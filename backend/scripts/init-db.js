/**
 * First-time database bootstrap (schema + demo seed).
 *
 * Why this file exists:
 * - New developers and fresh deploys need tables and sample restaurants/menu data without
 *   running MySQL commands by hand.
 * - `backend/db/schema.sql` defines the full schema (restaurants, menu_items, orders, etc.).
 * - `backend/db/seed.sql` inserts demo rows so the app is usable immediately.
 *
 * When it runs:
 * - Automatically on server start (`server.js` → `initializeDatabaseIfEmpty`) after the DB
 *   connection check and before `runMigrations` from `config/migrate.js`.
 * - Manually: `node scripts/init-db.js` from the `backend/` folder (loads `backend/.env`).
 *
 * Safety: initialization runs only if the `restaurants` table is missing in `DB_NAME`.
 * Existing databases are left unchanged (returns `false`). Schema changes on live DBs are
 * handled by `config/migrate.js`, not by re-running these SQL files.
 *
 * Requires `DB_NAME` (and other DB_* vars or `DATABASE_URL`) to match the database you intend
 * to use; `schema.sql` also contains `CREATE DATABASE` / `USE` statements for local setup.
 */

const fs = require("fs");
const path = require("path");

/**
 * Returns true if `restaurants` already exists in the configured database.
 * Used as a simple signal that schema.sql has been applied at least once.
 */
async function tableExists(connection, databaseName) {
  const [rows] = await connection.query(
    `SELECT COUNT(1) AS count
     FROM information_schema.tables
     WHERE table_schema = ? AND table_name = 'restaurants'`,
    [databaseName]
  );
  return Number(rows[0]?.count || 0) > 0;
}

/**
 * Reads a `.sql` file, splits it into statements, and executes each in order.
 * Splits on semicolon + newline (`;\n`) so multi-line statements stay intact.
 * Skips empty chunks and lines that are only SQL comments (`--`).
 */
async function runSqlFile(connection, filePath) {
  const sql = fs.readFileSync(filePath, "utf8");
  const statements = sql
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  for (const statement of statements) {
    await connection.query(statement);
  }
}

/**
 * Applies `db/schema.sql` then `db/seed.sql` when the database looks empty.
 *
 * @param {import('mysql2/promise').Pool} pool - Shared MySQL pool from `src/config/db.js`
 * @returns {Promise<boolean>} `true` if schema+seed ran; `false` if already initialized
 */
async function initializeDatabaseIfEmpty(pool) {
  const databaseName = process.env.DB_NAME;
  if (!databaseName) {
    throw new Error("DB_NAME is required to initialize the database");
  }

  if (await tableExists(pool, databaseName)) {
    return false;
  }

  const schemaPath = path.resolve(__dirname, "../db/schema.sql");
  const seedPath = path.resolve(__dirname, "../db/seed.sql");

  // eslint-disable-next-line no-console
  console.log("Initializing database (schema + seed)...");
  await runSqlFile(pool, schemaPath);
  await runSqlFile(pool, seedPath);
  // eslint-disable-next-line no-console
  console.log("Database initialized successfully");
  return true;
}

module.exports = {
  initializeDatabaseIfEmpty,
};

// Standalone CLI: `node scripts/init-db.js` (from `backend/` directory)
if (require.main === module) {
  require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
  const pool = require("../src/config/db");

  initializeDatabaseIfEmpty(pool)
    .then(() => pool.end())
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error("Database init failed:", error.message);
      process.exit(1);
    });
}
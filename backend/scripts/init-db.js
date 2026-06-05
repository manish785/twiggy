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
const isPostgres = Boolean(
  process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("postgres")
);

async function tableExists(connection) {
  const [rows] = isPostgres
    ? await connection.query(
        `SELECT COUNT(1) AS count
         FROM information_schema.tables
         WHERE table_schema = 'public' AND table_name = 'restaurants'`
      )
    : await connection.query(
        `SELECT COUNT(1) AS count
         FROM information_schema.tables
         WHERE table_schema = ? AND table_name = 'restaurants'`,
        [process.env.DB_NAME]
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
function stripSqlComments(sql) {
  return sql
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");
}

function convertMysqlSeedToPostgres(sql) {
  return stripSqlComments(sql)
    .replace(/USE foodheaven_db;\s*/g, "")
    .replace(/JSON_ARRAY\(([^)]+)\)/g, (_match, inner) => {
      const items = inner
        .split(",")
        .map((part) => part.trim().replace(/^'|'$/g, ""));
      return `'${JSON.stringify(items)}'::jsonb`;
    })
    .replace(
      /INSERT INTO restaurants[\s\S]*?ON DUPLICATE KEY UPDATE[\s\S]*?;/,
      (statement) =>
        statement.replace(
          /ON DUPLICATE KEY UPDATE[\s\S]*$/,
          `ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  avg_rating = EXCLUDED.avg_rating,
  cost_for_two_message = EXCLUDED.cost_for_two_message,
  is_open = EXCLUDED.is_open,
  delivery_time_minutes = EXCLUDED.delivery_time_minutes,
  cuisines = EXCLUDED.cuisines,
  is_active = TRUE;`
        )
    );
}

async function initializeDatabaseIfEmpty(pool) {
  if (!isPostgres && !process.env.DB_NAME) {
    throw new Error("DB_NAME is required to initialize the database");
  }

  const hasRestaurants = await tableExists(pool);
  const [countRows] = await pool.query(
    hasRestaurants
      ? "SELECT COUNT(1) AS count FROM restaurants"
      : "SELECT 0 AS count"
  );
  const restaurantCount = Number(countRows[0]?.count || 0);

  if (hasRestaurants && restaurantCount > 0) {
    return false;
  }

  const schemaPath = path.resolve(
    __dirname,
    isPostgres ? "../db/schema.postgres.sql" : "../db/schema.sql"
  );
  const seedPath = path.resolve(__dirname, "../db/seed.sql");

  // eslint-disable-next-line no-console
  console.log("Initializing database (schema + seed)...");
  if (!hasRestaurants) {
    await runSqlFile(pool, schemaPath);
  }

  const seedSql = fs.readFileSync(seedPath, "utf8");
  const seedToRun = isPostgres ? convertMysqlSeedToPostgres(seedSql) : seedSql;
  const seedStatements = seedToRun
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  for (const statement of seedStatements) {
    await pool.query(statement);
  }
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
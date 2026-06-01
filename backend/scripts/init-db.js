const fs = require("fs");
const path = require("path");

async function tableExists(connection, databaseName) {
  const [rows] = await connection.query(
    `SELECT COUNT(1) AS count
     FROM information_schema.tables
     WHERE table_schema = ? AND table_name = 'restaurants'`,
    [databaseName]
  );
  return Number(rows[0]?.count || 0) > 0;
}

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

if (require.main === module) {
  require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
  const pool = require("../config/db");

  initializeDatabaseIfEmpty(pool)
    .then(() => pool.end())
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error("Database init failed:", error.message);
      process.exit(1);
    });
}

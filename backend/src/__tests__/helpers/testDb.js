const fs = require("fs/promises");
const path = require("path");
const mysql = require("mysql2/promise");

const TEST_DB_NAME = process.env.TEST_DB_NAME || "foodheaven_test_db";

function createAdminConnection() {
  return mysql.createConnection({
    host: process.env.TEST_DB_HOST || process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.TEST_DB_PORT || process.env.DB_PORT || 3306),
    user: process.env.TEST_DB_USER || process.env.DB_USER || "root",
    password: process.env.TEST_DB_PASSWORD || process.env.DB_PASSWORD || "",
    multipleStatements: true,
  });
}

async function recreateSchema() {
  const schemaPath = path.resolve(__dirname, "../../../db/schema.sql");
  const seedPath = path.resolve(__dirname, "../../../db/seed.sql");
  const schemaSql = await fs.readFile(schemaPath, "utf8");
  const seedSql = await fs.readFile(seedPath, "utf8");

  const normalizedSchema = schemaSql.replaceAll("foodheaven_db", TEST_DB_NAME);
  const normalizedSeed = seedSql.replaceAll("foodheaven_db", TEST_DB_NAME);

  const connection = await createAdminConnection();
  await connection.query(`DROP DATABASE IF EXISTS \`${TEST_DB_NAME}\``);
  await connection.query(`CREATE DATABASE \`${TEST_DB_NAME}\``);
  await connection.query(normalizedSchema);
  await connection.query(normalizedSeed);
  await connection.end();
}

async function cleanupOrders() {
  const connection = await mysql.createConnection({
    host: process.env.TEST_DB_HOST || process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.TEST_DB_PORT || process.env.DB_PORT || 3306),
    user: process.env.TEST_DB_USER || process.env.DB_USER || "root",
    password: process.env.TEST_DB_PASSWORD || process.env.DB_PASSWORD || "",
    database: TEST_DB_NAME,
  });
  await connection.query("DELETE FROM payments");
  await connection.query("DELETE FROM order_items");
  await connection.query("DELETE FROM orders");
  await connection.end();
}

module.exports = {
  TEST_DB_NAME,
  recreateSchema,
  cleanupOrders,
};

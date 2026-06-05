const mysql = require("mysql2/promise");

const databaseUrl = process.env.DATABASE_URL || "";
const isPostgres = databaseUrl.startsWith("postgres");

let pool;

if (isPostgres) {
  const { Pool } = require("pg");

  const pgPool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  function toPgSql(sql) {
    let index = 0;
    return sql.replace(/\?/g, () => `$${++index}`);
  }

  pool = {
    isPostgres: true,
    async query(sql, params = []) {
      const result = await pgPool.query(toPgSql(sql), params);
      return [result.rows, result.fields];
    },
    async getConnection() {
      const client = await pgPool.connect();
      return {
        async query(sql, params = []) {
          const result = await client.query(toPgSql(sql), params);
          return [result.rows, result.fields];
        },
        async beginTransaction() {
          await client.query("BEGIN");
        },
        async commit() {
          await client.query("COMMIT");
        },
        async rollback() {
          await client.query("ROLLBACK");
        },
        release() {
          client.release();
        },
      };
    },
    async end() {
      await pgPool.end();
    },
  };
} else {
  const mysqlPool = databaseUrl
    ? mysql.createPool(databaseUrl)
    : mysql.createPool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

  pool = {
    isPostgres: false,
    query: (...args) => mysqlPool.query(...args),
    getConnection: () => mysqlPool.getConnection(),
    end: () => mysqlPool.end(),
  };
}

module.exports = pool;

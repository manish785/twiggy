async function ensureOrderIdempotencyColumn(pool, logger) {
  const [rows] = await pool.query(
    `SELECT COUNT(1) AS columnCount
     FROM information_schema.columns
     WHERE table_schema = ?
       AND table_name = 'orders'
       AND column_name = 'idempotency_key'`,
    [process.env.DB_NAME]
  );

  const columnCount = Number(rows?.[0]?.columnCount || 0);
  if (columnCount > 0) {
    return;
  }

  await pool.query(
    "ALTER TABLE orders ADD COLUMN idempotency_key VARCHAR(80) NULL UNIQUE AFTER order_number"
  );
  logger.info("Migration applied: added orders.idempotency_key");
}

async function runMigrations(pool, logger) {
  await ensureOrderIdempotencyColumn(pool, logger);
}

module.exports = {
  runMigrations,
};

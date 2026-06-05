/**
 * Startup schema migrations (lightweight, idempotent patches).
 *
 * Why this file exists:
 * - Fresh databases are created from `backend/db/schema.sql` via `scripts/init-db.js`,
 *   which already includes `orders.idempotency_key`.
 * - Older databases created before that column was added would miss the column and break
 *   idempotent order creation (`Idempotency-Key` header).
 * - Re-running the full schema on an existing DB is unsafe (drops/recreates data), so we
 *   apply small, targeted ALTERs here instead.
 *
 * When it runs: `server.js` calls `runMigrations` after DB connectivity check and
 * `initializeDatabaseIfEmpty`, before Express listens for traffic.
 *
 * This is not a migration framework (no version table). Each check is safe to run on
 * every boot; add new `ensure*` helpers and call them from `runMigrations`.
 */

/**
 * Adds `orders.idempotency_key` if missing (matches `backend/db/schema.sql`).
 * Queries `information_schema` so the ALTER runs only once per database.
 */
async function ensureOrderIdempotencyColumn(pool, logger) {
  if (pool.isPostgres) {
    await pool.query(
      "ALTER TABLE orders ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(80) UNIQUE"
    );
    return;
  }

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

/**
 * Runs all startup migrations in order. Extend this when adding new schema patches.
 *
 * @param {import('mysql2/promise').Pool} pool - Shared MySQL pool from `config/db.js`
 * @param {{ info: (msg: string) => void }} logger - App logger from `utils/logger.js`
 */
const RESTAURANT_IMAGE_IDS = require("../../db/restaurant-images");

async function ensureUniqueRestaurantImages(pool) {
  for (const [id, imageId] of Object.entries(RESTAURANT_IMAGE_IDS)) {
    await pool.query(
      "UPDATE restaurants SET cloudinary_image_id = ? WHERE id = ?",
      [imageId, id]
    );
  }
}

async function runMigrations(pool, logger) {
  await ensureOrderIdempotencyColumn(pool, logger);
  await ensureUniqueRestaurantImages(pool, logger);
}

module.exports = {
  runMigrations,
};

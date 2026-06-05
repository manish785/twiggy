// Shared DB pool — all queries run through this singleton
const pool = require("../config/db");
const { mapRestaurantRow, mapMenuItemRow } = require("./rowMappers");
const activeFilter = pool.isPostgres ? "TRUE" : "1";

// Fetch every active restaurant, highest rated first
async function findAllRestaurants() {
  // mysql2 returns [rows, fields]; we only need the row array
  const [rows] = await pool.query(
    `SELECT
      id,
      name,
      cloudinary_image_id AS cloudinaryImageId,
      locality,
      area_name AS areaName,
      avg_rating AS avgRating,
      cost_for_two_message AS costForTwoMessage,
      is_open AS isOpen,
      delivery_time_minutes AS deliveryTimeMinutes,
      cuisines
    FROM restaurants
    WHERE is_active = ${activeFilter}
    ORDER BY avg_rating DESC, id DESC`
  );

  return rows.map(mapRestaurantRow);
}

// Fetch active menu items for one restaurant (prices stored in paise)
async function findRestaurantMenuByRestaurantId(restaurantId) {
  const [rows] = await pool.query(
    `SELECT
      id,
      restaurant_id AS restaurantId,
      name,
      image_id AS imageId,
      price_paise AS price,
      default_price_paise AS defaultPrice,
      rating
    FROM menu_items
    WHERE restaurant_id = ? AND is_active = ${activeFilter}
    ORDER BY id ASC`,
    [restaurantId]
  );

  return rows.map(mapMenuItemRow);
}

// Fetch a single active restaurant by primary key, or null if not found
async function findRestaurantById(restaurantId) {
  const [rows] = await pool.query(
    `SELECT
      id,
      name,
      cloudinary_image_id AS cloudinaryImageId,
      locality,
      area_name AS areaName,
      avg_rating AS avgRating,
      cost_for_two_message AS costForTwoMessage,
      is_open AS isOpen,
      delivery_time_minutes AS deliveryTimeMinutes,
      cuisines
    FROM restaurants
    WHERE id = ? AND is_active = ${activeFilter}
    LIMIT 1`,
    [restaurantId]
  );

  // Empty result set → null so the service can return 404
  return rows[0] ? mapRestaurantRow(rows[0]) : null;
}

module.exports = {
  findAllRestaurants,
  findRestaurantMenuByRestaurantId,
  findRestaurantById,
};

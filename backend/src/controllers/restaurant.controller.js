// Business logic layer — controllers only handle HTTP input/output
const restaurantService = require("../services/restaurant.service");

// GET /api/v1/restaurants — fetch and return all active restaurants
async function listRestaurants(req, res) {
  const restaurants = await restaurantService.getRestaurants();

  res.status(200).json({
    success: true,
    data: restaurants,
  });
}

// GET /api/v1/restaurants/:restaurantId/menu — menu for a single restaurant
async function getRestaurantMenu(req, res) {
  // Parse route param to a number (e.g. "42" → 42, "abc" → NaN)
  const restaurantId = Number(req.params.restaurantId);

  // Reject invalid ids before hitting the database
  if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
    return res.status(400).json({
      success: false,
      message: "restaurantId must be a valid positive number",
    });
  }

  const menuData = await restaurantService.getRestaurantMenu(restaurantId);
  // Service returns null when no restaurant matches the id
  if (!menuData) {
    return res.status(404).json({
      success: false,
      message: "Restaurant not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: menuData,
  });
}

module.exports = {
  listRestaurants,
  getRestaurantMenu,
};

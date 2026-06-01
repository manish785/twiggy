// Express Router — groups restaurant endpoints (mounted at /api/v1 in app.js)
const express = require("express");
// Wraps async controllers so rejected promises reach the error handler
const asyncHandler = require("../../utils/asyncHandler");
const restaurantController = require("../../controllers/restaurant.controller");

// Isolated router exported and mounted by app.js
const router = express.Router();

// GET /api/v1/restaurants — list all active restaurants
router.get("/restaurants", asyncHandler(restaurantController.listRestaurants));

// GET /api/v1/restaurants/:restaurantId/menu — menu for one restaurant
router.get(
  "/restaurants/:restaurantId/menu",
  asyncHandler(restaurantController.getRestaurantMenu)
);

module.exports = router;

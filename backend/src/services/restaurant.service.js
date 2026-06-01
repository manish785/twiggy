// Data access layer — service maps DB rows to API shapes the frontend expects
const restaurantRepository = require("../repositories/restaurant.repository");

// Transform a restaurant DB row into the card format used by the React app
function toRestaurantCardShape(row) {
  return {
    info: {
      id: String(row.id),
      name: row.name,
      cloudinaryImageId: row.cloudinaryImageId,
      locality: row.locality,
      areaName: row.areaName,
      avgRating: Number(row.avgRating),
      costForTwoMessage: row.costForTwoMessage,
      isOpen: Boolean(row.isOpen),
      veg: false,
      sla: {
        deliveryTime: row.deliveryTimeMinutes,
      },
      // cuisines may be stored as JSON string or already parsed array
      cuisines: Array.isArray(row.cuisines)
        ? row.cuisines
        : JSON.parse(row.cuisines || "[]"),
    },
  };
}

// Transform a menu_items DB row into the nested card shape the frontend reads
function toMenuItemCardShape(row) {
  return {
    card: {
      info: {
        id: String(row.id),
        name: row.name,
        imageId: row.imageId,
        price: row.price,
        defaultPrice: row.defaultPrice,
        ratings: {
          aggregatedRating: {
            rating: row.rating ? String(row.rating) : "N/A",
          },
        },
      },
    },
  };
}

// Return all active restaurants, sorted by rating (from repository)
async function getRestaurants() {
  const restaurants = await restaurantRepository.findAllRestaurants();
  return restaurants.map(toRestaurantCardShape);
}

// Return restaurant info + menu items, or null if the restaurant does not exist
async function getRestaurantMenu(restaurantId) {
  const restaurant = await restaurantRepository.findRestaurantById(restaurantId);
  if (!restaurant) {
    return null;
  }

  const menuItems = await restaurantRepository.findRestaurantMenuByRestaurantId(
    restaurantId
  );

  return {
    info: toRestaurantCardShape(restaurant).info,
    itemCards: menuItems.map(toMenuItemCardShape),
  };
}

module.exports = {
  getRestaurants,
  getRestaurantMenu,
};

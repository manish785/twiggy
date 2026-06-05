function pick(row, camelKey, snakeKey) {
  return row[camelKey] ?? row[snakeKey] ?? row[camelKey.toLowerCase()];
}

function mapRestaurantRow(row) {
  return {
    id: row.id,
    name: row.name,
    cloudinaryImageId: pick(row, "cloudinaryImageId", "cloudinary_image_id"),
    locality: row.locality,
    areaName: pick(row, "areaName", "area_name"),
    avgRating: pick(row, "avgRating", "avg_rating"),
    costForTwoMessage: pick(row, "costForTwoMessage", "cost_for_two_message"),
    isOpen: pick(row, "isOpen", "is_open"),
    deliveryTimeMinutes: pick(row, "deliveryTimeMinutes", "delivery_time_minutes"),
    cuisines: row.cuisines,
  };
}

function mapMenuItemRow(row) {
  return {
    id: row.id,
    restaurantId: pick(row, "restaurantId", "restaurant_id"),
    name: row.name,
    imageId: pick(row, "imageId", "image_id"),
    price: pick(row, "price", "price_paise"),
    defaultPrice: pick(row, "defaultPrice", "default_price_paise"),
    rating: row.rating,
  };
}

module.exports = {
  mapRestaurantRow,
  mapMenuItemRow,
};

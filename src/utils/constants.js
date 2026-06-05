export const CDN_URL =
  "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/";

export const MENU_ITEM_URL =
  "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_208,h_208,c_fit/";

export const BG_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdpaeAl1DBJ6LEXy8b2GMdt3fgTfY9NcQHbbgNCauOaA&s";

const DEFAULT_API_BASE = "http://localhost:5000/api/v1";

function resolveApiBaseUrl() {
  const fromEnv = process.env.REACT_APP_API_BASE_URL;
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  return DEFAULT_API_BASE;
}

export function getApiBaseUrl() {
  return resolveApiBaseUrl();
}

export const API_BASE_URL = resolveApiBaseUrl();

export function getRestaurantsUrl() {
  return `${getApiBaseUrl()}/restaurants`;
}

export function getRestaurantMenuUrl(restaurantId) {
  return `${getApiBaseUrl()}/restaurants/${restaurantId}/menu`;
}

export function getLoginUrl() {
  return `${getApiBaseUrl()}/auth/login`;
}

export function getCreateOrderUrl() {
  return `${getApiBaseUrl()}/orders`;
}

export function getConfirmPaymentUrl(orderId) {
  return `${getApiBaseUrl()}/orders/${orderId}/payments`;
}

export const GROCERY_URL =
  "https://cdn.dribbble.com/users/90631/screenshots/16812389/media/7afe0c556ede3387b72f21fe5cc60a57.png";

export const FOOD_PLACEHOLDER =
  "https://via.placeholder.com/160?text=Food+Item";

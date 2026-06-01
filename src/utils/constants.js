export const CDN_URL =
  "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/";

export const MENU_ITEM_URL =
  "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_208,h_208,c_fit/";

export const LOGO_URL =
  "https://marketplace.canva.com/EAFXIvlL2Ns/2/0/1600w/canva-brown-and-black-vintage-food-restaurant-logo-YASJJho2Kzw.jpg";

export const BG_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdpaeAl1DBJ6LEXy8b2GMdt3fgTfY9NcQHbbgNCauOaA&s";

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

export const AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN || "";
export const AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID || "";
export const AUTH0_AUDIENCE = process.env.REACT_APP_AUTH0_AUDIENCE || "";

export const DEV_AUTH_KEY = process.env.REACT_APP_DEV_AUTH_KEY || "";

export const GET_RESTAURANTS_URL = `${API_BASE_URL}/restaurants`;
export const getRestaurantMenuUrl = (restaurantId) =>
  `${API_BASE_URL}/restaurants/${restaurantId}/menu`;
export const CREATE_ORDER_URL = `${API_BASE_URL}/orders`;
export const getConfirmPaymentUrl = (orderId) =>
  `${API_BASE_URL}/orders/${orderId}/payments`;
export const DEV_TOKEN_URL = `${API_BASE_URL}/auth/dev-token`;

export const GROCERY_URL =
  "https://cdn.dribbble.com/users/90631/screenshots/16812389/media/7afe0c556ede3387b72f21fe5cc60a57.png";

export const FOOD_PLACEHOLDER =
  "https://via.placeholder.com/160?text=Food+Item";

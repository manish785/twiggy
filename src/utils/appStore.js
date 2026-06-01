import { configureStore } from "@reduxjs/toolkit";
import { cartInitialState, cartReducer } from "../redux/CartPage/reducer";
import {
  clearPersistedCart,
  loadPersistedCart,
  persistCart,
} from "./cartStorage";

const persistedCart = loadPersistedCart();

const appStore = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: persistedCart
    ? {
        cart: {
          ...cartInitialState,
          ...persistedCart,
        },
      }
    : undefined,
});

appStore.subscribe(() => {
  const cart = appStore.getState().cart;

  if (cart.itemCount === 0 && !cart.deliveryAddress?.email) {
    clearPersistedCart();
    return;
  }

  persistCart(cart);
});

export default appStore;

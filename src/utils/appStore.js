import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

const appStore = configureStore({
    // This is a big reducers - consists of multiples reducers
    reducer: {
        cart : cartReducer
    }
});


export default appStore;
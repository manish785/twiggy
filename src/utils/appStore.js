import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import { NewCartReducer } from '../redux/CartPage/reducer';

const appStore = configureStore({
    // This is a big reducers - consists of multiples reducers
    reducer: {
        cart : cartReducer,
        NewCartReducer,
    }
});


export default appStore;
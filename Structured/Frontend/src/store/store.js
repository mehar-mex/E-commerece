import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import productSlice from './productSlice';
import cartSlice from './cartSlice';
import wishlistSlice from './wishlistSlice';
import ordersSlice from './ordersSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productSlice,
    cart: cartSlice,
    wishlist: wishlistSlice,
    orders: ordersSlice,
  },
});

export default store;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (item, { getState }) => {
    const { auth } = getState();
    const config = {
      headers: { Authorization: `Bearer ${auth.token}` }
    };
    const response = await axios.post('/api/cart/add', item, config);
    return response.data;
  }
);

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState }) => {
    const { auth } = getState();
    const config = {
      headers: { Authorization: `Bearer ${auth.token}` }
    };
    const response = await axios.get('/api/cart', config);
    return response.data;
  }
);

export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, quantity }, { getState }) => {
    const { auth } = getState();
    const config = {
      headers: { Authorization: `Bearer ${auth.token}` }
    };
    const response = await axios.put('/api/cart/update', { productId, quantity }, config);
    return response.data;
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { getState }) => {
    const { auth } = getState();
    const config = {
      headers: { Authorization: `Bearer ${auth.token}` }
    };
    const response = await axios.delete(`/api/cart/remove/${productId}`, config);
    return response.data;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
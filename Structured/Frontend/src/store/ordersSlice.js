import { createSlice } from '@reduxjs/toolkit';

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: JSON.parse(localStorage.getItem('orders')) || [],
  },
  reducers: {
    addOrder: (state, action) => {
      const newOrder = {
        id: Date.now(),
        items: action.payload.items,
        total: action.payload.total,
        date: new Date().toISOString(),
        status: 'Completed',
        trackingId: `TRK${Date.now().toString().slice(-8)}`,
        shipmentStatus: 'Processing',
        shippingAddress: action.payload.shippingAddress || {}
      };
      state.orders.unshift(newOrder);
      localStorage.setItem('orders', JSON.stringify(state.orders));
    },
    cancelOrder: (state, action) => {
      const orderId = action.payload;
      const orderIndex = state.orders.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        state.orders[orderIndex].status = 'Cancelled';
        localStorage.setItem('orders', JSON.stringify(state.orders));
      }
    },
  },
});

export const { addOrder, cancelOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
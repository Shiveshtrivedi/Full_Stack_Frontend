import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ICreateOrderRequest,
  IOrder,
  IOrderState,
  IUpdateOrderArgs,
} from '../../utils/type/types';
import { getOrdersFromCookies } from '../../utils/cookie/cookieUtils';
import axios from 'axios';

const initialState: IOrderState = {
  orders: [],
  userId: 0,
  loading: false,
  error: '',
};

export const fetchOrdersByUserId = createAsyncThunk<IOrder[], number>(
  'order/fetchOrdersByUserId',
  async (userId: number) => {
    const response = await axios.get(
      `http://localhost:5086/api/order/user/${userId}/getOrderByUserId`
    );
    return response.data;
  }
);

export const createOrder = createAsyncThunk<IOrder, ICreateOrderRequest>(
  'order/createOrder',
  async (orderData: ICreateOrderRequest, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:5086/api/order/placeOrder',
        orderData
      );
      return response.data;
    } catch (error: any) {
      console.error('Error creating order:', error);
      return rejectWithValue(error.response.data || 'Failed to create order');
    }
  }
);

export const updateOrder = createAsyncThunk<IOrder[], IUpdateOrderArgs>(
  'orders/updateOrder',
  async ({ orderId, orderData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5086/api/order/${orderId}/updateStatus`,
        orderData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    initializeOrders(state, action: PayloadAction<string>) {
      const orders1 = getOrdersFromCookies(action.payload);
      state.orders = orders1 || [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersByUserId.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(
        fetchOrdersByUserId.fulfilled,
        (state, action: PayloadAction<IOrder[]>) => {
          state.loading = false;
          state.orders = action.payload;
        }
      )
      .addCase(fetchOrdersByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'failed';
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<IOrder>) => {
          state.loading = false;
          state.orders.push(action.payload);
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'failed to create order';
      })
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { initializeOrders } = orderSlice.actions;
export default orderSlice.reducer;

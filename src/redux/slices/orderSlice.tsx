import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ICreateOrderRequest,
  IOrder,
  IOrderState,
  IUpdateOrderArgs,
} from '../../utils/type/types';
import { api } from './authSlice';

const ORDER_STORAGE_KEY = 'orders';

const API_URL = process.env.REACT_APP_USER_API_URL ?? '';

const getOrdersFromLocalStorage = (): IOrder[] => {
  const storedOrders = localStorage.getItem(ORDER_STORAGE_KEY);
  return storedOrders ? JSON.parse(storedOrders) : [];
};

const saveOrdersToLocalStorage = (orders: IOrder[]): void => {
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
};

const initialState: IOrderState = {
  orders: getOrdersFromLocalStorage(),
  orderView: null,
  userId: 0,
  loading: false,
  error: '',
};

export const fetchOrdersByUserId = createAsyncThunk<IOrder[], number>(
  'order/fetchOrdersByUserId',
  async (userId: number) => {
    const response = await api.get(
      `${API_URL}/order/user/${userId}/getOrderByUserId`
    );
    return response.data;
  }
);

export const fetchOrderByOrderId = createAsyncThunk<IOrder, number>(
  'order/fetchOrderByOrderId',
  async (orderId: number) => {
    const response = await api.get(
      `${API_URL}/order/${orderId}/getOrderByOrderId`
    );
    return response.data;
  }
);

export const createOrder = createAsyncThunk<IOrder, ICreateOrderRequest>(
  'order/createOrder',
  async (orderData: ICreateOrderRequest, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/order/placeOrder`, orderData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating order:', error);
      return rejectWithValue(error.response.data || 'Failed to create order');
    }
  }
);

export const updateOrder = createAsyncThunk<IOrder, IUpdateOrderArgs>(
  'orders/updateOrder',
  async ({ orderId, orderData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `${API_URL}/order/${orderId}/updateStatus`,
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
    initializeOrders(state) {
      state.orders = getOrdersFromLocalStorage() || [];
      saveOrdersToLocalStorage(state.orders);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersByUserId.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchOrdersByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrdersByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'failed';
        saveOrdersToLocalStorage(state.orders);
      })
      .addCase(fetchOrderByOrderId.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(
        fetchOrderByOrderId.fulfilled,
        (state, action: PayloadAction<IOrder>) => {
          state.loading = false;
          state.orderView = action.payload;
        }
      )
      .addCase(fetchOrderByOrderId.rejected, (state, action) => {
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
          saveOrdersToLocalStorage(state.orders);
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
      .addCase(
        updateOrder.fulfilled,
        (state, action: PayloadAction<IOrder>) => {
          state.loading = false;
          const index = state.orders.findIndex(
            (order) => order.orderId === action.payload.orderId
          );
          if (index !== -1) {
            state.orders[index] = action.payload;
            saveOrdersToLocalStorage(state.orders);
          }
        }
      )
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { initializeOrders } = orderSlice.actions;
export default orderSlice.reducer;

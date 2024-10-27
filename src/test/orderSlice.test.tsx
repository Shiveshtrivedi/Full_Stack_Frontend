import { configureStore } from '@reduxjs/toolkit';
import orderReducer, {
  fetchOrdersByUserId,
  createOrder,
  updateOrder,
} from '../redux/slices/orderSlice';
import { mockCreateOrderRequest, mockOrders } from './mockData/mockData';
import { api } from '../redux/slices/authSlice';

jest.mock('../redux/slices/authSlice');

describe('Order Slice', () => {
  let store: any;

  beforeEach(() => {
    localStorage.clear();
    store = configureStore({
      reducer: { order: orderReducer },
    });
  });

  it('should initialize orders from localStorage', () => {
    localStorage.setItem('orders', JSON.stringify(mockOrders));

    store = configureStore({
      reducer: { order: orderReducer },
    });

    const initialState = store.getState().order;

    expect(initialState.orders).toEqual([]);
  });

  it('should handle fetchOrdersByUserId', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockOrders });

    await store.dispatch(fetchOrdersByUserId(1));

    const state = store.getState().order;

    expect(state.orders).toEqual(mockOrders);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('');
  });

  it('should handle createOrder', async () => {
    const newOrderResponse = {
      ...mockCreateOrderRequest.items[0],
      orderId: Date.now(),
      status: 'Pending',
      orderDate: new Date().toISOString(),
      razorpayOrderId: `razorpay_${Date.now()}`,
      userName: 'Alice Johnson',
    };

    (api.post as jest.Mock).mockResolvedValueOnce({ data: newOrderResponse });

    await store.dispatch(createOrder(mockCreateOrderRequest));

    const state = store.getState().order;

    expect(state.orders).toContainEqual(newOrderResponse);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('');
  });

  it('should handle updateOrder', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockOrders });
    await store.dispatch(fetchOrdersByUserId(1));

    const updatedOrderResponse = { ...mockOrders[0], status: 'Completed' };

    (api.put as jest.Mock).mockResolvedValueOnce({
      data: updatedOrderResponse,
    });

    await store.dispatch(
      updateOrder({
        orderId: updatedOrderResponse.orderId,
        orderData: { status: 'Completed' },
      })
    );

    const state = store.getState().order;

    expect(state.orders).toContainEqual(updatedOrderResponse);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('');
  });
});

import { configureStore } from '@reduxjs/toolkit';
import cartReducer, {
  addToCart,
  updateCartItem,
  clearCart,
} from '../redux/slices/cartSlice';
import {
  mockCartItem,
  mockCartItemsArray,
  initialCartState,
} from '../test/mockData/mockData';

describe('cartSlice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({ reducer: { cart: cartReducer } });
    localStorage.clear();
  });

  it('should return the initial state', () => {
    const state = store.getState().cart;
    expect(state).toEqual(initialCartState);
  });

  it('should handle adding an item to the cart', async () => {
    store.dispatch(
      addToCart.fulfilled(mockCartItemsArray, '', {
        userId: mockCartItem.userId,
        productId: mockCartItem.items[0].productId,
        quantity: mockCartItem.items[0].quantity,
      })
    );

    const state = store.getState().cart;
    expect(state.items).toHaveLength(1);
    expect(state.totalAmount).toBe(200);
    expect(state.items[0]).toEqual(mockCartItemsArray[0]);
  });

  it('should handle updating a cart item', async () => {
    store.dispatch(
      addToCart.fulfilled(mockCartItemsArray, '', {
        userId: mockCartItem.userId,
        productId: mockCartItem.items[0].productId,
        quantity: mockCartItem.items[0].quantity,
      })
    );

    const updatedItems = [
      { productId: mockCartItem.items[0].productId, quantity: 3 },
    ];

    store.dispatch(
      updateCartItem.fulfilled(
        [
          {
            ...mockCartItem,
            items: updatedItems.map((item) => ({
              ...item,
              productName: 'Test Product',
              imageUrl: 'http://image.com',
              price: 100,
            })),
          },
        ],
        '',
        { userId: mockCartItem.userId, items: updatedItems }
      )
    );

    const state = store.getState().cart;
    expect(state.items[0].quantity).toBe(2);
    expect(state.totalAmount).toBe(200);
  });

  it('should handle clearing the cart', async () => {
    store.dispatch(
      addToCart.fulfilled(mockCartItemsArray, '', {
        userId: mockCartItem.userId,
        productId: mockCartItem.items[0].productId,
        quantity: mockCartItem.items[0].quantity,
      })
    );

    await store.dispatch(
      clearCart.fulfilled(undefined, '', { userId: mockCartItem.userId })
    );

    const state = store.getState().cart;
    expect(state.items).toHaveLength(0);
    expect(state.totalAmount).toBe(0);
  });
});

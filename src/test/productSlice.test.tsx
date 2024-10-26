import { configureStore } from '@reduxjs/toolkit';
import productReducer, {
  fetchProducts,
  addProduct,
  updateProduct,
  fetchProductsByUserId,
  fetchProductsByCategory,
} from '../redux/slices/productSlice';
import {
  mockProductsArray,
  mockProduct,
  newProduct,
} from '../test/mockData/mockData';

describe('productSlice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({ reducer: { products: productReducer } });
  });

  it('should handle fetchProducts pending', () => {
    const action = fetchProducts.pending('');
    store.dispatch(action);
    const state = store.getState().products;
    expect(state.status).toBe('loading');
  });

  it('should handle fetchProducts fulfilled', () => {
    const action = fetchProducts.fulfilled(mockProductsArray, '');
    store.dispatch(action);
    const state = store.getState().products;
    expect(state.products).toEqual(mockProductsArray);
    expect(state.status).toBe('succeeded');
  });

  it('should handle adding a new product', () => {
    const action = addProduct.fulfilled(mockProduct, '', {
      newProduct,
      userId: 1,
    });
    store.dispatch(action);
    const state = store.getState().products;
    expect(state.products).toContainEqual(mockProduct);
    expect(state.error).toBe('');
  });

  it('should handle fetchProductsByUserId fulfilled', () => {
    const action = fetchProductsByUserId.fulfilled(mockProductsArray, '', 1);
    store.dispatch(action);
    const state = store.getState().products;
    expect(state.adminProductsHistory).toEqual(mockProductsArray);
  });

  it('should handle fetchProductsByCategory fulfilled', () => {
    const action = fetchProductsByCategory.fulfilled(
      mockProductsArray,
      '',
      'TestCategory'
    );
    store.dispatch(action);
    const state = store.getState().products;
    expect(state.products).toEqual(mockProductsArray);
  });

  it('should handle updateProduct fulfilled', () => {
    store.dispatch(
      addProduct.fulfilled(mockProduct, '', { newProduct, userId: 1 })
    );

    const updatedProduct = { ...mockProduct, price: 120 };
    const action = updateProduct.fulfilled(updatedProduct, '', {
      productId: mockProduct.productId,
      updatedProduct,
    });
    store.dispatch(action);
    const state = store.getState().products;
    expect(state.products).toContainEqual(updatedProduct);
  });
});

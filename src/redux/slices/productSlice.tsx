import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  EStatus,
  IProduct,
  IProductState,
  IProductWithoutId,
} from '../../utils/type/types';

const initialState: IProductState = {
  products: [],
  adminProductsHistory: [],
  filterProducts: [],
  status: 'idle',
  error: '',
  productId: 0,
};

const API_URL = process.env.REACT_APP_USER_API_URL;

export const fetchProducts = createAsyncThunk<IProduct[]>(
  'products/fetchProducts',
  async () => {
    const response = await axios.get(
      `http://localhost:5086/api/product/all/fetchProducts`
    );
    return response.data;
  }
);

export const fetchProductsByUserId = createAsyncThunk<
  IProduct[],
  number,
  { rejectValue: string }
>('products/fetchProductsByUserId', async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `http://localhost:5086/api/product/user/${userId}/getProductByUserIdForHistory`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || 'Failed to fetch products by user ID'
    );
  }
});

export const addProduct = createAsyncThunk<
  IProduct,
  { newProduct: IProductWithoutId; userId: number }
>('products/addProduct', async ({ newProduct, userId }) => {
  const response = await axios.post(
    `http://localhost:5086/api/product/${userId}/addProductByUserId`,
    newProduct
  );

  return response.data;
});

export const deleteProduct = createAsyncThunk<
  void,
  number,
  { rejectValue: string }
>('products/deleteProduct', async (productId, { rejectWithValue }) => {
  try {
    await axios.delete(
      `http://localhost:5086/api/product/${productId}/deleteProduct`
    );
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to delete product');
  }
});

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({
    productId,
    updatedProduct,
  }: {
    productId: number;
    updatedProduct: IProduct;
  }) => {
    try {
      const response = await axios.put(
        `${API_URL}/product/${productId}/updateProduct`,
        updatedProduct,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || 'Failed to update product';
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk<
  IProduct[],
  string,
  { rejectValue: string }
>('products/fetchProductsByCategory', async (category, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_PRODUCT_API_URL}/${category}`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to fetch products');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProductToHistory(state, action: PayloadAction<IProduct>) {
      const updatedHistory = [...state.adminProductsHistory, action.payload];
      state.adminProductsHistory = updatedHistory;
    },

    removeProductFromHistory(state, action: PayloadAction<number>) {
      const updatedHistory = state.adminProductsHistory.filter(
        (product) => product.productId !== action.payload
      );
      state.adminProductsHistory = updatedHistory;
    },

    clearHistory() {
      // if (state.id) {
      //   state.adminProductsHistory = [];
      //   saveAdminHistoryToCookies(state.id, []);
      // }
    },

    resetFilter(state) {
      state.filterProducts = [...state.products];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = EStatus.Loading;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<IProduct[]>) => {
          state.status = EStatus.Succeeded;
          state.products = action.payload;
          state.filterProducts = action.payload;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = EStatus.Failed;
        state.error = action.error.message ?? 'Failed to fetch products';
      })
      .addCase(
        addProduct.fulfilled,
        (state, action: PayloadAction<IProduct>) => {
          state.products.push(action.payload);
        }
      )
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to add product';
      })
      .addCase(
        deleteProduct.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload ?? 'Failed to delete product';
        }
      )
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product.productId !== action.meta.arg
        );
      })
      .addCase(
        fetchProductsByCategory.fulfilled,
        (state, action: PayloadAction<IProduct[]>) => {
          state.status = EStatus.Succeeded;
          state.products = action.payload;
          state.filterProducts = action.payload;
        }
      )
      .addCase(
        fetchProductsByCategory.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = EStatus.Failed;
          state.error =
            action.payload ?? 'Failed to fetch products by category';
        }
      )
      .addCase(fetchProductsByUserId.pending, (state) => {
        state.status = EStatus.Loading;
      })
      .addCase(
        fetchProductsByUserId.fulfilled,
        (state, action: PayloadAction<IProduct[]>) => {
          state.status = EStatus.Succeeded;
          state.products = action.payload;
          state.filterProducts = action.payload;
          state.adminProductsHistory = [
            ...state.adminProductsHistory,
            ...action.payload,
          ];
        }
      )
      .addCase(fetchProductsByUserId.rejected, (state, action) => {
        state.status = EStatus.Failed;
        state.error = action.payload ?? 'Failed to fetch products by user ID';
      })
      .addCase(updateProduct.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<IProduct>) => {
          state.status = 'succeeded';
          const index = state.products.findIndex(
            (p) => p.productId === action.payload.productId
          );
          if (index !== -1) {
            state.products[index] = action.payload;
          }
        }
      )
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'failed to update';
      });
  },
});

export const {
  addProductToHistory,
  removeProductFromHistory,
  clearHistory,
  resetFilter,
} = productSlice.actions;

export default productSlice.reducer;

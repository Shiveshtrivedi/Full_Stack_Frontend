import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  EStatus,
  IProduct,
  IProductState,
  IProductWithoutId,
  IUpdateProductStockPayload,
} from '../../utils/type/types';
import { api } from './authSlice';
import { toast } from 'react-toastify';

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
    const response = await api.get(`${API_URL}/product/all/fetchProducts`);
    return response.data;
  }
);

export const fetchProductsByUserId = createAsyncThunk<
  IProduct[],
  number,
  { rejectValue: string }
>('products/fetchProductsByUserId', async (userId, { rejectWithValue }) => {
  try {
    const response = await api.get(
      `${API_URL}/product/user/${userId}/getProductByUserIdForHistory`
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
  const response = await api.post(
    `${API_URL}/product/${userId}/addProductByUserId`,
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
    await api.delete(`${API_URL}/product/${productId}/deleteProduct`);
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
      const response = await api.put(
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
    const response = await api.get(
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

    resetFilter(state) {
      state.filterProducts = [...state.products];
    },
    updateInventoryInProduct: (
      state,
      action: PayloadAction<IUpdateProductStockPayload>
    ) => {
      // const updatedProducts = state.products.map((product) =>
      //   product.productId === action.payload.ProductId
      //     ? { ...product, stock: action.payload.StockAvailable }
      //     : product
      // );

      const updatedProducts = state.products.map((product) =>
        product.productId === action.payload.ProductId
          ? { ...product, ...action.payload }
          : product
      );

      console.log('updated products', JSON.stringify(updatedProducts));
      state.products = updatedProducts;
    },
    deleteProductInProductManagement: (state, action) => {
      state.products = state.products.filter(
        (product) => product.productId !== action.payload
      );
    },
    updateProductInUserManagement: (state, action) => {
      const productIndex = state.products.findIndex(
        (product) => product.productId === action.payload.productId
      );

      if (productIndex !== -1) {
        const productToUpdate = state.products[productIndex];

        const updatedProduct = {
          ...productToUpdate,
          productName:
            action.payload.productName ?? productToUpdate.productName,
          productDescription:
            action.payload.productDescription ??
            productToUpdate.productDescription,
          price: action.payload.price ?? productToUpdate.price,
          stock: action.payload.stock ?? productToUpdate.stock,
          category: action.payload.category ?? productToUpdate.category,
        };

        state.products[productIndex] = updatedProduct;
      }
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
          toast.success('Product added successfully');
        }
      )
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to add product';
        toast.error('Error occurred while adding product');
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
        toast.error('Item deleted successfully');
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
  resetFilter,
  updateInventoryInProduct,
  updateProductInUserManagement,
  deleteProductInProductManagement,
} = productSlice.actions;

export default productSlice.reducer;

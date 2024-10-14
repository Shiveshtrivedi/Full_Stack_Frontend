import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  DashboardData,
  DashboardState,
  ISale,
  IUpdateProductStockPayload,
  Product,
  User,
} from '../../utils/type/types';

export const fetchDashboardData = createAsyncThunk<
  DashboardData,
  void,
  { rejectValue: string }
>('/admin/dashboard', async (_, { rejectWithValue }) => {
  try {
    const userResponse = await axios.get<User[]>(
      `http://localhost:5086/api/user/allUser`
    );
    const productResponse = await axios.get<Product[]>(
      `http://localhost:5086/api/product/all/fetchProducts`
    );
    const saleResponse = await axios.get<ISale[]>(
      `http://localhost:5086/api/sales`
    );
    return {
      users: userResponse.data,
      products: productResponse.data,
      sales: saleResponse.data,
    };
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

const initialState: DashboardState = {
  users: [],
  products: [],
  sales: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateInventory: (
      state,
      action: PayloadAction<IUpdateProductStockPayload>
    ) => {
      const updatedProducts = state.products.map((product) =>
        product.productId === action.payload.ProductId
          ? { ...product, stock: action.payload.StockAvailable }
          : product
      );

      state.products = updatedProducts;
    },
    updateSales: (state, action: PayloadAction<ISale>) => {
      state.sales.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchDashboardData.fulfilled,
        (state, action: PayloadAction<DashboardData>) => {
          state.users = action.payload.users;
          state.products = action.payload.products;
          state.sales = action.payload.sales;
          state.loading = false;
        }
      )
      .addCase(
        fetchDashboardData.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload ?? 'Failed to fetch dashboard data';
          state.loading = false;
        }
      );
  },
});

export const { updateInventory, updateSales } = dashboardSlice.actions;
export default dashboardSlice.reducer;

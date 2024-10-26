import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DashboardData,
  DashboardState,
  IOrder,
  ISale,
  IUpdateProductStockPayload,
  Product,
  User,
} from '../../utils/type/types';
import { api } from './authSlice';

const API_URL = process.env.REACT_APP_USER_API_URL ?? '';

export const fetchDashboardData = createAsyncThunk<
  DashboardData,
  void,
  { rejectValue: string }
>('/admin/dashboard', async (_, { rejectWithValue }) => {
  try {
    const userResponse = await api.get<User[]>(`${API_URL}/user/allUser`);
    const productResponse = await api.get<Product[]>(
      `${API_URL}/product/all/fetchProducts`
    );
    const saleResponse = await api.get<ISale[]>(`${API_URL}/sales`);

    const revenueResponse = await api.get(`${API_URL}/revenue/total`);

    const orderResponse = await api.get<IOrder[]>(`${API_URL}/order`);
    return {
      users: userResponse.data,
      products: productResponse.data,
      sales: saleResponse.data,
      revenue: revenueResponse.data,
      orders: orderResponse.data,
    };
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

const initialState: DashboardState = {
  users: [],
  products: [],
  sales: [],
  revenue: [],
  orders: [],
  loading: false,
  error: '',
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
      if (!action.payload) {
        console.error('Payload is undefined or null');
        return;
      }

      const { saleDate, totalProductsSold } = action.payload;
      const actionDate = action.payload.saleDate.split('T')[0];
      console.log('sale date is ', saleDate);
      console.log('saledata', JSON.stringify(state.sales));

      const existingSaleIndex = state.sales.findIndex(
        (sale) => sale.saleDate === `${actionDate}T00:00:00`
      );
      console.log('existing date', existingSaleIndex);

      console.log('existing saledate', state.sales[existingSaleIndex].saleDate);

      if (existingSaleIndex !== -1) {
        console.log(
          'Total products sold before update: ',
          state.sales[existingSaleIndex].totalProductsSold,
          'Index: ',
          existingSaleIndex,
          'product sold',
          totalProductsSold
        );
        state.sales[existingSaleIndex].totalProductsSold =
          state.sales[existingSaleIndex].totalProductsSold + totalProductsSold;
      } else {
        state.sales.push(action.payload);
      }
    },
    updateProductList: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    updateRevenue: (state, action) => {
      const actionDate = action.payload.saleDate.split('T')[0];
      const existingRevenueIndex = state.revenue.findIndex(
        (revenue) => revenue.date === `${actionDate}T00:00:00`
      );
      if (existingRevenueIndex !== -1) {
        state.revenue[existingRevenueIndex].totalRevenue +=
          action.payload.totalAmount;
      }
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
          state.revenue = action.payload.revenue;
          state.orders = action.payload.orders;
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

export const {
  updateInventory,
  updateSales,
  updateProductList,
  updateRevenue,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;

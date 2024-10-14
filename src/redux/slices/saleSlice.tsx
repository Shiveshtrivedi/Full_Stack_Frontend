import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { ISale } from '../../utils/type/types';

const API_URL = process.env.REACT_APP_USER_API_URL ?? '';

export const fetchSalesReport = createAsyncThunk<
  ISale[],
  { startDate: string; endDate: string },
  { rejectValue: string }
>(
  'sales/fetchSalesReport',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/sales/daterange?startDate=${startDate}&endDate=${endDate}`,
        {
          params: { startDate, endDate },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data || 'Failed to fetch sales data'
      );
    }
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    sales: [] as ISale[],
    loading: false,
    error: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSalesReport.fulfilled, (state, action) => {
        state.sales = action.payload;
        state.loading = false;
      })
      .addCase(fetchSalesReport.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default salesSlice.reducer;
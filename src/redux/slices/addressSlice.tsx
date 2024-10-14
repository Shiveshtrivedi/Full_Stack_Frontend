import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { IAddress, IAddressState } from '../../utils/type/types';

const initialState: IAddressState = {
  address: null,
  loading: false,
  error: null,
};

export const getAddresses = createAsyncThunk(
  'address/getAddresses',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5086/api/shippingAddress/${userId}/getAddressByUserId`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || 'Failed to fetch addresses'
      );
    }
  }
);

export const postAddress = createAsyncThunk(
  'address/postAddress',
  async (addressData: IAddress, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:5086/api/shippingAddress/addAddress',
        addressData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || 'Failed to post address'
      );
    }
  }
);

export const updateAddress = createAsyncThunk(
  'address/updateAddress',
  async (addressData: IAddress, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5086/api/shippingAddress/${addressData.shippingAddressID}/updateAddress`,
        addressData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update address'
      );
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    resetAddress(state) {
      state.address = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
      })
      .addCase(postAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
      })
      .addCase(getAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.address?.findIndex(
          (address) =>
            address.shippingAddressID === action.payload.shippingAddressID
        );
        if (index !== undefined && index >= 0) {
          if (state.address !== null) state.address[index] = action.payload;
        }
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAddress } = addressSlice.actions;
export default addressSlice.reducer;

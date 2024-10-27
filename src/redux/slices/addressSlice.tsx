import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IAddress, IAddressState } from '../../utils/type/types';
import { api } from './authSlice';

const initialState: IAddressState = {
  address: null,
  loading: false,
  error: '',
};

const API_URL = process.env.REACT_APP_USER_API_URL ?? '';

export const getAddresses = createAsyncThunk(
  'address/getAddresses',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `${API_URL}/shippingAddress/${userId}/getAddressByUserId`
      );
      return response.data;
    } catch (error: any) {
      const rejectValue =
        error.response.data.message || 'Failed to fetch addresses';
      return rejectWithValue(rejectValue);
    }
  }
);

export const postAddress = createAsyncThunk(
  'address/postAddress',
  async (addressData: IAddress, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `${API_URL}/shippingAddress/addAddress`,
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
      const response = await api.put(
        `${API_URL}/shippingAddress/${addressData.shippingAddressID}/updateAddress`,
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
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postAddress.pending, (state) => {
        state.loading = true;
        state.error = '';
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
        state.error = '';
      })
      .addCase(
        getAddresses.fulfilled,
        (state, action: PayloadAction<IAddress[]>) => {
          state.loading = false;
          state.address = action.payload;
        }
      )
      .addCase(getAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to fetch addresses';
      })
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = '';
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

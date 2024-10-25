import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  IProduct,
  IWishListItem,
  IWishListState,
} from '../../utils/type/types';
import { toast } from 'react-toastify';
import { api } from './authSlice';

const initialState: IWishListState = {
  items: [] as IWishListItem[],
  loading: false,
  error: '',
};

const API_URL = process.env.REACT_APP_USER_API_URL ?? '';

export const getWishlist = createAsyncThunk<IWishListItem[], number>(
  '/wishlist/items',
  async (userId: number) => {
    const response = await api.get(
      `${API_URL}/wishlist/${userId}/getAllItemsOfWishlist`
    );
    return response.data;
  }
);

export const addToWishlist = createAsyncThunk<
  IWishListItem,
  { userId: number; product: IProduct }
>('/wishlist/add', async ({ userId, product }) => {
  const response = await api.post(
    `${API_URL}/wishlist/${userId}/add/${product.productId}/addProductToWishList`,
    {
      userId,
      product: {
        productId: product.productId,
      },
    }
  );
  return response.data;
});

export const removeFromWishlist = createAsyncThunk<
  void,
  { userId: number; productId: number }
>('/wishlist/remove', async ({ userId, productId }) => {
  await api.delete(
    `${API_URL}/wishlist/${userId}/remove/${productId}/removeProductFromWishList`
  );
});

const wishListSlice = createSlice({
  name: 'wishList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getWishlist.fulfilled, (state, action:PayloadAction<IWishListItem[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch';
      })
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        toast.success(`Added to wishlist`);
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add item to wishlist';
      })
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (item) => item.product.productId !== action.meta.arg.productId
        );
        toast.error('Item removed from wishlist');
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to remove item from wishlist';
      });
  },
});

export default wishListSlice.reducer;

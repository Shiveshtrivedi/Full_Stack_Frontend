import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { ICartItem, ICartState } from '../../utils/type/types';
import { toast } from 'react-toastify';
import { api } from './authSlice';

const API_URL = process.env.REACT_APP_USER_API_URL ?? '';

const initialState: ICartState = {
  items: JSON.parse(
    localStorage.getItem(`cart_${localStorage.getItem('userId')}`) ?? '[]'
  ),
  totalAmount: parseFloat(localStorage.getItem('totalAmount') ?? '0'),
  totalItems: parseInt(localStorage.getItem('totalItems') ?? '0', 10),
  userId: localStorage.getItem('userId')
    ? Number(localStorage.getItem('userId'))
    : 0,
  loading: false,
};

export const getCart = createAsyncThunk<
  ICartItem[],
  { userId: number },
  { rejectValue: string }
>('cart/getCart', async ({ userId }, { rejectWithValue }) => {
  try {
    const response = await api.get(`${API_URL}/cart/${userId}/getCartItems`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    return rejectWithValue(
      (axiosError.response?.data as string) || 'Failed to get cart'
    );
  }
});

export const addToCart = createAsyncThunk<
  ICartItem[],
  { userId: number; productId: number; quantity: number },
  { rejectValue: string }
>('cart/add', async ({ userId, productId, quantity }, { rejectWithValue }) => {
  try {
    const response = await api.post(`${API_URL}/cart/${userId}/addCartItems`, {
      productId,
      quantity,
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    return rejectWithValue(
      (axiosError.response?.data as string) || 'Failed to add to cart'
    );
  }
});

export const updateCartItem = createAsyncThunk<
  ICartItem[],
  { userId: number; items: Array<{ productId: number; quantity: number }> },
  { rejectValue: string }
>('cart/updateItem', async ({ userId, items }, { rejectWithValue }) => {
  try {
    const response = await api.put(
      `${API_URL}/cart/${userId}/updateCartItem`,
      items
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    toast.error(
      (axiosError.response?.data as string) || 'Failed to update cart item'
    );
    return rejectWithValue(
      (axiosError.response?.data as string) || 'Failed to update cart item'
    );
  }
});

export const clearCart = createAsyncThunk<
  void,
  { userId: number },
  { rejectValue: string }
>('cart/clearCart', async ({ userId }, { rejectWithValue }) => {
  try {
    await api.delete(`${API_URL}/cart/clear/${userId}/deletItemsInCart`);
  } catch (error) {
    const axiosError = error as AxiosError;
    toast.error(
      (axiosError.response?.data as string) || 'Failed to clear cart'
    );
    return rejectWithValue(
      (axiosError.response?.data as string) || 'Failed to clear cart'
    );
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItem(state, action: PayloadAction<ICartItem[]>) {
      state.items = action.payload;
      state.totalAmount = action.payload.reduce((total, item) => {
        return total + item.totalPrice * (item.quantity ?? 0);
      }, 0);
      state.totalItems = action.payload.reduce(
        (total, item) => total + (item.quantity ?? 0),
        0
      );
      localStorage.setItem(`cart_${state.userId}`, JSON.stringify(state.items));
      localStorage.setItem('totalAmount', state.totalAmount.toString());
      localStorage.setItem('totalItems', state.totalItems.toString());
    },
    checkout(state) {
      if (!state.userId) return;

      localStorage.setItem(`cart_${state.userId}`, JSON.stringify(state.items));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.totalAmount = action.payload.reduce(
          (total, item) => total + item.totalPrice,
          0
        );
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(
        addToCart.fulfilled,
        (state, action: PayloadAction<ICartItem[]>) => {
          const updatedCart: ICartItem[] = action.payload;

          if (!updatedCart || updatedCart.length === 0) return;

          state.items = updatedCart;

          state.totalAmount = updatedCart.reduce(
            (total, item) => total + item.totalPrice,
            0
          );

          localStorage.setItem(
            `cart_${state.userId}`,
            JSON.stringify(state.items)
          );

          localStorage.setItem('totalAmount', state.totalAmount.toString());

          toast.success('Product added to cart');
        }
      )
      .addCase(
        addToCart.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          console.error(action.payload);
          toast.error('Failed to add product to cart ');
        }
      )
      .addCase(
        updateCartItem.fulfilled,
        (state, action: PayloadAction<ICartItem[]>) => {
          const updatedCart: ICartItem[] = action.payload;

          if (!updatedCart || updatedCart.length === 0) return;

          state.items = updatedCart;

          state.totalAmount = updatedCart.reduce(
            (total, item) => total + item.totalPrice,
            0
          );

          localStorage.setItem(
            `cart_${state.userId}`,
            JSON.stringify(state.items)
          );
        }
      )
      .addCase(
        updateCartItem.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          console.error(action.payload);
        }
      )
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalAmount = 0;
        localStorage.removeItem(`cart_${state.userId}`);
        localStorage.setItem('totalAmount', '0');
        toast.error('Cart cleared');
      })
      .addCase(
        clearCart.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          console.error(action.payload);
        }
      );
  },
});

export const { setCartItem, checkout } = cartSlice.actions;
export default cartSlice.reducer;

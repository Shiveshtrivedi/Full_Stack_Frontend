import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { InventoryItem, InventoryState, UpdateStockRequest } from '../../utils/type/types';


const initialState: InventoryState = {
  items: [],
  loading: false,
  error: null,
};

const API_URL = process.env.REACT_APP_USER_API_URL ?? '';

export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async (productId: number) => {
    const response = await axios.get(
      `${API_URL}/inventory/${productId}/getInventory`
    );
    return response.data;
  }
);

export const addInventoryItem = createAsyncThunk<InventoryItem[], number>(
  'inventory/addInventoryItem',
  async (productId: number) => {
    const response = await axios.post(
      `${API_URL}/inventory/${productId}/createInventory`,
      { productId }
    );
    return response.data;
  }
);

export const updateStock = createAsyncThunk(
  'inventory/updateStock',
  async (updateStockRequest: UpdateStockRequest) => {
    const response = await axios.put(
      `${API_URL}/inventory/updateStock`,
      updateStockRequest
    );
    return response.data;
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch inventory';
      })
      .addCase(addInventoryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInventoryItem.fulfilled, (state, action) => {
        const newItems: InventoryItem[] = action.payload;

        newItems.forEach((newItem) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.productId === newItem.productId
          );

          if (existingItemIndex !== -1) {
            state.items[existingItemIndex].stockSold += newItem.stockSold;
          } else {
            state.items.push(newItem);
          }
        });

        state.loading = false;
      })
      .addCase(addInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to add inventory item';
      })
      .addCase(updateStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStock.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to update stock';
      });
  },
});

export default inventorySlice.reducer;

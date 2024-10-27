import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAdminHistory, IAdminHistoryState } from '../../utils/type/types';
import { api } from './authSlice';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_USER_API_URL;

export const fetchProductHistory = createAsyncThunk<
  IAdminHistory[],
  number,
  { rejectValue: string }
>('/fetch/adminProduct/history', async (userId, { rejectWithValue }) => {
  try {
    const response = await api.get(
      `${API_URL}/history/${userId}/adminProductHistoryByUserId`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to fetch history');
  }
});

export const deleteAdminHistory = createAsyncThunk<
  number,
  { historyId: number },
  { rejectValue: string }
>('adminHistory/delete', async ({ historyId }, { rejectWithValue }) => {
  try {
    await api.delete(`${API_URL}/history/${historyId}/deleteProducthistory`);
    return historyId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || 'Failed to delete history entry'
    );
  }
});

export const clearAdminHistory = createAsyncThunk<
  void,
  number,
  { rejectValue: string }
>('adminHistory/clear', async (userId, { rejectWithValue }) => {
  try {
    await api.delete(`${API_URL}/history/clear/${userId}/clearHistory`);
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to clear history');
  }
});

const initialState: IAdminHistoryState = {
  histories: [],
  loading: false,
  error: '',
};

const adminHistorySlice = createSlice({
  name: 'adminHistoryOfProduct',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchProductHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchProductHistory.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || 'failed to fetch';
        }
      )
      .addCase(
        fetchProductHistory.fulfilled,
        (state, action: PayloadAction<IAdminHistory[]>) => {
          state.histories = action.payload;
          state.loading = false;
        }
      )
      .addCase(deleteAdminHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        deleteAdminHistory.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.histories = state.histories.filter(
            (history) => history.historyId !== action.payload
          );
          toast.error('Product removed from history');
        }
      )
      .addCase(
        deleteAdminHistory.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || 'Failed to delete history entry';
        }
      )
      .addCase(clearAdminHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearAdminHistory.fulfilled, (state) => {
        state.histories = [];
        state.loading = false;
        toast.error('History Cleared');
      })
      .addCase(
        clearAdminHistory.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || 'Failed to clear history';
        }
      ),
});

export default adminHistorySlice.reducer;

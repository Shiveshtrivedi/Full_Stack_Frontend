import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { IUserForAdmin, IUserManagementState } from '../../utils/type/types';

const API_URL = process.env.REACT_APP_USER_API_URL ?? '';

export const fetchUsers = createAsyncThunk<
  IUserForAdmin[],
  void,
  { rejectValue: string }
>('users/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/user/allUser`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const updateUser = createAsyncThunk<
  IUserForAdmin,
  IUserForAdmin,
  { rejectValue: string }
>('users/update', async (user, { rejectWithValue }) => {
  try {
    const response = await axios.put(
      `${API_URL}/user/${user.userId}/updateUserById`,
      user
    );
    return response.data as IUserForAdmin;
  } catch (error) {
    return rejectWithValue((error as any).response.data);
  }
});

export const deleteUser = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>('users/delete', async (userId, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/user/${userId}/deleteUser`);
    return userId;
  } catch (error) {
    return rejectWithValue((error as any).response.data);
  }
});

const initialState: IUserManagementState = {
  users: [],
  loading: false,
  error: null as string | null,
};

const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.payload ?? '';
        state.loading = false;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUserIndex = state.users.findIndex(
          (u) => u.userId === action.payload.userId
        );
        if (updatedUserIndex !== -1) {
          state.users[updatedUserIndex] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.users = state.users.filter((u) => u.userId !== action.payload);
      });
  },
});

export default userManagementSlice.reducer;

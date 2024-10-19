import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { removeCookie } from '../../utils/cookie/cookieUtils';
import {
  IUser,
  IAuthState,
  IAuthResponse,
  ICredentials,
} from '../../utils/type/types';

const API_URL = process.env.REACT_APP_USER_API_URL ?? '';

const storedToken = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');

const isTokenExpired = () => {
  const expiration = localStorage.getItem('tokenExpiration');
  return expiration ? Date.now() > Number(expiration) : true;
};

const initialState: IAuthState = {
  isAuthenticated: !!storedToken && !isTokenExpired(),
  user: storedUser
    ? JSON.parse(storedUser)
    : { name: '', email: '', password: '', id: '' },
  token: storedToken ?? '',
  error: '',
  isAdmin: storedUser ? JSON.parse(storedUser).isAdmin : false,
  userEmail: storedUser ? JSON.parse(storedUser).email : '',
};

export const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to add the Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = createAsyncThunk<
  IAuthResponse,
  ICredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post(
      `${API_URL}/auth/login`,
      {
        email: credentials.email,
        password: credentials.password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const user = {
      id: response.data.userId,
      name: response.data.userName,
      email: response.data.email,
      password: response.data.password,
      isAdmin: response.data.isAdmin,
    } as IUser;

    const token = response.data.token as string;
    const expirationTime = Date.now() + 3600000;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('tokenExpiration', expirationTime.toString());

    return { user, token };
  } catch (error) {
    const axiosError = error as AxiosError;
    return rejectWithValue(
      (axiosError.response?.data as string) || 'Login failed'
    );
  }
});

export const signup = createAsyncThunk<
  IAuthResponse,
  ICredentials,
  { rejectValue: string }
>('auth/signup', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      userName: credentials.name,
      email: credentials.email,
      password: credentials.password,
    });

    const user = response.data.user as IUser;
    const token = response.data.token as string;

    return { user, token };
  } catch (error) {
    const axiosError = error as AxiosError;
    return rejectWithValue(
      (axiosError.response?.data as string) || 'Signup failed'
    );
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      removeCookie('token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tokenExpiration');
      state.isAuthenticated = false;
      state.user = {
        name: '',
        email: '',
        password: '',
        id: 0,
        isAdmin: false,
      };
      state.token = '';
      state.error = '';
      state.isAdmin = false;
      state.userEmail = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.error = '';
      })

      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<IAuthResponse>) => {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.error = '';
          state.userEmail = action.payload.user.email;
          state.isAdmin = action.payload.user.isAdmin ?? false;
        }
      )
      .addCase(
        login.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload ?? 'Login failed';
        }
      )
      .addCase(signup.pending, (state) => {
        state.error = '';
      })

      .addCase(
        signup.fulfilled,
        (state, action: PayloadAction<IAuthResponse>) => {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.error = '';
          state.userEmail = action.payload.user.email;
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      )
      .addCase(
        signup.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload ?? 'Signup failed';
        }
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

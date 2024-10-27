import { configureStore } from '@reduxjs/toolkit';
import authReducer, { login, signup, logout } from '../redux/slices/authSlice';
import { mockUser } from './mockData/mockData';

describe('authSlice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({ reducer: { auth: authReducer } });
  });

  it('should handle login pending', () => {
    const action = login.pending('', {
      email: 'test@example.com',
      password: 'password123',
    });
    store.dispatch(action);
    const state = store.getState().auth;
    expect(state.error).toBe('');
  });

  it('should handle login fulfilled', () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Test@123',
      isAdmin: false,
    };

    const mockToken = 'mockToken123';

    store.dispatch(
      login.fulfilled({ user: mockUser, token: mockToken }, '', {
        email: 'john.doe@example.com',
        password: 'password123',
      })
    );

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(mockToken);
    expect(state.error).toBe('');
  });

  it('should handle login rejected', () => {
    const errorMessage = 'Login failed';

    store.dispatch(
      login.rejected(new Error(errorMessage), '', {
        email: 'john.doe@example.com',
        password: 'wrongPassword',
      })
    );
    const state = store.getState().auth;
    expect(state.error).toBe(errorMessage);
  });

  it('should handle signup pending', () => {
    store.dispatch(
      signup.pending('', {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      })
    );
    const state = store.getState().auth;
    expect(state.error).toBe('');
  });

  it('should handle signup fulfilled', () => {
    const mockSignupResponse = {
      userName: 'John Doe',
      email: 'john.doe@example.com',
      isAdmin: false,
      token: 'mockToken123',
    };

    store.dispatch(
      signup.fulfilled(mockSignupResponse, '', {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      })
    );

    const state = store.getState().auth;
    expect(state.user.name).toBe(mockSignupResponse.userName);
    expect(state.user.email).toBe(mockSignupResponse.email);
    expect(state.isAdmin).toBe(mockSignupResponse.isAdmin);
    expect(state.error).toBe('');
  });

  it('should handle signup rejected', () => {
    const errorMessage = 'Signup failed';

    store.dispatch(
      signup.rejected(new Error(errorMessage), '', {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      })
    );

    const state = store.getState().auth;
    expect(state.error).toBe(errorMessage);
  });

  it('should handle logout', () => {
    const mockToken = 'mockToken123';

    store.dispatch(
      login.fulfilled({ user: mockUser, token: mockToken }, '', {
        email: 'john.doe@example.com',
        password: 'password123',
      })
    );

    store.dispatch(logout());

    const state = store.getState().auth;

    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toEqual({
      name: '',
      email: '',
      password: '',
      id: 0,
      isAdmin: false,
    });
    expect(state.token).toBe('');
  });
});

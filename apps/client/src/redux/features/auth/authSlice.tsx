import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { IUserResponse } from '@noted/types';

interface AuthState {
  isLoggedIn: boolean;
  name: string;
  user: {
    name: string;
    email: string;
    phone: string;
    bio: string;
    photo: string;
  };
}

// Get initial name from localStorage if it exists
const getInitialName = (): string => {
  try {
    const storedName = localStorage.getItem('name');
    return storedName ? JSON.parse(storedName) : '';
  } catch {
    return '';
  }
};

const initialState: AuthState = {
  isLoggedIn: false,
  name: getInitialName(),
  user: {
    name: '',
    email: '',
    phone: '',
    bio: '',
    photo: '',
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    SET_LOGIN(state, action: PayloadAction<boolean>): void {
      state.isLoggedIn = action.payload;
    },
    SET_NAME(state, action: PayloadAction<string>): void {
      state.name = action.payload;
      // Side effect - ideally this should be in middleware
      try {
        localStorage.setItem('name', JSON.stringify(action.payload));
      } catch (error) {
        console.error('Failed to save name to localStorage:', error);
      }
    },
    SET_USER(state, action: PayloadAction<IUserResponse>): void {
      const profile = action.payload;
      state.user.name = profile.name;
      state.user.email = profile.email;
      state.user.phone = profile.phone;
      state.user.bio = profile.bio;
      state.user.photo = profile.photo;
    },
    CLEAR_AUTH(state): void {
      state.isLoggedIn = false;
      state.name = '';
      state.user = {
        name: '',
        email: '',
        phone: '',
        bio: '',
        photo: '',
      };
      try {
        localStorage.removeItem('name');
      } catch (error) {
        console.error('Failed to clear name from localStorage:', error);
      }
    },
  },
});

export const { SET_LOGIN, SET_NAME, SET_USER, CLEAR_AUTH } = authSlice.actions;

// Typed selectors
export const selectIsLoggedIn = (state: { auth: AuthState }): boolean => state.auth.isLoggedIn;
export const selectName = (state: { auth: AuthState }): string => state.auth.name;
export const selectUser = (state: { auth: AuthState }): AuthState['user'] => state.auth.user;

export default authSlice.reducer;

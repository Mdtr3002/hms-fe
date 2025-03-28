import { StateCreator } from 'zustand';

import AuthService from '../service/auth.service';

export interface TAuthState {
  isAuthenticated: boolean;
  token: string;
}

export interface TAuthActions {
  loginWithGoogle: () => void;
  setToken: (token: string) => void;
}

export interface TAuthSlice extends TAuthState, TAuthActions {}

export const initialState = {
  isAuthenticated: false,
  token: localStorage.getItem('token') || '',
};

export const AuthSlice: StateCreator<TAuthSlice, [['zustand/devtools', never]], [], TAuthSlice> = (
  set
) => ({
  ...initialState,
  loginWithGoogle: () => {
    AuthService.loginWithGoogle();
  },
  setToken: (token) => {
    localStorage.setItem('token', JSON.stringify(token));
    set({ isAuthenticated: true, token });
  },
});

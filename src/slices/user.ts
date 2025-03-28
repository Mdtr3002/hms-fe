import { StateCreator } from 'zustand';

import UserService from '../service/user.service';

import { TAuthSlice } from './auth';

import type { User } from '../types/user';

export interface TUserState extends User {}

export interface TUserActions {
  getUserProfile: () => Promise<void>;
}

export interface TUserSlice extends TUserActions {
  user: TUserState;
}

export const initialState: TUserState = {
  _id: '',
  googleId: '',
  accessLevels: [],
  isManager: false,
  familyAndMiddleName: '',
  givenName: '',
  picture: '',
  dateOfBirth: 0,
  email: '',
  studentId: '',
  major: '',
  phoneNumber: '',
  gender: '',
};

export const UserSlice: StateCreator<
  TUserSlice & TAuthSlice,
  [['zustand/devtools', never]],
  [],
  TUserSlice
> = (set) => ({
  user: initialState,
  getUserProfile: async () => {
    try {
      const { data } = await UserService.getUserProfile();
      set((state) => ({
        user: {
          ...state.user,
          _id: data.payload?._id,
          googleId: data.payload?.googleId,
          accessLevels: data.payload?.accessLevels,
          isManager: data.payload?.isManager,
          familyAndMiddleName: data.payload?.familyAndMiddleName,
          givenName: data.payload?.givenName,
          picture: data.payload?.picture,
          dateOfBirth: data.payload?.dateOfBirth,
          email: data.payload?.email,
          studentId: data.payload?.studentId,
          major: data.payload?.major,
          phoneNumber: data.payload?.phoneNumber,
          gender: data.payload?.gender,
        },
        isAuthenticated: true,
      }));
    } catch (error: any) {
      set({ user: { ...initialState }, isAuthenticated: false });
    }
  },
});

import { create, StoreApi, UseBoundStore } from 'zustand';
import { devtools } from 'zustand/middleware';

import { AdminFilterSlice, TAdminFilterSlice } from './slices/admin';
import { AppSlice, TAppSlice } from './slices/app';
import { AuthSlice, TAuthSlice, initialState as authInitialState } from './slices/auth';
import { LibrarySlice, TLibrarySlice } from './slices/library';
import { TUserSlice, UserSlice, initialState as userInitialState } from './slices/user';

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  let store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

export interface TCommonActions {
  logout: () => void;
}

const useBoundStoreBase = create<
  TAppSlice & TAuthSlice & TUserSlice & TLibrarySlice & TCommonActions & TAdminFilterSlice
>()(
  devtools((...a) => ({
    ...AppSlice(...a),
    ...AuthSlice(...a),
    ...UserSlice(...a),
    ...LibrarySlice(...a),
    ...AdminFilterSlice(...a),
    logout: () => {
      localStorage.clear();
      a[0]({ ...authInitialState, ...userInitialState });
    },
  }))
);

const useBoundStore = createSelectors(useBoundStoreBase);

export default useBoundStore;

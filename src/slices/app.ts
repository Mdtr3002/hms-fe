import { StateCreator } from 'zustand';

export interface TAppSlice {
  isAsideOpen: boolean;
  isSignInModalOpen: boolean;
  toggleAside: () => void;
  openAside: () => void;
  openSignInModal: () => void;
  closeSignInModal: () => void;
}

export const AppSlice: StateCreator<TAppSlice, [['zustand/devtools', never]], [], TAppSlice> = (
  set
) => ({
  isAsideOpen: true,
  isSignInModalOpen: false,
  toggleAside: () => set((state) => ({ isAsideOpen: !state.isAsideOpen })),
  openAside: () => set(() => ({ isAsideOpen: true })),
  openSignInModal: () => set(() => ({ isSignInModalOpen: true })),
  closeSignInModal: () => set(() => ({ isSignInModalOpen: false })),
});

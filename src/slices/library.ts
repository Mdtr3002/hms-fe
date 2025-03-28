import { StateCreator } from 'zustand';

import SubjectService from '../service/subject.service';

import type { Subject } from '../types/subject';

export interface TLibraryState {
  subjects: Array<Subject>;
}

export interface TLibraryActions {
  getAllSubjects: () => Promise<void>;
}

export interface TLibrarySlice extends TLibraryState, TLibraryActions {}

export const initialState: TLibraryState = {
  subjects: [],
};

export const LibrarySlice: StateCreator<
  TLibrarySlice,
  [['zustand/devtools', never]],
  [],
  TLibrarySlice
> = (set) => ({
  ...initialState,
  getAllSubjects: async () => {
    try {
      const { data } = await SubjectService.getAll({});
      set({ subjects: data.payload.result });
    } catch (error: any) {
      set({ ...initialState });
    }
  },
});

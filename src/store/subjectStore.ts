import { create } from 'zustand';
import { Subject } from '../types';
import { fetchSubjects } from '../api';

interface SubjectState {
  subjects: Subject[];
  isLoading: boolean;
  error: string | null;
  fetchSubjects: () => Promise<void>;
}

export const useSubjectStore = create<SubjectState>((set) => ({
  subjects: [],
  isLoading: false,
  error: null,
  fetchSubjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const subjects = await fetchSubjects();
      set({ subjects, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch subjects', isLoading: false });
    }
  },
}));
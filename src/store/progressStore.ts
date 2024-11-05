import { create } from 'zustand';
import { Topic } from '../types';
import { fetchTopics, updateProgress } from '../api';

interface ProgressState {
  topics: Topic[];
  isLoading: boolean;
  error: string | null;
  fetchTopics: (subject: string) => Promise<void>;
  updateProgress: (userId: string, topicId: string, completed: boolean) => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set) => ({
  topics: [],
  isLoading: false,
  error: null,

  fetchTopics: async (subject: string) => {
    set({ isLoading: true, error: null });
    try {
      const topics = await fetchTopics(subject);
      set({ topics, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch topics', isLoading: false });
    }
  },

  updateProgress: async (userId: string, topicId: string, completed: boolean) => {
    try {
      await updateProgress(userId, topicId, completed);
      set((state) => ({
        topics: state.topics.map((topic) =>
          topic.id === topicId
            ? {
                ...topic,
                completedQuestions: completed
                  ? topic.completedQuestions + 1
                  : topic.completedQuestions,
              }
            : topic
        ),
      }));
    } catch (error) {
      set({ error: 'Failed to update progress' });
    }
  },
}));
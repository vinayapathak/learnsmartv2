import { create } from 'zustand';
import { TestQuestion, TestConfig } from '../types';
import { fetchQuestions, saveTestResults } from '../api';
import { useAuthStore } from './authStore';

interface TestState {
  questions: TestQuestion[];
  currentQuestionIndex: number;
  timeRemaining: number;
  isTestComplete: boolean;
  isLoading: boolean;
  error: string | null;
  fetchQuestions: (config: TestConfig) => Promise<void>;
  setCurrentQuestion: (index: number) => void;
  answerQuestion: (questionId: string, answer: string) => void;
  toggleBookmark: (questionId: string) => void;
  updateTimeRemaining: (time: number) => void;
  completeTest: () => Promise<void>;
}

export const useTestStore = create<TestState>((set, get) => ({
  questions: [],
  currentQuestionIndex: 0,
  timeRemaining: 1200,
  isTestComplete: false,
  isLoading: false,
  error: null,

  fetchQuestions: async (config: TestConfig) => {
    set({ isLoading: true, error: null });
    try {
      const questions = await fetchQuestions(config);
      set({
        questions: questions.map((q: any) => ({
          ...q,
          isAttempted: false,
          isBookmarked: false,
        })),
        isLoading: false,
      });
    } catch (error) {
      set({ error: 'Failed to fetch questions', isLoading: false });
    }
  },

  setCurrentQuestion: (index) => set({ currentQuestionIndex: index }),

  answerQuestion: (questionId, answer) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === questionId ? { ...q, selectedAnswer: answer, isAttempted: true } : q
      ),
    })),

  toggleBookmark: (questionId) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === questionId ? { ...q, isBookmarked: !q.isBookmarked } : q
      ),
    })),

  updateTimeRemaining: (time) => set({ timeRemaining: time }),

  completeTest: async () => {
    const state = get();
    const user = useAuthStore.getState().user;
    if (!user) return;

    const correctAnswers = state.questions.filter(
      (q) => q.selectedAnswer === q.correctAnswer
    ).length;
    const score = (correctAnswers / state.questions.length) * 100;

    try {
      await saveTestResults(
        user.id,
        state.questions[0].subject,
        state.questions,
        score,
        1200 - state.timeRemaining
      );
      set({ isTestComplete: true });
    } catch (error) {
      set({ error: 'Failed to save test results' });
    }
  },
}));
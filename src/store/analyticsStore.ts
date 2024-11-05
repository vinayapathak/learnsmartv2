import { create } from 'zustand';
import { TestQuestion, Subject } from '../types';

interface PerformancePrediction {
  predictedScore: number;
  recommendedTopics: string[];
  recommendedDifficulty: string;
  estimatedStudyTime: number;
}

interface AnalyticsState {
  performanceByTopic: Record<string, { total: number; correct: number }>;
  difficultyDistribution: Record<string, number>;
  averageTimePerQuestion: number;
  strengthsAndWeaknesses: {
    strengths: string[];
    weaknesses: string[];
  };
  performanceTrend: {
    dates: string[];
    scores: number[];
  };
  prediction: PerformancePrediction;
  updateAnalytics: (questions: TestQuestion[], timeSpent: number) => void;
  predictPerformance: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  performanceByTopic: {},
  difficultyDistribution: {},
  averageTimePerQuestion: 0,
  strengthsAndWeaknesses: { strengths: [], weaknesses: [] },
  performanceTrend: {
    dates: [],
    scores: [],
  },
  prediction: {
    predictedScore: 0,
    recommendedTopics: [],
    recommendedDifficulty: 'medium',
    estimatedStudyTime: 0,
  },

  updateAnalytics: (questions: TestQuestion[], timeSpent: number) => {
    const topicPerformance: Record<string, { total: number; correct: number }> = {};
    const difficultyCount: Record<string, number> = {};

    questions.forEach((q) => {
      if (!topicPerformance[q.topic]) {
        topicPerformance[q.topic] = { total: 0, correct: 0 };
      }
      topicPerformance[q.topic].total++;
      if (q.selectedAnswer === q.correctAnswer) {
        topicPerformance[q.topic].correct++;
      }

      difficultyCount[q.difficulty] = (difficultyCount[q.difficulty] || 0) + 1;
    });

    const topicScores = Object.entries(topicPerformance).map(([topic, data]) => ({
      topic,
      score: (data.correct / data.total) * 100,
    }));

    const strengths = topicScores
      .filter((topic) => topic.score >= 70)
      .map((topic) => topic.topic);

    const weaknesses = topicScores
      .filter((topic) => topic.score < 50)
      .map((topic) => topic.topic);

    // Update performance trend
    const score = (questions.filter((q) => q.selectedAnswer === q.correctAnswer).length / questions.length) * 100;
    const date = new Date().toLocaleDateString();

    set((state) => ({
      performanceByTopic: topicPerformance,
      difficultyDistribution: difficultyCount,
      averageTimePerQuestion: timeSpent / questions.length,
      strengthsAndWeaknesses: { strengths, weaknesses },
      performanceTrend: {
        dates: [...state.performanceTrend.dates, date],
        scores: [...state.performanceTrend.scores, score],
      },
    }));

    get().predictPerformance();
  },

  predictPerformance: () => {
    const state = get();
    const weakTopics = state.strengthsAndWeaknesses.weaknesses;
    const avgScore = state.performanceTrend.scores.length > 0
      ? state.performanceTrend.scores.reduce((a, b) => a + b, 0) / state.performanceTrend.scores.length
      : 0;

    // Simple linear regression for score prediction
    const scores = state.performanceTrend.scores;
    let predictedScore = avgScore;
    if (scores.length >= 2) {
      const slope = (scores[scores.length - 1] - scores[scores.length - 2]);
      predictedScore = Math.min(100, Math.max(0, scores[scores.length - 1] + slope));
    }

    // Recommend difficulty based on current performance
    const recommendedDifficulty = avgScore < 50 ? 'easy' : avgScore < 75 ? 'medium' : 'hard';

    // Estimate study time based on weak topics
    const estimatedStudyTime = weakTopics.length * 2; // 2 hours per weak topic

    set({
      prediction: {
        predictedScore,
        recommendedTopics: weakTopics,
        recommendedDifficulty,
        estimatedStudyTime,
      },
    });
  },
}));
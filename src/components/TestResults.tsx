import React from 'react';
import { useTestStore } from '../store/testStore';
import { useAnalyticsStore } from '../store/analyticsStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { Award, Clock, Target, TrendingUp, AlertTriangle, Brain, BookOpen, Lightbulb } from 'lucide-react';

export default function TestResults() {
  const questions = useTestStore((state) => state.questions);
  const analytics = useAnalyticsStore();
  const prediction = useAnalyticsStore((state) => state.prediction);

  React.useEffect(() => {
    analytics.updateAnalytics(questions, 1200);
  }, [questions]);

  const correctAnswers = questions.filter(
    (q) => q.selectedAnswer === q.correctAnswer
  ).length;

  const score = (correctAnswers / questions.length) * 100;

  // Chart data preparation
  const topicPerformanceData = Object.entries(analytics.performanceByTopic).map(
    ([topic, data]) => ({
      topic,
      score: (data.correct / data.total) * 100,
    })
  );

  const difficultyData = Object.entries(analytics.difficultyDistribution).map(
    ([difficulty, count]) => ({
      difficulty,
      count,
    })
  );

  const performanceTrendData = analytics.performanceTrend.dates.map((date, index) => ({
    date,
    score: analytics.performanceTrend.scores[index],
  }));

  const radarData = topicPerformanceData.map((item) => ({
    subject: item.topic,
    score: item.score,
    fullMark: 100,
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Performance Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {/* ... existing stat cards ... */}
        </div>

        {/* Performance Prediction Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Brain className="w-6 h-6 mr-2 text-purple-500" />
            Performance Predictions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                Predicted Next Score
              </h3>
              <p className="text-3xl font-bold text-purple-600">
                {prediction.predictedScore.toFixed(1)}%
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                Recommended Study Time
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {prediction.estimatedStudyTime}h
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-600" />
                Recommended Difficulty
              </h3>
              <p className="text-3xl font-bold text-green-600 capitalize">
                {prediction.recommendedDifficulty}
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-orange-600" />
                Focus Areas
              </h3>
              <div className="space-y-1">
                {prediction.recommendedTopics.map((topic) => (
                  <p key={topic} className="text-sm text-orange-600">
                    • {topic}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Visualizations */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Performance Trend */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Performance Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#4F46E5"
                    fill="#4F46E5"
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Topic Performance Radar */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Topic Mastery</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#4F46E5"
                    fill="#4F46E5"
                    fillOpacity={0.6}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Existing visualizations and detailed analysis */}
        {/* ... rest of the component ... */}
      </div>
    </div>
  );
}
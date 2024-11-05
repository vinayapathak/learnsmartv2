import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TestConfig, Topic } from '../types';
import { useProgressStore } from '../store/progressStore';

export default function TestConfig({ subject }: { subject: string }) {
  const navigate = useNavigate();
  const topics = useProgressStore((state) =>
    state.topics.filter((t) => t.subject === subject)
  );

  const [config, setConfig] = useState<TestConfig>({
    subject: subject as any,
    topics: [],
    duration: 1200,
    questionCount: 10,
    difficulty: ['easy', 'medium'],
    questionTypes: ['objective', 'subjective'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would fetch questions based on config
    navigate('/test', { state: { config } });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Customize Your Test</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Topics
          </label>
          <div className="grid gap-2">
            {topics.map((topic) => (
              <label key={topic.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.topics.includes(topic.id)}
                  onChange={(e) => {
                    setConfig((prev) => ({
                      ...prev,
                      topics: e.target.checked
                        ? [...prev.topics, topic.id]
                        : prev.topics.filter((t) => t !== topic.id),
                    }));
                  }}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-gray-700">{topic.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Duration (minutes)
          </label>
          <input
            type="number"
            min="5"
            max="180"
            value={config.duration / 60}
            onChange={(e) =>
              setConfig((prev) => ({
                ...prev,
                duration: parseInt(e.target.value) * 60,
              }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Questions
          </label>
          <input
            type="number"
            min="5"
            max="50"
            value={config.questionCount}
            onChange={(e) =>
              setConfig((prev) => ({
                ...prev,
                questionCount: parseInt(e.target.value),
              }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['easy', 'medium', 'hard'].map((level) => (
              <label key={level} className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.difficulty.includes(level as any)}
                  onChange={(e) => {
                    setConfig((prev) => ({
                      ...prev,
                      difficulty: e.target.checked
                        ? [...prev.difficulty, level as any]
                        : prev.difficulty.filter((d) => d !== level),
                    }));
                  }}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 capitalize text-gray-700">{level}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Types
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['objective', 'subjective'].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.questionTypes.includes(type as any)}
                  onChange={(e) => {
                    setConfig((prev) => ({
                      ...prev,
                      questionTypes: e.target.checked
                        ? [...prev.questionTypes, type as any]
                        : prev.questionTypes.filter((t) => t !== type),
                    }));
                  }}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 capitalize text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
        >
          Start Test
        </button>
      </form>
    </div>
  );
}
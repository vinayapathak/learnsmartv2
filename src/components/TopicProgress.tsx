import React from 'react';
import { useProgressStore } from '../store/progressStore';

export default function TopicProgress({ subject }: { subject: string }) {
  const topics = useProgressStore((state) =>
    state.topics.filter((t) => t.subject === subject)
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Topic Progress</h2>
      <div className="grid gap-4">
        {topics.map((topic) => {
          const progress = (topic.completedQuestions / topic.totalQuestions) * 100;
          return (
            <div key={topic.id} className="bg-white rounded-lg p-4 shadow">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-900">{topic.name}</h3>
                <span className="text-sm text-gray-500">
                  {topic.completedQuestions}/{topic.totalQuestions} completed
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
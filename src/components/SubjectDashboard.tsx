import React from 'react';
import TopicProgress from './TopicProgress';
import TestConfig from './TestConfig';
import { useParams } from 'react-router-dom';

export default function SubjectDashboard() {
  const { subject } = useParams<{ subject: string }>();

  if (!subject) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 capitalize">
          {subject} Dashboard
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <TopicProgress subject={subject} />
          <TestConfig subject={subject} />
        </div>
      </div>
    </div>
  );
}
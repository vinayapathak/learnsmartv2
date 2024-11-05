import React from 'react';
import { Link } from 'react-router-dom';
import { Atom, Flask } from 'lucide-react';

const subjects = [
  {
    id: 'physics',
    name: 'Physics',
    icon: Atom,
    description: 'Study mechanics, waves, electricity, and more',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: Flask,
    description: 'Explore organic, inorganic, and physical chemistry',
    color: 'from-green-500 to-green-600',
  },
];

export default function SubjectsScreen() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Subject</h1>
          <p className="text-lg text-gray-600">Select a subject to start practicing questions</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {subjects.map((subject) => {
            const Icon = subject.icon;
            return (
              <Link
                key={subject.id}
                to={`/subjects/${subject.id}`}
                className="transform hover:scale-105 transition-transform duration-200"
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className={`bg-gradient-to-r ${subject.color} p-6`}>
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{subject.name}</h2>
                    <p className="text-gray-600">{subject.description}</p>
                    <button className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-500">
                      Start Learning
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
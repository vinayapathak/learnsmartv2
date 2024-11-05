import React, { useEffect } from 'react';
import { useTestStore } from '../store/testStore';
import { BookmarkPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export default function TestInterface() {
  const {
    questions,
    currentQuestionIndex,
    timeRemaining,
    setCurrentQuestion,
    answerQuestion,
    toggleBookmark,
    updateTimeRemaining,
    completeTest,
  } = useTestStore();

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeRemaining > 0) {
        updateTimeRemaining(timeRemaining - 1);
      } else {
        completeTest();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const currentQuestion = questions[currentQuestionIndex];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Timer */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center">
          <span className="text-lg font-semibold">Time Remaining:</span>
          <span className="text-2xl font-bold text-indigo-600">{formatTime(timeRemaining)}</span>
        </div>

        {/* Question Area */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</span>
            <button
              onClick={() => toggleBookmark(currentQuestion.id)}
              className={clsx(
                "p-2 rounded-full transition-colors",
                currentQuestion.isBookmarked ? "text-yellow-500 hover:text-yellow-600" : "text-gray-400 hover:text-gray-500"
              )}
            >
              <BookmarkPlus className="w-6 h-6" />
            </button>
          </div>

          <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>

          {currentQuestion.type === 'objective' && (
            <div className="space-y-4">
              {currentQuestion.options?.map((option) => (
                <label
                  key={option.id}
                  className={clsx(
                    "block p-4 rounded-lg border-2 cursor-pointer transition-all",
                    currentQuestion.selectedAnswer === option.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option.id}
                    checked={currentQuestion.selectedAnswer === option.id}
                    onChange={() => answerQuestion(currentQuestion.id, option.id)}
                    className="hidden"
                  />
                  <span>{option.text}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === 'subjective' && (
            <textarea
              className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={4}
              placeholder="Enter your answer here..."
              value={currentQuestion.selectedAnswer || ''}
              onChange={(e) => answerQuestion(currentQuestion.id, e.target.value)}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentQuestion(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
            className="flex items-center px-4 py-2 text-gray-600 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Previous
          </button>

          <div className="flex gap-2">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(index)}
                className={clsx(
                  "w-10 h-10 rounded-lg font-medium transition-colors",
                  index === currentQuestionIndex && "ring-2 ring-indigo-500",
                  q.isBookmarked && "bg-yellow-100",
                  q.isAttempted ? "bg-green-100" : "bg-red-100"
                )}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              if (currentQuestionIndex === questions.length - 1) {
                completeTest();
              } else {
                setCurrentQuestion(currentQuestionIndex + 1);
              }
            }}
            className="flex items-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
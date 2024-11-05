export type Subject = 'physics' | 'chemistry';

export type QuestionType = 'objective' | 'subjective';

export interface Topic {
  id: string;
  name: string;
  subject: Subject;
  totalQuestions: number;
  completedQuestions: number;
}

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  subject: Subject;
  topic: string;
  type: QuestionType;
  question: string;
  options?: Option[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TestQuestion extends Question {
  isAttempted: boolean;
  isBookmarked: boolean;
  selectedAnswer?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface TestConfig {
  subject: Subject;
  topics: string[];
  duration: number;
  questionCount: number;
  difficulty: ('easy' | 'medium' | 'hard')[];
  questionTypes: QuestionType[];
}
import axios from 'axios';
import { Subject, Topic, Question, TestConfig } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export const fetchSubjects = async (): Promise<Subject[]> => {
  const response = await api.get('/subjects');
  return response.data;
};

export const fetchTopics = async (subject: string): Promise<Topic[]> => {
  const response = await api.get(`/topics/${subject}`);
  return response.data;
};

export const fetchQuestions = async (config: TestConfig) => {
  const response = await api.get('/generate-test', { params: config });
  return response.data;
};

export const updateProgress = async (userId: string, topicId: string, completed: boolean) => {
  const response = await api.post(`/progress/${userId}/${topicId}`, { completed });
  return response.data;
};

export const saveTestResults = async (
  userId: string,
  subject: string,
  questions: Question[],
  score: number,
  timeTaken: number
) => {
  const response = await api.post('/results', {
    userId,
    subject,
    questions,
    score,
    timeTaken,
  });
  return response.data;
};
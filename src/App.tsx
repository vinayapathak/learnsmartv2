import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import AuthScreen from './components/AuthScreen';
import SubjectsScreen from './components/SubjectsScreen';
import SubjectDashboard from './components/SubjectDashboard';
import TestInterface from './components/TestInterface';
import TestResults from './components/TestResults';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthScreen />} />
        <Route
          path="/subjects"
          element={
            <PrivateRoute>
              <SubjectsScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/subjects/:subject"
          element={
            <PrivateRoute>
              <SubjectDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/test"
          element={
            <PrivateRoute>
              <TestInterface />
            </PrivateRoute>
          }
        />
        <Route
          path="/results"
          element={
            <PrivateRoute>
              <TestResults />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
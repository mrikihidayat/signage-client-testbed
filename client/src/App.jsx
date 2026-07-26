import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './components/CustomToast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DisplayClient from './pages/DisplayClient';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('signage_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/display/:deviceId" element={<DisplayClient />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  );
}

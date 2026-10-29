import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StudentProvider } from './context/StudentContext';

import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddStudent from './pages/AddStudent';
import StudentList from './pages/StudentList';
import StudentDetails from './pages/StudentDetails';
import EditStudent from './pages/EditStudent';
import Reports from './pages/Reports';

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-300">Loading Student Management System...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Redirect already authenticated users away from Login page
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <StudentProvider>
        <BrowserRouter>
          <Routes>
            {/* Screen 1: Login & Registration */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            {/* Authenticated Application Layout with 5 Screens */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              {/* Screen 2: Dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Screen 3: Add Student */}
              <Route path="/add-student" element={<AddStudent />} />
              {/* Screen 4: Student List */}
              <Route path="/students" element={<StudentList />} />
              {/* Screen 5: Student Details */}
              <Route path="/students/:id" element={<StudentDetails />} />
              {/* Edit Student record */}
              <Route path="/students/:id/edit" element={<EditStudent />} />
              {/* Screen 6: Reports */}
              <Route path="/reports" element={<Reports />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </StudentProvider>
    </AuthProvider>
  );
}

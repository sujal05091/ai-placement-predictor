// Main App Component with Routing
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FeaturesPage from './pages/FeaturesPage';
import RoleExplorerPage from './pages/RoleExplorerPage';
import StudentDashboard from './pages/StudentDashboard';
import MockInterviewPage from './pages/MockInterviewPage';
import SkillTestPage from './pages/SkillTestPage';
import TPO_Dashboard from './pages/TPO_Dashboard';
import ProtectedRoute from './pages/ProtectedRoute';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Legacy route - redirect to appropriate dashboard */}
          <Route
            path="/features"
            element={
              <ProtectedRoute>
                <FeaturesPage />
              </ProtectedRoute>
            }
          />

          {/* --- STUDENT-ONLY ROUTES (Strict RBAC) --- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MockInterviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/role-explorer"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <RoleExplorerPage />
              </ProtectedRoute>
            }
          />
          
          {/* NEW: Skill Test Route - "Prove It" Feature */}
          <Route
            path="/skill-test/:skillName"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <SkillTestPage />
              </ProtectedRoute>
            }
          />

          {/* --- TPO-ONLY ROUTE (Strict RBAC) --- */}
          <Route
            path="/tpo-analytics"
            element={
              <ProtectedRoute allowedRoles={['tpo']}>
                <TPO_Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

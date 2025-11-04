// Protected Route Component
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChange } from '../services/authService';
import { getUserProfile } from '../services/firestoreService';
import { CircularProgress, Box, Typography, Paper } from '@mui/material';

const ProtectedRoute = ({ children, allowedRoles = null }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔒 ProtectedRoute: Setting up auth listener');
    const unsubscribe = onAuthStateChange(async (currentUser) => {
      console.log('🔒 ProtectedRoute: Auth state changed', { 
        userId: currentUser?.uid, 
        email: currentUser?.email 
      });
      setUser(currentUser);
      if (currentUser) {
        console.log('🔒 ProtectedRoute: Fetching user profile for', currentUser.uid);
        try {
          const profile = await getUserProfile(currentUser.uid);
          console.log('🔒 ProtectedRoute: User profile loaded', profile);
          setUserProfile(profile);
        } catch (error) {
          console.error('🔒 ProtectedRoute: Failed to fetch profile, continuing anyway', error);
          // Set a default profile to allow user to continue
          setUserProfile({ 
            email: currentUser.email, 
            displayName: currentUser.displayName || 'User',
            role: 'student' 
          });
        }
      } else {
        console.log('🔒 ProtectedRoute: No user authenticated');
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    console.log('🔒 ProtectedRoute: Loading...');
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    console.log('🔒 ProtectedRoute: No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check role if allowedRoles is specified (strict RBAC)
  if (allowedRoles && Array.isArray(allowedRoles)) {
    const userRole = userProfile?.role || 'student';
    if (!allowedRoles.includes(userRole)) {
      console.log(`🔒 ProtectedRoute: Access denied. User role "${userRole}" not in allowed roles:`, allowedRoles);
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f5f5f5'
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              maxWidth: 500
            }}
          >
            <Typography variant="h5" color="error" gutterBottom>
              Access Denied
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
              You do not have permission to access this page.
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Your role: <strong>{userRole}</strong>
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Required role: <strong>{allowedRoles.join(' or ')}</strong>
            </Typography>
          </Paper>
        </Box>
      );
    }
  }

  console.log('🔒 ProtectedRoute: Access granted, rendering children');
  return children;
};

export default ProtectedRoute;

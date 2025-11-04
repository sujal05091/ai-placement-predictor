// Sign Up Page Component
import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  Alert,
  Link
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import { signUpWithEmail, signInWithGoogle } from '../services/authService';
import { getUserProfile } from '../services/firestoreService';
import BackgroundVideo from '../components/BackgroundVideo';

const SignupPage = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const result = await signUpWithEmail(email, password, displayName);
      console.log('✅ Signup successful, fetching user profile...');
      
      // Fetch user profile to determine role (should be 'student' for new signups)
      const profile = await getUserProfile(result.user.uid);
      
      // Redirect to dashboard (all new signups are students by default)
      console.log('🔐 New student account created, redirecting to dashboard...');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setLoading(false);
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. Please use a stronger password.');
      } else {
        setError(error.message || 'Failed to create account. Please try again.');
      }
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithGoogle();
      console.log('✅ Google signup successful, fetching user profile...');
      
      // Fetch user profile to determine role
      const profile = await getUserProfile(result.user.uid);
      
      // Smart redirect based on role
      if (profile && profile.role === 'tpo') {
        console.log('🔐 TPO user detected, redirecting to analytics...');
        navigate('/tpo-analytics', { replace: true });
      } else {
        console.log('🔐 Student user detected, redirecting to dashboard...');
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      setLoading(false);
      setError(error.message || 'Failed to sign up with Google.');
    }
  };

  return (
    <>
      <BackgroundVideo />
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4
          }}
        >
          <Box
            sx={{
              p: 4,
              width: '100%',
              textAlign: 'center'
            }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              align="center" 
              gutterBottom 
              fontWeight="bold"
              sx={{ 
                color: '#fff',
                textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,1)',
                mb: 2
              }}
            >
              Create Account
            </Typography>
            <Typography 
              variant="body1" 
              align="center" 
              sx={{ 
                mb: 4,
                color: '#fff',
                fontSize: '1.1rem',
                fontWeight: 500,
                textShadow: '0 3px 20px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,1)'
              }}
            >
              Join us to predict your placement success
            </Typography>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 2,
                  backgroundColor: 'rgba(211, 47, 47, 0.9)',
                  color: '#fff'
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleEmailSignup}>
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                margin="normal"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                autoFocus
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(10px)',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.4)', borderWidth: 2 },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.6)' },
                    '&.Mui-focused fieldset': { borderColor: '#fff', borderWidth: 2 }
                  },
                  '& .MuiOutlinedInput-input': { color: '#fff' },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.9)', fontWeight: 500 },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#171616ff', fontWeight: 600 }
                }}
              />
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(10px)',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.4)', borderWidth: 2 },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.6)' },
                    '&.Mui-focused fieldset': { borderColor: '#fff', borderWidth: 2 }
                  },
                  '& .MuiOutlinedInput-input': { color: '#fff' },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.9)', fontWeight: 500 },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#080808ff', fontWeight: 600 }
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                helperText="Must be at least 6 characters"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(10px)',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.4)', borderWidth: 2 },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.6)' },
                    '&.Mui-focused fieldset': { borderColor: '#fff', borderWidth: 2 }
                  },
                  '& .MuiOutlinedInput-input': { color: '#fff' },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.9)', fontWeight: 500 },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#040202ff', fontWeight: 600 },
                  '& .MuiFormHelperText-root': { color: 'rgba(9, 6, 6, 0.9)', fontWeight: 500 }
                }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(10px)',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.4)', borderWidth: 2 },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.6)' },
                    '&.Mui-focused fieldset': { borderColor: '#fff', borderWidth: 2 }
                  },
                  '& .MuiOutlinedInput-input': { color: '#fff' },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.9)', fontWeight: 500 },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#070505ff', fontWeight: 600 }
                }}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ 
                  mt: 3, 
                  mb: 2, 
                  py: 1.5,
                  backgroundColor: '#1976d2',
                  boxShadow: '0 4px 20px rgba(25,118,210,0.4)',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                    boxShadow: '0 6px 30px rgba(25,118,210,0.6)'
                  }
                }}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </Box>

            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.5)', borderWidth: 1 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#fff',
                  fontWeight: 600,
                  textShadow: '0 2px 15px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,1)'
                }}
              >
                OR
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignup}
              disabled={loading}
              sx={{ 
                py: 1.5,
                borderColor: '#fff',
                color: '#fff',
                fontWeight: 600,
                backgroundColor: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(10px)',
                borderWidth: 2,
                textShadow: '0 2px 10px rgba(0,0,0,0.9)',
                '&:hover': {
                  borderWidth: 2,
                  borderColor: '#fff',
                  backgroundColor: 'rgba(0,0,0,0.6)'
                }
              }}
            >
              Continue with Google
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography 
                variant="body2"
                sx={{ 
                  color: '#fff',
                  fontWeight: 500,
                  textShadow: '0 2px 15px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,1)'
                }}
              >
                Already have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    cursor: 'pointer',
                    color: '#fff',
                    fontWeight: 700,
                    textShadow: '0 2px 15px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,1)',
                    textDecoration: 'underline'
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default SignupPage;

// Login Page Component
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
import { signInWithEmail, signInWithGoogle } from '../services/authService';
import { getUserProfile } from '../services/firestoreService';
import BackgroundVideo from '../components/BackgroundVideo';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signInWithEmail(email, password);
      console.log('✅ Login successful, fetching user profile...');
      
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
      setError(error.message || 'Failed to sign in. Please check your credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithGoogle();
      console.log('✅ Google login successful, fetching user profile...');
      
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
      setError(error.message || 'Failed to sign in with Google.');
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
              Welcome Back
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
              Sign in to access your AI Placement Predictor
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

            <Box component="form" onSubmit={handleEmailLogin}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(10px)',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.4)',
                      borderWidth: 2
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.6)'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#fff',
                      borderWidth: 2
                    }
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#fff'
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.9)',
                    fontWeight: 500
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#110808ff',
                    fontWeight: 600
                  }
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(10px)',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.4)',
                      borderWidth: 2
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(249, 249, 249, 0.94)'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ebebebff',
                      borderWidth: 2
                    }
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#f5f5f5ff'
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.9)',
                    fontWeight: 500
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#110a0aff',
                    fontWeight: 600
                  }
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
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>

            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.4)' }}>
              <Typography 
                variant="body2" 
                fontWeight={600}
                sx={{ 
                  color: '#fff',
                  textShadow: '0 2px 10px rgba(0,0,0,0.8)'
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
              onClick={handleGoogleLogin}
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
                fontWeight={500}
                sx={{ 
                  color: '#fff',
                  textShadow: '0 2px 10px rgba(0,0,0,0.8)'
                }}
              >
                Don't have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/signup')}
                  sx={{ 
                    cursor: 'pointer',
                    color: '#fff',
                    fontWeight: 700,
                    textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                    textDecoration: 'underline',
                    '&:hover': {
                      textShadow: '0 0 10px rgba(255,255,255,0.5)'
                    }
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default LoginPage;

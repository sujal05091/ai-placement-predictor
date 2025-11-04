// Landing Page Component - Professional Public-Facing Homepage
import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  useTheme,
  alpha
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TimelineIcon from '@mui/icons-material/Timeline';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import BackgroundVideo from '../components/BackgroundVideo';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <PsychologyIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
      title: 'AI-Powered Predictions',
      description: 'Advanced machine learning algorithms analyze your resume to predict placement probability with explainable AI insights using SHAP values.'
    },
    {
      icon: <TimelineIcon sx={{ fontSize: 60, color: theme.palette.secondary.main }} />,
      title: 'Personalized Roadmaps',
      description: 'Get custom-tailored recommendations and action plans to enhance your employability and bridge skill gaps identified by our AI.'
    },
    {
      icon: <RecordVoiceOverIcon sx={{ fontSize: 60, color: theme.palette.success.main }} />,
      title: 'Mock Interview Coach',
      description: 'Practice with our AI-powered voice interview simulator featuring speech-to-text and text-to-speech for realistic interview preparation.'
    }
  ];

  const stats = [
    { value: '95%', label: 'Prediction Accuracy', icon: <TrendingUpIcon /> },
    { value: '10K+', label: 'Students Analyzed', icon: <SchoolIcon /> },
    { value: '500+', label: 'Companies Partnered', icon: <WorkIcon /> }
  ];

  return (
    <>
      <Navbar />
      <BackgroundVideo />
      
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          pt: 10,
          pb: 8
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={8} lg={7}>
              <Box
                sx={{
                  textAlign: 'center',
                  px: { xs: 2, sm: 4, md: 6 }
                }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                    color: '#fff',
                    textShadow: '0 4px 30px rgba(0,0,0,0.8), 0 0 60px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,1)',
                    mb: 3,
                    lineHeight: 1.2
                  }}
                >
                  Decode Your Employability DNA
                </Typography>
                
                <Typography
                  variant="h5"
                  paragraph
                  sx={{ 
                    mb: 5, 
                    lineHeight: 1.6,
                    color: '#fff',
                    fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                    textShadow: '0 3px 20px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,1)',
                    fontWeight: 500
                  }}
                >
                  Harness the power of AI to predict your placement success, receive personalized career guidance, and master interviews with our intelligent coaching system.
                </Typography>

                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', mb: 6 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/signup')}
                    sx={{
                      px: 5,
                      py: 2,
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      textTransform: 'none',
                      boxShadow: '0 8px 30px rgba(25,118,210,0.4)',
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      '&:hover': {
                        boxShadow: '0 12px 40px rgba(25,118,210,0.6)',
                        transform: 'translateY(-3px)',
                        transition: 'all 0.3s ease'
                      }
                    }}
                  >
                    Get Started Free
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{
                      px: 5,
                      py: 2,
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      textTransform: 'none',
                      borderWidth: 2,
                      borderColor: '#5e3ad4ff',
                      color: '#1e1919ff',
                      backgroundColor: 'rgba(40, 48, 167, 0.1)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        borderWidth: 2,
                        borderColor: '#fcfbfbff',
                        backgroundColor: 'rgba(40, 76, 177, 0.2)',
                        transform: 'translateY(-3px)',
                        transition: 'all 0.3s ease'
                      }
                    }}
                  >
                    Login
                  </Button>
                </Box>

                {/* Stats Bar */}
                <Grid container spacing={3} justifyContent="center">
                  {stats.map((stat, index) => (
                    <Grid item xs={4} sm={4} key={index}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                          {React.cloneElement(stat.icon, { 
                            sx: { fontSize: 35, color: '#171414ff', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' } 
                          })}
                        </Box>
                        <Typography 
                          variant="h4" 
                          fontWeight={700} 
                          sx={{ 
                            color: '#ffffffff',
                            textShadow: '0 3px 15px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,1)'
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          fontWeight={500}
                          sx={{ 
                            color: '#fff',
                            textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,1)'
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          py: 10,
          backgroundColor: alpha(theme.palette.background.default, 0.7),
          backdropFilter: 'blur(5px)',
          position: 'relative'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              fontWeight={700}
              color="primary"
            >
              Why Choose Our Platform?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Experience the future of career preparation with cutting-edge AI technology designed to maximize your placement success.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
                      borderColor: theme.palette.primary.main
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box sx={{ mb: 3 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 10, position: 'relative' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              fontWeight={700}
              color="primary"
            >
              How It Works
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {[
              { step: '01', title: 'Upload Resume', desc: 'Upload your PDF resume to our secure platform' },
              { step: '02', title: 'AI Analysis', desc: 'Our AI analyzes skills, experience, and education' },
              { step: '03', title: 'Get Insights', desc: 'Receive placement probability and recommendations' },
              { step: '04', title: 'Practice & Improve', desc: 'Use AI coach to prepare for interviews' }
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 3,
                    height: '100%',
                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      color: alpha(theme.palette.primary.main, 0.2),
                      mb: 2
                    }}
                  >
                    {item.step}
                  </Typography>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          position: 'relative'
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={6}
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 4,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.95)} 0%, ${alpha(theme.palette.secondary.main, 0.95)} 100%)`,
              color: 'white'
            }}
          >
            <Typography variant="h3" component="h2" gutterBottom fontWeight={700}>
              Ready to Transform Your Career?
            </Typography>
            <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.95 }}>
              Join thousands of students who have successfully decoded their employability DNA and secured their dream placements.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                px: 5,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 600,
                borderRadius: 3,
                textTransform: 'none',
                backgroundColor: 'white',
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  transform: 'scale(1.05)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              Start Your Journey Today
            </Button>
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 4,
          backgroundColor: alpha(theme.palette.background.paper, 0.9),
          textAlign: 'center',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Container>
          <Typography variant="body2" color="text.secondary">
            © 2025 AI Placement Predictor. Powered by Advanced Machine Learning & Google Gemini AI.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Empowering students to achieve their career goals.
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default LandingPage;

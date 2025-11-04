import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Avatar
} from '@mui/material';
import {
  Psychology as AIIcon,
  RecordVoiceOver as InterviewIcon,
  CloudUpload as UploadIcon,
  Analytics as AnalyticsIcon,
  Explore as ExploreIcon
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import BackgroundVideo from '../components/BackgroundVideo';

const FeaturesPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'AI Career Coach',
      description: 'Get personalized career guidance and interview preparation with our intelligent AI coach',
      icon: <AIIcon sx={{ fontSize: 60 }} />,
      color: '#2196f3',
      path: '/interview'
    },
    {
      title: 'Mock Interview',
      description: 'Practice with realistic interview scenarios and get instant feedback on your performance',
      icon: <InterviewIcon sx={{ fontSize: 60 }} />,
      color: '#4caf50',
      path: '/interview'
    },
    {
      title: 'Resume Analyzer',
      description: 'Upload your resume and get AI-powered insights to predict your placement success',
      icon: <UploadIcon sx={{ fontSize: 60 }} />,
      color: '#ff9800',
      path: '/dashboard'
    },
    {
      title: 'Role Explorer',
      description: 'Discover required skills, YouTube resources, and courses for any job role at top companies',
      icon: <ExploreIcon sx={{ fontSize: 60 }} />,
      color: '#e91e63',
      path: '/role-explorer'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <BackgroundVideo />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ pt: 12, pb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              color: '#fff',
              fontWeight: 'bold',
              textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,1)',
              mb: 2
            }}
          >
            Choose Your Path
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: '#fff',
              fontWeight: 500,
              textShadow: '0 3px 20px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,1)',
              mb: 1
            }}
          >
            Explore our AI-powered features to boost your placement success
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(15px)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    border: '2px solid rgba(255,255,255,0.5)',
                    boxShadow: `0 12px 40px ${feature.color}40`
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4 }}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      margin: '0 auto 24px',
                      backgroundColor: `${feature.color}20`,
                      border: `3px solid ${feature.color}`,
                      color: feature.color
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  
                  <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    sx={{
                      color: '#fff',
                      fontWeight: 'bold',
                      textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                      mb: 2
                    }}
                  >
                    {feature.title}
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '1.1rem',
                      lineHeight: 1.6,
                      textShadow: '0 2px 10px rgba(0,0,0,0.8)'
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => navigate(feature.path)}
                    sx={{
                      backgroundColor: feature.color,
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      py: 1.5,
                      boxShadow: `0 4px 20px ${feature.color}60`,
                      '&:hover': {
                        backgroundColor: feature.color,
                        filter: 'brightness(1.2)',
                        boxShadow: `0 6px 30px ${feature.color}80`
                      }
                    }}
                  >
                    Get Started
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '1.1rem',
              textShadow: '0 2px 10px rgba(0,0,0,0.8)',
              mb: 2
            }}
          >
            Not sure where to start? Try our Resume Analyzer first!
          </Typography>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/dashboard')}
            sx={{
              borderColor: '#fff',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1.1rem',
              px: 4,
              py: 1.5,
              borderWidth: 2,
              backgroundColor: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(10px)',
              textShadow: '0 2px 10px rgba(0,0,0,0.9)',
              '&:hover': {
                borderWidth: 2,
                borderColor: '#fff',
                backgroundColor: 'rgba(0,0,0,0.6)'
              }
            }}
          >
            Go to Dashboard
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturesPage;

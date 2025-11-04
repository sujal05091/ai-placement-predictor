// Student Dashboard - Main Predictor Component
// Updated to connect to FastAPI backend at https://placementpredictionai.onrender.com
import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import ScienceIcon from '@mui/icons-material/Science';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { onAuthStateChange } from '../services/authService';
import { saveStudentReport, updateStudentReportAfterTest } from '../services/firestoreService';
import GaugeChart from '../components/GaugeChart';
import ShapChart from '../components/ShapChart';
import ProgressChart from '../components/ProgressChart';
import Navbar from '../components/Navbar';
import BackgroundVideo from '../components/BackgroundVideo';
import Chatbot from '../components/Chatbot';

// LIVE BACKEND API - FastAPI server
// Use proxy in development to avoid CORS issues
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:8080'  // Use Flask API in development (has weak_skills feature)
  : 'https://placementpredictionai.onrender.com';  // Direct in production

const LIVE_API_URL = `${API_BASE_URL}/predict`;

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [predictionResults, setPredictionResults] = useState(null);
  const [completedSkills, setCompletedSkills] = useState([]); // Track completed skill tests
  
  // Key to trigger ProgressChart refresh after new analysis
  const [refreshProgress, setRefreshProgress] = useState(0);

  // Check if we received updated values from skill test
  useEffect(() => {
    const updateAfterTest = async () => {
      if (location.state?.updatedProbability && predictionResults && user) {
        console.log('📈 Updating dashboard with new values:', location.state);
        
        // Mark the skill as completed
        const newCompletedSkills = location.state?.completedSkill 
          ? [...completedSkills, location.state.completedSkill]
          : completedSkills;
        
        if (location.state?.completedSkill) {
          setCompletedSkills(newCompletedSkills);
        }
        
        // Update the prediction results with new values from test
        const updatedResults = {
          ...predictionResults,
          probability: location.state.updatedProbability,
          shap_values: location.state.updatedShapValues 
            ? { ...location.state.updatedShapValues }  // Create new object reference
            : { ...predictionResults.shap_values },     // Clone existing
          confidence: location.state.updatedConfidence || predictionResults.confidence,
          recommended_track: location.state.updatedTrack || predictionResults.recommended_track,
          weak_skills: [...predictionResults.weak_skills]  // Clone array
        };
        
        console.log('🔄 Old SHAP values:', predictionResults.shap_values);
        console.log('✨ New SHAP values:', updatedResults.shap_values);
        console.log('📊 Old probability:', predictionResults.probability);
        console.log('📈 New probability:', updatedResults.probability);
        
        setPredictionResults(updatedResults);
        
        // Save updated values to database
        try {
          await updateStudentReportAfterTest(user.uid, {
            probability: location.state.updatedProbability,
            shap_values: location.state.updatedShapValues || predictionResults.shap_values,
            confidence: location.state.updatedConfidence || predictionResults.confidence,
            track: location.state.updatedTrack || predictionResults.recommended_track,
            completedSkills: newCompletedSkills
          });
          console.log('✅ Database updated with new values');
        } catch (error) {
          console.error('❌ Failed to update database:', error);
        }
        
        // Clear location state to prevent re-updating
        window.history.replaceState({}, document.title);
      }
    };
    
    updateAfterTest();
  }, [location.state]);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError('');
      setPredictionResults(null); // Clear previous results
    } else {
      setError('Please select a valid PDF file');
      setSelectedFile(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select a resume file first');
      return;
    }

    if (!user) {
      setError('Please log in to analyze your resume');
      return;
    }

    setLoading(true);
    setError('');
    setPredictionResults(null);
    setCompletedSkills([]); // Reset completed skills for new resume analysis

    try {
      console.log('📧 User Email:', user.email);
      console.log('👤 User Name:', user.displayName);

      // --- Step 1: Create FormData with resume file only (Flask API) ---
      const formData = new FormData();
      formData.append('resume', selectedFile);

      console.log('📤 Sending request to:', LIVE_API_URL);
      console.log('📄 File:', selectedFile.name, '-', selectedFile.size, 'bytes');

      // --- Step 3: Call the Live Backend API ---
      const response = await axios.post(LIVE_API_URL, formData, {
        timeout: 90000, // 90 second timeout for resume processing
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Upload progress:', percentCompleted + '%');
        }
      });

      console.log('✅ Response received:', response.status);

      // --- Step 4: Transform API Response to Match Frontend Format ---
      const apiData = response.data;
      console.log('📊 Raw API Response:', apiData);
      
      // Flask API returns values already as percentages (0-100)
      // Check if values are already percentages (0-100) or decimals (0-1)
      const isAlreadyPercentage = (apiData.probability || apiData.placement_probability) > 1;
      
      // Map the API response to the format our frontend expects
      const results = {
        probability: apiData.probability || (isAlreadyPercentage 
          ? Math.min(100, Math.max(0, Math.round(apiData.placement_probability))) 
          : Math.min(100, Math.max(0, Math.round(apiData.placement_probability * 100)))),
        recommended_track: apiData.recommended_track || apiData.recommended_career || 'General',
        confidence: apiData.confidence || (isAlreadyPercentage
          ? Math.min(100, Math.max(0, Math.round(apiData.career_confidence))) 
          : Math.min(100, Math.max(0, Math.round(apiData.career_confidence * 100)))),
        recommendations: apiData.recommendations || apiData.improvement_suggestions || [],
        weak_skills: apiData.weak_skills || [], // NEW: Store weak_skills array from Flask API
        shap_values: apiData.shap_values || apiData.feature_importance || {},
        resume_url: apiData.resume_url || apiData.resume_link || null,
        prediction_id: apiData.prediction_id || null
      };
      
      console.log('📊 Transformed Results:', results);
      console.log('📊 Weak Skills Found:', results.weak_skills);
      setPredictionResults(results);

      // --- Step 5: Save to Firestore ---
      // Save the report to user's reports subcollection for progress tracking
      if (user) {
        try {
          await saveStudentReport(user.uid, results);
          console.log('Report saved to Firestore successfully');
        } catch (firestoreError) {
          console.error('Failed to save to Firestore:', firestoreError);
          // Don't show error to user, prediction was successful
        }
      }

      // --- Step 6: Refresh Progress Chart ---
      // Increment key to force ProgressChart to re-fetch from Firestore
      setRefreshProgress(prev => prev + 1);

    } catch (error) {
      console.error('❌ Error analyzing resume:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        hasRequest: !!error.request
      });
      
      let errorMessage = 'Failed to analyze resume. ';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage += 'The server took too long to respond (> 90 seconds). The server may be processing the resume or starting up. Please try again.';
      } else if (error.response) {
        // Server responded with error
        console.log('Server responded with status:', error.response.status);
        const detail = error.response.data?.detail;
        if (Array.isArray(detail)) {
          // FastAPI validation errors
          console.error('Validation errors:', detail);
          errorMessage += detail.map(e => `${e.loc?.join('.')} - ${e.msg}`).join('; ');
        } else {
          errorMessage += error.response.data?.error || error.response.data?.message || JSON.stringify(detail) || `Server error (${error.response.status})`;
        }
      } else if (error.request) {
        // No response received
        console.error('No response received from server');
        console.error('Request config:', error.config);
        errorMessage += 'Cannot reach the server. Please check:\n' +
                       '1. Your internet connection\n' +
                       '2. The server may be starting up (wait 60 seconds)\n' +
                       '3. Try refreshing the page and trying again';
      } else {
        errorMessage += error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <BackgroundVideo />
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
            sx={{ color: '#ffffff', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
          >
            AI Placement Predictor
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: '#ffffff', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
          >
            Analyze your resume and discover your placement readiness
          </Typography>
        </Box>

        {/* Upload Section */}
        <Paper
          elevation={6}
          sx={{
            p: 4,
            mb: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Upload Your Resume
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Upload your resume in PDF format to get an AI-powered analysis of your placement readiness
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              size="large"
            >
              Choose PDF File
              <input
                type="file"
                hidden
                accept=".pdf"
                onChange={handleFileSelect}
              />
            </Button>
            {selectedFile && (
              <Chip
                label={selectedFile.name}
                onDelete={() => setSelectedFile(null)}
                color="primary"
              />
            )}
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={handleAnalyze}
            disabled={!selectedFile || loading || !user}
            sx={{ mt: 3 }}
            startIcon={loading ? <CircularProgress size={20} /> : <TipsAndUpdatesIcon />}
          >
            {loading ? 'Analyzing...' : 'Analyze My Employability'}
          </Button>

          {loading && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                🚀 Analyzing your resume... This may take 50-90 seconds. The server needs time to wake up and process your PDF using ML models.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, fontSize: '0.85rem', opacity: 0.8 }}>
                ⏳ Please be patient - extracting text, running predictions, and saving results...
              </Typography>
            </Alert>
          )}
        </Paper>

        {/* Results Section */}
        {predictionResults && (
          <Grid container spacing={3}>
            {/* Gauge Chart */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={6}
                sx={{
                  p: 4,
                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                  backdropFilter: 'blur(10px)',
                  height: '100%',
                  minHeight: '500px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  {completedSkills.length > 0 && (
                    <Alert severity="success" sx={{ mb: 2, backgroundColor: 'rgba(76, 175, 80, 0.2)' }}>
                      <Typography variant="body2" fontWeight="bold">
                        🎉 {completedSkills.length} Skill Test{completedSkills.length > 1 ? 's' : ''} Completed!
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                        Score has been updated with your improvements
                      </Typography>
                    </Alert>
                  )}
                  <GaugeChart
                    key={`gauge-${predictionResults.probability}-${completedSkills.length}`}
                    value={predictionResults.probability || 0}
                    title="Placement Probability"
                  />
                </Box>
                <Box sx={{ mt: 4, textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', pt: 3 }}>
                  <Typography variant="h6" sx={{ color: '#ffffff', mb: 2, fontWeight: 500 }}>
                    Recommended Track
                  </Typography>
                  <Chip
                    label={predictionResults.recommended_track || 'N/A'}
                    color="primary"
                    sx={{ fontSize: '1rem', py: 2.5, px: 4, fontWeight: 'bold' }}
                  />
                  {predictionResults.confidence && (
                    <Typography variant="h5" sx={{ color: '#4caf50', mt: 3, fontWeight: 'bold' }}>
                      Confidence: {predictionResults.confidence}%
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 2, fontSize: '0.9rem' }}>
                    Based on {Object.keys(predictionResults.shap_values || {}).length} factors analyzed
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* SHAP Chart */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={6}
                sx={{
                  p: 4,
                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                  backdropFilter: 'blur(10px)',
                  height: '100%',
                  minHeight: '500px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Typography variant="h5" sx={{ color: '#ffffff', mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
                  Key Decision Factors
                </Typography>
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShapChart
                    key={`shap-${JSON.stringify(predictionResults.shap_values)}-${completedSkills.length}`}
                    data={predictionResults.shap_values || {}}
                    title=""
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Weak Skills - "Prove It" Section */}
            <Grid item xs={12}>
              <Paper
                elevation={6}
                sx={{
                  p: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
                  🎯 Skills to Improve
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                  Take a skill test to prove your abilities and improve your placement score!
                </Typography>
                
                {(predictionResults.weak_skills || []).length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {predictionResults.weak_skills.map((skill, index) => {
                      const isCompleted = completedSkills.includes(skill.skill_name);
                      
                      return (
                        <Alert 
                          key={index}
                          severity={isCompleted ? "success" : "warning"}
                          sx={{
                            alignItems: 'center',
                            '& .MuiAlert-message': { flex: 1 }
                          }}
                          action={
                            !isCompleted && (
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<ScienceIcon />}
                                onClick={() => navigate(`/skill-test/${encodeURIComponent(skill.skill_name)}`, {
                                  state: { 
                                    originalProbability: predictionResults.probability, // Use CURRENT probability (may be updated)
                                    originalShapValues: predictionResults.shap_values,
                                    originalConfidence: predictionResults.confidence,
                                    originalTrack: predictionResults.recommended_track,
                                    skillName: skill.skill_name
                                  }
                                })}
                                sx={{ 
                                  minWidth: 120,
                                  fontWeight: 'bold',
                                  boxShadow: 2
                                }}
                              >
                                Prove It
                              </Button>
                            )
                          }
                        >
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
                              {skill.skill_name} - Current Score: {skill.current_score}%
                              {isCompleted && (
                                <Chip 
                                  label="✓ Test Completed" 
                                  color="success" 
                                  size="small" 
                                  sx={{ ml: 2 }}
                                />
                              )}
                            </Typography>
                            <Typography variant="body2">
                              {isCompleted ? "Test completed! Your placement score has been updated." : skill.message}
                            </Typography>
                          </Box>
                        </Alert>
                      );
                    })}
                  </Box>
                ) : (
                  <Alert severity="success">
                    <Typography variant="body1" fontWeight="500">
                      🎉 Great job! All your skills are above the threshold. Keep up the excellent work!
                    </Typography>
                  </Alert>
                )}
              </Paper>
            </Grid>

            {/* Progress Chart - Now refreshes automatically after each analysis */}
            <Grid item xs={12}>
              <Paper
                elevation={6}
                sx={{
                  p: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  minHeight: '450px'
                }}
              >
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <Typography variant="h5" gutterBottom fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                    📈 Your Employability Progress
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Track your improvement over time with each resume analysis
                  </Typography>
                </Box>
                {user ? (
                  <Box sx={{ minHeight: 350 }}>
                    <ProgressChart user={user} key={refreshProgress} />
                  </Box>
                ) : (
                  <Alert severity="info" sx={{ mt: 2 }}>Please log in to view your progress chart</Alert>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
      <Chatbot />
    </>
  );
};

export default StudentDashboard;

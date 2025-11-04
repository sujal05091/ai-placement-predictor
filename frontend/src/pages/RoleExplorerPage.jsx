// Role Explorer Page Component
import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import Navbar from '../components/Navbar';
import BackgroundVideo from '../components/BackgroundVideo';
import { runChat } from '../services/geminiService'; // Real Gemini 2.5 Flash API

const RoleExplorerPage = () => {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState('');

  const handleAnalyze = async () => {
    // Validate inputs
    if (!company.trim() || !role.trim()) {
      setError('Please enter both Company Name and Job Role');
      return;
    }

    setError('');
    setLoading(true);
    setAnalysis('');

    try {
      // Create the specialized prompt
      const specializedPrompt = `
Act as an expert career coach and senior technical recruiter.
A student wants to work at "${company}" as a "${role}"${salary ? `, with an expected salary of "${salary}"` : ''}.

Provide a detailed, actionable analysis for this student. Your response MUST be in GitHub-flavored Markdown and MUST include these exact sections:

### 1. Key Technical Skills Required
* (List the specific programming languages, databases, and tools)

### 2. Essential Soft Skills
* (List the top 3-5 soft skills for this company and role)

### 3. Recommended YouTube Learning Path
* **Topic:** (e.g., "SQL for Data Analysis")
    * **Link:** [Channel/Video Name](Full_YouTube_URL)
* **Topic:** (e.g., "Power BI Dashboards")
    * **Link:** [Channel/Video Name](Full_YouTube_URL)
* **Topic:** (e.g., "Python Pandas")
    * **Link:** [Channel/Video Name](Full_YouTube_URL)

### 4. Suggested Online Courses
* **Course Name:** (e.g., "Google Data Analytics Professional Certificate")
    * **Platform:** (e.g., "Coursera")
* **Course Name:** (e.g., "The Complete SQL Bootcamp")
    * **Platform:** (e.g., "Udemy")

### 5. Overall Analysis
(Give a brief summary of how the salary expectation matches the role and what the student should focus on.)
`;

      console.log('🔍 Analyzing role:', { company, role, salary });
      
      // Call the Gemini API
      const response = await runChat([], specializedPrompt);
      
      console.log('✅ Analysis received');
      setAnalysis(response);
    } catch (err) {
      console.error('❌ Error analyzing role:', err);
      setError(err.message || 'Failed to generate analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <BackgroundVideo />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ pt: 12, pb: 8 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
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
            🎯 Role Explorer
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: '#fff',
              fontWeight: 500,
              textShadow: '0 3px 20px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,1)',
            }}
          >
            Discover the skills, resources, and courses you need for your dream job
          </Typography>
        </Box>

        {/* Input Form */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(15px)',
            border: '2px solid rgba(255,255,255,0.2)',
          }}
        >
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleAnalyze(); }}>
            <TextField
              fullWidth
              label="Company Name"
              placeholder="e.g., Google, Microsoft, Amazon"
              variant="outlined"
              margin="normal"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
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
                '& .MuiInputLabel-root.Mui-focused': { color: '#fff', fontWeight: 600 }
              }}
            />

            <TextField
              fullWidth
              label="Job Role"
              placeholder="e.g., Data Analyst, Software Engineer, Product Manager"
              variant="outlined"
              margin="normal"
              value={role}
              onChange={(e) => setRole(e.target.value)}
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
                '& .MuiInputLabel-root.Mui-focused': { color: '#fff', fontWeight: 600 }
              }}
            />

            <TextField
              fullWidth
              label="Expected Salary (Optional)"
              placeholder="e.g., 80,000 USD, 12 LPA, 50,000 EUR"
              variant="outlined"
              margin="normal"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
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
                '& .MuiInputLabel-root.Mui-focused': { color: '#fff', fontWeight: 600 }
              }}
            />

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 2,
                  backgroundColor: 'rgba(211, 47, 47, 0.9)',
                  color: '#fff'
                }}
              >
                {error}
              </Alert>
            )}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
              sx={{
                mt: 3,
                py: 1.5,
                backgroundColor: '#2196f3',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 20px rgba(33,150,243,0.4)',
                '&:hover': {
                  backgroundColor: '#1976d2',
                  boxShadow: '0 6px 30px rgba(33,150,243,0.6)'
                }
              }}
            >
              {loading ? 'Analyzing Role...' : 'Analyze Role'}
            </Button>
          </Box>
        </Paper>

        {/* Results Display */}
        {analysis && (
          <Paper
            sx={{
              p: 4,
              backgroundColor: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(15px)',
              border: '2px solid rgba(33,150,243,0.3)',
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                color: '#1976d2',
                fontWeight: 'bold',
                mb: 3,
                borderBottom: '3px solid #2196f3',
                pb: 2
              }}
            >
              📊 Career Analysis Results
            </Typography>
            
            <Box
              sx={{
                '& h3': {
                  color: '#1976d2',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  mt: 3,
                  mb: 2,
                  borderLeft: '4px solid #2196f3',
                  paddingLeft: 2
                },
                '& h4': {
                  color: '#424242',
                  fontWeight: 600,
                  fontSize: '1.2rem',
                  mt: 2,
                  mb: 1
                },
                '& ul': {
                  paddingLeft: 3,
                  '& li': {
                    marginBottom: 1,
                    color: '#424242',
                    fontSize: '1.05rem',
                    lineHeight: 1.8
                  }
                },
                '& p': {
                  color: '#424242',
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                  marginBottom: 2
                },
                '& strong': {
                  color: '#1976d2',
                  fontWeight: 600
                },
                '& a': {
                  color: '#2196f3',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline',
                    color: '#1565c0'
                  }
                },
                '& code': {
                  backgroundColor: 'rgba(33,150,243,0.1)',
                  padding: '2px 6px',
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  color: '#1565c0'
                }
              }}
            >
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </Box>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  setAnalysis('');
                  setCompany('');
                  setRole('');
                  setSalary('');
                }}
                sx={{
                  borderColor: '#2196f3',
                  color: '#2196f3',
                  fontWeight: 600,
                  px: 4,
                  '&:hover': {
                    borderColor: '#1976d2',
                    backgroundColor: 'rgba(33,150,243,0.1)'
                  }
                }}
              >
                Analyze Another Role
              </Button>
            </Box>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default RoleExplorerPage;

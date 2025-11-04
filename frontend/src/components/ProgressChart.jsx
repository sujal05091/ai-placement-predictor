// Progress Chart Component - Displays Student's Report History
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Paper } from '@mui/material';
import Plot from 'react-plotly.js';
import { getStudentReports } from '../services/firestoreService';

const ProgressChart = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      if (!user || !user.uid) {
        console.log('⚠️ ProgressChart: No user or UID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        console.log('📊 ProgressChart: Fetching reports for user:', user.uid);
        
        // Fetch all reports for this user
        const fetchedReports = await getStudentReports(user.uid);
        setReports(fetchedReports);
        
        console.log('📊 ProgressChart: Fetched reports:', fetchedReports);
        console.log('📊 Number of reports:', fetchedReports?.length || 0);
      } catch (err) {
        console.error('❌ ProgressChart: Error fetching reports:', err);
        setError('Failed to load progress data');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user]);

  // Process reports to extract dates and scores
  const processReportsData = () => {
    if (!reports || reports.length === 0) {
      console.log('⚠️ ProgressChart: No reports to process');
      return { dates: [], scores: [] };
    }

    console.log('📊 ProgressChart: Processing', reports.length, 'reports');

    const dates = reports.map(report => {
      const timestamp = report.timestamp;
      // Handle both Firestore Timestamp and regular Date objects
      const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    });

    const scores = reports.map(report => {
      // Extract probability score (percentage) - should be 0-100
      const probability = report.probability || 0;
      console.log('📊 Report probability:', probability);
      return probability;
    });

    console.log('📊 Processed dates:', dates);
    console.log('📊 Processed scores:', scores);

    return { dates, scores };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading progress data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <Paper
        elevation={6}
        sx={{
          p: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" color="textSecondary">
          No progress data yet
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Upload and analyze your resume to start tracking your employability progress!
        </Typography>
      </Paper>
    );
  }

  const { dates, scores } = processReportsData();

  // Plotly configuration for the line chart
  const plotData = [{
    x: dates,
    y: scores,
    type: 'scatter',
    mode: 'lines+markers',
    marker: {
      color: '#1976d2',
      size: 10,
      line: {
        color: '#ffffff',
        width: 2
      }
    },
    line: {
      color: '#1976d2',
      width: 3,
      shape: 'spline'
    },
    name: 'Employability Score'
  }];

  const plotLayout = {
    title: {
      text: 'Your Employability Progress',
      font: {
        size: 20,
        color: '#1976d2',
        family: 'Roboto, sans-serif',
        weight: 'bold'
      }
    },
    xaxis: {
      title: 'Date',
      showgrid: true,
      gridcolor: 'rgba(0,0,0,0.1)',
      zeroline: false
    },
    yaxis: {
      title: 'Placement Probability (%)',
      showgrid: true,
      gridcolor: 'rgba(0,0,0,0.1)',
      zeroline: false,
      range: [0, 100]
    },
    plot_bgcolor: 'rgba(255, 255, 255, 0.9)',
    paper_bgcolor: 'rgba(255, 255, 255, 0.95)',
    margin: { t: 60, b: 60, l: 60, r: 40 },
    hovermode: 'closest',
    showlegend: false
  };

  const plotConfig = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d', 'autoScale2d']
  };

  return (
    <Paper
      elevation={6}
      sx={{
        p: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="textSecondary">
          Total Analyses: {reports.length}
        </Typography>
      </Box>
      <Plot
        data={plotData}
        layout={plotLayout}
        config={plotConfig}
        style={{ width: '100%', height: '400px' }}
        useResizeHandler={true}
      />
    </Paper>
  );
};

export default ProgressChart;

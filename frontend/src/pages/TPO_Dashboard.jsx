// TPO Dashboard Component with Real-time Analytics
import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import Plot from 'react-plotly.js';
import Navbar from '../components/Navbar';
import BackgroundVideo from '../components/BackgroundVideo';

const TPO_Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [allReports, setAllReports] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgProbability: 0,
    totalAnalyses: 0,
    topSkills: []
  });

  useEffect(() => {
    fetchAllStudentData();
  }, []);

  const fetchAllStudentData = async () => {
    try {
      setLoading(true);
      
      // Fetch all users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const allStudentReports = [];
      
      // For each user, fetch their reports
      for (const userDoc of usersSnapshot.docs) {
        const reportsSnapshot = await getDocs(
          collection(db, 'users', userDoc.id, 'reports')
        );
        
        reportsSnapshot.forEach(reportDoc => {
          allStudentReports.push({
            ...reportDoc.data(),
            userId: userDoc.id,
            userEmail: userDoc.data().email,
            userName: userDoc.data().displayName
          });
        });
      }
      
      setAllReports(allStudentReports);
      calculateStats(allStudentReports, usersSnapshot.size);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const calculateStats = (reports, userCount) => {
    if (reports.length === 0) {
      setStats({
        totalStudents: userCount,
        avgProbability: 0,
        totalAnalyses: 0,
        topSkills: []
      });
      return;
    }

    const avgProb = reports.reduce((sum, r) => sum + (r.probability || 0), 0) / reports.length;
    
    setStats({
      totalStudents: userCount,
      avgProbability: avgProb.toFixed(1),
      totalAnalyses: reports.length,
      topSkills: ['Python', 'JavaScript', 'Communication', 'Teamwork'] // Placeholder
    });
  };

  if (loading) {
    return (
      <>
        <BackgroundVideo />
        <Navbar />
        <Container maxWidth="xl" sx={{ py: 3, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress size={60} />
            <Typography sx={{ ml: 2, color: '#fff', fontSize: '1.2rem' }}>
              Loading analytics data...
            </Typography>
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <BackgroundVideo />
      <Navbar />
      <Container maxWidth="xl" sx={{ py: 3, position: 'relative', zIndex: 1 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight="bold"
              sx={{ color: '#ffffff', textShadow: '2px 2px 4px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <AssessmentIcon fontSize="large" />
              Training & Placement Officer Dashboard
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: '#ffffff', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              Real-time Analytics and Insights
            </Typography>
          </Box>
          <Chip 
            label="Live Data" 
            color="success" 
            sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}
          />
        </Box>

        {allReports.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            No student data yet. Data will appear here once students start analyzing their resumes.
          </Alert>
        ) : (
          <Alert severity="success" sx={{ mb: 3 }}>
            ✅ Dashboard is live! Showing data from {stats.totalAnalyses} analyses across {stats.totalStudents} students.
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={6} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" sx={{ color: '#fff', fontWeight: 'bold' }}>
                      {stats.totalStudents}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#fff' }}>
                      Total Students
                    </Typography>
                  </Box>
                  <PeopleIcon sx={{ fontSize: 50, color: 'rgba(255,255,255,0.3)' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={6} sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" sx={{ color: '#fff', fontWeight: 'bold' }}>
                      {stats.totalAnalyses}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#fff' }}>
                      Total Analyses
                    </Typography>
                  </Box>
                  <AssessmentIcon sx={{ fontSize: 50, color: 'rgba(255,255,255,0.3)' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={6} sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" sx={{ color: '#fff', fontWeight: 'bold' }}>
                      {stats.avgProbability}%
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#fff' }}>
                      Avg Probability
                    </Typography>
                  </Box>
                  <TrendingUpIcon sx={{ fontSize: 50, color: 'rgba(255,255,255,0.3)' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={6} sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" sx={{ color: '#fff', fontWeight: 'bold' }}>
                      A+
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#fff' }}>
                      Overall Grade
                    </Typography>
                  </Box>
                  <SchoolIcon sx={{ fontSize: 50, color: 'rgba(255,255,255,0.3)' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        {allReports.length > 0 && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={6} sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Placement Probability Distribution
                </Typography>
                <Plot
                  data={[{
                    x: allReports.map(r => r.probability || 0),
                    type: 'histogram',
                    marker: { color: '#1976d2' },
                    nbinsx: 10
                  }]}
                  layout={{
                    xaxis: { title: 'Probability (%)' },
                    yaxis: { title: 'Number of Students' },
                    height: 300,
                    margin: { t: 20, b: 40, l: 40, r: 20 }
                  }}
                  config={{ responsive: true, displayModeBar: false }}
                  style={{ width: '100%' }}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={6} sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Analysis Trend Over Time
                </Typography>
                <Plot
                  data={[{
                    x: allReports.map((r, i) => i + 1),
                    y: allReports.map(r => r.probability || 0),
                    type: 'scatter',
                    mode: 'lines+markers',
                    marker: { color: '#4caf50', size: 8 },
                    line: { width: 2 }
                  }]}
                  layout={{
                    xaxis: { title: 'Analysis Number' },
                    yaxis: { title: 'Probability (%)' },
                    height: 300,
                    margin: { t: 20, b: 40, l: 40, r: 20 }
                  }}
                  config={{ responsive: true, displayModeBar: false }}
                  style={{ width: '100%' }}
                />
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Recent Analyses Table */}
        {allReports.length > 0 && (
          <Paper elevation={6} sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Recent Student Analyses
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Student</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Probability</strong></TableCell>
                    <TableCell><strong>Confidence</strong></TableCell>
                    <TableCell><strong>Recommended Track</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allReports.slice(0, 10).map((report, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{report.userName || 'Anonymous'}</TableCell>
                      <TableCell>{report.userEmail || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={`${report.probability || 0}%`} 
                          color={report.probability > 70 ? 'success' : report.probability > 50 ? 'warning' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{report.confidence || 0}%</TableCell>
                      <TableCell>{report.recommended_track || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Container>
    </>
  );
};

export default TPO_Dashboard;

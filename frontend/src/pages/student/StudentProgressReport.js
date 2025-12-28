import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert, 
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  EmojiEvents as TrophyIcon,
  Assessment as AssessmentIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Styled components for modern design
const PageHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '20px',
  padding: '32px',
  marginBottom: '32px',
  color: 'white',
  textAlign: 'center',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const StatsCard = styled(Card)(({ theme, color = 'primary' }) => ({
  background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
  borderRadius: '16px',
  color: 'white',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  overflow: 'visible',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  }
}));

const ProgressCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  }
}));

const GradeChip = styled(Chip)(({ theme, grade }) => {
  const getGradeColor = (grade) => {
    if (grade >= 90) return { bg: '#22c55e', color: 'white' };
    if (grade >= 80) return { bg: '#3b82f6', color: 'white' };
    if (grade >= 70) return { bg: '#f59e0b', color: 'white' };
    if (grade >= 60) return { bg: '#f97316', color: 'white' };
    return { bg: '#ef4444', color: 'white' };
  };
  
  const colors = getGradeColor(grade);
  
  return {
    background: colors.bg,
    color: colors.color,
    fontWeight: 600,
    fontSize: '0.875rem',
    '& .MuiChip-label': {
      color: colors.color,
    }
  };
});

const StudentProgressReport = () => {
  const { currentUser } = useSelector(state => state.user);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_BASE_URL = process.env.REACT_APP_BASE_URL || '';
  const student = currentUser._id;

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_BASE_URL}/TestResults?student=${student}`);
        // Only show released results
        setResults(res.data.filter(r => r.release));
      } catch (err) {
        setError('Failed to load progress report.');
      } finally {
        setLoading(false);
      }
    };
    if (student) fetchResults();
  }, [student, API_BASE_URL]);

  // Analytics summary
  const totalTests = results.length;
  const marksArray = results.map(r => r.marks).filter(m => typeof m === 'number');
  const averageMarks = marksArray.length > 0 ? (marksArray.reduce((a, b) => a + b, 0) / marksArray.length).toFixed(1) : 0;
  const highestMarks = marksArray.length > 0 ? Math.max(...marksArray) : 0;
  const lowestMarks = marksArray.length > 0 ? Math.min(...marksArray) : 0;
  const improvement = marksArray.length > 1 ? 
    ((marksArray[marksArray.length - 1] - marksArray[0]) / marksArray[0] * 100).toFixed(1) : 0;

  // Prepare chart data
  const chartData = results.map((result, index) => ({
    name: `Test ${index + 1}`,
    marks: result.marks,
    testName: result.testPaper?.title || `Test ${index + 1}`,
    date: new Date(result.createdAt).toLocaleDateString()
  }));

  const gradeDistribution = [
    { name: 'A (90-100)', value: marksArray.filter(m => m >= 90).length, color: '#22c55e' },
    { name: 'B (80-89)', value: marksArray.filter(m => m >= 80 && m < 90).length, color: '#3b82f6' },
    { name: 'C (70-79)', value: marksArray.filter(m => m >= 70 && m < 80).length, color: '#f59e0b' },
    { name: 'D (60-69)', value: marksArray.filter(m => m >= 60 && m < 70).length, color: '#f97316' },
    { name: 'F (<60)', value: marksArray.filter(m => m < 60).length, color: '#ef4444' }
  ].filter(item => item.value > 0);

  const getGrade = (marks) => {
    if (marks >= 90) return 'A';
    if (marks >= 80) return 'B';
    if (marks >= 70) return 'C';
    if (marks >= 60) return 'D';
    return 'F';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} sx={{ color: '#667eea' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <AnimatePresence>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Page Header */}
          <PageHeader
            component={motion.div}
            variants={cardVariants}
          >
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
              <AssessmentIcon sx={{ fontSize: 48, mr: 2 }} />
              <Typography variant="h3" fontWeight="bold" sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Progress Report
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Track your academic performance and growth
            </Typography>
          </PageHeader>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard 
                color="#667eea"
                component={motion.div} 
                variants={cardVariants}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <TrophyIcon sx={{ fontSize: 40, mb: 1, color: '#fbbf24' }} />
                  <Typography variant="h4" fontWeight="bold">{totalTests}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Tests</Typography>
                </CardContent>
              </StatsCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard 
                color="#22c55e"
                component={motion.div} 
                variants={cardVariants}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <BarChartIcon sx={{ fontSize: 40, mb: 1, color: '#fbbf24' }} />
                  <Typography variant="h4" fontWeight="bold">{averageMarks}%</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Average Score</Typography>
                </CardContent>
              </StatsCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard 
                color="#3b82f6"
                component={motion.div} 
                variants={cardVariants}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <StarIcon sx={{ fontSize: 40, mb: 1, color: '#fbbf24' }} />
                  <Typography variant="h4" fontWeight="bold">{highestMarks}%</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Highest Score</Typography>
                </CardContent>
              </StatsCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard 
                color="#f59e0b"
                component={motion.div} 
                variants={cardVariants}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <TrendingUpIcon sx={{ fontSize: 40, mb: 1, color: '#fbbf24' }} />
                  <Typography variant="h4" fontWeight="bold">{improvement}%</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Improvement</Typography>
                </CardContent>
              </StatsCard>
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          {/* Charts Section */}
          {results.length > 0 && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} lg={8}>
                <ProgressCard
                  component={motion.div}
                  variants={cardVariants}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" mb={3}>
                      <TimelineIcon sx={{ fontSize: 28, mr: 2, color: '#667eea' }} />
                      <Typography variant="h6" fontWeight="bold">Performance Trend</Typography>
                    </Box>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" stroke="#64748b" />
                        <YAxis stroke="#64748b" domain={[0, 100]} />
                        <RechartsTooltip 
                          contentStyle={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="marks" 
                          stroke="#667eea" 
                          strokeWidth={3}
                          dot={{ fill: '#667eea', strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, stroke: '#667eea', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </ProgressCard>
              </Grid>
              <Grid item xs={12} lg={4}>
                <ProgressCard
                  component={motion.div}
                  variants={cardVariants}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" mb={3}>
                      <BarChartIcon sx={{ fontSize: 28, mr: 2, color: '#667eea' }} />
                      <Typography variant="h6" fontWeight="bold">Grade Distribution</Typography>
                    </Box>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={gradeDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {gradeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <Box mt={2}>
                      {gradeDistribution.map((item, index) => (
                        <Box key={index} display="flex" alignItems="center" mb={1}>
                          <Box 
                            sx={{ 
                              width: 12, 
                              height: 12, 
                              borderRadius: '50%', 
                              bgcolor: item.color, 
                              mr: 1 
                            }} 
                          />
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {item.value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </ProgressCard>
              </Grid>
            </Grid>
          )}

          {/* Test Results */}
          <ProgressCard
            component={motion.div}
            variants={cardVariants}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <AssignmentIcon sx={{ fontSize: 28, mr: 2, color: '#667eea' }} />
                <Typography variant="h6" fontWeight="bold">Test Results</Typography>
              </Box>
              
              {results.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <InfoIcon sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Test Results Available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your test results will appear here once they are released by your teachers.
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {results.map((result, index) => (
                    <Grid item xs={12} key={result._id}>
                      <Paper 
                        sx={{ 
                          p: 3, 
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                          <Box display="flex" alignItems="center">
                            <Avatar 
                              sx={{ 
                                bgcolor: '#667eea',
                                mr: 2,
                                width: 48,
                                height: 48
                              }}
                            >
                              <SchoolIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="h6" fontWeight="bold">
                                {result.testPaper?.title || `Test ${index + 1}`}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(result.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                          <Box textAlign="right">
                            <GradeChip 
                              label={`${result.marks}% - ${getGrade(result.marks)}`}
                              grade={result.marks}
                              size="medium"
                            />
                          </Box>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Box display="flex" alignItems="center" mb={1}>
                              <PersonIcon sx={{ fontSize: 16, mr: 1, color: '#64748b' }} />
                              <Typography variant="body2" color="text.secondary">
                                Teacher: {result.teacher?.name || 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Box display="flex" alignItems="center" mb={1}>
                              <CalendarIcon sx={{ fontSize: 16, mr: 1, color: '#64748b' }} />
                              <Typography variant="body2" color="text.secondary">
                                {new Date(result.createdAt).toLocaleString()}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                        
                        {result.remarks && (
                          <Box mt={2} p={2} sx={{ 
                            bgcolor: 'rgba(59, 130, 246, 0.1)', 
                            borderRadius: '8px',
                            border: '1px solid rgba(59, 130, 246, 0.2)'
                          }}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Remarks:</strong> {result.remarks}
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </ProgressCard>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default StudentProgressReport; 
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  Box, Typography, Paper, CircularProgress, Alert, Grid, Card, CardContent, 
  Chip, Avatar, Divider, IconButton, Tooltip, LinearProgress, Button
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  CartesianGrid, Legend, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  Analytics as AnalyticsIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Speed as SpeedIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

// Styled components for modern design
const PageHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '20px',
  padding: '32px',
  color: 'white',
  marginBottom: '24px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.3,
  }
}));

const StatsCard = styled(Card)(({ theme, color = 'primary' }) => ({
  background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
  borderRadius: '16px',
  color: 'white',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  height: '100%',
  minHeight: '140px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    transition: 'all 0.3s ease',
  },
  '&:hover::before': {
    transform: 'scale(1.2)',
  }
}));

const ChartCard = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-2px)',
  }
}));

const PerformanceCard = styled(Card)(({ theme, performance }) => ({
  borderRadius: '16px',
  padding: '20px',
  background: performance === 'excellent' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
              performance === 'good' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' :
              performance === 'average' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
              'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  color: 'white',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  height: '100%',
  minHeight: '140px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
  }
}));

const StudentAssessmentTools = () => {
  const { currentUser } = useSelector(state => state.user);
  const [results, setResults] = useState([]);
  const [testPapers, setTestPapers] = useState([]);
  const [classResults, setClassResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const API_BASE_URL = process.env.REACT_APP_BASE_URL || '';
  const sclass = currentUser.sclassName?._id;
  const student = currentUser._id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [studentRes, classRes, testPapersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/TestResults?student=${student}`),
          axios.get(`${API_BASE_URL}/TestResults?sclass=${sclass}`),
          axios.get(`${API_BASE_URL}/TestPapers?sclass=${sclass}`)
        ]);
        setResults(studentRes.data);
        setClassResults(classRes.data);
        setTestPapers(testPapersRes.data);
      } catch (err) {
        setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };
    if (sclass && student) fetchData();
  }, [sclass, student, API_BASE_URL]);

  // Calculate comprehensive analytics
  const calculateAnalytics = () => {
    if (!results.length || !testPapers.length) return null;

    const totalTests = testPapers.length;
    const attemptedTests = results.length;
    const totalMarks = results.reduce((sum, result) => sum + result.marks, 0);
    const maxPossibleMarks = testPapers.reduce((sum, paper) => sum + paper.totalMarks, 0);
    const averageScore = totalMarks / attemptedTests;
    const overallPercentage = (totalMarks / maxPossibleMarks) * 100;

    // Calculate class statistics
    const classAverages = testPapers.map(tp => {
      const classMarks = classResults.filter(r => r.testPaper && r.testPaper._id === tp._id).map(r => r.marks);
      return classMarks.length > 0 ? (classMarks.reduce((a, b) => a + b, 0) / classMarks.length) : 0;
    });
    const classAverage = classAverages.reduce((a, b) => a + b, 0) / classAverages.length;

    // Performance analysis
    const performanceLevel = overallPercentage >= 90 ? 'excellent' :
                           overallPercentage >= 80 ? 'good' :
                           overallPercentage >= 70 ? 'average' : 'needs_improvement';

    // Subject-wise performance
    const subjectPerformance = {};
    results.forEach(result => {
      const subject = result.testPaper?.subject?.subName || 'Unknown';
      if (!subjectPerformance[subject]) {
        subjectPerformance[subject] = { total: 0, count: 0, maxMarks: 0 };
      }
      subjectPerformance[subject].total += result.marks;
      subjectPerformance[subject].count += 1;
      subjectPerformance[subject].maxMarks += result.testPaper?.totalMarks || 0;
    });

    const subjectChartData = Object.entries(subjectPerformance).map(([subject, data]) => ({
      subject,
      percentage: (data.total / data.maxMarks) * 100,
      average: data.total / data.count
    }));

    return {
      totalTests,
      attemptedTests,
      totalMarks,
      maxPossibleMarks,
      averageScore,
      overallPercentage,
      classAverage,
      performanceLevel,
      subjectChartData,
      improvement: overallPercentage > classAverage ? overallPercentage - classAverage : 0
    };
  };

  const analytics = calculateAnalytics();

  // Prepare chart data
  const chartData = testPapers.map(tp => {
    const studentResult = results.find(r => r.testPaper && r.testPaper._id === tp._id);
    const classMarks = classResults.filter(r => r.testPaper && r.testPaper._id === tp._id).map(r => r.marks);
    const classAvg = classMarks.length > 0 ? (classMarks.reduce((a, b) => a + b, 0) / classMarks.length).toFixed(2) : 0;
    return {
      name: tp.title,
      'My Marks': studentResult ? studentResult.marks : 0,
      'Class Avg': Number(classAvg),
      'Max Marks': tp.totalMarks,
      date: new Date(tp.date).toLocaleDateString()
    };
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const getPerformanceIcon = (level) => {
    switch (level) {
      case 'excellent': return <TrophyIcon sx={{ fontSize: 40 }} />;
      case 'good': return <StarIcon sx={{ fontSize: 40 }} />;
      case 'average': return <CheckCircleIcon sx={{ fontSize: 40 }} />;
      default: return <WarningIcon sx={{ fontSize: 40 }} />;
    }
  };

  const getPerformanceColor = (level) => {
    switch (level) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'average': return '#f59e0b';
      default: return '#ef4444';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <PageHeader>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <AnalyticsIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 700, 
                mb: 1,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Performance Analytics
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Track your academic progress and compare with class performance
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </PageHeader>

      {/* Statistics Cards */}
      {analytics && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
                             <StatsCard color="#667eea">
                 <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                   <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                     <AssessmentIcon sx={{ fontSize: 32 }} />
                     <Typography variant="h4" sx={{ fontWeight: 700 }}>
                       {analytics.attemptedTests}/{analytics.totalTests}
                     </Typography>
                   </Box>
                   <Typography variant="body2" sx={{ opacity: 0.9 }}>
                     Tests Completed
                   </Typography>
                   <LinearProgress 
                     variant="determinate" 
                     value={(analytics.attemptedTests / analytics.totalTests) * 100}
                     sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }}
                   />
                 </CardContent>
               </StatsCard>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
                             <StatsCard color="#10b981">
                 <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                   <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                     <TrendingUpIcon sx={{ fontSize: 32 }} />
                     <Typography variant="h4" sx={{ fontWeight: 700 }}>
                       {analytics.overallPercentage.toFixed(1)}%
                     </Typography>
                   </Box>
                   <Typography variant="body2" sx={{ opacity: 0.9 }}>
                     Overall Score
                   </Typography>
                   <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                     <Typography variant="caption" sx={{ opacity: 0.8 }}>
                       {analytics.improvement > 0 ? `+${analytics.improvement.toFixed(1)}%` : `${analytics.improvement.toFixed(1)}%`} vs Class
                     </Typography>
                   </Box>
                 </CardContent>
               </StatsCard>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
                             <StatsCard color="#f59e0b">
                 <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                   <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                     <SchoolIcon sx={{ fontSize: 32 }} />
                     <Typography variant="h4" sx={{ fontWeight: 700 }}>
                       {analytics.averageScore.toFixed(1)}
                     </Typography>
                   </Box>
                   <Typography variant="body2" sx={{ opacity: 0.9 }}>
                     Average Score
                   </Typography>
                   <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                     <Typography variant="caption" sx={{ opacity: 0.8 }}>
                       Class avg: {analytics.classAverage.toFixed(1)}
                     </Typography>
                   </Box>
                 </CardContent>
               </StatsCard>
            </motion.div>
          </Grid>

                     <Grid item xs={12} sm={6} md={3}>
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.4 }}
             >
               <StatsCard color="#ef4444">
                 <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                   <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                     <SpeedIcon sx={{ fontSize: 32 }} />
                     <Typography variant="h4" sx={{ fontWeight: 700 }}>
                       {analytics.performanceLevel === 'excellent' ? 'A+' :
                        analytics.performanceLevel === 'good' ? 'B+' :
                        analytics.performanceLevel === 'average' ? 'C+' : 'D'}
                     </Typography>
                   </Box>
                   <Typography variant="body2" sx={{ opacity: 0.9 }}>
                     Grade Level
                   </Typography>
                   <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                     <Typography variant="caption" sx={{ opacity: 0.8 }}>
                       {analytics.performanceLevel.replace('_', ' ').toUpperCase()}
                     </Typography>
                   </Box>
                 </CardContent>
               </StatsCard>
             </motion.div>
           </Grid>
        </Grid>
      )}

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Main Performance Chart */}
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <ChartCard>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  My Performance vs Class Average
                </Typography>
                <Chip 
                  label={`${analytics?.overallPercentage.toFixed(1)}% Overall`} 
                  color="primary" 
                  variant="outlined"
                />
              </Box>
              {chartData.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <AssessmentIcon sx={{ fontSize: 64, color: '#64748b', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                    No test data available
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    Complete your first test to see performance analytics
                  </Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      allowDecimals={false}
                      tick={{ fontSize: 12 }}
                      label={{ value: 'Marks', angle: -90, position: 'insideLeft', fontSize: 14 }}
                    />
                    <RechartsTooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="My Marks" fill="#667eea" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Class Avg" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </motion.div>
        </Grid>

        {/* Subject Performance */}
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <ChartCard>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                Subject Performance
              </Typography>
              {analytics?.subjectChartData.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <PsychologyIcon sx={{ fontSize: 48, color: '#64748b', mb: 2 }} />
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    No subject data available
                  </Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.subjectChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ subject, percentage }) => `${subject}: ${percentage.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {analytics.subjectChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </motion.div>
        </Grid>

        {/* Performance Trend */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <ChartCard>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                Performance Trend
              </Typography>
              {chartData.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <TimelineIcon sx={{ fontSize: 64, color: '#64748b', mb: 2 }} />
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    Complete more tests to see your performance trend
                  </Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      allowDecimals={false}
                      tick={{ fontSize: 12 }}
                    />
                    <RechartsTooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="My Marks" 
                      stroke="#667eea" 
                      fill="#667eea" 
                      fillOpacity={0.3}
                      strokeWidth={3}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Class Avg" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.3}
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentAssessmentTools; 
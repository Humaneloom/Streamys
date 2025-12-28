import React, { useEffect, useState } from 'react';
import { 
    Typography, 
    Box, 
    Paper, 
    CircularProgress, 
    Alert,
    Grid,
    Card,
    CardContent,
    Chip,
    Divider
} from '@mui/material';
import {
    Analytics as AnalyticsIcon,
    TrendingUp as TrendingUpIcon,
    Assessment as AssessmentIcon,
    School as SchoolIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Star as StarIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AssessmentTools = () => {
  const { currentUser } = useSelector(state => state.user);
  const [results, setResults] = useState([]);
  const [testPapers, setTestPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_BASE_URL = process.env.REACT_APP_BASE_URL || '';
  const sclass = currentUser.teachSclass?._id;
  const subject = currentUser.teachSubject?._id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [resultsRes, testPapersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/TestResults?sclass=${sclass}`),
          axios.get(`${API_BASE_URL}/TestPapers?sclass=${sclass}&subject=${subject}`)
        ]);
        setResults(resultsRes.data);
        setTestPapers(testPapersRes.data);
      } catch (err) {
        setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };
    if (sclass && subject) fetchData();
  }, [sclass, subject, API_BASE_URL]);

  // Calculate analytics
  const testAverages = testPapers.map(tp => {
    const marks = results.filter(r => r.testPaper && r.testPaper._id === tp._id).map(r => r.marks);
    const avg = marks.length > 0 ? (marks.reduce((a, b) => a + b, 0) / marks.length).toFixed(2) : 0;
    return { name: tp.title, average: Number(avg) };
  });

  const totalTests = testPapers.length;
  const totalResults = results.length;
  const averageScore = testAverages.length > 0 ? 
    (testAverages.reduce((sum, test) => sum + test.average, 0) / testAverages.length).toFixed(1) : 0;
  const topPerformers = results.filter(r => r.marks >= 80).length;

  // Performance distribution data
  const performanceData = [
    { name: 'Excellent (80-100)', value: results.filter(r => r.marks >= 80).length, color: '#4caf50' },
    { name: 'Good (60-79)', value: results.filter(r => r.marks >= 60 && r.marks < 80).length, color: '#2196f3' },
    { name: 'Average (40-59)', value: results.filter(r => r.marks >= 40 && r.marks < 60).length, color: '#ff9800' },
    { name: 'Below Average (<40)', value: results.filter(r => r.marks < 40).length, color: '#f44336' }
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
        Academic Assessment Analytics
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 4, 
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': { transform: 'translateY(-8px)' }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <AssessmentIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {totalTests}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Total Tests
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 4, 
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': { transform: 'translateY(-8px)' }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <AnalyticsIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {totalResults}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Total Results
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 4, 
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': { transform: 'translateY(-8px)' }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <TrendingUpIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {averageScore}%
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Average Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 4, 
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': { transform: 'translateY(-8px)' }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <StarIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {topPerformers}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Top Performers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Class Average Marks Chart */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ 
              borderRadius: 4, 
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              p: 3
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUpIcon sx={{ fontSize: 32, color: '#667eea', mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
                    Class Average Marks per Test
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Performance analysis across all test papers
                  </Typography>
                </Box>
              </Box>
              
              {testAverages.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <AssessmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                    No Test Data Available
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Create and conduct tests to see analytics
                  </Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={testAverages} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: 8, 
                        border: 'none', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
                      }} 
                    />
                    <Legend />
                    <Bar 
                      dataKey="average" 
                      fill="url(#colorGradient)" 
                      name="Average Marks"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#667eea" />
                        <stop offset="100%" stopColor="#764ba2" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </Grid>

          {/* Performance Distribution */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ 
              borderRadius: 4, 
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              p: 3
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AnalyticsIcon sx={{ fontSize: 32, color: '#667eea', mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
                    Performance Distribution
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Student performance breakdown
                  </Typography>
                </Box>
              </Box>
              
              {performanceData.some(item => item.value > 0) ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={performanceData.filter(item => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {performanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: 8, 
                          border: 'none', 
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <Box sx={{ mt: 2 }}>
                    {performanceData.filter(item => item.value > 0).map((item, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box 
                          sx={{ 
                            width: 12, 
                            height: 12, 
                            backgroundColor: item.color, 
                            borderRadius: '50%', 
                            mr: 1 
                          }} 
                        />
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          {item.name}
                        </Typography>
                        <Chip 
                          label={item.value} 
                          size="small" 
                          sx={{ 
                            background: 'rgba(102, 126, 234, 0.1)',
                            color: '#667eea',
                            fontWeight: 600
                          }} 
                        />
                      </Box>
                    ))}
                  </Box>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <AnalyticsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No performance data available
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>

          {/* Test Performance Trend */}
          {testAverages.length > 1 && (
            <Grid item xs={12}>
              <Card sx={{ 
                borderRadius: 4, 
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                p: 3
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TrendingUpIcon sx={{ fontSize: 32, color: '#667eea', mr: 2 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
                      Performance Trend Over Time
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Track class performance progression
                    </Typography>
                  </Box>
                </Box>
                
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={testAverages} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: 8, 
                        border: 'none', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
                      }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="average" 
                      stroke="#667eea" 
                      strokeWidth={3}
                      dot={{ fill: '#667eea', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: '#667eea', strokeWidth: 2, fill: '#fff' }}
                      name="Average Marks"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default AssessmentTools; 
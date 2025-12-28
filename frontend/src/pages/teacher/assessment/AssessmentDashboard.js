import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Tabs, 
    Tab, 
    Typography, 
    Paper, 
    Grid, 
    Card, 
    CardContent,
    Container,
    Grow,
    Fade,
    Chip,
    IconButton,
    Tooltip
} from '@mui/material';
import { 
    Assignment as AssignmentIcon,
    Assessment as AssessmentIcon,
    Analytics as AnalyticsIcon,
    Create as CreateIcon,
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
    CheckCircle as CheckCircleIcon,
    School as SchoolIcon
} from '@mui/icons-material';
import TestPapers from './TestPapers';
import ProgressReport from './ProgressReport';
import AssessmentTools from './AssessmentTools';

const AssessmentDashboard = () => {
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState({
    totalTests: 12,
    totalStudents: 45,
    averageScore: 78,
    completedTests: 8
  });

  const handleChange = (event, newValue) => setTab(newValue);

  // Mock data for statistics
  useEffect(() => {
    // Simulate loading stats
    const timer = setTimeout(() => {
      setStats({
        totalTests: 15,
        totalStudents: 48,
        averageScore: 82,
        completedTests: 12
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const tabData = [
    {
      label: "Test Papers",
      icon: <AssignmentIcon />,
      description: "Create and manage test papers",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      label: "Progress Report", 
      icon: <AssessmentIcon />,
      description: "Track student progress and grades",
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      label: "Assessment Tools",
      icon: <AnalyticsIcon />,
      description: "Analytics and insights",
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 800, 
            mb: 2, 
            textAlign: 'center',
            background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}
        >
          Assessment & Evaluation Center
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            textAlign: 'center', 
            color: 'text.secondary',
            mb: 4
          }}
        >
          Comprehensive tools for student assessment and academic tracking
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Grow in timeout={500}>
            <Card sx={{ 
              borderRadius: 4, 
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': { transform: 'translateY(-8px)' }
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <AssignmentIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {stats.totalTests}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Total Tests
                </Typography>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Grow in timeout={700}>
            <Card sx={{ 
              borderRadius: 4, 
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': { transform: 'translateY(-8px)' }
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <PeopleIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {stats.totalStudents}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Active Students
                </Typography>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Grow in timeout={900}>
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
                  {stats.averageScore}%
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Average Score
                </Typography>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Grow in timeout={1100}>
            <Card sx={{ 
              borderRadius: 4, 
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': { transform: 'translateY(-8px)' }
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <CheckCircleIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {stats.completedTests}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Completed Tests
                </Typography>
              </CardContent>
            </Card>
          </Grow>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {tabData.map((item, index) => (
            <Grid item key={index}>
              <Tooltip title={item.description}>
                <Card 
                  sx={{ 
                    borderRadius: 3, 
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': { 
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                    }
                  }}
                  onClick={() => setTab(index)}
                >
                  <CardContent sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    minWidth: 120,
                    background: tab === index ? item.color : 'transparent',
                    color: tab === index ? 'white' : 'inherit'
                  }}>
                    <Box sx={{ mb: 1 }}>
                      {React.cloneElement(item.icon, { 
                        sx: { fontSize: 32 },
                        color: tab === index ? 'inherit' : 'primary'
                      })}
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Main Content */}
      <Paper sx={{ 
        p: 4, 
        borderRadius: 4, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        {/* Enhanced Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs 
            value={tab} 
            onChange={handleChange} 
            variant="fullWidth" 
            sx={{ 
              mb: 3,
              '& .MuiTab-root': {
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                mx: 1,
                transition: 'all 0.3s ease-in-out',
                '&.Mui-selected': {
                  background: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea'
                }
              }
            }}
          >
            {tabData.map((item, index) => (
              <Tab 
                key={index}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {item.icon}
                    {item.label}
                  </Box>
                } 
              />
            ))}
          </Tabs>
        </Box>

        {/* Tab Content with Animation */}
        <Fade in timeout={300}>
          <Box>
            {tab === 0 && <TestPapers />}
            {tab === 1 && <ProgressReport />}
            {tab === 2 && <AssessmentTools />}
          </Box>
        </Fade>
      </Paper>

      {/* Footer Info */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Chip 
          icon={<SchoolIcon />} 
          label="Assessment Center v2.0" 
          sx={{ 
            background: 'rgba(102, 126, 234, 0.1)',
            color: '#667eea',
            fontWeight: 600
          }} 
        />
      </Box>
    </Container>
  );
};

export default AssessmentDashboard; 
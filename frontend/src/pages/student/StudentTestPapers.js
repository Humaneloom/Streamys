import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert, 
  Button, 
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Book as BookIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
  Quiz as QuizIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';

// Styled components for modern design
const StyledCard = styled(Card)(({ theme, attempted }) => ({
  background: attempted 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  overflow: 'visible',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '20px',
    padding: '2px',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
  },
  '&:hover::before': {
    opacity: 1,
  }
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: '24px',
  color: 'white',
  '&:last-child': {
    paddingBottom: '24px',
  }
}));

const StatusChip = styled(Chip)(({ theme, attempted }) => ({
  background: attempted 
    ? 'rgba(34, 197, 94, 0.2)'
    : 'rgba(59, 130, 246, 0.2)',
  color: attempted ? '#22c55e' : '#3b82f6',
  border: `1px solid ${attempted ? '#22c55e' : '#3b82f6'}`,
  fontWeight: 600,
  fontSize: '0.75rem',
  '& .MuiChip-icon': {
    color: attempted ? '#22c55e' : '#3b82f6',
  }
}));

const ActionButton = styled(Button)(({ theme, attempted }) => ({
  background: attempted 
    ? 'rgba(255, 255, 255, 0.2)'
    : 'rgba(255, 255, 255, 0.9)',
  color: attempted ? 'white' : '#1f2937',
  borderRadius: '12px',
  padding: '10px 24px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.875rem',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: attempted 
      ? 'rgba(255, 255, 255, 0.3)'
      : 'rgba(255, 255, 255, 1)',
    transform: 'scale(1.05)',
  },
  '&:disabled': {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.5)',
  }
}));

const PageHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '20px',
  padding: '32px',
  marginBottom: '32px',
  color: 'white',
  textAlign: 'center',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '16px',
  padding: '20px',
  textAlign: 'center',
  color: 'white',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  }
}));

const StudentTestPapers = () => {
  const { currentUser } = useSelector(state => state.user);
  const [testPapers, setTestPapers] = useState([]);
  const [attempted, setAttempted] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_BASE_URL = process.env.REACT_APP_BASE_URL || '';
  const sclass = currentUser.sclassName?._id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [tpRes, resultRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/TestPapers?sclass=${sclass}`),
          axios.get(`${API_BASE_URL}/TestResults?student=${currentUser._id}`)
        ]);
        setTestPapers(tpRes.data);
        // Map attempted testPaper ids
        const attemptedMap = {};
        resultRes.data.forEach(r => {
          if (r.testPaper && r.testPaper._id) attemptedMap[r.testPaper._id] = true;
        });
        setAttempted(attemptedMap);
      } catch (err) {
        setError('Failed to load test papers.');
      } finally {
        setLoading(false);
      }
    };
    if (sclass) fetchData();
  }, [sclass, API_BASE_URL, currentUser._id]);

  const attemptedCount = Object.keys(attempted).length;
  const totalCount = testPapers.length;
  const pendingCount = totalCount - attemptedCount;

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
              <QuizIcon sx={{ fontSize: 48, mr: 2 }} />
              <Typography variant="h3" fontWeight="bold" sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Test Papers
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Challenge yourself with these assessments
            </Typography>
          </PageHeader>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <StatsCard component={motion.div} variants={cardVariants}>
                <TrophyIcon sx={{ fontSize: 40, mb: 1, color: '#fbbf24' }} />
                <Typography variant="h4" fontWeight="bold">{totalCount}</Typography>
                <Typography variant="body2">Total Tests</Typography>
              </StatsCard>
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatsCard component={motion.div} variants={cardVariants}>
                <CheckCircleIcon sx={{ fontSize: 40, mb: 1, color: '#22c55e' }} />
                <Typography variant="h4" fontWeight="bold">{attemptedCount}</Typography>
                <Typography variant="body2">Completed</Typography>
              </StatsCard>
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatsCard component={motion.div} variants={cardVariants}>
                <TrendingUpIcon sx={{ fontSize: 40, mb: 1, color: '#3b82f6' }} />
                <Typography variant="h4" fontWeight="bold">{pendingCount}</Typography>
                <Typography variant="body2">Pending</Typography>
              </StatsCard>
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          {testPapers.length === 0 ? (
            <motion.div variants={cardVariants}>
              <Paper 
                sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
                }}
              >
                <AssignmentIcon sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Test Papers Available
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Check back later for new assessments in your class.
                </Typography>
              </Paper>
            </motion.div>
          ) : (
            <Grid container spacing={3}>
              {testPapers.map((tp, index) => (
                <Grid item xs={12} md={6} lg={4} key={tp._id}>
                  <StyledCard 
                    attempted={attempted[tp._id]}
                    component={motion.div}
                    variants={cardVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <StyledCardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar 
                          sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            mr: 2,
                            width: 48,
                            height: 48
                          }}
                        >
                          <AssignmentIcon />
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {tp.title}
                          </Typography>
                          <StatusChip
                            icon={attempted[tp._id] ? <CheckCircleIcon /> : <PlayArrowIcon />}
                            label={attempted[tp._id] ? 'Completed' : 'Available'}
                            attempted={attempted[tp._id]}
                            size="small"
                          />
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

                      <Box sx={{ mb: 2 }}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <SchoolIcon sx={{ fontSize: 16, mr: 1, opacity: 0.8 }} />
                          <Typography variant="body2">
                            {tp.sclass?.sclassName || 'N/A'}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mb={1}>
                          <BookIcon sx={{ fontSize: 16, mr: 1, opacity: 0.8 }} />
                          <Typography variant="body2">
                            {tp.subject?.subName || 'N/A'}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mb={1}>
                          <QuizIcon sx={{ fontSize: 16, mr: 1, opacity: 0.8 }} />
                          <Typography variant="body2">
                            {tp.questions.length} Questions
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mb={1}>
                          <PersonIcon sx={{ fontSize: 16, mr: 1, opacity: 0.8 }} />
                          <Typography variant="body2">
                            By {tp.createdBy?.name || 'Unknown'}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                          <ScheduleIcon sx={{ fontSize: 16, mr: 1, opacity: 0.8 }} />
                          <Typography variant="body2">
                            {new Date(tp.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>

                      <CardActions sx={{ p: 0, mt: 2 }}>
                        <ActionButton
                          fullWidth
                          variant="contained"
                          attempted={attempted[tp._id]}
                          disabled={attempted[tp._id]}
                          onClick={() => !attempted[tp._id] && navigate(`/Student/attempt/${tp._id}`)}
                          startIcon={attempted[tp._id] ? <CheckCircleIcon /> : <PlayArrowIcon />}
                        >
                          {attempted[tp._id] ? 'Already Attempted' : 'Start Test'}
                        </ActionButton>
                      </CardActions>
                    </StyledCardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          )}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default StudentTestPapers; 
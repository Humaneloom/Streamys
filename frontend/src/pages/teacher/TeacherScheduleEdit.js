import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    Button, 
    CircularProgress, 
    Alert,
    Grid,
    Card,
    CardContent,
    Chip,
    Divider,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Schedule as ScheduleIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Refresh as RefreshIcon,
    TrendingUp as TrendingUpIcon,
    School as SchoolIcon,
    AccessTime as AccessTimeIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import TeacherSchedule from './TeacherSchedule';
import { useSelector } from 'react-redux';
import axios from 'axios';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIMES = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM (Lunch)',
  '1:00 PM',
  '2:00 PM',
];
const SUBJECTS = [
  'Math',
  'English',
  'Biology',
  'Physics',
  'Chemistry',
  'History',
  'Free',
];

const initialSchedule = {
  'Monday':    ['Math', 'English', 'Biology', 'Physics', 'Lunch', 'Chemistry', 'History'],
  'Tuesday':   ['English', 'Math', 'Physics', 'Biology', 'Lunch', 'History', 'Chemistry'],
  'Wednesday': ['Biology', 'Physics', 'Math', 'English', 'Lunch', 'Chemistry', 'Free'],
  'Thursday':  ['Physics', 'Biology', 'English', 'Math', 'Lunch', 'Free', 'Chemistry'],
  'Friday':    ['Math', 'English', 'Biology', 'Physics', 'Lunch', 'Chemistry', 'History'],
};

const TeacherScheduleEdit = () => {
  const { currentUser } = useSelector((state) => state.user);
  const teacherId = currentUser?._id;
  const [schedule, setSchedule] = useState(initialSchedule);
  const [edit, setEdit] = useState({ open: false, day: '', timeIdx: -1, value: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_BASE_URL = process.env.REACT_APP_BASE_URL || '';

  // Calculate schedule statistics
  const getScheduleStats = () => {
    const totalSlots = DAYS.length * (TIMES.length - 2); // Exclude lunch and empty slots
    const filledSlots = Object.values(schedule).flat().filter(subject => 
      subject && subject !== 'Lunch' && subject !== 'Free'
    ).length;
    const freeSlots = Object.values(schedule).flat().filter(subject => 
      subject === 'Free'
    ).length;
    const lunchSlots = DAYS.length; // 5 lunch slots per week
    
    return {
      totalSlots,
      filledSlots,
      freeSlots,
      lunchSlots,
      utilizationRate: Math.round((filledSlots / totalSlots) * 100)
    };
  };

  const stats = getScheduleStats();

  // Fetch schedule from backend on mount
  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_BASE_URL}/Teacher/${teacherId}/schedule`);
        if (res.data && res.data.schedule && Object.keys(res.data.schedule).length > 0) {
          setSchedule(res.data.schedule);
        } else {
          setSchedule(initialSchedule);
        }
      } catch (err) {
        setError('Failed to load schedule.');
      } finally {
        setLoading(false);
      }
    };
    if (teacherId) fetchSchedule();
  }, [teacherId]);

  const handleCellClick = (day, timeIdx) => {
    if (TIMES[timeIdx].includes('Lunch')) return;
    setEdit({ open: true, day, timeIdx, value: schedule[day][timeIdx] });
  };

  const handleEditChange = (e) => {
    setEdit((prev) => ({ ...prev, value: e.target.value }));
  };

  const handleEditSave = () => {
    setSchedule((prev) => ({
      ...prev,
      [edit.day]: prev[edit.day].map((val, idx) => idx === edit.timeIdx ? edit.value : val)
    }));
    setEdit({ open: false, day: '', timeIdx: -1, value: '' });
  };

  const handleEditClose = () => {
    setEdit({ open: false, day: '', timeIdx: -1, value: '' });
  };

  // Save schedule to backend
  const handleSaveToBackend = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await axios.put(`${API_BASE_URL}/Teacher/${teacherId}/schedule`, { schedule });
      setSuccess('Schedule saved successfully!');
    } catch (err) {
      setError('Failed to save schedule.');
    } finally {
      setSaving(false);
    }
  };

  // Reset to initial schedule
  const handleReset = () => {
    setSchedule(initialSchedule);
    setSuccess('Schedule reset to default!');
  };

  return (
    <Box sx={{ mt: 4, p: 3 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#667eea' }}>
          Schedule Management
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
          Edit and manage your weekly teaching schedule. Click on any time slot to modify the subject or activity.
        </Typography>
      </Box>

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
              <ScheduleIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {stats.totalSlots}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Total Time Slots
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
              <SchoolIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {stats.filledSlots}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Teaching Hours
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
                {stats.utilizationRate}%
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Utilization Rate
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
              <AccessTimeIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {stats.freeSlots}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Free Periods
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          {/* Schedule Card */}
          <Card sx={{ 
            borderRadius: 4, 
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            mb: 3
          }}>
            <Box sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
                    Weekly Schedule
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                    Click on any time slot to edit the subject or activity
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Reset to default schedule">
                    <IconButton 
                      onClick={handleReset}
                      sx={{ 
                        background: 'rgba(255, 152, 0, 0.1)',
                        color: '#ff9800',
                        '&:hover': { background: 'rgba(255, 152, 0, 0.2)' }
                      }}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ p: 3 }}>
              <TeacherSchedule
                editable={true}
                schedule={schedule}
                onEdit={{
                  edit,
                  handleCellClick,
                  handleEditChange,
                  handleEditSave,
                  handleEditClose,
                  subjects: SUBJECTS,
                  times: TIMES
                }}
              />
            </Box>
          </Card>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveToBackend}
              disabled={saving}
              sx={{ 
                fontWeight: 600, 
                fontSize: '1.1rem', 
                borderRadius: 3,
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                }
              }}
            >
              {saving ? <CircularProgress size={24} color="inherit" /> : 'Save Schedule'}
            </Button>
          </Box>

          {/* Quick Tips */}
          <Card sx={{ 
            mt: 4, 
            borderRadius: 4, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea', mb: 2 }}>
                Quick Tips
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircleIcon sx={{ color: '#4caf50', mr: 1, fontSize: 20 }} />
                    <Typography variant="body2">Click any time slot to edit the subject</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircleIcon sx={{ color: '#4caf50', mr: 1, fontSize: 20 }} />
                    <Typography variant="body2">Lunch periods are automatically set</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircleIcon sx={{ color: '#4caf50', mr: 1, fontSize: 20 }} />
                    <Typography variant="body2">Use "Free" for unassigned periods</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircleIcon sx={{ color: '#4caf50', mr: 1, fontSize: 20 }} />
                    <Typography variant="body2">Save changes to persist your schedule</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default TeacherScheduleEdit; 
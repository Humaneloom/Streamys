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
    Tooltip,
    TextField,
    Stack,
    Fade,
    Grow
} from '@mui/material';
import {
    Schedule as ScheduleIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Refresh as RefreshIcon,
    TrendingUp as TrendingUpIcon,
    School as SchoolIcon,
    AccessTime as AccessTimeIcon,
    CheckCircle as CheckCircleIcon,
    Book as BookIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import axios from 'axios';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIMES = [
  { label: '8:00 AM', range: '8:00 AM – 8:45 AM' },
  { label: '9:00 AM', range: '9:00 AM – 9:45 AM' },
  { label: '10:00 AM', range: '10:00 AM – 10:45 AM' },
  { label: '11:00 AM', range: '11:00 AM – 11:45 AM' },
  { label: '12:00 PM', range: '' }, // Lunch
  { label: '1:00 PM', range: '1:00 PM – 1:45 PM' },
  { label: '2:00 PM', range: '2:00 PM – 2:45 PM' },
  { label: '3:00 PM', range: '' },
];
const SUBJECTS = [
  'Mathematics',
  'English',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'Computer Science',
  'Art',
  'Music',
  'Physical Education',
  'Free Period',
];

const CardBox = styled(Box)(({ bgcolor, isEditing }) => ({
  background: isEditing ? '#e3f2fd' : (bgcolor || '#f8fafc'),
  borderRadius: 12,
  padding: '12px 16px',
  marginBottom: 8,
  boxShadow: isEditing ? '0 4px 12px rgba(33, 150, 243, 0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
  fontWeight: 500,
  fontSize: '1rem',
  minWidth: 120,
  display: 'inline-block',
  transition: 'all 0.3s ease-in-out',
  border: isEditing ? '2px solid #2196f3' : '1px solid transparent',
  cursor: isEditing ? 'default' : 'pointer',
  '&:hover': {
    transform: isEditing ? 'none' : 'translateY(-2px)',
    boxShadow: isEditing ? '0 4px 12px rgba(33, 150, 243, 0.2)' : '0 4px 16px rgba(0,0,0,0.1)'
  }
}));

const Table = styled('table')({
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: 0,
  tableLayout: 'fixed',
  borderRadius: 12,
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
});

const Th = styled('th')({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  fontWeight: 700,
  fontSize: '1.1rem',
  padding: '20px 12px',
  textAlign: 'center',
  position: 'sticky',
  top: 0,
  zIndex: 2,
  border: 'none',
  '&:first-of-type': {
    background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
    minWidth: 120
  }
});

const Td = styled('td')({
  border: '1px solid #e0e7ef',
  minWidth: 140,
  height: 100,
  verticalAlign: 'top',
  padding: 12,
  background: '#f8fafc',
  textAlign: 'center',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: '#f1f5f9'
  }
});

const TimeTd = styled(Td)({
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  color: '#64748b',
  fontWeight: 700,
  fontSize: '1.1rem',
  position: 'sticky',
  left: 0,
  zIndex: 1,
  textAlign: 'right',
  paddingRight: 20,
  borderRight: '2px solid #e2e8f0',
  '&:hover': {
    background: 'linear-gradient(135deg, #f1f5f9 0%, #dbeafe 100%)'
  }
});

const initialSchedule = {
  'Monday':    ['Mathematics', 'English', 'Physics', 'Chemistry', 'Lunch', 'Biology', 'History', 'Free Period'],
  'Tuesday':   ['English', 'Mathematics', 'Chemistry', 'Physics', 'Lunch', 'Biology', 'Geography', 'Art'],
  'Wednesday': ['Physics', 'Mathematics', 'English', 'Biology', 'Lunch', 'Chemistry', 'History', 'Physical Education'],
  'Thursday':  ['Chemistry', 'English', 'Mathematics', 'Physics', 'Lunch', 'Biology', 'Geography', 'Music'],
  'Friday':    ['Biology', 'Mathematics', 'Chemistry', 'English', 'Lunch', 'Physics', 'History', 'Computer Science'],
};

const StudentScheduleEdit = () => {
  const { currentUser } = useSelector((state) => state.user);
  const studentId = currentUser?._id;
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
      subject && subject !== 'Lunch' && subject !== 'Free Period'
    ).length;
    const freeSlots = Object.values(schedule).flat().filter(subject => 
      subject === 'Free Period'
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

  // Ensure schedule has correct structure
  const normalizeSchedule = (scheduleData) => {
    const normalized = {};
    DAYS.forEach(day => {
      if (scheduleData[day] && Array.isArray(scheduleData[day])) {
        // Ensure array has 8 elements (matching TIMES length)
        normalized[day] = [...scheduleData[day]];
        while (normalized[day].length < TIMES.length) {
          normalized[day].push('Free Period');
        }
        normalized[day] = normalized[day].slice(0, TIMES.length);
      } else {
        normalized[day] = [...initialSchedule[day]];
      }
    });
    return normalized;
  };

  // Fetch schedule from backend on mount
  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_BASE_URL}/Student/${studentId}/schedule`);
        if (res.data && res.data.schedule && Object.keys(res.data.schedule).length > 0) {
          const normalizedSchedule = normalizeSchedule(res.data.schedule);
          console.log('Normalized schedule:', normalizedSchedule);
          setSchedule(normalizedSchedule);
        } else {
          setSchedule(initialSchedule);
        }
      } catch (err) {
        setError('Failed to load schedule.');
        setSchedule(initialSchedule);
      } finally {
        setLoading(false);
      }
    };
    if (studentId) fetchSchedule();
  }, [studentId]);

  // Debug: Log schedule changes
  useEffect(() => {
    console.log('Schedule state updated:', schedule);
  }, [schedule]);

  const handleCellClick = (day, timeIdx) => {
    if (TIMES[timeIdx].label === '12:00 PM' || TIMES[timeIdx].label === '3:00 PM') return;
    
    // If already editing this cell, don't reset it
    if (edit.open && edit.day === day && edit.timeIdx === timeIdx) {
      return;
    }
    
    const currentValue = schedule[day][timeIdx];
    console.log('Opening edit for:', { day, timeIdx, currentValue });
    setEdit({ open: true, day, timeIdx, value: currentValue });
  };

  const handleEditChange = (e) => {
    const newValue = e.target.value;
    console.log('Edit value changed to:', newValue);
    console.log('Current edit state before update:', edit);
    setEdit((prev) => {
      const updated = { ...prev, value: newValue };
      console.log('Updated edit state:', updated);
      return updated;
    });
  };

  const handleEditSave = () => {
    console.log('=== SAVE OPERATION ===');
    console.log('Current edit state:', edit);
    console.log('Saving edit:', { day: edit.day, timeIdx: edit.timeIdx, value: edit.value });
    console.log('Current schedule before save:', schedule[edit.day]);
    
    setSchedule((prev) => {
      const newSchedule = {
        ...prev,
        [edit.day]: [...prev[edit.day]] // Create a new array
      };
      newSchedule[edit.day][edit.timeIdx] = edit.value;
      console.log('Updated schedule for', edit.day, ':', newSchedule[edit.day]);
      return newSchedule;
    });
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
      await axios.put(`${API_BASE_URL}/Student/${studentId}/schedule`, { schedule });
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
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      mt: 4, 
      p: 3 
    }}>
      {/* Header Section */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 4,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '40px 20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          mb: 2, 
          color: 'white',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          My Schedule Management
        </Typography>
        <Typography variant="body1" sx={{ 
          color: 'rgba(255,255,255,0.8)', 
          maxWidth: 600, 
          mx: 'auto' 
        }}>
          View and customize your weekly class schedule. Click on any time slot to modify the subject or activity.
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
              <BookIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {stats.filledSlots}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Classes Scheduled
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
                Schedule Utilization
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
              <Box sx={{ 
                borderRadius: 4, 
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                background: '#fff'
              }}>
                <Table>
                  <thead>
                    <tr>
                      <Th>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <AccessTimeIcon sx={{ fontSize: 20 }} />
                          Time
                        </Box>
                      </Th>
                      {DAYS.map(day => (
                        <Th key={day}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <SchoolIcon sx={{ fontSize: 20 }} />
                            {day}
                          </Box>
                        </Th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TIMES.map((slot, timeIdx) => (
                      <tr key={slot.label}>
                        <TimeTd>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: '#667eea' }}>
                              {slot.label}
                            </Typography>
                            {slot.range && (
                              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                {slot.range}
                              </Typography>
                            )}
                          </Box>
                        </TimeTd>
                        {DAYS.map(day => {
                          if (slot.label === '12:00 PM') {
                            return (
                              <Td key={day + timeIdx} style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
                                <Chip 
                                  label="Lunch Break" 
                                  icon={<AccessTimeIcon />}
                                  sx={{ 
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                    color: '#fff',
                                    fontWeight: 700,
                                    width: '100%',
                                    '& .MuiChip-icon': { color: '#fff' }
                                  }} 
                                />
                              </Td>
                            );
                          } else if (slot.label === '3:00 PM') {
                            return <Td key={day + timeIdx} style={{ background: '#f8fafc' }}></Td>;
                          } else {
                            const isEditing = edit.open && edit.day === day && edit.timeIdx === timeIdx;
                            return (
                              <Td
                                key={day + timeIdx}
                                onClick={(e) => {
                                  // Prevent click if clicking on editing controls
                                  if (isEditing && (e.target.closest('button') || e.target.closest('input') || e.target.closest('select'))) {
                                    return;
                                  }
                                  handleCellClick(day, timeIdx);
                                }}
                                style={{ 
                                  cursor: isEditing ? 'default' : 'pointer',
                                  background: isEditing ? '#e3f2fd' : undefined 
                                }}
                              >
                                {isEditing ? (
                                  <Fade in timeout={300}>
                                    <Stack spacing={2}>
                                      <TextField
                                        value={edit.value}
                                        onChange={handleEditChange}
                                        size="small"
                                        autoFocus
                                        fullWidth
                                        select
                                        SelectProps={{ native: true }}
                                        sx={{
                                          '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            background: '#fff'
                                          }
                                        }}
                                      >
                                        {SUBJECTS.map((subject) => (
                                          <option key={subject} value={subject}>
                                            {subject}
                                          </option>
                                        ))}
                                      </TextField>
                                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                        <Tooltip title="Save changes">
                                          <IconButton 
                                            color="primary" 
                                            size="small" 
                                            onClick={e => { e.stopPropagation(); handleEditSave(); }}
                                            sx={{ 
                                              background: 'rgba(33, 150, 243, 0.1)',
                                              '&:hover': { background: 'rgba(33, 150, 243, 0.2)' }
                                            }}
                                          >
                                            <SaveIcon fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Cancel">
                                          <IconButton 
                                            color="secondary" 
                                            size="small" 
                                            onClick={e => { e.stopPropagation(); handleEditClose(); }}
                                            sx={{ 
                                              background: 'rgba(156, 39, 176, 0.1)',
                                              '&:hover': { background: 'rgba(156, 39, 176, 0.2)' }
                                            }}
                                          >
                                            <EditIcon fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                      </Box>
                                    </Stack>
                                  </Fade>
                                ) : (
                                  <Grow in timeout={300}>
                                    <CardBox>
                                      <Typography variant="caption" sx={{ color: '#888', fontWeight: 500, display: 'block', mb: 0.5 }}>
                                        {slot.range}
                                      </Typography>
                                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                                        {schedule[day][timeIdx]}
                                      </Typography>
                                    </CardBox>
                                  </Grow>
                                )}
                              </Td>
                            );
                          }
                        })}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Box>
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
                    <Typography variant="body2">Use "Free Period" for unassigned times</Typography>
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

export default StudentScheduleEdit; 
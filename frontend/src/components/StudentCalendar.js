import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Event,
  Add,
  School,
  Assignment,
  Celebration,
  Warning,
  Delete
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { 
  getStudentEventsByMonth, 
  createCalendarEvent, 
  deleteCalendarEvent 
} from '../redux/calendarRelated/calendarHandle';

const CalendarDay = styled(Box, {
  shouldForwardProp: (prop) => !['isCurrent', 'isSelected', 'hasEvent', 'isOtherMonth'].includes(prop)
})(({ theme, isCurrent, isSelected, hasEvent, isOtherMonth }) => ({
  width: '100%',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  cursor: 'pointer',
  position: 'relative',
  fontSize: '0.875rem',
  fontWeight: isCurrent ? 700 : 500,
  color: isOtherMonth ? '#cbd5e1' : isCurrent ? '#ffffff' : '#1e293b',
  background: isSelected 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : isCurrent 
    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    : hasEvent
    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    : 'transparent',
  border: isSelected 
    ? '2px solid #667eea'
    : isCurrent 
    ? '2px solid #10b981'
    : hasEvent
    ? '2px solid #f59e0b'
    : '1px solid transparent',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  '&::after': hasEvent ? {
    content: '""',
    position: 'absolute',
    bottom: '2px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: isCurrent ? '#ffffff' : '#f59e0b',
  } : {}
}));

const EventChip = styled(Chip)(({ theme, eventType }) => ({
  margin: '2px',
  fontSize: '0.7rem',
  height: '20px',
  background: eventType === 'exam' 
    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
    : eventType === 'assignment'
    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    : eventType === 'event'
    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#ffffff',
  '& .MuiChip-label': {
    padding: '0 6px',
  }
}));

const StudentCalendar = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { currentMonthEvents, loading, error } = useSelector((state) => state.calendar);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'event',
    description: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Load events for current month when component mounts or month changes
  useEffect(() => {
    if (currentUser?._id) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // getMonth() returns 0-11
      dispatch(getStudentEventsByMonth(currentUser._id, year, month));
    }
  }, [dispatch, currentUser?._id, currentDate]);

  // Show error messages
  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: error,
        severity: 'error'
      });
    }
  }, [error]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add days from previous month
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isOtherMonth: true
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isOtherMonth: false
      });
    }
    
    // Add days from next month to fill the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isOtherMonth: true
      });
    }
    
    return days;
  };

  const formatDateKey = (date) => {
    // Use local date to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getEventsForDate = (date) => {
    const dateKey = formatDateKey(date);
    const events = currentMonthEvents[dateKey] || [];
    console.log(`Getting events for ${date.toDateString()} (key: ${dateKey}):`, events);
    return events;
  };

  const hasEvents = (date) => {
    const dateEvents = getEventsForDate(date);
    const hasEvent = dateEvents.length > 0;
    console.log(`Checking events for ${date.toDateString()}: hasEvent=${hasEvent}`);
    return hasEvent;
  };

  const isCurrentDate = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelectedDate = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setNewEvent({ title: '', type: 'event', description: '' });
    setOpenDialog(true);
  };

  const handleAddEvent = async () => {
    if (!newEvent.title.trim()) return;
    
    try {
      // Create a date at noon to avoid timezone issues
      const eventDate = new Date(selectedDate);
      eventDate.setHours(12, 0, 0, 0); // Set to noon local time
      
      const eventData = {
        title: newEvent.title.trim(),
        description: newEvent.description.trim(),
        eventType: newEvent.type,
        date: eventDate.toISOString()
      };
      
      console.log('Creating event with data:', eventData);
      console.log('Selected date:', selectedDate.toDateString());
      console.log('Event date (noon):', eventDate.toDateString());
      console.log('Date ISO string:', eventDate.toISOString());
      
      await dispatch(createCalendarEvent(currentUser._id, eventData));
      
      setSnackbar({
        open: true,
        message: 'Event created successfully!',
        severity: 'success'
      });
      
      setNewEvent({ title: '', type: 'event', description: '' });
      setOpenDialog(false);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await dispatch(deleteCalendarEvent(eventId));
      
      setSnackbar({
        open: true,
        message: 'Event deleted successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'exam': return <School fontSize="small" />;
      case 'assignment': return <Assignment fontSize="small" />;
      case 'event': return <Celebration fontSize="small" />;
      default: return <Event fontSize="small" />;
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'exam': return '#ef4444';
      case 'assignment': return '#f59e0b';
      case 'event': return '#10b981';
      default: return '#667eea';
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const days = getDaysInMonth(currentDate);

  return (
    <Card sx={{ 
      borderRadius: '16px', 
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      border: '1px solid rgba(0,0,0,0.08)',
      height: '100%'
    }}>
      <CardContent sx={{ p: 3 }}>
        {/* Calendar Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Typography>
          <Box>
            <IconButton 
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              size="small"
            >
              <ChevronLeft />
            </IconButton>
            <IconButton 
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              size="small"
            >
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>
        


        {/* Day Headers */}
        <Grid container sx={{ mb: 2 }}>
          {dayNames.map((day) => (
            <Grid item xs={12/7} key={day}>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  textAlign: 'center', 
                  fontWeight: 600, 
                  color: '#64748b',
                  borderBottom: '1px dotted #e2e8f0',
                  pb: 1
                }}
              >
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Calendar Grid */}
        <Grid container spacing={0.5}>
          {days.map((day, index) => (
            <Grid item xs={12/7} key={index}>
              <CalendarDay
                isCurrent={isCurrentDate(day.date)}
                isSelected={isSelectedDate(day.date)}
                hasEvent={hasEvents(day.date)}
                isOtherMonth={day.isOtherMonth}
                onClick={() => handleDateClick(day.date)}
              >
                {day.date.getDate()}
              </CalendarDay>
            </Grid>
          ))}
        </Grid>

        {/* Selected Date Events */}
        {selectedDate && getEventsForDate(selectedDate).length > 0 && (
          <Box sx={{ mt: 3, p: 2, background: 'rgba(102, 126, 234, 0.05)', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#667eea', mb: 1 }}>
              Events for {selectedDate.toLocaleDateString()}
            </Typography>
            <List dense>
              {getEventsForDate(selectedDate).map((event) => (
                <ListItem key={event.id} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32, color: getEventColor(event.type) }}>
                    {getEventIcon(event.type)}
                  </ListItemIcon>
                  <ListItemText 
                    primary={event.title}
                    secondary={event.description}
                    primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }}
                    secondaryTypographyProps={{ fontSize: '0.75rem' }}
                  />
                  <IconButton 
                    size="small" 
                    onClick={() => handleDeleteEvent(event._id)}
                    sx={{ color: '#ef4444' }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Add Event Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={() => {
            setOpenDialog(false);
            setNewEvent({ title: '', type: 'event', description: '' });
          }} 
          maxWidth="sm" 
          fullWidth
        >
          <DialogTitle sx={{ color: '#667eea', fontWeight: 700 }}>
            Add Event for {selectedDate?.toLocaleDateString()}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Event Title"
              fullWidth
              variant="outlined"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Event Type</InputLabel>
              <Select
                value={newEvent.type}
                label="Event Type"
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
              >
                <MenuItem value="exam">Exam</MenuItem>
                <MenuItem value="assignment">Assignment</MenuItem>
                <MenuItem value="event">Event</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Description (Optional)"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setOpenDialog(false);
                setNewEvent({ title: '', type: 'event', description: '' });
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddEvent} 
              variant="contained"
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                }
              }}
            >
              Add Event
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default StudentCalendar; 
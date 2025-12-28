import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  AccessTime as AccessTimeIcon,
  Book as BookIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const TIMES = [
  { label: '8:00 AM', range: '8:00 AM – 8:45 AM' },
  { label: '9:00 AM', range: '9:00 AM – 9:45 AM' },
  { label: '10:00 AM', range: '10:00 AM – 10:45 AM' },
  { label: '11:00 AM', range: '11:00 AM – 11:45 AM' },
  { label: '12:00 PM', range: '12:00 PM – 12:45 PM' },
  { label: '1:00 PM', range: '1:00 PM – 1:45 PM' },
  { label: '2:00 PM', range: '2:00 PM – 2:45 PM' },
  { label: '3:00 PM', range: '3:00 PM – 3:45 PM' },
];

const ScheduleItem = styled(Box, {
  shouldForwardProp: (prop) => !['isCurrent'].includes(prop)
})(({ theme, isCurrent }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 12px',
  marginBottom: '6px',
  borderRadius: '10px',
  background: isCurrent 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  border: isCurrent 
    ? '2px solid rgba(102, 126, 234, 0.3)' 
    : '1px solid rgba(0,0,0,0.08)',
  boxShadow: isCurrent 
    ? '0 4px 20px rgba(102, 126, 234, 0.2)' 
    : '0 2px 8px rgba(0,0,0,0.04)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateX(4px)',
    boxShadow: isCurrent 
      ? '0 6px 25px rgba(102, 126, 234, 0.3)' 
      : '0 4px 16px rgba(0,0,0,0.1)',
  }
}));

const TimeSlot = styled(Box, {
  shouldForwardProp: (prop) => !['isCurrent'].includes(prop)
})(({ theme, isCurrent }) => ({
  minWidth: '70px',
  textAlign: 'center',
  marginRight: '12px',
  '& .time-label': {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: isCurrent ? '#ffffff' : '#667eea',
    marginBottom: '2px',
  },
  '& .time-range': {
    fontSize: '0.7rem',
    color: isCurrent ? 'rgba(255,255,255,0.8)' : '#64748b',
  }
}));

const SubjectInfo = styled(Box, {
  shouldForwardProp: (prop) => !['isCurrent'].includes(prop)
})(({ theme, isCurrent }) => ({
  flex: 1,
  '& .subject-name': {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: isCurrent ? '#ffffff' : '#1e293b',
    marginBottom: '3px',
  },
  '& .subject-details': {
    fontSize: '0.8rem',
    color: isCurrent ? 'rgba(255,255,255,0.8)' : '#64748b',
  }
}));

const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => !['isCurrent', 'status'].includes(prop)
})(({ theme, isCurrent, status }) => ({
  fontSize: '0.7rem',
  fontWeight: 600,
  height: '22px',
  background: isCurrent 
    ? 'rgba(255,255,255,0.2)' 
    : status === 'completed' 
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : status === 'upcoming'
      ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: isCurrent ? '#ffffff' : '#ffffff',
  border: 'none',
  '& .MuiChip-label': {
    padding: '0 6px',
  }
}));

const StudentSchedule = ({ schedule }) => {
  const getCurrentTimeSlot = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    
    // Convert schedule times to minutes for comparison
    const timeSlots = TIMES.map((time, index) => {
      const [hour, minute] = time.label.split(':');
      const timeInMinutes = parseInt(hour) * 60 + parseInt(minute);
      return { index, timeInMinutes, time };
    });
    
    // Find current or next time slot
    for (let i = 0; i < timeSlots.length; i++) {
      const slot = timeSlots[i];
      const nextSlot = timeSlots[i + 1];
      
      if (currentTime >= slot.timeInMinutes && (!nextSlot || currentTime < nextSlot.timeInMinutes)) {
        return slot.index;
      }
    }
    
    return -1; // No current slot found
  };

  const getStatus = (timeIndex) => {
    const currentSlot = getCurrentTimeSlot();
    if (timeIndex < currentSlot) return 'completed';
    if (timeIndex === currentSlot) return 'current';
    return 'upcoming';
  };

  const getDayName = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const currentDay = getDayName();
  const currentSlot = getCurrentTimeSlot();

  // Sample schedule data - in real app, this would come from props
  const sampleSchedule = {
    'Monday': ['Mathematics', 'English', 'Physics', 'Chemistry', 'Lunch Break', 'Biology', 'History', 'Computer Science'],
    'Tuesday': ['English', 'Mathematics', 'Chemistry', 'Physics', 'Lunch Break', 'Biology', 'Geography', 'Art'],
    'Wednesday': ['Physics', 'Mathematics', 'English', 'Biology', 'Lunch Break', 'Chemistry', 'History', 'Physical Education'],
    'Thursday': ['Chemistry', 'English', 'Mathematics', 'Physics', 'Lunch Break', 'Biology', 'Geography', 'Music'],
    'Friday': ['Biology', 'Mathematics', 'Chemistry', 'English', 'Lunch Break', 'Physics', 'History', 'Computer Science'],
  };

  const todaySchedule = schedule?.[currentDay] || sampleSchedule[currentDay] || Array(8).fill('Free Period');

  if (!todaySchedule || todaySchedule.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <ScheduleIcon sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#667eea', mb: 1 }}>
          No Schedule Available
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Your schedule for today hasn't been set up yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <ScheduleIcon sx={{ fontSize: 20, color: '#667eea', mr: 1 }} />
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#667eea' }}>
            {currentDay}'s Schedule
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Typography>
        </Box>
      </Box>

      {/* Schedule Items */}
      <Box sx={{ maxHeight: '350px', overflowY: 'auto' }}>
        {TIMES.map((timeSlot, index) => {
          const subject = todaySchedule[index];
          const isCurrent = index === currentSlot;
          const status = getStatus(index);
          
          if (!subject || subject === 'Lunch Break') {
            return (
              <ScheduleItem key={index} isCurrent={isCurrent}>
                <TimeSlot isCurrent={isCurrent}>
                  <div className="time-label">{timeSlot.label}</div>
                  <div className="time-range">{timeSlot.range}</div>
                </TimeSlot>
                <SubjectInfo isCurrent={isCurrent}>
                  <div className="subject-name">
                    {subject === 'Lunch Break' ? 'Lunch Break' : 'Free Period'}
                  </div>
                  <div className="subject-details">
                    {subject === 'Lunch Break' ? 'Enjoy your meal!' : 'No class scheduled'}
                  </div>
                </SubjectInfo>
                <StatusChip 
                  label={subject === 'Lunch Break' ? 'Break' : 'Free'} 
                  isCurrent={isCurrent}
                  status={status}
                  size="small"
                />
              </ScheduleItem>
            );
          }

          return (
            <ScheduleItem key={index} isCurrent={isCurrent}>
              <TimeSlot isCurrent={isCurrent}>
                <div className="time-label">{timeSlot.label}</div>
                <div className="time-range">{timeSlot.range}</div>
              </TimeSlot>
              <SubjectInfo isCurrent={isCurrent}>
                <div className="subject-name">{subject}</div>
                <div className="subject-details">
                  <BookIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                  Classroom {Math.floor(Math.random() * 20) + 1}
                </div>
              </SubjectInfo>
              <StatusChip 
                label={status === 'completed' ? 'Done' : status === 'current' ? 'Now' : 'Next'} 
                isCurrent={isCurrent}
                status={status}
                size="small"
              />
            </ScheduleItem>
          );
        })}
      </Box>

      {/* Summary */}
      <Box sx={{ mt: 2, p: 1.5, background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', borderRadius: 2 }}>
        <Typography variant="caption" sx={{ color: '#64748b', textAlign: 'center' }}>
          <strong>{todaySchedule.filter(subject => subject && subject !== 'Lunch Break').length}</strong> classes today • 
          <strong> {todaySchedule.filter(subject => subject === 'Lunch Break').length}</strong> break periods
        </Typography>
      </Box>
    </Box>
  );
};

export default StudentSchedule; 
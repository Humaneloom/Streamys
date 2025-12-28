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
  Book as BookIcon,
  Group as GroupIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

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

const TeacherDailySchedule = ({ schedule }) => {
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

  // Sample teacher schedule data - in real app, this would come from props
  const sampleTeacherSchedule = {
    'Monday': ['Class 4A - Physics', 'Class 3B - Physics', 'Class 2B - Physics', 'Class 5A - Physics', 'Lunch Break', 'Class 6C - Free Period', 'Class 2B - Physics', 'Free Period'],
    'Tuesday': ['Class 1A - Chemistry', 'Class 2B - Physics', 'Class 3A - Physics', 'Class 5B - Physics', 'Lunch Break', 'Free Period', 'Class 1A - Physics', 'Free Period'],
    'Wednesday': ['Class 4A - Chemistry', 'Class 6A - Physics', 'Class 2B - Physics', 'Class 5C - Physics', 'Lunch Break', 'Class 3C - Chemistry', 'Class 4A - Chemistry', 'Free Period'],
    'Thursday': ['Class 1A - Chemistry', 'Class 3B - Physics', 'Class 2B - Physics', 'Class 5C - Physics', 'Lunch Break', 'Class 6A - Chemistry', 'Class 6B - Chemistry', 'Free Period'],
    'Friday': ['Class 4A - Chemistry', 'Class 3B - Physics', 'Class 6B - Chemistry', 'Class 6A - Physics', 'Lunch Break', 'Class 6A - Chemistry', 'Class 6B - Chemistry', 'Free Period'],
  };

  const todaySchedule = schedule?.[currentDay] || sampleTeacherSchedule[currentDay] || Array(8).fill('Free Period');

  if (!todaySchedule || todaySchedule.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <ScheduleIcon sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#667eea', mb: 1 }}>
          No Classes Today
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          You have no classes scheduled for today.
        </Typography>
      </Box>
    );
  }

  const completedClasses = todaySchedule.filter((cls, index) => 
    cls && cls !== 'Lunch Break' && cls !== 'Free Period' && index < currentSlot
  ).length;

  const upcomingClasses = todaySchedule.filter((cls, index) => 
    cls && cls !== 'Lunch Break' && cls !== 'Free Period' && index > currentSlot
  ).length;

  const getScheduleItemStyle = (isCurrent, isCompleted) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    marginBottom: '8px',
    borderRadius: '12px',
    background: isCurrent 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
      : isCompleted
      ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    border: isCurrent 
      ? '2px solid rgba(102, 126, 234, 0.3)' 
      : isCompleted
      ? '1px solid rgba(0,0,0,0.08)'
      : '1px solid rgba(245, 158, 11, 0.3)',
    boxShadow: isCurrent 
      ? '0 4px 20px rgba(102, 126, 234, 0.2)' 
      : '0 2px 8px rgba(0,0,0,0.04)',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
  });

  const getTimeSlotStyle = (isCurrent, isCompleted) => ({
    minWidth: '80px',
    textAlign: 'center',
    marginRight: '16px',
  });

  const getClassInfoStyle = () => ({
    flex: 1,
  });

  const getStatusChipStyle = (isCurrent, isCompleted, status) => ({
    fontSize: '0.75rem',
    fontWeight: 600,
    height: '24px',
    background: isCurrent 
      ? 'rgba(255,255,255,0.2)' 
      : isCompleted
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : status === 'upcoming'
      ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    border: 'none',
  });

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ScheduleIcon sx={{ fontSize: 24, color: '#667eea', mr: 1 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
            Today's Schedule
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            {currentDay}'s Schedule • {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Typography>
        </Box>
      </Box>

      {/* Schedule Items */}
      <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
        {TIMES.map((timeSlot, index) => {
          const classInfo = todaySchedule[index];
          const isCurrent = index === currentSlot;
          const isCompleted = index < currentSlot;
          const status = getStatus(index);
          
          if (!classInfo || classInfo === 'Lunch Break') {
            return (
              <Box key={index} sx={getScheduleItemStyle(isCurrent, isCompleted)}>
                <Box sx={getTimeSlotStyle(isCurrent, isCompleted)}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: isCurrent ? '#ffffff' : isCompleted ? '#64748b' : '#d97706',
                      marginBottom: '2px',
                    }}
                  >
                    {timeSlot.label}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: '0.7rem',
                      color: isCurrent ? 'rgba(255,255,255,0.8)' : '#94a3b8',
                    }}
                  >
                    {timeSlot.range}
                  </Typography>
                </Box>
                <Box sx={getClassInfoStyle()}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: isCurrent ? '#ffffff' : isCompleted ? '#64748b' : '#1e293b',
                      marginBottom: '4px',
                    }}
                  >
                    {classInfo === 'Lunch Break' ? 'Lunch Break' : 'Free Period'}
                  </Typography>
                  <Box sx={{ 
                    fontSize: '0.8rem',
                    color: isCurrent ? 'rgba(255,255,255,0.8)' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <AccessTimeIcon sx={{ fontSize: 14 }} />
                    {classInfo === 'Lunch Break' ? 'Enjoy your meal!' : 'No class scheduled'}
                  </Box>
                </Box>
                <Chip 
                  label={classInfo === 'Lunch Break' ? 'Break' : 'Free'} 
                  size="small"
                  sx={getStatusChipStyle(isCurrent, isCompleted, status)}
                />
              </Box>
            );
          }

          // Parse class information
          const classMatch = classInfo.match(/Class (\w+) - (.+)/);
          const className = classMatch ? classMatch[1] : 'Unknown Class';
          const subject = classMatch ? classMatch[2] : classInfo;

          return (
            <Box key={index} sx={getScheduleItemStyle(isCurrent, isCompleted)}>
              <Box sx={getTimeSlotStyle(isCurrent, isCompleted)}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: isCurrent ? '#ffffff' : isCompleted ? '#64748b' : '#d97706',
                    marginBottom: '2px',
                  }}
                >
                  {timeSlot.label}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: '0.7rem',
                    color: isCurrent ? 'rgba(255,255,255,0.8)' : '#94a3b8',
                  }}
                >
                  {timeSlot.range}
                </Typography>
              </Box>
              <Box sx={getClassInfoStyle()}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: isCurrent ? '#ffffff' : isCompleted ? '#64748b' : '#1e293b',
                    marginBottom: '4px',
                  }}
                >
                  {className} - {subject}
                </Typography>
                <Box sx={{ 
                  fontSize: '0.8rem',
                  color: isCurrent ? 'rgba(255,255,255,0.8)' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <GroupIcon sx={{ fontSize: 14 }} />
                  <span>Class {className}</span>
                  <BookIcon sx={{ fontSize: 14 }} />
                  <span>{subject}</span>
                  <SchoolIcon sx={{ fontSize: 14 }} />
                  <span>Room {Math.floor(Math.random() * 20) + 1}</span>
                </Box>
              </Box>
              <Chip 
                label={status === 'completed' ? 'Done' : status === 'current' ? 'Now' : 'Next'} 
                size="small"
                sx={getStatusChipStyle(isCurrent, isCompleted, status)}
              />
            </Box>
          );
        })}
      </Box>

      {/* Summary */}
      <Box sx={{ 
        mt: 3, 
        p: 2, 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
        borderRadius: 2,
        border: '1px solid rgba(0,0,0,0.08)'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
            Today's Summary
          </Typography>
          <CheckCircleIcon sx={{ fontSize: 16, color: '#10b981' }} />
        </Box>
        <Typography variant="caption" sx={{ color: '#64748b' }}>
          <strong>{completedClasses}</strong> classes completed • 
          <strong> {upcomingClasses}</strong> classes remaining • 
          <strong> {todaySchedule.filter(cls => cls === 'Lunch Break').length}</strong> break periods
        </Typography>
      </Box>
    </Box>
  );
};

export default TeacherDailySchedule; 
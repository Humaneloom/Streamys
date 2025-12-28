import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  Book as BookIcon
} from '@mui/icons-material';

const TeacherQuickStats = ({ currentUser, sclassStudents, subjectDetails }) => {
  const navigate = useNavigate();


  const performanceMetrics = {
    attendanceRate: 94,
    assignmentCompletion: 87,
    studentSatisfaction: 92,
    classParticipation: 89
  };



  const statCardStyle = {
    padding: '16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    border: '1px solid rgba(0,0,0,0.08)',
    marginBottom: '12px',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
  };

  const progressBarStyle = (color) => ({
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    '& .MuiLinearProgress-bar': {
      borderRadius: 4,
      background: color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }
  });

  // Navigation handlers for quick actions
  const handleMarkAttendance = () => {
    if (currentUser?.teachSclass?._id) {
      navigate(`/Teacher/class/mark-attendance/${currentUser.teachSclass._id}`);
    } else {
      navigate('/Teacher/class');
    }
  };

  const handleGradePapers = () => {
    navigate('/Teacher/assessment');
  };

  const handleStudentList = () => {
    if (currentUser?.teachSclass?._id) {
      navigate(`/Teacher/class/${currentUser.teachSclass._id}`);
    } else {
      navigate('/Teacher/class');
    }
  };

  const handleViewSchedule = () => {
    navigate('/Teacher/schedule-edit');
  };

  return (
    <Box>
      {/* Teacher Profile Summary */}
      <Box sx={statCardStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ 
              width: 56, 
              height: 56, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              mr: 2
            }}
          >
            {currentUser?.name?.charAt(0) || 'T'}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
              {currentUser?.name || 'Teacher Name'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              {currentUser?.teachSubject?.subName || 'Subject'} Teacher
            </Typography>
            <Chip 
              label="Active" 
              size="small" 
              sx={{ 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontSize: '0.7rem',
                mt: 0.5
              }} 
            />
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
              {sclassStudents?.length || 0}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Students
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
              {subjectDetails?.sessions || 0}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Sessions
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
              4.8
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Rating
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Performance Metrics */}
      <Box sx={statCardStyle}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
          Performance Overview
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Attendance Rate
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
              {performanceMetrics.attendanceRate}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={performanceMetrics.attendanceRate} 
            sx={progressBarStyle('#10b981')}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Assignment Completion
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
              {performanceMetrics.assignmentCompletion}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={performanceMetrics.assignmentCompletion} 
            sx={progressBarStyle('#667eea')}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Student Satisfaction
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
              {performanceMetrics.studentSatisfaction}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={performanceMetrics.studentSatisfaction} 
            sx={progressBarStyle('#f59e0b')}
          />
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Class Participation
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
              {performanceMetrics.classParticipation}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={performanceMetrics.classParticipation} 
            sx={progressBarStyle('#8b5cf6')}
          />
        </Box>
      </Box>

      

      {/* Quick Actions */}
      <Box sx={statCardStyle}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
          Quick Actions
        </Typography>
        
                 <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
           <Chip 
             icon={<AssignmentIcon />}
             label="Mark Attendance" 
             onClick={handleMarkAttendance}
             sx={{ 
               background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
               color: 'white',
               cursor: 'pointer',
               '&:hover': { opacity: 0.9 }
             }} 
           />
           <Chip 
             icon={<BookIcon />}
             label="Grade Papers" 
             onClick={handleGradePapers}
             sx={{ 
               background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
               color: 'white',
               cursor: 'pointer',
               '&:hover': { opacity: 0.9 }
             }} 
           />
           <Chip 
             icon={<GroupIcon />}
             label="Student List" 
             onClick={handleStudentList}
             sx={{ 
               background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
               color: 'white',
               cursor: 'pointer',
               '&:hover': { opacity: 0.9 }
             }} 
           />
           <Chip 
             icon={<ScheduleIcon />}
             label="View Schedule" 
             onClick={handleViewSchedule}
             sx={{ 
               background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
               color: 'white',
               cursor: 'pointer',
               '&:hover': { opacity: 0.9 }
             }} 
           />
         </Box>
      </Box>
    </Box>
  );
};

export default TeacherQuickStats; 
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Fade,
  Grow
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

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

const sampleSchedule = {
  'Monday': [
    { timeIdx: 0, class: '4A', subject: 'Physics', color: '#e3f2fd' },
    { timeIdx: 1, class: '3B', subject: 'Physics', color: '#fffde7' },
    { timeIdx: 2, class: '2B', subject: 'Physics', color: '#e3f2fd' },
    { timeIdx: 3, class: '5A', subject: 'Physics', color: '#fce4ec' },
    { timeIdx: 5, class: '6C', subject: '', color: '#e3f2fd' },
    { timeIdx: 6, class: '2B', subject: 'Physics', color: '#e3f2fd' },
  ],
  'Tuesday': [
    { timeIdx: 0, class: '1A', subject: 'Chemistry', color: '#e1f5fe' },
    { timeIdx: 1, class: '2B', subject: 'Physics', color: '#e3f2fd' },
    { timeIdx: 2, class: '3A', subject: 'Physics', color: '#fffde7' },
    { timeIdx: 3, class: '5B', subject: 'Physics', color: '#fce4ec' },
    { timeIdx: 6, class: '1A', subject: 'Physics', color: '#e3f2fd' },
  ],
  'Wednesday': [
    { timeIdx: 0, class: '4A', subject: 'Chemistry', color: '#e1f5fe' },
    { timeIdx: 1, class: '6A', subject: 'Physics', color: '#e3f2fd' },
    { timeIdx: 2, class: '2B', subject: 'Physics', color: '#e3f2fd' },
    { timeIdx: 3, class: '5C', subject: 'Physics', color: '#fce4ec' },
    { timeIdx: 5, class: '3C', subject: 'Chemistry', color: '#e1f5fe' },
    { timeIdx: 6, class: '4A', subject: 'Chemistry', color: '#e1f5fe' },
  ],
  'Thursday': [
    { timeIdx: 0, class: '1A', subject: 'Chemistry', color: '#e1f5fe' },
    { timeIdx: 1, class: '3B', subject: 'Physics', color: '#fffde7' },
    { timeIdx: 2, class: '2B', subject: 'Physics', color: '#e3f2fd' },
    { timeIdx: 3, class: '5C', subject: 'Physics', color: '#fce4ec' },
    { timeIdx: 5, class: '6A', subject: 'Chemistry', color: '#e1f5fe' },
    { timeIdx: 6, class: '6B', subject: 'Chemistry', color: '#e1f5fe' },
  ],
  'Friday': [
    { timeIdx: 0, class: '4A', subject: 'Chemistry', color: '#e1f5fe' },
    { timeIdx: 1, class: '3B', subject: 'Physics', color: '#fffde7' },
    { timeIdx: 2, class: '6B', subject: 'Chemistry', color: '#e1f5fe' },
    { timeIdx: 3, class: '6A', subject: 'Physics', color: '#e3f2fd' },
    { timeIdx: 5, class: '6A', subject: 'Chemistry', color: '#e1f5fe' },
    { timeIdx: 6, class: '6B', subject: 'Chemistry', color: '#e1f5fe' },
  ],
};

function getCurrentWeekRangeLabel() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
  // Calculate Monday
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  // Calculate Friday
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  // Format as e.g. July 22 – 26, 2024
  const options = { month: 'long', day: 'numeric' };
  const year = friday.getFullYear();
  return `${monday.toLocaleDateString(undefined, options)} – ${friday.getDate()}, ${year}`;
}

const TeacherSchedule = ({ editable = false, schedule, onEdit, dateRangeLabel }) => {
  // If schedule is provided, always use it for rendering (dashboard and edit)
  const isEditable = editable && schedule && onEdit;
  const edit = isEditable ? onEdit.edit : {};
  const handleCellClick = isEditable ? onEdit.handleCellClick : undefined;
  const handleEditChange = isEditable ? onEdit.handleEditChange : undefined;
  const handleEditSave = isEditable ? onEdit.handleEditSave : undefined;
  const handleEditClose = isEditable ? onEdit.handleEditClose : undefined;

  const weekLabel = dateRangeLabel || getCurrentWeekRangeLabel();

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ScheduleIcon sx={{ fontSize: 32, color: '#667eea' }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#667eea' }}>
              Weekly Schedule
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {weekLabel}
            </Typography>
          </Box>
        </Box>
        {isEditable && (
          <Chip 
            icon={<EditIcon />} 
            label="Edit Mode" 
            color="primary" 
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        )}
      </Box>
      
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
                  if (schedule && schedule[day]) {
                    // Unified rendering for both dashboard and edit
                    if (isEditable && !(slot.label === '12:00 PM' || slot.label === '3:00 PM')) {
                      const isEditing = edit.open && edit.day === day && edit.timeIdx === timeIdx;
                      return (
                        <Td
                          key={day + timeIdx}
                          onClick={() => handleCellClick(day, timeIdx)}
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
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 2,
                                      background: '#fff'
                                    }
                                  }}
                                />
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
                                      <CancelIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Stack>
                            </Fade>
                          ) : (
                            <Grow in timeout={300}>
                              <CardBox isEditing={false}>
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
                    } else if (slot.label === '12:00 PM') {
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
                      // Read-only mode, unified
                      return (
                        <Td key={day + timeIdx}>
                          <CardBox isEditing={false}>
                            <Typography variant="caption" sx={{ color: '#888', fontWeight: 500, display: 'block', mb: 0.5 }}>
                              {slot.range}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                              {schedule[day][timeIdx]}
                            </Typography>
                          </CardBox>
                        </Td>
                      );
                    }
                  } else {
                    // Fallback to sampleSchedule if no schedule prop
                    const getCards = (sampleSchedule[day] || []).filter(card => card.timeIdx === timeIdx);
                    return (
                      <Td key={day + timeIdx}>
                        {getCards.length > 0 ? (
                          getCards.map((card, idx) => (
                            <CardBox key={idx} bgcolor={card.color} isEditing={false}>
                              <Typography variant="caption" sx={{ color: '#888', fontWeight: 500, display: 'block', mb: 0.5 }}>
                                {slot.range}
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                                {card.class} - {card.subject}
                              </Typography>
                            </CardBox>
                          ))
                        ) : null}
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
  );
};

export default TeacherSchedule; 
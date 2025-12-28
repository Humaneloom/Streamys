import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Snackbar,
    CircularProgress,
    Container
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

// Helper function to format time for display
const formatTimeForDisplay = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
};

const AddExamTimetable = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    
    const [title, setTitle] = useState('');
    const [examDate, setExamDate] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleAddSubject = () => {
        setSubjects([
            ...subjects,
            {
                subjectName: '',
                examTime: '',
                examDate: '',
                customTime: ''
            }
        ]);
    };

    const handleRemoveSubject = (index) => {
        const newSubjects = subjects.filter((_, i) => i !== index);
        setSubjects(newSubjects);
    };

    const handleSubjectChange = (index, field, value) => {
        const newSubjects = [...subjects];
        newSubjects[index][field] = value;
        setSubjects(newSubjects);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title || !examDate || subjects.length === 0) {
            setSnackbar({
                open: true,
                message: 'Please fill all required fields and add at least one subject',
                severity: 'error'
            });
            return;
        }

        // Validate subjects
        for (const subject of subjects) {
            if (!subject.subjectName || !subject.examDate) {
                setSnackbar({
                    open: true,
                    message: 'Please fill all subject details',
                    severity: 'error'
                });
                return;
            }
            
            // Check if exam time is selected
            if (!subject.examTime || (subject.examTime === 'custom' && !subject.customTime)) {
                setSnackbar({
                    open: true,
                    message: 'Please select exam time for all subjects',
                    severity: 'error'
                });
                return;
            }
        }

        setLoading(true);
        try {
            // Prepare subjects data with proper time handling
            const processedSubjects = subjects.map(subject => ({
                subjectName: subject.subjectName,
                examTime: subject.examTime === 'custom' ? subject.customTime : subject.examTime,
                examDate: subject.examDate
            }));

            const examTimetableData = {
                title,
                classId: currentUser.teachSclass._id,
                examDate,
                subjects: processedSubjects,
                schoolId: currentUser._id
            };

            await axios.post(`${process.env.REACT_APP_BASE_URL}/ExamTimetable`, examTimetableData);
            
            setSnackbar({
                open: true,
                message: 'Exam timetable created successfully!',
                severity: 'success'
            });

            // Navigate back after a short delay
            setTimeout(() => {
                navigate('/Teacher/exam-timetables');
            }, 2000);

        } catch (error) {
            console.error('Error creating exam timetable:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Error creating exam timetable',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/Teacher/exam-timetables')}
                    sx={{
                        color: '#64748b',
                        mb: 2,
                        '&:hover': {
                            backgroundColor: 'rgba(100, 116, 139, 0.1)',
                        }
                    }}
                >
                    Back to Exam Timetables
                </Button>
                
                <Typography 
                    variant="h3" 
                    sx={{ 
                        fontWeight: 800, 
                        mb: 2,
                        background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    Create Exam Timetable
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
                    Add exam schedule for your class: {currentUser.teachSclass?.sclassName} - {currentUser.teachSclass?.section}
                </Typography>
            </Box>

            <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 4 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Basic Information */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Timetable Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Mid-Term Exam Timetable"
                                    required
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Overall Exam Date"
                                    value={examDate}
                                    onChange={(e) => setExamDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>
                        </Grid>

                        {/* Subjects Section */}
                        <Box sx={{ mt: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                    Exam Subjects
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={handleAddSubject}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Add Subject
                                </Button>
                            </Box>

                            {subjects.length === 0 ? (
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    Click "Add Subject" to start adding exam subjects
                                </Alert>
                            ) : (
                                <>
                                    <Alert severity="info" sx={{ mb: 2 }}>
                                        💡 <strong>Time Selection Tip:</strong> Choose from common exam times in the dropdown, or select "Custom Time" for specific times.
                                    </Alert>
                                    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                                                    <TableCell sx={{ fontWeight: 700 }}>Subject Name</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>Exam Date</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>Exam Time (Select from dropdown)</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {subjects.map((subject, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            <TextField
                                                                fullWidth
                                                                size="small"
                                                                label="Subject Name"
                                                                value={subject.subjectName}
                                                                onChange={(e) => handleSubjectChange(index, 'subjectName', e.target.value)}
                                                                placeholder="e.g., Mathematics"
                                                                required
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                fullWidth
                                                                size="small"
                                                                type="date"
                                                                label="Exam Date"
                                                                value={subject.examDate}
                                                                onChange={(e) => handleSubjectChange(index, 'examDate', e.target.value)}
                                                                InputLabelProps={{ shrink: true }}
                                                                required
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <FormControl fullWidth size="small" required>
                                                                <InputLabel>Exam Time</InputLabel>
                                                                <Select
                                                                    value={subject.examTime}
                                                                    onChange={(e) => handleSubjectChange(index, 'examTime', e.target.value)}
                                                                    label="Exam Time"
                                                                >
                                                                    <MenuItem value="09:00">9:00 AM</MenuItem>
                                                                    <MenuItem value="09:30">9:30 AM</MenuItem>
                                                                    <MenuItem value="10:00">10:00 AM</MenuItem>
                                                                    <MenuItem value="10:30">10:30 AM</MenuItem>
                                                                    <MenuItem value="11:00">11:00 AM</MenuItem>
                                                                    <MenuItem value="11:30">11:30 AM</MenuItem>
                                                                    <MenuItem value="12:00">12:00 PM</MenuItem>
                                                                    <MenuItem value="12:30">12:30 PM</MenuItem>
                                                                    <MenuItem value="13:00">1:00 PM</MenuItem>
                                                                    <MenuItem value="13:30">1:30 PM</MenuItem>
                                                                    <MenuItem value="14:00">2:00 PM</MenuItem>
                                                                    <MenuItem value="14:30">2:30 PM</MenuItem>
                                                                    <MenuItem value="15:00">3:00 PM</MenuItem>
                                                                    <MenuItem value="15:30">3:30 PM</MenuItem>
                                                                    <MenuItem value="16:00">4:00 PM</MenuItem>
                                                                    <MenuItem value="16:30">4:30 PM</MenuItem>
                                                                    <MenuItem value="17:00">5:00 PM</MenuItem>
                                                                    <MenuItem value="17:30">5:30 PM</MenuItem>
                                                                    <MenuItem value="18:00">6:00 PM</MenuItem>
                                                                    <MenuItem value="custom">Custom Time</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                            {subject.examTime === 'custom' && (
                                                                <TextField
                                                                    fullWidth
                                                                    size="small"
                                                                    type="time"
                                                                    label="Custom Time"
                                                                    value={subject.customTime || ''}
                                                                    onChange={(e) => handleSubjectChange(index, 'customTime', e.target.value)}
                                                                    InputLabelProps={{ shrink: true }}
                                                                    sx={{ mt: 1 }}
                                                                    required
                                                                />
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <IconButton
                                                                color="error"
                                                                onClick={() => handleRemoveSubject(index)}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </>
                            )}
                        </Box>

                        {/* Submit Button */}
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                disabled={loading}
                                sx={{
                                    background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 2,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)'
                                    }
                                }}
                            >
                                {loading ? 'Creating...' : 'Create Exam Timetable'}
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AddExamTimetable; 
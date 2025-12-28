import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";
import { 
    Box, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    Button, 
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Container,
    Alert,
    Snackbar,
    CircularProgress,
    Divider
} from '@mui/material';
import { 
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    CalendarToday as CalendarIcon,
    School as SchoolIcon,
    People as PeopleIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    Close as CloseIcon
} from '@mui/icons-material';

const TeacherMarkAttendance = () => {
    const navigate = useNavigate();
    const { classId } = useParams();
    const dispatch = useDispatch();
    const { sclassStudents, loading, error } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector((state) => state.user);
    const subjectID = currentUser.teachSubject?._id;

    // State for form controls
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState({});
    const [notes, setNotes] = useState({});
    const [isHoliday, setIsHoliday] = useState(false);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Get class details
    const className = currentUser.teachSclass?.sclassName || 'Class';
    const sectionName = currentUser.teachSclass?.section || 'Section';

    useEffect(() => {
        if (classId) {
            dispatch(getClassStudents(classId));
            setSelectedClass(className);
            setSelectedSection(sectionName);
        }
    }, [dispatch, classId, className, sectionName]);

    // Initialize attendance data when students are loaded
    useEffect(() => {
        if (sclassStudents && sclassStudents.length > 0) {
            const initialAttendance = {};
            const initialNotes = {};
            sclassStudents.forEach(student => {
                initialAttendance[student._id] = 'present'; // Default to present
                initialNotes[student._id] = '';
            });
            setAttendanceData(initialAttendance);
            setNotes(initialNotes);
        }
    }, [sclassStudents]);

    const handleAttendanceChange = (studentId, value) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: value
        }));
    };

    const handleNoteChange = (studentId, value) => {
        setNotes(prev => ({
            ...prev,
            [studentId]: value
        }));
    };

    const handleSaveAttendance = async () => {
        setSaving(true);
        try {
            // Use the teacher's assigned class ID instead of URL parameter
            const teacherClassId = currentUser.teachSclass?._id;
            
            console.log('Teacher class ID:', teacherClassId);
            console.log('URL class ID:', classId);
            console.log('Students loaded:', sclassStudents?.length);
            
            // Prepare attendance data for bulk save
            const attendancePayload = {
                classId: teacherClassId, // Use teacher's assigned class
                subjectId: subjectID,
                date: attendanceDate,
                attendanceData: Object.keys(attendanceData).map(studentId => ({
                    studentId: studentId,
                    status: attendanceData[studentId],
                    note: notes[studentId] || ''
                }))
            };

            console.log('Attendance payload:', attendancePayload);

            // Use the new bulk attendance API
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/MarkBulkAttendanceForClass`, attendancePayload);
            
            console.log('Bulk attendance response:', response.data);
            
            const { successCount, errorCount, totalStudents } = response.data;

            if (errorCount === 0) {
                setSnackbar({
                    open: true,
                    message: `Attendance saved successfully for all ${successCount} students!`,
                    severity: 'success'
                });

                // Navigate back after a short delay
                setTimeout(() => {
                    navigate(`/Teacher/class/${classId}`);
                }, 2000);
            } else {
                setSnackbar({
                    open: true,
                    message: `Attendance saved for ${successCount} students. ${errorCount} failed.`,
                    severity: 'warning'
                });
            }

        } catch (error) {
            console.error('Error saving attendance:', error);
            setSnackbar({
                open: true,
                message: 'Error saving attendance. Please try again.',
                severity: 'error'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const getAttendanceStats = () => {
        if (!sclassStudents) return { present: 0, absent: 0, late: 0, halfDay: 0 };
        
        const stats = { present: 0, absent: 0, late: 0, halfDay: 0 };
        Object.values(attendanceData).forEach(status => {
            if (stats.hasOwnProperty(status)) {
                stats[status]++;
            }
        });
        return stats;
    };

    const stats = getAttendanceStats();

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress size={60} />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(`/Teacher/class/${classId}`)}
                    sx={{
                        color: '#64748b',
                        mb: 2,
                        '&:hover': {
                            backgroundColor: 'rgba(100, 116, 139, 0.1)',
                        }
                    }}
                >
                    Back to Class
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
                    Mark Attendance
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
                    {className} • {currentUser.teachSubject?.subName}
                </Typography>
            </Box>

            {/* Select Criteria Section */}
            <Card sx={{ mb: 4, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
                        Select Criteria
                    </Typography>
                    
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Class</InputLabel>
                                <Select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    label="Class"
                                >
                                    <MenuItem value={className}>{className}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Section</InputLabel>
                                <Select
                                    value={selectedSection}
                                    onChange={(e) => setSelectedSection(e.target.value)}
                                    label="Section"
                                >
                                    <MenuItem value={sectionName}>{sectionName}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Attendance Date"
                                value={attendanceDate}
                                onChange={(e) => setAttendanceDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={3}>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    py: 1.5,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                                    }
                                }}
                            >
                                Search
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Attendance Statistics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                        color: 'white',
                        borderRadius: 4
                    }}>
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <CheckCircleIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {stats.present}
                            </Typography>
                            <Typography variant="body1">Present</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                        color: 'white',
                        borderRadius: 4
                    }}>
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <CloseIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {stats.absent}
                            </Typography>
                            <Typography variant="body1">Absent</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                        color: 'white',
                        borderRadius: 4
                    }}>
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <ScheduleIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {stats.late}
                            </Typography>
                            <Typography variant="body1">Late</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                        color: 'white',
                        borderRadius: 4
                    }}>
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <PeopleIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {stats.halfDay}
                            </Typography>
                            <Typography variant="body1">Half Day</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Student List Section */}
            <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                            Student List
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                color="warning"
                                onClick={() => setIsHoliday(!isHoliday)}
                                sx={{ borderRadius: 2 }}
                            >
                                Mark As Holiday
                            </Button>
                            
                            <Button
                                variant="contained"
                                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                onClick={handleSaveAttendance}
                                disabled={saving}
                                sx={{
                                    background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                                    borderRadius: 2,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)'
                                    }
                                }}
                            >
                                {saving ? 'Saving...' : 'Save Attendance'}
                            </Button>
                        </Box>
                    </Box>

                    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                                    <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Admission No</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Roll Number</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Attendance</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Note</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sclassStudents?.map((student, index) => (
                                    <TableRow key={student._id} sx={{ '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' } }}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{student._id.slice(-4)}</TableCell>
                                        <TableCell>{student.rollNum}</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>{student.name}</TableCell>
                                        <TableCell>
                                            <RadioGroup
                                                row
                                                value={attendanceData[student._id] || 'present'}
                                                onChange={(e) => handleAttendanceChange(student._id, e.target.value)}
                                            >
                                                <FormControlLabel 
                                                    value="present" 
                                                    control={<Radio color="success" />} 
                                                    label="Present" 
                                                />
                                                <FormControlLabel 
                                                    value="late" 
                                                    control={<Radio color="warning" />} 
                                                    label="Late" 
                                                />
                                                <FormControlLabel 
                                                    value="absent" 
                                                    control={<Radio color="error" />} 
                                                    label="Absent" 
                                                />
                                                <FormControlLabel 
                                                    value="halfDay" 
                                                    control={<Radio color="secondary" />} 
                                                    label="Half Day" 
                                                />
                                            </RadioGroup>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                size="small"
                                                placeholder="Add note..."
                                                value={notes[student._id] || ''}
                                                onChange={(e) => handleNoteChange(student._id, e.target.value)}
                                                sx={{ minWidth: 150 }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
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

export default TeacherMarkAttendance; 
import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Alert,
    CircularProgress,
    LinearProgress
} from '@mui/material';
import {
    EventNote as EventNoteIcon,
    Schedule as ScheduleIcon,
    School as SchoolIcon,
    Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion } from 'framer-motion';

const StudentExamTimetables = () => {
    const { currentUser } = useSelector(state => state.user);
    const [examTimetables, setExamTimetables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExamTimetables = async () => {
            try {
                setLoading(true);
                // Get the class ID - it could be either an ObjectId or a populated object
                const classId = currentUser.sclassName?._id || currentUser.sclassName;
                console.log('Student class ID:', classId);
                console.log('Student class object:', currentUser.sclassName);
                
                // Fetch exam timetables for the student's class
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/ExamTimetables/class/${classId}`);
                console.log('Exam timetables response:', response.data);
                setExamTimetables(response.data);
            } catch (error) {
                console.error('Error fetching exam timetables:', error);
                setError('Failed to load exam timetables');
            } finally {
                setLoading(false);
            }
        };

        if (currentUser.sclassName) {
            fetchExamTimetables();
        } else {
            setLoading(false);
            setError('No class assigned to student');
        }
    }, [currentUser.sclassName]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ width: '100%', mt: 4 }}>
                    <LinearProgress />
                    <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
                        Loading exam timetables...
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Card sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 4,
                    mb: 4,
                    color: 'white'
                }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <EventNoteIcon sx={{ fontSize: 40, mr: 2 }} />
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                    Exam Timetables
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                    View your upcoming exam schedule
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Chip 
                                icon={<SchoolIcon />}
                                label={`Class: ${currentUser.sclassName?.sclassName || 'Not Assigned'}`}
                                sx={{ 
                                    background: 'rgba(255,255,255,0.2)', 
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.3)'
                                }} 
                            />
                            <Chip 
                                icon={<AssignmentIcon />}
                                label={`Total Timetables: ${examTimetables.length}`}
                                sx={{ 
                                    background: 'rgba(255,255,255,0.2)', 
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.3)'
                                }} 
                            />
                        </Box>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Exam Timetables */}
            {examTimetables.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Card sx={{ borderRadius: 4, textAlign: 'center', p: 4 }}>
                        <EventNoteIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h5" sx={{ color: 'text.secondary', mb: 2 }}>
                            No Exam Timetables Available
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                            Your exam timetables will appear here once they are published by the administration.
                        </Typography>
                    </Card>
                </motion.div>
            ) : (
                <Grid container spacing={3}>
                    {examTimetables.map((timetable, index) => (
                        <Grid item xs={12} key={timetable._id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                                    <CardContent sx={{ p: 4 }}>
                                        {/* Timetable Header */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                            <Box>
                                                <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                                                    {timetable.title}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    Overall Exam Date: {new Date(timetable.examDate).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                            <Chip 
                                                label={timetable.isActive ? 'Active' : 'Inactive'}
                                                color={timetable.isActive ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </Box>

                                        {/* Subjects Table */}
                                        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow sx={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                                                        <TableCell sx={{ fontWeight: 700 }}>Subject</TableCell>
                                                        <TableCell sx={{ fontWeight: 700 }}>Exam Date</TableCell>
                                                        <TableCell sx={{ fontWeight: 700 }}>Exam Time</TableCell>
                                                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {timetable.subjects?.map((subject, idx) => {
                                                        const examDate = new Date(subject.examDate);
                                                        const today = new Date();
                                                        const isPast = examDate < today;
                                                        const isToday = examDate.toDateString() === today.toDateString();
                                                        
                                                        return (
                                                            <TableRow key={idx} sx={{ 
                                                                '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' },
                                                                backgroundColor: isToday ? 'rgba(255, 193, 7, 0.1)' : 'inherit'
                                                            }}>
                                                                <TableCell sx={{ fontWeight: 600 }}>
                                                                    {subject.subjectName}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {examDate.toLocaleDateString()}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                        <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                                                        {subject.examTime}
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Chip 
                                                                        label={
                                                                            isPast ? 'Completed' : 
                                                                            isToday ? 'Today' : 'Upcoming'
                                                                        }
                                                                        color={
                                                                            isPast ? 'default' : 
                                                                            isToday ? 'warning' : 'primary'
                                                                        }
                                                                        size="small"
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

                                        {/* Additional Info */}
                                        <Box sx={{ mt: 3, p: 2, background: 'rgba(102, 126, 234, 0.05)', borderRadius: 2 }}>
                                            <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                                                💡 Please arrive 15 minutes before the exam time. Bring all necessary stationery and your student ID.
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default StudentExamTimetables; 
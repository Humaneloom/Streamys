import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Chip,
    Container,
    IconButton,
    Tooltip,
    Alert,
    Snackbar,
    CircularProgress,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    EventNote as EventNoteIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    Schedule as ScheduleIcon,
    School as SchoolIcon,
    Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const ShowExamTimetables = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    const [examTimetables, setExamTimetables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, timetable: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchExamTimetables();
    }, []);

    const fetchExamTimetables = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/ExamTimetables/${currentUser._id}`);
            setExamTimetables(response.data);
        } catch (error) {
            console.error('Error fetching exam timetables:', error);
            setError('Failed to load exam timetables');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (timetable) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BASE_URL}/ExamTimetable/${timetable._id}`);
            setSnackbar({
                open: true,
                message: 'Exam timetable deleted successfully!',
                severity: 'success'
            });
            fetchExamTimetables();
        } catch (error) {
            console.error('Error deleting exam timetable:', error);
            setSnackbar({
                open: true,
                message: 'Error deleting exam timetable',
                severity: 'error'
            });
        }
        setDeleteDialog({ open: false, timetable: null });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
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
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <EventNoteIcon sx={{ fontSize: 40, mr: 2 }} />
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                        Exam Timetables
                                    </Typography>
                                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                        Manage exam schedules for all classes
                                    </Typography>
                                </Box>
                            </Box>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => navigate('/Admin/exam-timetables/add')}
                                sx={{
                                    background: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    '&:hover': {
                                        background: 'rgba(255,255,255,0.3)'
                                    }
                                }}
                            >
                                Create Timetable
                            </Button>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                            <Chip 
                                icon={<AssignmentIcon />}
                                label={`Total Timetables: ${examTimetables.length}`}
                                sx={{ 
                                    background: 'rgba(255,255,255,0.2)', 
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.3)'
                                }} 
                            />
                            <Chip 
                                icon={<SchoolIcon />}
                                label={`Active: ${examTimetables.filter(t => t.isActive).length}`}
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

            {/* Exam Timetables Grid */}
            {examTimetables.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Card sx={{ borderRadius: 4, textAlign: 'center', p: 4 }}>
                        <EventNoteIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h5" sx={{ color: 'text.secondary', mb: 2 }}>
                            No Exam Timetables
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                            Create your first exam timetable to help students prepare for their exams.
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/Admin/exam-timetables/add')}
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                                }
                            }}
                        >
                            Create First Timetable
                        </Button>
                    </Card>
                </motion.div>
            ) : (
                <Grid container spacing={3}>
                    {examTimetables.map((timetable, index) => (
                        <Grid item xs={12} md={6} lg={4} key={timetable._id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card sx={{ 
                                    borderRadius: 4, 
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                                    }
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        {/* Header */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                                {timetable.title}
                                            </Typography>
                                            <Chip 
                                                label={timetable.isActive ? 'Active' : 'Inactive'}
                                                size="small"
                                                color={timetable.isActive ? 'success' : 'default'}
                                            />
                                        </Box>

                                        {/* Class Info */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <SchoolIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                {timetable.class?.sclassName} - {timetable.class?.section}
                                            </Typography>
                                        </Box>

                                        {/* Stats */}
                                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                            <Chip 
                                                label={`${timetable.subjects?.length || 0} subjects`}
                                                size="small"
                                                variant="outlined"
                                            />
                                            <Chip 
                                                label={new Date(timetable.examDate).toLocaleDateString()}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </Box>

                                        {/* Subjects Preview */}
                                        <Box sx={{ mb: 2 }}>
                                            {timetable.subjects?.slice(0, 3).map((subject, idx) => (
                                                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                        {subject.subjectName}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                                        {subject.examTime}
                                                    </Typography>
                                                </Box>
                                            ))}
                                            {timetable.subjects?.length > 3 && (
                                                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                                                    +{timetable.subjects.length - 3} more subjects
                                                </Typography>
                                            )}
                                        </Box>

                                        {/* Actions */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Tooltip title="View Details">
                                                    <IconButton 
                                                        size="small"
                                                        onClick={() => navigate(`/Admin/exam-timetables/${timetable._id}`)}
                                                        sx={{ color: 'primary.main' }}
                                                    >
                                                        <ViewIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit Timetable">
                                                    <IconButton 
                                                        size="small"
                                                        onClick={() => navigate(`/Admin/exam-timetables/edit/${timetable._id}`)}
                                                        sx={{ color: 'warning.main' }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                            <Tooltip title="Delete Timetable">
                                                <IconButton 
                                                    size="small"
                                                    onClick={() => setDeleteDialog({ open: true, timetable })}
                                                    sx={{ color: 'error.main' }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog({ open: false, timetable: null })}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        <EventNoteIcon sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                        <Typography variant="h6">Delete Exam Timetable</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ textAlign: 'center', mb: 2 }}>
                        Are you sure you want to delete the exam timetable "{deleteDialog.timetable?.title}"?
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                        This action cannot be undone. All exam schedule information will be permanently removed.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'center', gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setDeleteDialog({ open: false, timetable: null })}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(deleteDialog.timetable)}
                        startIcon={<DeleteIcon />}
                    >
                        Delete Timetable
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
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

export default ShowExamTimetables; 
import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
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
    Alert,
    Snackbar,
    CircularProgress,
    Container,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Visibility as VisibilityIcon,
    EventNote as EventNoteIcon,
    School as SchoolIcon,
    Schedule as ScheduleIcon
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

// Helper function to format date for display
const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const ShowExamTimetables = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    
    const [examTimetables, setExamTimetables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, timetable: null });

    // Fetch exam timetables for teacher's assigned class
    useEffect(() => {
        const fetchExamTimetables = async () => {
            if (!currentUser.teachSclass?._id) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/ExamTimetables/class/${currentUser.teachSclass._id}`);
                setExamTimetables(response.data);
            } catch (error) {
                console.error('Error fetching exam timetables:', error);
                setSnackbar({
                    open: true,
                    message: 'Error fetching exam timetables',
                    severity: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchExamTimetables();
    }, [currentUser.teachSclass?._id]);

    const handleDeleteClick = (timetable) => {
        setDeleteDialog({ open: true, timetable });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteDialog.timetable) return;

        try {
            await axios.delete(`${process.env.REACT_APP_BASE_URL}/ExamTimetable/${deleteDialog.timetable._id}`);
            
            setExamTimetables(prev => prev.filter(t => t._id !== deleteDialog.timetable._id));
            setSnackbar({
                open: true,
                message: 'Exam timetable deleted successfully!',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error deleting exam timetable:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Error deleting exam timetable',
                severity: 'error'
            });
        } finally {
            setDeleteDialog({ open: false, timetable: null });
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialog({ open: false, timetable: null });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <CircularProgress size={60} />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
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
                    Exam Timetables
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
                    Manage exam schedules for your class
                </Typography>
            </Box>

            {/* Class Info */}
            {currentUser.teachSclass && (
                <Card sx={{ mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <SchoolIcon sx={{ fontSize: 40, color: '#667eea' }} />
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                    {currentUser.teachSclass.sclassName} - {currentUser.teachSclass.section}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#64748b' }}>
                                    Your assigned class for exam timetable management
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Create Button */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/Teacher/exam-timetables/add')}
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
                    Create Timetable
                </Button>
            </Box>

            {/* Exam Timetables Grid */}
            {examTimetables.length === 0 ? (
                <Card sx={{ borderRadius: 3, textAlign: 'center', py: 8 }}>
                    <CardContent>
                        <EventNoteIcon sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
                        <Typography variant="h5" sx={{ color: '#64748b', mb: 2 }}>
                            No Exam Timetables Found
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#94a3b8', mb: 3 }}>
                            You haven't created any exam timetables yet. Click "Create Timetable" to get started.
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/Teacher/exam-timetables/add')}
                            sx={{ borderRadius: 2 }}
                        >
                            Create Your First Timetable
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {examTimetables.map((timetable) => (
                        <Grid item xs={12} md={6} lg={4} key={timetable._id}>
                            <Card sx={{ 
                                borderRadius: 3, 
                                height: '100%',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                                }
                            }}>
                                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    {/* Header */}
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                                            {timetable.title}
                                        </Typography>
                                        <Chip 
                                            label={timetable.isActive ? 'Active' : 'Inactive'} 
                                            color={timetable.isActive ? 'success' : 'default'}
                                            size="small"
                                            sx={{ borderRadius: 1 }}
                                        />
                                    </Box>

                                    {/* Details */}
                                    <Box sx={{ mb: 3, flex: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <ScheduleIcon sx={{ fontSize: 16, color: '#64748b', mr: 1 }} />
                                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                {formatDateForDisplay(timetable.examDate)}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                                            {timetable.subjects.length} subject{timetable.subjects.length !== 1 ? 's' : ''}
                                        </Typography>
                                    </Box>

                                    {/* Actions */}
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                        <Tooltip title="View Details">
                                            <IconButton
                                                size="small"
                                                onClick={() => navigate(`/Teacher/exam-timetables/${timetable._id}`)}
                                                sx={{ color: '#667eea' }}
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit Timetable">
                                            <IconButton
                                                size="small"
                                                onClick={() => navigate(`/Teacher/exam-timetables/edit/${timetable._id}`)}
                                                sx={{ color: '#f59e0b' }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Timetable">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteClick(timetable)}
                                                sx={{ color: '#ef4444' }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialog.open}
                onClose={handleDeleteCancel}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title" sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        Delete Exam Timetable
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ color: '#64748b', textAlign: 'center' }}>
                        Are you sure you want to delete "{deleteDialog.timetable?.title}"?
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center', mt: 1 }}>
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'center', gap: 2 }}>
                    <Button
                        onClick={handleDeleteCancel}
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        color="error"
                        sx={{ borderRadius: 2 }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

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

export default ShowExamTimetables; 
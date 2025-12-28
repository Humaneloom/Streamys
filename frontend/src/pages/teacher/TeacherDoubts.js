import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Card, CardContent, Grid, Chip, Button, 
    TextField, Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, InputLabel, Select, MenuItem, IconButton, 
    Tooltip, Avatar, Divider, Alert, CircularProgress,
    ToggleButtonGroup, ToggleButton, Badge
} from '@mui/material';
import {
    QuestionAnswer as QuestionAnswerIcon,
    Reply as ReplyIcon,
    Close as CloseIcon,
    FilterList as FilterListIcon,
    Search as SearchIcon,
    Add as AddIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    PriorityHigh as PriorityHighIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { getTeacherDoubts, answerDoubt, updateDoubtStatus, getDoubtStats, deleteDoubt } from '../../redux/doubtRelated/doubtHandle';
import Popup from '../../components/Popup';
import { PurpleButton, BlueButton } from '../../components/buttonStyles';

const StyledCard = styled(Card)(({ theme, priority }) => ({
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    border: `2px solid ${
        priority === 'urgent' ? '#ef4444' :
        priority === 'high' ? '#f59e0b' :
        priority === 'medium' ? '#3b82f6' :
        '#10b981'
    }`,
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    },
}));

const PriorityChip = styled(Chip)(({ priority }) => ({
    backgroundColor: 
        priority === 'urgent' ? '#ef4444' :
        priority === 'high' ? '#f59e0b' :
        priority === 'medium' ? '#3b82f6' :
        '#10b981',
    color: 'white',
    fontWeight: 600,
}));

const StatusChip = styled(Chip)(({ status }) => ({
    backgroundColor: 
        status === 'pending' ? '#f59e0b' :
        status === 'answered' ? '#10b981' :
        '#6b7280',
    color: 'white',
    fontWeight: 600,
}));

const TeacherDoubts = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const { doubtsList, doubtStats, loading, error, response } = useSelector((state) => state.doubt);

    const [selectedDoubt, setSelectedDoubt] = useState(null);
    const [answerDialogOpen, setAnswerDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [answer, setAnswer] = useState('');
    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all',
        subject: 'all'
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('all'); // all, pending, answered
    const [updatingStatus, setUpdatingStatus] = useState(null); // Track which doubt is being updated
    const [deletingDoubt, setDeletingDoubt] = useState(null); // Track which doubt is being deleted

    useEffect(() => {
        if (currentUser?._id) {
            console.log('Teacher Doubts: Current user ID:', currentUser._id);
            console.log('Teacher Doubts: API Base URL:', process.env.REACT_APP_BASE_URL);
            dispatch(getTeacherDoubts(currentUser._id, filters));
            dispatch(getDoubtStats(currentUser._id));
        }
    }, [dispatch, currentUser?._id, filters]);

    // Auto-reset loading state if stuck
    useEffect(() => {
        if (updatingStatus) {
            const timer = setTimeout(() => {
                console.log('Auto-resetting stuck loading state');
                setUpdatingStatus(null);
            }, 15000); // 15 seconds timeout
            
            return () => clearTimeout(timer);
        }
    }, [updatingStatus]);

    const handleAnswerSubmit = async () => {
        if (!answer.trim()) return;
        
        await dispatch(answerDoubt(selectedDoubt._id, answer));
        
        // Close dialog and reset form after a short delay to allow Redux to update
        setTimeout(() => {
            setAnswer('');
            setAnswerDialogOpen(false);
            setSelectedDoubt(null);
        }, 500);
    };

    const handleStatusUpdate = async (doubtId, newStatus) => {
        console.log('Frontend: Starting status update for doubt:', doubtId, 'to status:', newStatus);
        setUpdatingStatus(doubtId);
        
        try {
            // Add timeout protection
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timeout')), 10000)
            );
            
            console.log('Frontend: Dispatching updateDoubtStatus action');
            const resultPromise = dispatch(updateDoubtStatus(doubtId, newStatus));
            
            const result = await Promise.race([resultPromise, timeoutPromise]);
            
            console.log('Frontend: Status update completed successfully, result:', result);
            
            // Refresh the doubts list to get updated data
            console.log('Frontend: Refreshing doubts list...');
            await dispatch(getTeacherDoubts());
            
            console.log('Frontend: Doubts list refreshed successfully');
            
            // Small delay to prevent rapid clicking and show success
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            console.error('Frontend: Error updating status:', error);
            console.error('Frontend: Error details:', {
                message: error.message,
                response: error.response,
                status: error.response?.status
            });
            // Show error message to user
            alert(`Failed to update status: ${error.message}. Please try again.`);
        } finally {
            console.log('Frontend: Resetting loading state');
            setUpdatingStatus(null);
        }
    };

    const handleDeleteDoubt = async () => {
        if (!selectedDoubt) return;
        
        setDeletingDoubt(selectedDoubt._id);
        
        try {
            await dispatch(deleteDoubt(selectedDoubt._id));
            
            // Refresh the doubts list and stats
            await dispatch(getTeacherDoubts(currentUser._id, filters));
            await dispatch(getDoubtStats(currentUser._id));
            
            setDeleteDialogOpen(false);
            setSelectedDoubt(null);
        } catch (error) {
            console.error('Error deleting doubt:', error);
        } finally {
            setDeletingDoubt(null);
        }
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const filteredDoubts = doubtsList.filter(doubt => {
        const matchesSearch = doubt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             doubt.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             doubt.student?.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesViewMode = viewMode === 'all' || 
                               (viewMode === 'answered' && (doubt.status === 'answered' || doubt.status === 'closed')) ||
                               doubt.status === viewMode;
        
        return matchesSearch && matchesViewMode;
    });

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'urgent':
                return <PriorityHighIcon sx={{ color: '#ef4444' }} />;
            case 'high':
                return <PriorityHighIcon sx={{ color: '#f59e0b' }} />;
            default:
                return <ScheduleIcon sx={{ color: '#3b82f6' }} />;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'answered':
                return <CheckCircleIcon sx={{ color: '#10b981' }} />;
            case 'pending':
                return <ScheduleIcon sx={{ color: '#f59e0b' }} />;
            default:
                return <CloseIcon sx={{ color: '#6b7280' }} />;
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ 
                    fontWeight: 700, 
                    color: '#1e293b', 
                    mb: 2,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Doubts & Queries Management
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b' }}>
                    Answer student questions and manage academic queries efficiently
                </Typography>
            </Box>

            {/* Statistics Cards */}
            {doubtStats && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            borderRadius: '16px'
                        }}>
                            <CardContent>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                    {doubtStats.total}
                                </Typography>
                                <Typography variant="body2">Total Doubts</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ 
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            color: 'white',
                            borderRadius: '16px'
                        }}>
                            <CardContent>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                    {doubtStats.pending}
                                </Typography>
                                <Typography variant="body2">Pending</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ 
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            borderRadius: '16px'
                        }}>
                            <CardContent>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                    {doubtStats.answered}
                                </Typography>
                                <Typography variant="body2">Answered</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ 
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            color: 'white',
                            borderRadius: '16px'
                        }}>
                            <CardContent>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                    {Math.round((doubtStats.answered / doubtStats.total) * 100) || 0}%
                                </Typography>
                                <Typography variant="body2">Response Rate</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Filters and Search */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                    placeholder="Search doubts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: '#64748b' }} />
                    }}
                    sx={{ minWidth: 300 }}
                />
                
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={filters.status}
                        label="Status"
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="answered">Answered</MenuItem>
                        <MenuItem value="closed">Closed</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                        value={filters.priority}
                        label="Priority"
                        onChange={(e) => handleFilterChange('priority', e.target.value)}
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                        <MenuItem value="urgent">Urgent</MenuItem>
                    </Select>
                </FormControl>

                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(e, newValue) => newValue && setViewMode(newValue)}
                >
                    <ToggleButton value="all">All ({doubtsList.length})</ToggleButton>
                    <ToggleButton value="pending">Pending ({doubtsList.filter(d => d.status === 'pending').length})</ToggleButton>
                    <ToggleButton value="answered">Answered ({doubtsList.filter(d => d.status === 'answered' || d.status === 'closed').length})</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Doubts List */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {filteredDoubts.map((doubt) => (
                        <Grid item xs={12} md={6} lg={4} key={doubt._id}>
                            <StyledCard priority={doubt.priority}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {getPriorityIcon(doubt.priority)}
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                {doubt.title}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <PriorityChip 
                                                label={doubt.priority} 
                                                priority={doubt.priority}
                                                size="small"
                                            />
                                            <StatusChip 
                                                label={doubt.status === 'closed' ? 'Closed' : doubt.status} 
                                                status={doubt.status === 'closed' ? 'answered' : doubt.status}
                                                size="small"
                                            />
                                        </Box>
                                    </Box>

                                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                                        {doubt.question}
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                            {doubt.student?.name?.charAt(0)}
                                        </Avatar>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {doubt.student?.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                                            • {doubt.subject?.subName}
                                        </Typography>
                                    </Box>

                                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                                        {new Date(doubt.createdAt).toLocaleDateString()}
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                        {doubt.status === 'pending' && (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<ReplyIcon />}
                                                onClick={() => {
                                                    setSelectedDoubt(doubt);
                                                    setAnswerDialogOpen(true);
                                                }}
                                            >
                                                Answer
                                            </Button>
                                        )}
                                        
                                        {doubt.status === 'answered' && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => {
                                                    setSelectedDoubt(doubt);
                                                    setAnswerDialogOpen(true);
                                                }}
                                            >
                                                View Answer
                                            </Button>
                                        )}

                                        {/* Only show close button for pending and answered doubts, not closed ones */}
                                        {doubt.status !== 'closed' && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleStatusUpdate(doubt._id, 'closed')}
                                                disabled={updatingStatus === doubt._id || loading}
                                                startIcon={updatingStatus === doubt._id ? <CircularProgress size={16} /> : null}
                                                sx={{ 
                                                    minWidth: 80,
                                                    '&:disabled': {
                                                        opacity: 0.6
                                                    }
                                                }}
                                            >
                                                {updatingStatus === doubt._id ? 'Closing...' : 'Close'}
                                            </Button>
                                        )}
                                        
                                        {/* Show status badge for closed doubts */}
                                        {doubt.status === 'closed' && (
                                            <Chip 
                                                label="Closed" 
                                                color="default" 
                                                size="small"
                                                variant="outlined"
                                            />
                                        )}

                                        {/* Delete Button */}
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => {
                                                setSelectedDoubt(doubt);
                                                setDeleteDialogOpen(true);
                                            }}
                                            sx={{
                                                borderColor: '#ef4444',
                                                color: '#ef4444',
                                                '&:hover': {
                                                    borderColor: '#dc2626',
                                                    backgroundColor: 'rgba(239, 68, 68, 0.1)'
                                                }
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </CardContent>
                            </StyledCard>
                        </Grid>
                    ))}
                </Grid>
            )}

            {filteredDoubts.length === 0 && !loading && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <QuestionAnswerIcon sx={{ fontSize: 64, color: '#64748b', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#64748b' }}>
                        No doubts found
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        {searchTerm ? 'Try adjusting your search criteria' : 'Students will appear here when they ask questions'}
                    </Typography>
                </Box>
            )}

            {/* Answer Dialog */}
            <Dialog 
                open={answerDialogOpen} 
                onClose={() => setAnswerDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <QuestionAnswerIcon />
                        {selectedDoubt?.status === 'answered' ? 'View Answer' : 'Answer Doubt'}
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedDoubt && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                {selectedDoubt.title}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {selectedDoubt.question}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <Chip label={selectedDoubt.student?.name} size="small" />
                                <Chip label={selectedDoubt.subject?.subName} size="small" />
                                <PriorityChip label={selectedDoubt.priority} priority={selectedDoubt.priority} size="small" />
                            </Box>
                        </Box>
                    )}
                    
                    {selectedDoubt?.status !== 'answered' ? (
                        <TextField
                            fullWidth
                            multiline
                            rows={6}
                            label="Your Answer"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Provide a detailed answer to the student's question..."
                        />
                    ) : (
                        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>Answer:</Typography>
                            <Typography variant="body1">{selectedDoubt.answer}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAnswerDialogOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={handleAnswerSubmit} 
                        variant="contained" 
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                        {loading ? 'Sending...' : 'Send Answer'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog 
                open={deleteDialogOpen} 
                onClose={() => setDeleteDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ color: '#ef4444' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DeleteIcon sx={{ color: '#ef4444' }} />
                        Delete Doubt
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Are you sure you want to delete this doubt?
                    </Typography>
                    {selectedDoubt && (
                        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                {selectedDoubt.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                                {selectedDoubt.question}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip label={selectedDoubt.student?.name} size="small" />
                                <Chip label={selectedDoubt.subject?.subName} size="small" />
                                <PriorityChip label={selectedDoubt.priority} priority={selectedDoubt.priority} size="small" />
                            </Box>
                        </Box>
                    )}
                    <Typography variant="body2" sx={{ color: '#ef4444', mt: 2 }}>
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setDeleteDialogOpen(false)}
                        disabled={deletingDoubt === selectedDoubt?._id}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDeleteDoubt}
                        variant="contained"
                        color="error"
                        disabled={deletingDoubt === selectedDoubt?._id}
                        startIcon={deletingDoubt === selectedDoubt?._id ? <CircularProgress size={20} /> : <DeleteIcon />}
                    >
                        {deletingDoubt === selectedDoubt?._id ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Popup message={response} setShowPopup={() => {}} showPopup={!!response} />
        </Box>
    );
};

export default TeacherDoubts; 
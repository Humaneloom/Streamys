import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Card, CardContent, Grid, Chip, Button, 
    TextField, Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, InputLabel, Select, MenuItem, Avatar, Divider, 
    CircularProgress, ToggleButtonGroup, ToggleButton, Fab,
    Paper, Alert, IconButton, Tooltip, Badge
} from '@mui/material';
import {
    QuestionAnswer as QuestionAnswerIcon,
    Add as AddIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    PriorityHigh as PriorityHighIcon,
    Subject as SubjectIcon,
    Refresh as RefreshIcon,
    Help as HelpIcon,
    TrendingUp as TrendingUpIcon,
    Analytics as AnalyticsIcon,
    Star as StarIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
    Close as CloseIcon,
    Send as SendIcon,
    Edit as EditIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { getStudentDoubts, createDoubt } from '../../redux/doubtRelated/doubtHandle';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import Popup from '../../components/Popup';

// Styled components for modern design
const PageHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: '24px',
  padding: '32px',
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '16px',
  padding: '20px',
  color: 'white',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  }
}));

const StyledCard = styled(Card)(({ theme, priority }) => ({
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    border: `2px solid ${
        priority === 'urgent' ? '#ef4444' :
        priority === 'high' ? '#f59e0b' :
        priority === 'medium' ? '#3b82f6' :
        '#10b981'
    }`,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
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
    borderRadius: '8px',
}));

const StatusChip = styled(Chip)(({ status }) => ({
    backgroundColor: 
        status === 'pending' ? '#f59e0b' :
        status === 'answered' ? '#10b981' :
        '#6b7280',
    color: 'white',
    fontWeight: 600,
    borderRadius: '8px',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '12px',
  padding: '8px 16px',
  fontSize: '14px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
    transform: 'translateY(-2px)',
  },
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButton-root': {
    borderRadius: '12px',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    color: '#667eea',
    fontWeight: 600,
    textTransform: 'none',
    '&.Mui-selected': {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      '&:hover': {
        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
      }
    },
    '&:hover': {
      background: 'rgba(102, 126, 234, 0.1)',
    }
  }
}));

const StudentDoubts = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const { doubtsList, loading, error, response } = useSelector((state) => state.doubt);
    const { subjectsList } = useSelector((state) => state.sclass);

    const [selectedDoubt, setSelectedDoubt] = useState(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [askDialogOpen, setAskDialogOpen] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all',
        subject: 'all'
    });
    const [viewMode, setViewMode] = useState('all'); // all, pending, answered

    // Form state for asking new doubt
    const [newDoubt, setNewDoubt] = useState({
        title: '',
        question: '',
        subject: '',
        priority: 'medium',
        tags: []
    });

    useEffect(() => {
        if (currentUser?._id) {
            dispatch(getStudentDoubts(currentUser._id, filters));
        }
        if (currentUser?.sclassName?._id) {
            dispatch(getSubjectList(currentUser.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, currentUser?._id, currentUser?.sclassName?._id, filters]);

    // Auto-refresh doubts every 30 seconds
    useEffect(() => {
        if (currentUser?._id) {
            const interval = setInterval(() => {
                dispatch(getStudentDoubts(currentUser._id, filters));
            }, 30000); // 30 seconds

            return () => clearInterval(interval);
        }
    }, [dispatch, currentUser?._id, filters]);

    // Add effect to monitor response and error
    useEffect(() => {
        if (response) {
            // console.log('Doubt response:', response);
        }
        if (error) {
            // console.error('Doubt error:', error);
        }
    }, [response, error]);

    // Add effect to monitor doubts list
    useEffect(() => {
        if (doubtsList && doubtsList.length > 0) {
            // console.log('Doubts loaded:', doubtsList);
            // Check for doubts with answers
            const answeredDoubts = doubtsList.filter(doubt => doubt.answer);
            // console.log('Answered doubts:', answeredDoubts);
            
            // Debug view mode and counts
            // console.log('Current view mode:', viewMode);
            // console.log('Total doubts:', doubtsList.length);
            // console.log('Pending doubts:', doubtsList.filter(d => d.status === 'pending').length);
            // console.log('Answered doubts:', doubtsList.filter(d => d.status === 'answered').length);
            // console.log('Closed doubts:', doubtsList.filter(d => d.status === 'closed').length);
            // console.log('Answered + Closed doubts:', doubtsList.filter(d => d.status === 'answered' || d.status === 'closed').length);
        }
    }, [doubtsList, viewMode]);

    // Add effect to monitor subjects list
    useEffect(() => {
        if (subjectsList && subjectsList.length > 0) {
            // console.log('Subjects loaded:', subjectsList);
        }
    }, [subjectsList]);

    const handleAskDoubt = async () => {
        if (!newDoubt.title.trim() || !newDoubt.question.trim() || !newDoubt.subject) {
            // console.log('Form validation failed:', { title: newDoubt.title, question: newDoubt.question, subject: newDoubt.subject });
            return;
        }

        // Find the selected subject to get its teacher
        const selectedSubject = subjectsList.find(subject => subject._id === newDoubt.subject);
        // console.log('Selected subject:', selectedSubject);
        // console.log('Available subjects:', subjectsList);
        
        if (!selectedSubject || !selectedSubject.teacher) {
            // console.error('No teacher found for this subject');
            return;
        }

        const doubtData = {
            student: currentUser._id,
            teacher: selectedSubject.teacher._id,
            subject: newDoubt.subject,
            title: newDoubt.title,
            question: newDoubt.question,
            priority: newDoubt.priority,
            tags: newDoubt.tags,
            school: currentUser.school._id
        };

        // console.log('Sending doubt data:', doubtData);
        await dispatch(createDoubt(doubtData));
        
        // Close dialog and reset form after a short delay to allow Redux to update
        setTimeout(() => {
            setAskDialogOpen(false);
            setNewDoubt({
                title: '',
                question: '',
                subject: '',
                priority: 'medium',
                tags: []
            });
        }, 500);
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const filteredDoubts = doubtsList.filter(doubt => {
        const matchesViewMode = viewMode === 'all' || 
                               (viewMode === 'answered' && (doubt.status === 'answered' || doubt.status === 'closed')) ||
                               doubt.status === viewMode;
        
        // Debug logging
        if (viewMode === 'answered') {
            // console.log('Filtering doubt:', doubt.title, 'Status:', doubt.status, 'Matches:', matchesViewMode);
        }
        
        return matchesViewMode;
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
                return <ScheduleIcon sx={{ color: '#6b7280' }} />;
        }
    };

    // Calculate statistics
    const totalDoubts = doubtsList.length;
    const pendingDoubts = doubtsList.filter(d => d.status === 'pending').length;
    const answeredDoubts = doubtsList.filter(d => d.status === 'answered' || d.status === 'closed').length;
    const urgentDoubts = doubtsList.filter(d => d.priority === 'urgent').length;

    return (
        <Box sx={{ p: 3 }}>
            {/* Page Header */}
            <PageHeader>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <HelpIcon sx={{ fontSize: 120, color: '#667eea' }} />
                    </Box>
                    <Typography variant="h3" component="h1" gutterBottom sx={{ 
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        My Doubts & Queries
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                        Ask questions to your teachers and track their responses
                    </Typography>
                </motion.div>
            </PageHeader>

            {/* Statistics Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatsCard>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <QuestionAnswerIcon sx={{ fontSize: 32 }} />
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {totalDoubts}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Total Questions
                                    </Typography>
                                </Box>
                            </Box>
                        </StatsCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatsCard>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <ScheduleIcon sx={{ fontSize: 32 }} />
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {pendingDoubts}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Pending
                                    </Typography>
                                </Box>
                            </Box>
                        </StatsCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatsCard>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <CheckCircleIcon sx={{ fontSize: 32 }} />
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {answeredDoubts}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Answered
                                    </Typography>
                                </Box>
                            </Box>
                        </StatsCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatsCard>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <WarningIcon sx={{ fontSize: 32 }} />
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {urgentDoubts}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Urgent
                                    </Typography>
                                </Box>
                            </Box>
                        </StatsCard>
                    </Grid>
                </Grid>
            </motion.div>

            {/* Filters and Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                <Paper sx={{ p: 3, mb: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 3 }}>
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

                        <Box sx={{ flexGrow: 1 }} />

                        <ActionButton
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setAskDialogOpen(true)}
                        >
                            Ask New Question
                        </ActionButton>
                    </Box>

                    {/* View Mode Toggle */}
                    <StyledToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={(e, newMode) => {
                            if (newMode !== null) {
                                setViewMode(newMode);
                            }
                        }}
                        aria-label="view mode"
                    >
                        <ToggleButton value="all" aria-label="all">
                            All ({doubtsList.length})
                        </ToggleButton>
                        <ToggleButton value="pending" aria-label="pending">
                            Pending ({doubtsList.filter(d => d.status === 'pending').length})
                        </ToggleButton>
                        <ToggleButton value="answered" aria-label="answered">
                            Answered ({doubtsList.filter(d => d.status === 'answered' || d.status === 'closed').length})
                        </ToggleButton>
                    </StyledToggleButtonGroup>
                </Paper>
            </motion.div>

            {/* Doubts List */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={60} />
                </Box>
            ) : (
                <AnimatePresence>
                    <Grid container spacing={3}>
                        {filteredDoubts.map((doubt, index) => (
                            <Grid item xs={12} md={6} lg={4} key={doubt._id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
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
                                                {doubt.question.length > 100 
                                                    ? `${doubt.question.substring(0, 100)}...` 
                                                    : doubt.question
                                                }
                                            </Typography>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                <SubjectIcon sx={{ color: '#64748b', fontSize: 16 }} />
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {doubt.subject?.subName}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                    • {doubt.teacher?.name}
                                                </Typography>
                                            </Box>

                                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                {new Date(doubt.createdAt).toLocaleDateString()}
                                            </Typography>

                                            <Divider sx={{ my: 2 }} />

                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                <ActionButton
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => {
                                                        setSelectedDoubt(doubt);
                                                        setViewDialogOpen(true);
                                                    }}
                                                >
                                                    {doubt.status === 'answered' ? 'View Answer' : 'View Details'}
                                                </ActionButton>
                                            </Box>
                                        </CardContent>
                                    </StyledCard>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </AnimatePresence>
            )}

            {filteredDoubts.length === 0 && !loading && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <QuestionAnswerIcon sx={{ fontSize: 80, color: '#64748b', mb: 3 }} />
                        <Typography variant="h5" sx={{ color: '#64748b', mb: 2, fontWeight: 600 }}>
                            No questions found
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#94a3b8', mb: 4 }}>
                            {viewMode === 'all' ? 'You haven\'t asked any questions yet' : `No ${viewMode} questions`}
                        </Typography>
                        <ActionButton
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setAskDialogOpen(true)}
                            sx={{ px: 4, py: 1.5, fontSize: '16px' }}
                        >
                            Ask Your First Question
                        </ActionButton>
                    </Box>
                </motion.div>
            )}

            {/* View Doubt Dialog */}
            <Dialog 
                open={viewDialogOpen} 
                onClose={() => setViewDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: '16px' }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <QuestionAnswerIcon sx={{ color: '#667eea' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Question Details
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedDoubt && (
                        <Box>
                            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#1e293b' }}>
                                {selectedDoubt.title}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                                {selectedDoubt.question}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                                <Chip label={selectedDoubt.subject?.subName} size="small" />
                                <Chip label={selectedDoubt.teacher?.name} size="small" />
                                <PriorityChip label={selectedDoubt.priority} priority={selectedDoubt.priority} size="small" />
                                <StatusChip label={selectedDoubt.status} status={selectedDoubt.status} size="small" />
                            </Box>
                            
                            {selectedDoubt.answer && (
                                <Box sx={{ mt: 3, p: 3, bgcolor: '#f0f9ff', borderRadius: '12px', border: '1px solid #e0f2fe' }}>
                                    <Typography variant="h6" sx={{ mb: 2, color: '#10b981', fontWeight: 600 }}>
                                        Teacher's Answer:
                                    </Typography>
                                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                        {selectedDoubt.answer}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b', mt: 2, display: 'block' }}>
                                        Answered on: {new Date(selectedDoubt.answeredAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            )}
                            
                            {!selectedDoubt.answer && selectedDoubt.status === 'answered' && (
                                <Alert severity="warning" sx={{ mt: 3, borderRadius: '12px' }}>
                                    Answer is marked as provided but content is missing. Please contact your teacher.
                                </Alert>
                            )}
                            
                            {!selectedDoubt.answer && selectedDoubt.status !== 'answered' && (
                                <Alert severity="info" sx={{ mt: 3, borderRadius: '12px' }}>
                                    No answer yet. Your teacher will respond soon.
                                </Alert>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button 
                        onClick={() => setViewDialogOpen(false)}
                        sx={{ borderRadius: '8px' }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Ask New Doubt Dialog */}
            <Dialog 
                open={askDialogOpen} 
                onClose={() => setAskDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: '16px' }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AddIcon sx={{ color: '#667eea' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Ask New Question
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Question Title"
                            value={newDoubt.title}
                            onChange={(e) => setNewDoubt(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Brief title for your question"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                        
                        <FormControl fullWidth>
                            <InputLabel>Subject</InputLabel>
                            <Select
                                value={newDoubt.subject}
                                label="Subject"
                                onChange={(e) => setNewDoubt(prev => ({ ...prev, subject: e.target.value }))}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            >
                                {subjectsList?.map((subject) => (
                                    <MenuItem key={subject._id} value={subject._id}>
                                        {subject.subName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Priority</InputLabel>
                            <Select
                                value={newDoubt.priority}
                                label="Priority"
                                onChange={(e) => setNewDoubt(prev => ({ ...prev, priority: e.target.value }))}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            >
                                <MenuItem value="low">Low</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="high">High</MenuItem>
                                <MenuItem value="urgent">Urgent</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            multiline
                            rows={6}
                            label="Your Question"
                            value={newDoubt.question}
                            onChange={(e) => setNewDoubt(prev => ({ ...prev, question: e.target.value }))}
                            placeholder="Describe your question in detail..."
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button 
                        onClick={() => setAskDialogOpen(false)}
                        sx={{ borderRadius: '8px' }}
                    >
                        Cancel
                    </Button>
                    <ActionButton
                        onClick={handleAskDoubt} 
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                    >
                        {loading ? 'Sending...' : 'Ask Question'}
                    </ActionButton>
                </DialogActions>
            </Dialog>

            <Popup message={response} setShowPopup={() => {}} showPopup={!!response} />
        </Box>
    );
};

export default StudentDoubts; 
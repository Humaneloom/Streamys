import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Card, CardContent, Grid, Chip, Button, 
    TextField, Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, InputLabel, Select, MenuItem, Avatar, Divider, 
    CircularProgress, ToggleButtonGroup, ToggleButton, List, ListItem,
    ListItemText, ListItemAvatar, Fab, Paper, IconButton, Tooltip,
    Badge, Drawer
} from '@mui/material';
import {
    Chat as ChatIcon,
    Reply as ReplyIcon,
    Message as MessageIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    Add as AddIcon,
    Send as SendIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    Close as CloseIcon,
    FilterList as FilterIcon,
    Search as SearchIcon,
    MoreVert as MoreVertIcon,
    Delete as DeleteIcon,
    Archive as ArchiveIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { getTeacherInteractions, replyToInteraction, updateInteractionStatus, getInteractionStats, getConversationThread, deleteInteraction } from '../../redux/interactionRelated/interactionHandle';
import Popup from '../../components/Popup';
import { PurpleButton, BlueButton } from '../../components/buttonStyles';

// Styled components for modern chat design
const ChatContainer = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 200px)',
  display: 'flex',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    height: 'calc(100vh - 150px)',
  }
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '16px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  minHeight: '70px',
  flexShrink: 0,
}));

const ChatSidebar = styled(Box)(({ theme }) => ({
  width: '320px',
  background: 'white',
  borderRight: '1px solid #e2e8f0',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  flexShrink: 0,
  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: 'auto',
    maxHeight: '40vh',
    borderRight: 'none',
    borderBottom: '1px solid #e2e8f0',
  }
}));

const ChatMain = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  background: 'white',
  minHeight: 0, // Important for flex child scrolling
}));

const MessageBubble = styled(Box)(({ theme, isOwn }) => ({
  maxWidth: '70%',
  padding: '12px 16px',
  borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
  background: isOwn 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : '#f1f5f9',
  color: isOwn ? 'white' : '#1e293b',
  marginBottom: '8px',
  alignSelf: isOwn ? 'flex-end' : 'flex-start',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    [isOwn ? 'right' : 'left']: '-8px',
    width: 0,
    height: 0,
    border: '8px solid transparent',
    borderTopColor: isOwn 
      ? '#667eea'
      : '#f1f5f9',
    borderBottom: 'none',
  }
}));

const InteractionItem = styled(ListItem, {
  shouldForwardProp: (prop) => !['isActive', 'hasUnread'].includes(prop),
})(({ theme, isActive, hasUnread }) => ({
  padding: '12px 16px',
  borderBottom: '1px solid #f1f5f9',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: isActive ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
  borderLeft: isActive ? '4px solid #667eea' : '4px solid transparent',
  '&:hover': {
    background: 'rgba(102, 126, 234, 0.05)',
  },
  '& .MuiListItemAvatar-root': {
    minWidth: '40px',
  },
  '& .MuiListItemText-root': {
    margin: 0,
  }
}));

const StatusChip = styled(Chip)(({ status }) => ({
  backgroundColor: 
    status === 'sent' ? '#f59e0b' :
    status === 'read' ? '#3b82f6' :
    status === 'replied' ? '#10b981' :
    '#6b7280',
  color: 'white',
  fontWeight: 600,
  fontSize: '0.75rem',
}));

const TypeChip = styled(Chip)(({ type }) => ({
  backgroundColor: 
    type === 'message' ? '#3b82f6' :
    type === 'feedback' ? '#10b981' :
    type === 'consultation' ? '#f59e0b' :
    type === 'assignment_help' ? '#8b5cf6' :
    '#6b7280',
  color: 'white',
  fontWeight: 600,
  fontSize: '0.75rem',
}));

const TeacherInteractions = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const { interactionsList, conversationThread, interactionStats, loading, error, response } = useSelector((state) => state.interaction);

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [filters, setFilters] = useState({
        status: 'all',
        type: 'all',
        student: 'all'
    });
    const [viewMode, setViewMode] = useState('all');
    const [reply, setReply] = useState('');
    const [replying, setReplying] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [interactionToDelete, setInteractionToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (currentUser?._id) {
            dispatch(getTeacherInteractions(currentUser._id, filters));
            dispatch(getInteractionStats(currentUser._id));
        }
    }, [dispatch, currentUser?._id, filters]);

    useEffect(() => {
        if (selectedStudent) {
            // Get all conversation threads for the selected student
            const studentInteractions = selectedStudent.interactions;
            // For now, we'll show the latest interaction's thread
            // In a real implementation, you might want to merge all threads
            if (studentInteractions.length > 0) {
                const latestInteraction = studentInteractions[studentInteractions.length - 1];
                dispatch(getConversationThread(latestInteraction._id));
            }
        }
    }, [selectedStudent, dispatch]);

    useEffect(() => {
        scrollToBottom();
    }, [conversationThread]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleReplySubmit = async () => {
        if (!reply.trim() || !selectedStudent) return;
        
        setReplying(true);
        
        const replyData = {
            content: reply,
            sender: 'teacher'
        };
        
        try {
            // Reply to the latest interaction with this student
            const latestInteraction = selectedStudent.interactions[selectedStudent.interactions.length - 1];
            await dispatch(replyToInteraction(latestInteraction._id, replyData));
            await dispatch(getTeacherInteractions(currentUser._id, filters));
            await dispatch(getConversationThread(latestInteraction._id));
            setReply('');
        } catch (error) {
            console.error('Error replying to interaction:', error);
            alert(`Failed to send reply: ${error.message}. Please try again.`);
        } finally {
            setReplying(false);
        }
    };

    const handleDelete = async () => {
        if (!interactionToDelete) return;
        
        setDeleting(true);
        
        try {
            await dispatch(deleteInteraction(interactionToDelete._id));
            await dispatch(getTeacherInteractions(currentUser._id, filters));
            setDeleteDialogOpen(false);
            setInteractionToDelete(null);
            if (selectedStudent && selectedStudent.interactions.some(i => i._id === interactionToDelete._id)) {
                setSelectedStudent(null);
            }
        } catch (error) {
            console.error('Error deleting interaction:', error);
            alert(`Failed to delete interaction: ${error.message}. Please try again.`);
        } finally {
            setDeleting(false);
        }
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    // Group interactions by student
    const groupedInteractions = interactionsList.reduce((groups, interaction) => {
        const studentId = interaction.student?._id;
        if (!studentId) return groups;
        
        if (!groups[studentId]) {
            groups[studentId] = {
                student: interaction.student,
                interactions: [],
                latestMessage: null,
                unreadCount: 0,
                lastActivity: null
            };
        }
        
        groups[studentId].interactions.push(interaction);
        
        // Track latest message and unread count
        if (!groups[studentId].latestMessage || 
            new Date(interaction.createdAt) > new Date(groups[studentId].latestMessage.createdAt)) {
            groups[studentId].latestMessage = interaction;
        }
        
        if (interaction.status === 'sent') {
            groups[studentId].unreadCount++;
        }
        
        if (!groups[studentId].lastActivity || 
            new Date(interaction.createdAt) > new Date(groups[studentId].lastActivity)) {
            groups[studentId].lastActivity = interaction.createdAt;
        }
        
        return groups;
    }, {});

    // Convert to array and filter
    const filteredInteractions = Object.values(groupedInteractions)
        .filter(group => {
            const matchesViewMode = viewMode === 'all' || 
                group.interactions.some(interaction => interaction.status === viewMode);
            const matchesSearch = group.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 group.interactions.some(interaction => 
                                     interaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                     interaction.content.toLowerCase().includes(searchQuery.toLowerCase())
                                 );
            return matchesViewMode && matchesSearch;
        })
        .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));

    const getStatusIcon = (status) => {
        switch (status) {
            case 'replied':
                return <CheckCircleIcon sx={{ color: '#10b981', fontSize: 16 }} />;
            case 'read':
                return <MessageIcon sx={{ color: '#3b82f6', fontSize: 16 }} />;
            case 'sent':
                return <ScheduleIcon sx={{ color: '#f59e0b', fontSize: 16 }} />;
            default:
                return <ScheduleIcon sx={{ color: '#6b7280', fontSize: 16 }} />;
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'message':
                return <MessageIcon sx={{ color: '#3b82f6', fontSize: 16 }} />;
            case 'feedback':
                return <CheckCircleIcon sx={{ color: '#10b981', fontSize: 16 }} />;
            case 'consultation':
                return <ChatIcon sx={{ color: '#f59e0b', fontSize: 16 }} />;
            case 'assignment_help':
                return <SchoolIcon sx={{ color: '#8b5cf6', fontSize: 16 }} />;
            default:
                return <MessageIcon sx={{ color: '#6b7280', fontSize: 16 }} />;
        }
    };

    return (
        <Box sx={{ p: 2, height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ mb: 2, flexShrink: 0 }}>
                <Typography variant="h4" sx={{ 
                    fontWeight: 700, 
                    color: '#1e293b', 
                    mb: 1,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Student Interactions
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b' }}>
                    Chat with your students and provide timely responses
                </Typography>
            </Box>

            {/* Statistics Cards */}
            {interactionStats && (
                <Grid container spacing={2} sx={{ mb: 2, flexShrink: 0 }}>
                    <Grid item xs={6} sm={3}>
                        <Card sx={{ 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            borderRadius: '12px'
                        }}>
                            <CardContent sx={{ p: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {interactionStats.total}
                                </Typography>
                                <Typography variant="caption">Total</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Card sx={{ 
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            color: 'white',
                            borderRadius: '12px'
                        }}>
                            <CardContent sx={{ p: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {interactionStats.received}
                                </Typography>
                                <Typography variant="caption">Received</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Card sx={{ 
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            borderRadius: '12px'
                        }}>
                            <CardContent sx={{ p: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {interactionStats.replied}
                                </Typography>
                                <Typography variant="caption">Replied</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Card sx={{ 
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            color: 'white',
                            borderRadius: '12px'
                        }}>
                            <CardContent sx={{ p: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {interactionStats.responseRate}%
                                </Typography>
                                <Typography variant="caption">Response Rate</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            <ChatContainer sx={{ flex: 1, minHeight: 0 }}>
                <ChatSidebar>
                    {/* Sidebar Header */}
                    <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0', background: 'white', flexShrink: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" fontWeight="bold">
                                Conversations
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Filters">
                                    <IconButton 
                                        size="small" 
                                        onClick={() => setShowFilters(!showFilters)}
                                        color={showFilters ? 'primary' : 'default'}
                                    >
                                        <FilterIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                        
                        {/* Search */}
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ color: '#64748b', mr: 1 }} />,
                            }}
                            sx={{ mb: 2 }}
                        />

                        {/* Filters */}
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <FormControl size="small" fullWidth>
                                            <InputLabel>Status</InputLabel>
                                            <Select
                                                value={filters.status}
                                                label="Status"
                                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                            >
                                                <MenuItem value="all">All</MenuItem>
                                                <MenuItem value="sent">Sent</MenuItem>
                                                <MenuItem value="read">Read</MenuItem>
                                                <MenuItem value="replied">Replied</MenuItem>
                                                <MenuItem value="closed">Closed</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControl size="small" fullWidth>
                                            <InputLabel>Type</InputLabel>
                                            <Select
                                                value={filters.type}
                                                label="Type"
                                                onChange={(e) => handleFilterChange('type', e.target.value)}
                                            >
                                                <MenuItem value="all">All</MenuItem>
                                                <MenuItem value="message">Message</MenuItem>
                                                <MenuItem value="feedback">Feedback</MenuItem>
                                                <MenuItem value="consultation">Consultation</MenuItem>
                                                <MenuItem value="assignment_help">Assignment Help</MenuItem>
                                                <MenuItem value="general">General</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <ToggleButtonGroup
                                            value={viewMode}
                                            exclusive
                                            size="small"
                                            onChange={(e, newValue) => newValue && setViewMode(newValue)}
                                            fullWidth
                                        >
                                            <ToggleButton value="all">All</ToggleButton>
                                            <ToggleButton value="sent">Sent</ToggleButton>
                                            <ToggleButton value="replied">Replied</ToggleButton>
                                        </ToggleButtonGroup>
                                    </Box>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Box>

                    {/* Conversations List */}
                    <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : filteredInteractions.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
                                <ChatIcon sx={{ fontSize: 48, color: '#64748b', mb: 2 }} />
                                <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                                    No conversations
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                                    Students will appear here when they send messages
                                </Typography>
                            </Box>
                        ) : (
                            <List sx={{ p: 0 }}>
                                {filteredInteractions.map((studentGroup) => (
                                    <InteractionItem
                                        key={studentGroup.student._id}
                                        isActive={selectedStudent?.student._id === studentGroup.student._id}
                                        hasUnread={studentGroup.unreadCount > 0}
                                        onClick={() => setSelectedStudent(studentGroup)}
                                    >
                                        <ListItemAvatar>
                                            <Badge
                                                badgeContent={studentGroup.unreadCount}
                                                color="primary"
                                                invisible={studentGroup.unreadCount === 0}
                                            >
                                                <Avatar sx={{ bgcolor: '#667eea', width: 32, height: 32, fontSize: '0.875rem' }}>
                                                    {studentGroup.student.name?.charAt(0)}
                                                </Avatar>
                                            </Badge>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '0.875rem' }}>
                                                        {studentGroup.student.name}
                                                    </Typography>
                                                    {studentGroup.unreadCount > 0 && (
                                                        <CheckCircleIcon sx={{ color: '#10b981', fontSize: 14 }} />
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5, fontSize: '0.75rem' }}>
                                                        {studentGroup.latestMessage?.content?.length > 40 
                                                            ? `${studentGroup.latestMessage.content.substring(0, 40)}...` 
                                                            : studentGroup.latestMessage?.content || 'No messages yet'
                                                        }
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                                                            {studentGroup.interactions.length} conversation{studentGroup.interactions.length !== 1 ? 's' : ''}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                                                            •
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                                                            {new Date(studentGroup.lastActivity).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            }
                                            primaryTypographyProps={{ component: 'div' }}
                                            secondaryTypographyProps={{ component: 'div' }}
                                        />
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                                            <Chip 
                                                label={studentGroup.interactions.length} 
                                                size="small"
                                                sx={{ 
                                                    bgcolor: '#667eea', 
                                                    color: 'white',
                                                    fontSize: '0.7rem',
                                                    height: '20px'
                                                }}
                                            />
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Delete the latest interaction for this student
                                                    setInteractionToDelete(studentGroup.latestMessage);
                                                    setDeleteDialogOpen(true);
                                                }}
                                            >
                                                <DeleteIcon sx={{ fontSize: 14, color: '#ef4444' }} />
                                            </IconButton>
                                        </Box>
                                    </InteractionItem>
                                ))}
                            </List>
                        )}
                    </Box>
                </ChatSidebar>

                <ChatMain>
                    {selectedStudent ? (
                        <>
                            {/* Chat Header */}
                            <ChatHeader>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                                        {selectedStudent.student.name?.charAt(0)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">
                                            {selectedStudent.student.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            {selectedStudent.interactions.length} conversation{selectedStudent.interactions.length !== 1 ? 's' : ''} • Last active {new Date(selectedStudent.lastActivity).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip 
                                        label={selectedStudent.unreadCount > 0 ? `${selectedStudent.unreadCount} unread` : 'All read'} 
                                        size="small"
                                        sx={{ 
                                            bgcolor: selectedStudent.unreadCount > 0 ? '#f59e0b' : '#10b981',
                                            color: 'white',
                                            fontSize: '0.75rem'
                                        }}
                                    />
                                </Box>
                            </ChatHeader>

                            {/* Messages */}
                            <Box sx={{ flex: 1, overflow: 'auto', p: 2, background: '#f8fafc', minHeight: 0 }}>
                                {conversationThread.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography variant="body1" sx={{ color: '#64748b' }}>
                                            No messages yet. Start the conversation!
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        {conversationThread.map((message, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                            >
                                                <MessageBubble isOwn={message.sender === 'teacher'}>
                                                    <Typography variant="body1" sx={{ fontSize: '0.875rem' }}>
                                                        {message.content}
                                                    </Typography>
                                                    <Typography 
                                                        variant="caption" 
                                                        sx={{ 
                                                            opacity: 0.7, 
                                                            display: 'block', 
                                                            mt: 0.5,
                                                            fontSize: '0.7rem'
                                                        }}
                                                    >
                                                        {new Date(message.createdAt).toLocaleString()}
                                                    </Typography>
                                                </MessageBubble>
                                            </motion.div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </Box>
                                )}
                            </Box>

                            {/* Reply Input */}
                            {selectedStudent.interactions.some(interaction => interaction.status === 'sent') && (
                                <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0', background: 'white', flexShrink: 0 }}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="Type your reply..."
                                            value={reply}
                                            onChange={(e) => setReply(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleReplySubmit()}
                                            disabled={replying}
                                        />
                                        <IconButton
                                            color="primary"
                                            onClick={handleReplySubmit}
                                            disabled={!reply.trim() || replying}
                                        >
                                            {replying ? <CircularProgress size={20} /> : <SendIcon />}
                                        </IconButton>
                                    </Box>
                                </Box>
                            )}
                        </>
                    ) : (
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            height: '100%',
                            background: 'white'
                        }}>
                            <ChatIcon sx={{ fontSize: 64, color: '#64748b', mb: 2 }} />
                            <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                                Select a conversation
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                                Choose a conversation from the sidebar to start chatting
                            </Typography>
                        </Box>
                    )}
                </ChatMain>
            </ChatContainer>

            {/* Delete Confirmation Dialog */}
            <Dialog 
                open={deleteDialogOpen} 
                onClose={() => setDeleteDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" color="error">
                            Delete Conversation
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {interactionToDelete && (
                        <Box>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Are you sure you want to delete this conversation?
                            </Typography>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                {interactionToDelete.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                                {interactionToDelete.content}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <Chip label={interactionToDelete.student?.name} size="small" />
                                <Chip label={interactionToDelete.subject?.subName} size="small" />
                                <TypeChip label={interactionToDelete.type} type={interactionToDelete.type} size="small" />
                            </Box>
                            <Typography variant="body2" color="error">
                                This action cannot be undone. All messages will be permanently deleted.
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDelete} 
                        variant="contained" 
                        color="error"
                        disabled={deleting}
                        startIcon={deleting ? <CircularProgress size={20} /> : null}
                    >
                        {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Popup message={response} setShowPopup={() => {}} showPopup={!!response} />
        </Box>
    );
};

export default TeacherInteractions; 
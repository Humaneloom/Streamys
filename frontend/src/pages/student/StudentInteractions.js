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
import { getStudentInteractions, createInteraction, replyToInteraction, getConversationThread, deleteInteraction } from '../../redux/interactionRelated/interactionHandle';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
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

const InteractionItem = styled(ListItem)(({ theme, isActive, hasUnread }) => ({
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

const StudentInteractions = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const { interactionsList, conversationThread, loading, error, response } = useSelector((state) => state.interaction);
    const { subjectsList } = useSelector((state) => state.sclass);

    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [newMessageDialogOpen, setNewMessageDialogOpen] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        type: 'all',
        teacher: 'all'
    });
    const [viewMode, setViewMode] = useState('all');
    const [reply, setReply] = useState('');
    const [creating, setCreating] = useState(false);
    const [replying, setReplying] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [interactionToDelete, setInteractionToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const messagesEndRef = useRef(null);

    // Form state for new interaction
    const [newInteraction, setNewInteraction] = useState({
        title: '',
        content: '',
        subject: '',
        type: 'message',
        priority: 'medium'
    });

    useEffect(() => {
        if (currentUser?._id) {
            dispatch(getStudentInteractions(currentUser._id, filters));
        }
        if (currentUser?.sclassName?._id) {
            dispatch(getSubjectList(currentUser.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, currentUser?._id, currentUser?.sclassName?._id, filters]);

    useEffect(() => {
        if (selectedTeacher) {
            // Get all conversation threads for the selected teacher
            const teacherInteractions = selectedTeacher.interactions;
            // For now, we'll show the latest interaction's thread
            // In a real implementation, you might want to merge all threads
            if (teacherInteractions.length > 0) {
                const latestInteraction = teacherInteractions[teacherInteractions.length - 1];
                dispatch(getConversationThread(latestInteraction._id));
            }
        }
    }, [selectedTeacher, dispatch]);

    useEffect(() => {
        scrollToBottom();
    }, [conversationThread]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleNewInteraction = async () => {
        if (!newInteraction.title.trim() || !newInteraction.content.trim() || !newInteraction.subject) {
            return;
        }

        setCreating(true);
        const selectedSubject = subjectsList.find(subject => subject._id === newInteraction.subject);
        
        if (!selectedSubject || !selectedSubject.teacher) {
            console.error('No teacher found for this subject');
            setCreating(false);
            return;
        }

        const interactionData = {
            student: currentUser._id,
            teacher: selectedSubject.teacher._id,
            subject: newInteraction.subject,
            title: newInteraction.title,
            content: newInteraction.content,
            type: newInteraction.type,
            priority: newInteraction.priority,
            sender: 'student',
            school: currentUser.school._id
        };

        try {
            await dispatch(createInteraction(interactionData));
            await dispatch(getStudentInteractions(currentUser._id, filters));
            
            setTimeout(() => {
                setNewMessageDialogOpen(false);
                setNewInteraction({
                    title: '',
                    content: '',
                    subject: '',
                    type: 'message',
                    priority: 'medium'
                });
            }, 500);
        } catch (error) {
            console.error('Error creating interaction:', error);
            alert(`Failed to send message: ${error.message}. Please try again.`);
        } finally {
            setCreating(false);
        }
    };

    const handleReplySubmit = async () => {
        if (!reply.trim() || !selectedTeacher) return;
        
        setReplying(true);
        
        const replyData = {
            content: reply,
            sender: 'student'
        };
        
        try {
            // Reply to the latest interaction with this teacher
            const latestInteraction = selectedTeacher.interactions[selectedTeacher.interactions.length - 1];
            await dispatch(replyToInteraction(latestInteraction._id, replyData));
            await dispatch(getStudentInteractions(currentUser._id, filters));
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
            await dispatch(getStudentInteractions(currentUser._id, filters));
            setDeleteDialogOpen(false);
            setInteractionToDelete(null);
            if (selectedTeacher && selectedTeacher.interactions.some(i => i._id === interactionToDelete._id)) {
                setSelectedTeacher(null);
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

    // Group interactions by teacher
    const groupedInteractions = interactionsList.reduce((groups, interaction) => {
        const teacherId = interaction.teacher?._id;
        if (!teacherId) return groups;
        
        if (!groups[teacherId]) {
            groups[teacherId] = {
                teacher: interaction.teacher,
                interactions: [],
                latestMessage: null,
                unreadCount: 0,
                lastActivity: null
            };
        }
        
        groups[teacherId].interactions.push(interaction);
        
        // Track latest message and unread count
        if (!groups[teacherId].latestMessage || 
            new Date(interaction.createdAt) > new Date(groups[teacherId].latestMessage.createdAt)) {
            groups[teacherId].latestMessage = interaction;
        }
        
        if (interaction.status === 'sent') {
            groups[teacherId].unreadCount++;
        }
        
        if (!groups[teacherId].lastActivity || 
            new Date(interaction.createdAt) > new Date(groups[teacherId].lastActivity)) {
            groups[teacherId].lastActivity = interaction.createdAt;
        }
        
        return groups;
    }, {});

    // Convert to array and filter
    const filteredInteractions = Object.values(groupedInteractions)
        .filter(group => {
            const matchesViewMode = viewMode === 'all' || 
                group.interactions.some(interaction => interaction.status === viewMode);
            const matchesSearch = group.teacher?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
        <Box sx={{ 
            minHeight: '100vh',
            backgroundColor: '#f8fafc',
            p: 2, 
            height: 'calc(100vh - 80px)', 
            display: 'flex', 
            flexDirection: 'column' 
        }}>
            {/* Header */}
            <Box sx={{ 
                mb: 2, 
                flexShrink: 0,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                padding: '40px 20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                textAlign: 'center'
            }}>
                <Typography variant="h4" sx={{ 
                    fontWeight: 700, 
                    color: 'white',
                    mb: 1,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                    Teacher Interactions
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Chat with your teachers and get help when needed
                </Typography>
            </Box>

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
                                <PurpleButton
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => setNewMessageDialogOpen(true)}
                                >
                                    New
                                </PurpleButton>
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
                                    Start your first conversation with a teacher
                                </Typography>
                                <PurpleButton
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => setNewMessageDialogOpen(true)}
                                >
                                    New Message
                                </PurpleButton>
                            </Box>
                        ) : (
                            <List sx={{ p: 0 }}>
                                {filteredInteractions.map((teacherGroup) => (
                                    <InteractionItem
                                        key={teacherGroup.teacher._id}
                                        isActive={selectedTeacher?.teacher._id === teacherGroup.teacher._id}
                                        hasUnread={teacherGroup.unreadCount > 0}
                                        onClick={() => setSelectedTeacher(teacherGroup)}
                                    >
                                        <ListItemAvatar>
                                            <Badge
                                                badgeContent={teacherGroup.unreadCount}
                                                color="primary"
                                                invisible={teacherGroup.unreadCount === 0}
                                            >
                                                <Avatar sx={{ bgcolor: '#667eea', width: 32, height: 32, fontSize: '0.875rem' }}>
                                                    {teacherGroup.teacher.name?.charAt(0)}
                                                </Avatar>
                                            </Badge>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '0.875rem' }}>
                                                        {teacherGroup.teacher.name}
                                                    </Typography>
                                                    {teacherGroup.unreadCount > 0 && (
                                                        <CheckCircleIcon sx={{ color: '#10b981', fontSize: 14 }} />
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5, fontSize: '0.75rem' }}>
                                                        {teacherGroup.latestMessage?.content?.length > 40 
                                                            ? `${teacherGroup.latestMessage.content.substring(0, 40)}...` 
                                                            : teacherGroup.latestMessage?.content || 'No messages yet'
                                                        }
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                                                            {teacherGroup.interactions.length} conversation{teacherGroup.interactions.length !== 1 ? 's' : ''}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                                                            •
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                                                            {new Date(teacherGroup.lastActivity).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            }
                                        />
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                                            <Chip 
                                                label={teacherGroup.interactions.length} 
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
                                                    // Delete the latest interaction for this teacher
                                                    setInteractionToDelete(teacherGroup.latestMessage);
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
                    {selectedTeacher ? (
                        <>
                            {/* Chat Header */}
                            <ChatHeader>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                                        {selectedTeacher.teacher.name?.charAt(0)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">
                                            {selectedTeacher.teacher.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            {selectedTeacher.interactions.length} conversation{selectedTeacher.interactions.length !== 1 ? 's' : ''} • Last active {new Date(selectedTeacher.lastActivity).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip 
                                        label={selectedTeacher.unreadCount > 0 ? `${selectedTeacher.unreadCount} unread` : 'All read'} 
                                        size="small"
                                        sx={{ 
                                            bgcolor: selectedTeacher.unreadCount > 0 ? '#f59e0b' : '#10b981',
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
                                                <MessageBubble isOwn={message.sender === 'student'}>
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
                            {selectedTeacher.interactions.some(interaction => interaction.status === 'replied') && (
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
                            <PurpleButton
                                startIcon={<AddIcon />}
                                onClick={() => setNewMessageDialogOpen(true)}
                            >
                                Start New Conversation
                            </PurpleButton>
                        </Box>
                    )}
                </ChatMain>
            </ChatContainer>

            {/* New Message Dialog */}
            <Dialog 
                open={newMessageDialogOpen} 
                onClose={() => setNewMessageDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AddIcon />
                        New Message to Teacher
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Message Title"
                            value={newInteraction.title}
                            onChange={(e) => setNewInteraction(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Brief title for your message"
                        />
                        
                        <FormControl fullWidth>
                            <InputLabel>Subject</InputLabel>
                            <Select
                                value={newInteraction.subject}
                                label="Subject"
                                onChange={(e) => setNewInteraction(prev => ({ ...prev, subject: e.target.value }))}
                            >
                                {subjectsList?.map((subject) => (
                                    <MenuItem key={subject._id} value={subject._id}>
                                        {subject.subName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={newInteraction.type}
                                label="Type"
                                onChange={(e) => setNewInteraction(prev => ({ ...prev, type: e.target.value }))}
                            >
                                <MenuItem value="message">Message</MenuItem>
                                <MenuItem value="feedback">Feedback</MenuItem>
                                <MenuItem value="consultation">Consultation</MenuItem>
                                <MenuItem value="assignment_help">Assignment Help</MenuItem>
                                <MenuItem value="general">General</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Priority</InputLabel>
                            <Select
                                value={newInteraction.priority}
                                label="Priority"
                                onChange={(e) => setNewInteraction(prev => ({ ...prev, priority: e.target.value }))}
                            >
                                <MenuItem value="low">Low</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="high">High</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            multiline
                            rows={6}
                            label="Your Message"
                            value={newInteraction.content}
                            onChange={(e) => setNewInteraction(prev => ({ ...prev, content: e.target.value }))}
                            placeholder="Type your message to the teacher..."
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNewMessageDialogOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={handleNewInteraction} 
                        variant="contained" 
                        disabled={creating}
                        startIcon={creating ? <CircularProgress size={20} /> : null}
                    >
                        {creating ? 'Sending...' : 'Send Message'}
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
                                <Chip label={interactionToDelete.teacher?.name} size="small" />
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

export default StudentInteractions; 
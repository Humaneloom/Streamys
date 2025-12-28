import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Button,
    TextField,
    Grid,
    Paper,
    Chip,
    Alert,
    Snackbar,
    CircularProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Delete as DeleteIcon,
    School as SchoolIcon,
    Email as EmailIcon,
    Person as PersonIcon,
    Security as SecurityIcon,
    VerifiedUser as VerifiedUserIcon,
    AdminPanelSettings as AdminIcon,
    CalendarToday as CalendarIcon,
    AccessTime as TimeIcon,
    People as PeopleIcon,
    Class as ClassIcon,
    Book as BookIcon,
    Notifications as NotificationsIcon,
    Report as ReportIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { updateUser, deleteUser } from '../../redux/userRelated/userHandle';
import { authLogout } from '../../redux/userRelated/userSlice';

const ProfileCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    borderRadius: '24px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.8)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 16px 50px rgba(0,0,0,0.15)',
        background: 'linear-gradient(135deg, #f1f5f9 0%, #dbe4f0 100%)',
    },
}));

const StatsCard = styled(Paper)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '16px',
    padding: theme.spacing(3),
    textAlign: 'center',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
    },
}));

const InfoCard = styled(Paper)(({ theme }) => ({
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    borderRadius: '16px',
    padding: theme.spacing(3),
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
    },
}));

const ActionButton = styled(Button)(({ theme, variant }) => ({
    borderRadius: '12px',
    textTransform: 'none',
    fontWeight: 600,
    padding: '10px 24px',
    transition: 'all 0.3s ease-in-out',
    ...(variant === 'edit' && {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
        },
    }),
    ...(variant === 'delete' && {
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
        color: 'white',
        '&:hover': {
            background: 'linear-gradient(135deg, #ff5252 0%, #d32f2f 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(255, 107, 107, 0.3)',
        },
    }),
}));

const AdminProfile = () => {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');
    const [currentTime, setCurrentTime] = useState(new Date());

    // Mock data for demonstration - in real app, fetch from API
    const [systemStats] = useState({
        totalStudents: 245,
        totalTeachers: 18,
        totalClasses: 12,
        totalSubjects: 15,
        activeNotices: 5,
        pendingComplaints: 3,
        systemUptime: '99.8%',
        lastBackup: '2 hours ago'
    });

    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        schoolName: currentUser?.schoolName || '',
        password: '',
    });

    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleInputChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const fields = formData.password === "" 
                ? { name: formData.name, email: formData.email, schoolName: formData.schoolName }
                : formData;
            
            console.log('Sending update with fields:', fields);
            console.log('User ID:', currentUser._id);
            
            const result = await dispatch(updateUser(fields, currentUser._id, "Admin"));
            
            console.log('Update result:', result);
            
            // Check if the update was successful
            if (result && result.payload) {
                setIsEditing(false);
                setFormData(prev => ({ ...prev, password: '' }));
                setAlertMessage('Profile updated successfully!');
                setAlertType('success');
                setShowAlert(true);
            } else {
                throw new Error('Update failed - no payload received');
            }
        } catch (error) {
            console.error('Update error details:', error);
            console.error('Error message:', error.message);
            console.error('Error response:', error.response);
            
            let errorMessage = 'Failed to update profile. Please try again.';
            
            if (error.response) {
                errorMessage = `Server error: ${error.response.data?.message || error.response.statusText}`;
            } else if (error.message) {
                errorMessage = `Error: ${error.message}`;
            }
            
            setAlertMessage(errorMessage);
            setAlertType('error');
            setShowAlert(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            name: currentUser?.name || '',
            email: currentUser?.email || '',
            schoolName: currentUser?.schoolName || '',
            password: '',
        });
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            setLoading(true);
            try {
                await dispatch(deleteUser(currentUser._id, "Admin"));
                dispatch(authLogout());
                navigate('/');
            } catch (error) {
                setAlertMessage('Failed to delete account. Please try again.');
                setAlertType('error');
                setShowAlert(true);
                setLoading(false);
            }
        }
    };

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A';
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <Box sx={{ p: 3, minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Grid container spacing={3}>
                    {/* Profile Header */}
                    <Grid item xs={12}>
                        <ProfileCard>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                fontSize: '3rem',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                                            }}
                                        >
                                            {getInitials(currentUser?.name)}
                                        </Avatar>
                                    </motion.div>
                                    <Box sx={{ ml: 3, flex: 1 }}>
                                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
                                            {currentUser?.name}
                                        </Typography>
                                        <Chip
                                            icon={<AdminIcon />}
                                            label="Administrator"
                                            sx={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                color: 'white',
                                                fontWeight: 600,
                                            }}
                                        />
                                        <Typography variant="body1" sx={{ mt: 1, color: '#64748b' }}>
                                            School Management System
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <TimeIcon sx={{ fontSize: 16, mr: 1, color: '#667eea' }} />
                                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                Last updated: {formatTime(currentTime)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <ActionButton
                                            variant="edit"
                                            startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                                            onClick={isEditing ? handleSave : () => setIsEditing(true)}
                                            disabled={loading}
                                        >
                                            {loading ? <CircularProgress size={20} color="inherit" /> : 
                                             isEditing ? 'Save Changes' : 'Edit Profile'}
                                        </ActionButton>
                                        {isEditing && (
                                            <Button
                                                variant="outlined"
                                                startIcon={<CancelIcon />}
                                                onClick={handleCancel}
                                                sx={{ ml: 1, borderRadius: '12px' }}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                            </CardContent>
                        </ProfileCard>
                    </Grid>

                    {/* Profile Details */}
                    <Grid item xs={12} md={8}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Grid container spacing={3}>
                                {/* Basic Information */}
                                <Grid item xs={12}>
                                    <ProfileCard>
                                        <CardContent sx={{ p: 4 }}>
                                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                                                Profile Information
                                            </Typography>
                                            
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                        <PersonIcon sx={{ mr: 2, color: '#667eea' }} />
                                                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                                                            Full Name
                                                        </Typography>
                                                    </Box>
                                                    {isEditing ? (
                                                        <TextField
                                                            fullWidth
                                                            value={formData.name}
                                                            onChange={handleInputChange('name')}
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                                        />
                                                    ) : (
                                                        <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
                                                            {currentUser?.name}
                                                        </Typography>
                                                    )}
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                        <EmailIcon sx={{ mr: 2, color: '#667eea' }} />
                                                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                                                            Email Address
                                                        </Typography>
                                                    </Box>
                                                    {isEditing ? (
                                                        <TextField
                                                            fullWidth
                                                            value={formData.email}
                                                            onChange={handleInputChange('email')}
                                                            variant="outlined"
                                                            size="small"
                                                            type="email"
                                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                                        />
                                                    ) : (
                                                        <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
                                                            {currentUser?.email}
                                                        </Typography>
                                                    )}
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                        <SchoolIcon sx={{ mr: 2, color: '#667eea' }} />
                                                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                                                            School Name
                                                        </Typography>
                                                    </Box>
                                                    {isEditing ? (
                                                        <TextField
                                                            fullWidth
                                                            value={formData.schoolName}
                                                            onChange={handleInputChange('schoolName')}
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                                        />
                                                    ) : (
                                                        <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
                                                            {currentUser?.schoolName}
                                                        </Typography>
                                                    )}
                                                </Grid>

                                                {isEditing && (
                                                    <Grid item xs={12}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                            <SecurityIcon sx={{ mr: 2, color: '#667eea' }} />
                                                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                                                                New Password (leave blank to keep current)
                                                            </Typography>
                                                        </Box>
                                                        <TextField
                                                            fullWidth
                                                            value={formData.password}
                                                            onChange={handleInputChange('password')}
                                                            variant="outlined"
                                                            size="small"
                                                            type="password"
                                                            placeholder="Enter new password"
                                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                                        />
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </CardContent>
                                    </ProfileCard>
                                </Grid>

                                {/* System Statistics */}
                                <Grid item xs={12}>
                                    <ProfileCard>
                                        <CardContent sx={{ p: 4 }}>
                                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                                                System Overview
                                            </Typography>
                                            
                                            <Grid container spacing={2}>
                                                <Grid item xs={6} sm={3}>
                                                    <InfoCard>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <PeopleIcon sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
                                                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                                                {systemStats.totalStudents}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                                Students
                                                            </Typography>
                                                        </Box>
                                                    </InfoCard>
                                                </Grid>
                                                
                                                <Grid item xs={6} sm={3}>
                                                    <InfoCard>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <AdminIcon sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
                                                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                                                {systemStats.totalTeachers}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                                Teachers
                                                            </Typography>
                                                        </Box>
                                                    </InfoCard>
                                                </Grid>
                                                
                                                <Grid item xs={6} sm={3}>
                                                    <InfoCard>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <ClassIcon sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
                                                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                                                {systemStats.totalClasses}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                                Classes
                                                            </Typography>
                                                        </Box>
                                                    </InfoCard>
                                                </Grid>
                                                
                                                <Grid item xs={6} sm={3}>
                                                    <InfoCard>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <BookIcon sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
                                                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                                                {systemStats.totalSubjects}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                                Subjects
                                                            </Typography>
                                                        </Box>
                                                    </InfoCard>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </ProfileCard>
                                </Grid>

                                {/* Account Activity */}
                                <Grid item xs={12}>
                                    <ProfileCard>
                                        <CardContent sx={{ p: 4 }}>
                                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                                                Account Activity
                                            </Typography>
                                            
                                            <List>
                                                <ListItem>
                                                    <ListItemIcon>
                                                        <CalendarIcon sx={{ color: '#667eea' }} />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary="Account Created"
                                                        secondary={formatDate(currentUser?.createdAt || new Date())}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemIcon>
                                                        <TimeIcon sx={{ color: '#667eea' }} />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary="Last Login"
                                                        secondary={formatTime(currentTime)}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemIcon>
                                                        <NotificationsIcon sx={{ color: '#667eea' }} />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary="Active Notices"
                                                        secondary={`${systemStats.activeNotices} notices posted`}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemIcon>
                                                        <ReportIcon sx={{ color: '#667eea' }} />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary="Pending Complaints"
                                                        secondary={`${systemStats.pendingComplaints} complaints to review`}
                                                    />
                                                </ListItem>
                                            </List>
                                        </CardContent>
                                    </ProfileCard>
                                </Grid>
                            </Grid>
                        </motion.div>
                    </Grid>

                    {/* Stats Cards */}
                    <Grid item xs={12} md={4}>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <StatsCard>
                                        <VerifiedUserIcon sx={{ fontSize: 40, mb: 1 }} />
                                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                            Admin
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            System Administrator
                                        </Typography>
                                    </StatsCard>
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <InfoCard>
                                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                System Status
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                Uptime: {systemStats.systemUptime}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                Last Backup: {systemStats.lastBackup}
                                            </Typography>
                                        </Box>
                                        <Button
                                            startIcon={<RefreshIcon />}
                                            variant="outlined"
                                            fullWidth
                                            sx={{ borderRadius: '12px' }}
                                        >
                                            Refresh Stats
                                        </Button>
                                    </InfoCard>
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <ProfileCard>
                                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
                                                Account Actions
                                            </Typography>
                                            <ActionButton
                                                variant="delete"
                                                startIcon={<DeleteIcon />}
                                                onClick={handleDelete}
                                                disabled={loading}
                                                fullWidth
                                                sx={{ mb: 2 }}
                                            >
                                                Delete Account
                                            </ActionButton>
                                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                This action cannot be undone
                                            </Typography>
                                        </CardContent>
                                    </ProfileCard>
                                </Grid>
                            </Grid>
                        </motion.div>
                    </Grid>
                </Grid>
            </motion.div>

            <Snackbar
                open={showAlert}
                autoHideDuration={6000}
                onClose={() => setShowAlert(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setShowAlert(false)} 
                    severity={alertType}
                    sx={{ width: '100%' }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminProfile;
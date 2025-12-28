import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
    Divider,
    IconButton,
    Chip,
    Alert,
    Snackbar,
    CircularProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Badge,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    LocalLibrary as LocalLibraryIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    School as SchoolIcon,
    Person as PersonIcon,
    Book as BookIcon,
    TrendingUp as TrendingUpIcon,
    Notifications as NotificationsIcon,
    Work as WorkIcon,
    CalendarToday as CalendarIcon,
    Security as SecurityIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const StyledCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
    overflow: 'hidden',
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        pointerEvents: 'none',
    },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
    width: 120,
    height: 120,
    border: '4px solid rgba(255,255,255,0.3)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    color: '#667eea',
    fontSize: '3rem',
}));

const InfoCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(255,255,255,0.8)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        '&:hover fieldset': {
            borderColor: '#667eea',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#667eea',
        },
    },
}));

const StyledButton = styled(Button)(({ theme, variant }) => ({
    borderRadius: '12px',
    textTransform: 'none',
    fontWeight: 600,
    padding: theme.spacing(1.5, 3),
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    ...(variant === 'contained' && {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
        '&:hover': {
            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
        },
    }),
    ...(variant === 'outlined' && {
        border: '2px solid #667eea',
        color: '#667eea',
        '&:hover': {
            borderColor: '#5a67d8',
            backgroundColor: 'rgba(102, 126, 234, 0.05)',
            transform: 'translateY(-1px)',
        },
    }),
}));

const StatCard = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    border: '1px solid rgba(255,255,255,0.8)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
    },
}));

const LibrarianProfile = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { books, stats, loading: booksLoading } = useSelector(state => state.books);
    
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [libraryStats, setLibraryStats] = useState({
        totalBooks: 0,
        totalLoans: 0,
        activeLoans: 0,
        overdueBooks: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);
    
    // Get school name from current user
    const schoolName = currentUser?.schoolName || 'Default School';
    
    // Use actual user data from Redux store
    const [profileData, setProfileData] = useState({
        name: currentUser?.name || 'Librarian',
        email: currentUser?.email || 'librarian@school.com',
        phone: currentUser?.phone || '+91 0000000000',
        department: currentUser?.department || 'Library Department',
        schoolName: currentUser?.schoolName || 'School',
        role: currentUser?.role || 'Librarian',
        employeeId: currentUser?._id || 'LIB001'
    });

    const [tempData, setTempData] = useState({ ...profileData });

    // Update profile data when currentUser changes
    useEffect(() => {
        if (currentUser) {
            const updatedProfileData = {
                name: currentUser.name || 'Librarian',
                email: currentUser.email || 'librarian@school.com',
                phone: currentUser.phone || '+91 0000000000',
                department: currentUser.department || 'Library Department',
                schoolName: currentUser.schoolName || 'School',
                role: currentUser.role || 'Librarian',
                employeeId: currentUser._id || 'LIB001'
            };
            setProfileData(updatedProfileData);
            setTempData(updatedProfileData);
        }
    }, [currentUser]);

    // Fetch library statistics and recent activities
    useEffect(() => {
        if (schoolName) {
            fetchLibraryStats();
            fetchRecentActivities();
        }
    }, [schoolName]);

    const fetchLibraryStats = async () => {
        try {
            // Get book statistics from Redux store
            const totalBooks = books?.length || 0;
            const totalAvailable = books?.reduce((sum, book) => sum + (book.availableQuantity || 0), 0) || 0;
            
            // Fetch book loans data
            const loansResponse = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/BookLoans/${schoolName}`);
            const loans = loansResponse.data?.data || loansResponse.data || [];
            
            const activeLoans = loans.filter(loan => loan.status === 'borrowed').length;
            const overdueBooks = loans.filter(loan => {
                if (loan.status === 'returned') return false;
                const dueDate = new Date(loan.dueDate);
                const today = new Date();
                return dueDate < today;
            }).length;

            setLibraryStats({
                totalBooks,
                totalAvailable,
                totalLoans: loans.length,
                activeLoans,
                overdueBooks
            });
        } catch (error) {
            console.error('Error fetching library stats:', error);
        }
    };

    const fetchRecentActivities = async () => {
        try {
            // Fetch recent book loans
            const loansResponse = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/BookLoans/${schoolName}`);
            const loans = loansResponse.data?.data || loansResponse.data || [];
            
            // Generate recent activities from loans
            const activities = loans.slice(0, 5).map(loan => {
                const borrowerName = loan.student?.name || loan.teacher?.name || 'Unknown';
                const bookTitle = loan.book?.title || 'Unknown Book';
                
                return {
                    id: loan._id,
                    type: loan.status === 'returned' ? 'success' : 'info',
                    title: loan.status === 'returned' ? 'Book Returned' : 'Book Issued',
                    description: `${bookTitle} ${loan.status === 'returned' ? 'returned by' : 'issued to'} ${borrowerName}`,
                    time: formatTimeAgo(loan.issueDate),
                    timestamp: new Date(loan.issueDate)
                };
            });

            // Sort by timestamp and take top 5
            const sortedActivities = activities
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 5);

            setRecentActivities(sortedActivities);
        } catch (error) {
            console.error('Error fetching recent activities:', error);
        }
    };

    const formatTimeAgo = (dateString) => {
        if (!dateString) return 'Unknown time';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString();
    };

    const handleEdit = () => {
        setIsEditing(true);
        setTempData({ ...profileData });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Update librarian profile via API
            const response = await axios.put(
                `${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/Librarian/${currentUser._id}`,
                {
                    name: tempData.name,
                    phone: tempData.phone,
                    department: tempData.department
                }
            );

            if (response.data) {
                setProfileData({ ...tempData });
                setIsEditing(false);
                setShowSuccess(true);
                
                // Update local storage and Redux store
                const updatedUser = { ...currentUser, ...tempData };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                // Note: In a real app, you'd dispatch an action to update Redux store
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrorMessage('Failed to update profile. Please try again.');
            setShowError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setTempData({ ...profileData });
        setIsEditing(false);
    };

    const handleInputChange = (field, value) => {
        setTempData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
    };

    const handleCloseError = () => {
        setShowError(false);
    };

    const handleRefresh = () => {
        fetchLibraryStats();
        fetchRecentActivities();
    };

    const renderInfoField = (label, value, field, icon) => (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                minWidth: '200px',
                color: '#667eea',
                fontWeight: 600 
            }}>
                {icon}
                <Typography variant="body2" sx={{ ml: 1 }}>
                    {label}:
                </Typography>
            </Box>
            {isEditing && field !== 'email' && field !== 'role' && field !== 'employeeId' && field !== 'schoolName' ? (
                <StyledTextField
                    fullWidth
                    value={tempData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    variant="outlined"
                    size="small"
                />
            ) : (
                <Typography variant="body1" sx={{ color: '#4a5568' }}>
                    {value}
                </Typography>
            )}
        </Box>
    );

    const statsData = [
        {
            title: 'Total Books',
            value: libraryStats.totalBooks,
            icon: <BookIcon />,
            color: '#667eea',
            subtitle: `${libraryStats.totalAvailable} available`
        },
        {
            title: 'Active Loans',
            value: libraryStats.activeLoans,
            icon: <TrendingUpIcon />,
            color: '#10b981',
            subtitle: `${libraryStats.totalLoans} total loans`
        },
        {
            title: 'Overdue Books',
            value: libraryStats.overdueBooks,
            icon: <NotificationsIcon />,
            color: '#ef4444',
            subtitle: 'Requires attention'
        },
        {
            title: 'School',
            value: profileData.schoolName,
            icon: <SchoolIcon />,
            color: '#f59e0b',
            subtitle: 'Current institution'
        }
    ];

    if (!currentUser) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}>
                <CircularProgress size={60} sx={{ color: '#667eea' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
            {/* Header Card */}
            <StyledCard sx={{ mb: 4, p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
                    <ProfileAvatar>
                        <LocalLibraryIcon />
                    </ProfileAvatar>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                            {profileData.name}
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                            {profileData.role} • {profileData.department}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                                label={profileData.schoolName} 
                                sx={{ 
                                    backgroundColor: 'rgba(255,255,255,0.2)', 
                                    color: 'white',
                                    fontWeight: 600 
                                }} 
                            />
                            <Chip 
                                label={profileData.employeeId} 
                                sx={{ 
                                    backgroundColor: 'rgba(255,255,255,0.2)', 
                                    color: 'white',
                                    fontWeight: 600 
                                }} 
                            />
                            <Chip 
                                label={`Member since ${new Date(currentUser._id.substring(0, 8) * 1000).getFullYear()}`}
                                sx={{ 
                                    backgroundColor: 'rgba(255,255,255,0.2)', 
                                    color: 'white',
                                    fontWeight: 600 
                                }} 
                            />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                            onClick={handleRefresh}
                            sx={{ 
                                color: 'white',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                            }}
                        >
                            <RefreshIcon />
                        </IconButton>
                        {isEditing ? (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <StyledButton
                                    variant="contained"
                                    startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </StyledButton>
                                <StyledButton
                                    variant="outlined"
                                    startIcon={<CancelIcon />}
                                    onClick={handleCancel}
                                    sx={{ color: 'white', borderColor: 'white' }}
                                >
                                    Cancel
                                </StyledButton>
                            </Box>
                        ) : (
                            <StyledButton
                                variant="contained"
                                startIcon={<EditIcon />}
                                onClick={handleEdit}
                                sx={{ 
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.3)',
                                    }
                                }}
                            >
                                Edit Profile
                            </StyledButton>
                        )}
                    </Box>
                </Box>
            </StyledCard>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {statsData.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <StatCard>
                            <Avatar
                                sx={{
                                    width: 50,
                                    height: 50,
                                    mr: 2,
                                    background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`,
                                    color: 'white'
                                }}
                            >
                                {stat.icon}
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a202c', mb: 0.5 }}>
                                    {stat.value}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#718096', mb: 1 }}>
                                    {stat.title}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#a0aec0' }}>
                                    {stat.subtitle}
                                </Typography>
                            </Box>
                        </StatCard>
                    </Grid>
                ))}
            </Grid>

            {/* Main Content Grid */}
            <Grid container spacing={3}>
                {/* Profile Information */}
                <Grid item xs={12} md={8}>
                    <InfoCard>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
                            Personal Information
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        
                        {renderInfoField('Full Name', profileData.name, 'name', <PersonIcon />)}
                        {renderInfoField('Email Address', profileData.email, 'email', <EmailIcon />)}
                        {renderInfoField('Phone Number', profileData.phone, 'phone', <PhoneIcon />)}
                        {renderInfoField('Department', profileData.department, 'department', <WorkIcon />)}
                        {renderInfoField('Role', profileData.role, 'role', <LocalLibraryIcon />)}
                        {renderInfoField('Employee ID', profileData.employeeId, 'employeeId', <SecurityIcon />)}
                        {renderInfoField('School', profileData.schoolName, 'schoolName', <SchoolIcon />)}
                    </InfoCard>
                </Grid>

                {/* Recent Activities */}
                <Grid item xs={12} md={4}>
                    <InfoCard>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748' }}>
                                Recent Activities
                            </Typography>
                            <Badge badgeContent={recentActivities.length} color="primary">
                                <NotificationsIcon sx={{ color: '#667eea' }} />
                            </Badge>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        
                        {recentActivities.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 3 }}>
                                <BookIcon sx={{ fontSize: 40, color: '#cbd5e1', mb: 2 }} />
                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                    No recent activities
                                </Typography>
                            </Box>
                        ) : (
                            <List sx={{ p: 0 }}>
                                {recentActivities.map((activity, index) => (
                                    <ListItem key={activity.id} sx={{ px: 0, py: 1 }}>
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <Avatar
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    backgroundColor: activity.type === 'success' ? '#10b981' : '#667eea',
                                                    fontSize: '0.8rem'
                                                }}
                                            >
                                                {activity.type === 'success' ? '✓' : '📚'}
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2d3748' }}>
                                                    {activity.title}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" sx={{ color: '#718096', mb: 0.5 }}>
                                                        {activity.description}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#a0aec0' }}>
                                                        {activity.time}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </InfoCard>
                </Grid>
            </Grid>

            {/* Library Overview */}
            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={12}>
                    <InfoCard>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748' }}>
                                Library Overview
                            </Typography>
                            <Chip 
                                label={`${libraryStats.totalBooks} books managed`} 
                                color="primary" 
                                size="small"
                            />
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ textAlign: 'center', p: 2 }}>
                                    <BookIcon sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748' }}>
                                        {libraryStats.totalBooks}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#718096' }}>
                                        Total Books
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ textAlign: 'center', p: 2 }}>
                                    <TrendingUpIcon sx={{ fontSize: 40, color: '#10b981', mb: 1 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748' }}>
                                        {libraryStats.totalAvailable}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#718096' }}>
                                        Available Books
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ textAlign: 'center', p: 2 }}>
                                    <WorkIcon sx={{ fontSize: 40, color: '#f59e0b', mb: 1 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748' }}>
                                        {libraryStats.activeLoans}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#718096' }}>
                                        Active Loans
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ textAlign: 'center', p: 2 }}>
                                    <NotificationsIcon sx={{ fontSize: 40, color: '#ef4444', mb: 1 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748' }}>
                                        {libraryStats.overdueBooks}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#718096' }}>
                                        Overdue Books
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </InfoCard>
                </Grid>
            </Grid>

            {/* Success Snackbar */}
            <Snackbar
                open={showSuccess}
                autoHideDuration={4000}
                onClose={handleCloseSuccess}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseSuccess} 
                    severity="success" 
                    sx={{ width: '100%' }}
                >
                    Profile updated successfully!
                </Alert>
            </Snackbar>

            {/* Error Snackbar */}
            <Snackbar
                open={showError}
                autoHideDuration={6000}
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseError} 
                    severity="error" 
                    sx={{ width: '100%' }}
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default LibrarianProfile;

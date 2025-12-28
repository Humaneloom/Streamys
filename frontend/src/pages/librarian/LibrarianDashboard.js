import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
    Box,
    CssBaseline,
    Toolbar,
    Typography,
    IconButton,
    Badge,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Chip,
    Button,
    AppBar,
    Drawer,
    List
} from '@mui/material';
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    Search as SearchIcon,
    Notifications as NotificationsIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    Class as ClassIcon,
    Book as BookIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Info as InfoIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { InputBase } from '@mui/material';
import AccountMenu from '../../components/AccountMenu';
import LibrarianSideBar from './LibrarianSideBar';
import LibrarianHomePage from './LibrarianHomePage';
import LibrarianProfile from './LibrarianProfile';
import BookManagement from './BookManagement';
import StudentManagement from './StudentManagement';
import StaffManagement from './StaffManagement';
import Logout from '../Logout';

const StyledMenu = styled(Menu)(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: '16px',
        minWidth: 320,
        maxWidth: 400,
        maxHeight: 500,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        border: '1px solid rgba(255,255,255,0.8)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        overflow: 'hidden', // Prevent content from overflowing
        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
        mt: 1.5,
        zIndex: 9999, // Ensure high z-index
        position: 'relative', // Let Material-UI handle positioning
        isolation: 'isolate', // Create new stacking context
        '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
            borderLeft: '1px solid rgba(255,255,255,0.8)',
            borderTop: '1px solid rgba(255,255,255,0.8)',
        },
    },
}));

const NotificationItem = styled(MenuItem)(({ theme, type }) => ({
    borderRadius: '12px',
    margin: '4px 8px',
    padding: '12px 16px',
    transition: 'all 0.3s ease-in-out',
    borderLeft: `4px solid ${
        type === 'warning' ? '#f59e0b' :
        type === 'success' ? '#10b981' :
        type === 'error' ? '#ef4444' :
        '#3b82f6'
    }`,
    '&:hover': {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        transform: 'translateX(4px)',
        '& .MuiListItemIcon-root': {
            color: 'white',
        },
        '& .MuiChip-root': {
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
        },
    },
    '& .MuiListItemIcon-root': {
        color: '#667eea',
        minWidth: 40,
    },
    '& .MuiListItemText-root': {
        overflow: 'hidden', // Prevent text overflow
        '& .MuiTypography-root': {
            overflow: 'hidden',
            textOverflow: 'ellipsis', // Add ellipsis for long text
            whiteSpace: 'nowrap' // Prevent text wrapping
        }
    }
}));

// Styled Components for Modern Gradient Theme
const GradientAppBar = styled(AppBar)(({ theme, open }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    width: `calc(100% - ${open ? 240 : 64}px)`,
    marginLeft: open ? '240px' : '64px',
    zIndex: 1200, // Ensure AppBar is above other content
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.down('md')]: {
        width: '100%',
        marginLeft: 0,
    },
}));

const GradientDrawer = styled(Drawer)(({ theme, open }) => ({
    '& .MuiDrawer-paper': {
        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        border: 'none',
        boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
        width: open ? 240 : 64, // Adjust width based on open state
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden', // Hide overflow when collapsed
        '& .MuiListItemIcon-root': {
            color: '#ffffff',
        },
        '& .MuiListItemText-root': {
            color: '#ffffff',
        },
    },
}));

const SearchBar = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: '25px',
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: '#ffffff',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '20ch',
        },
    },
}));

const drawerWidth = 240;

const MainContent = styled(Box)(({ theme, open }) => ({
    backgroundColor: '#f8fafc',
    backgroundImage: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    minHeight: '100vh',
    flexGrow: 1,
    overflow: 'auto',
    padding: theme.spacing(3),
    marginLeft: open ? `${drawerWidth}px` : '64px',
    marginTop: '64px', // Account for fixed AppBar height
    position: 'relative',
    zIndex: 1, // Ensure proper layering
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.down('md')]: {
        marginLeft: 0, // No margin on mobile
        marginTop: '64px', // Keep top margin for AppBar
    },
}));



const LibrarianDashboard = () => {
    const [open, setOpen] = useState(true);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    
    const toggleDrawer = () => {
        setOpen(!open);
    };

    // Sample notifications data
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: 'New Book Added',
            message: 'Advanced Mathematics textbook has been added to the collection',
            type: 'success',
            time: '2 minutes ago',
            icon: <BookIcon />
        },
        {
            id: 2,
            title: 'Book Return Due',
            message: 'Several books are due for return this week',
            type: 'warning',
            time: '15 minutes ago',
            icon: <ClassIcon />
        },
        {
            id: 3,
            title: 'Library Maintenance',
            message: 'Scheduled maintenance will begin at 2 PM',
            type: 'info',
            time: '1 hour ago',
            icon: <InfoIcon />
        },
        {
            id: 4,
            title: 'New Student Registration',
            message: 'Library card issued for new student John Doe',
            type: 'success',
            time: '2 hours ago',
            icon: <PersonIcon />
        },
        {
            id: 5,
            title: 'Book Request',
            message: 'New book request submitted by Teacher Sarah',
            type: 'info',
            time: '3 hours ago',
            icon: <SchoolIcon />
        }
    ]);

    const handleNotificationClick = (event) => {
        setNotificationAnchorEl(event.currentTarget);
    };



    const handleNotificationClose = () => {
        setNotificationAnchorEl(null);
    };

    const handleNotificationRead = (notificationId) => {
        setNotifications(prev => 
            prev.filter(notification => notification.id !== notificationId)
        );
    };

    const handleMarkAllRead = () => {
        setNotifications([]);
        handleNotificationClose();
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon />;
            case 'warning':
                return <WarningIcon />;
            case 'error':
                return <WarningIcon />;
            default:
                return <InfoIcon />;
        }
    };

    const notificationOpen = Boolean(notificationAnchorEl);

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <GradientAppBar open={open} position='fixed'>
                    <Toolbar sx={{ 
                        pr: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'nowrap' // Prevent wrapping
                    }}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="toggle drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        
                        {/* Search Bar */}
                        <SearchBar>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search books, students, or activities..."
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </SearchBar>
                        
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1, fontWeight: 600 }}
                        >
                            Librarian Dashboard
                        </Typography>
                        
                        {/* Notifications */}
                        <Box sx={{ position: 'relative' }}>
                            <IconButton 
                                color="inherit" 
                                sx={{ mr: 2 }}
                                onClick={handleNotificationClick}
                                aria-controls={notificationOpen ? 'notification-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={notificationOpen ? 'true' : undefined}
                            >
                                <Badge badgeContent={notifications.length} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                        </Box>

                        {/* Notification Menu - Rendered outside toolbar */}
                        <StyledMenu
                            anchorEl={notificationAnchorEl}
                            id="notification-menu"
                            open={notificationOpen}
                            onClose={handleNotificationClose}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            sx={{
                                '& .MuiPaper-root': {
                                    zIndex: 9999,
                                    maxWidth: '400px', // Limit width to prevent overflow
                                    overflow: 'hidden' // Ensure content doesn't overflow
                                }
                            }}
                            // Let Material-UI handle positioning naturally
                        >
                            {/* Notification Header */}
                            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                        Notifications
                                    </Typography>
                                    <Chip 
                                        label={notifications.length} 
                                        size="small" 
                                        sx={{ 
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            fontWeight: 600,
                                        }}
                                    />
                                </Box>
                                {notifications.length > 0 && (
                                    <Button
                                        size="small"
                                        startIcon={<ClearIcon />}
                                        onClick={handleMarkAllRead}
                                        sx={{ 
                                            color: '#64748b',
                                            textTransform: 'none',
                                            '&:hover': { color: '#ef4444' }
                                        }}
                                    >
                                        Mark all as read
                                    </Button>
                                )}
                            </Box>

                            {/* Notification Items */}
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        type={notification.type}
                                        onClick={() => handleNotificationRead(notification.id)}
                                    >
                                        <ListItemIcon>
                                            {notification.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                                    {notification.title}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 0.5 }}>
                                                        {notification.message}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#95a5a6' }}>
                                                        {notification.time}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleNotificationRead(notification.id);
                                            }}
                                            sx={{
                                                color: '#95a5a6',
                                                '&:hover': {
                                                    color: '#e74c3c',
                                                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                                                },
                                            }}
                                        >
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    </NotificationItem>
                                ))
                            ) : (
                                <Box sx={{ p: 3, textAlign: 'center' }}>
                                    <CheckCircleIcon sx={{ fontSize: 40, color: '#10b981', mb: 1 }} />
                                    <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                        All caught up! No new notifications.
                                    </Typography>
                                </Box>
                            )}
                        </StyledMenu>

                        {/* Account Menu */}
                        <AccountMenu />
                    </Toolbar>
                </GradientAppBar>

                {/* Sidebar */}
                <GradientDrawer variant="permanent" open={open}>
                    <LibrarianSideBar isCollapsed={!open} />
                </GradientDrawer>

                {/* Main Content */}
                <MainContent open={open}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/Librarian/dashboard" replace />} />
                        <Route path="/Librarian/dashboard" element={<LibrarianHomePage />} />
                        <Route path="/Librarian/books" element={<BookManagement />} />
                        <Route path="/Librarian/students" element={<StudentManagement />} />
                        <Route path="/Librarian/staff" element={<StaffManagement />} />
                        <Route path="/Librarian/profile" element={<LibrarianProfile />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="*" element={<Navigate to="/Librarian/dashboard" replace />} />
                    </Routes>
                </MainContent>
            </Box>
        </>
    );
};

export default LibrarianDashboard;

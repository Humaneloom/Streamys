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
import FinanceSideBar from './FinanceSideBar';
import FinanceHomePage from './FinanceHomePage';
import FinanceProfile from './FinanceProfile';
import FeeManagement from './FeeManagement';
import StudentFees from './StudentFees';
import OtherExpenses from './OtherExpenses';
import TeacherSalaryManagement from './TeacherSalaryManagement';
import FinancialReports from './FinancialReports';
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
        overflow: 'visible',
        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
        mt: 1.5,
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
}));

// Styled Components for Modern Gradient Theme
const GradientAppBar = styled(AppBar)(({ theme, open }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    width: `calc(100% - ${open ? 240 : 64}px)`,
    marginLeft: open ? '240px' : '64px',
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
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
        '&::placeholder': {
            color: alpha(theme.palette.common.white, 0.7),
            opacity: 1,
        },
    },
}));

const MainContent = styled(Box)(({ theme, open }) => ({
    backgroundColor: '#f8fafc',
    backgroundImage: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    minHeight: '100vh',
    flexGrow: 1,
    overflow: 'auto',
    padding: theme.spacing(3),
    marginLeft: open ? '240px' : '64px', // Adjust margin based on drawer state
    marginTop: '64px', // Account for fixed AppBar height
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.down('md')]: {
        marginLeft: 0, // No margin on mobile
        marginTop: '64px', // Keep top margin for AppBar
    },
}));

const FinanceDashboard = () => {
    const [open, setOpen] = useState(true);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    
    const toggleDrawer = () => {
        setOpen(!open);
    };

    // Sample notifications data
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: 'Fee Payment Received',
            message: 'Payment of $500 received from John Doe for Class 10A',
            type: 'success',
            time: '2 minutes ago',
            icon: <PersonIcon />
        },
        {
            id: 2,
            title: 'Pending Fee Alert',
            message: '15 students have pending fees for this month',
            type: 'warning',
            time: '15 minutes ago',
            icon: <ClassIcon />
        },
        {
            id: 3,
            title: 'Budget Report Updated',
            message: 'Monthly budget report for March has been generated',
            type: 'info',
            time: '1 hour ago',
            icon: <BookIcon />
        },
        {
            id: 4,
            title: 'System Maintenance',
            message: 'Scheduled maintenance will begin at 10 PM',
            type: 'error',
            time: '2 hours ago',
            icon: <WarningIcon />
        },
        {
            id: 5,
            title: 'New Expense Entry',
            message: 'New expense entry added for school supplies',
            type: 'success',
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
                    <Toolbar sx={{ pr: '24px' }}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
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
                                placeholder="Search..."
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
                            Finance Management Dashboard
                        </Typography>
                        
                        {/* Notifications */}
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

                        <StyledMenu
                            anchorEl={notificationAnchorEl}
                            id="notification-menu"
                            open={notificationOpen}
                            onClose={handleNotificationClose}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
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
                                            {getNotificationIcon(notification.type)}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                        {notification.title}
                                                    </Typography>
                                                    <Chip
                                                        label={notification.time}
                                                        size="small"
                                                        sx={{
                                                            background: 'rgba(102, 126, 234, 0.1)',
                                                            color: '#667eea',
                                                            fontSize: '0.7rem',
                                                        }}
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                                                    {notification.message}
                                                </Typography>
                                            }
                                        />
                                    </NotificationItem>
                                ))
                            ) : (
                                <Box sx={{ p: 3, textAlign: 'center' }}>
                                    <CheckCircleIcon sx={{ fontSize: 48, color: '#10b981', mb: 2 }} />
                                    <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
                                        All caught up!
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                        No new notifications
                                    </Typography>
                                </Box>
                            )}
                        </StyledMenu>
                        
                        <AccountMenu />
                    </Toolbar>
                </GradientAppBar>
                
                <GradientDrawer variant="permanent" open={open}>
                    <Toolbar sx={styles.toolBarStyled}>
                        <IconButton onClick={toggleDrawer} sx={{ color: '#ffffff' }}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
                    <List component="nav">
                        <FinanceSideBar isCollapsed={!open} />
                    </List>
                </GradientDrawer>
                
                <MainContent component="main" open={open}>
                    <Routes>
                        <Route path="/" element={<FinanceHomePage />} />
                        <Route path='*' element={<Navigate to="/" />} />
                        <Route path="/Finance/dashboard" element={<FinanceHomePage />} />
                        <Route path="/Finance/profile" element={<FinanceProfile />} />
                        <Route path="/Finance/fees" element={<FeeManagement />} />
                        <Route path="/Finance/student-fees" element={<StudentFees />} />
                        <Route path="/Finance/other-expenses" element={<OtherExpenses />} />
                        <Route path="/Finance/teachers" element={<TeacherSalaryManagement />} />
                        <Route path="/Finance/reports" element={<FinancialReports />} />
                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </MainContent>
            </Box>
        </>
    );
}

export default FinanceDashboard

const styles = {
    toolBarStyled: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: [1],
    },
    drawerStyled: {
        display: "flex"
    },
    hideDrawer: {
        display: 'flex',
        '@media (max-width: 600px)': {
            display: 'none',
        },
    },
} 
import * as React from 'react';
import { useState } from 'react';
import { 
    Divider, ListItemButton, ListItemIcon, ListItemText, 
    Box, Typography, Avatar, Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { authLogout } from '../../redux/userRelated/userSlice';

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import ReportIcon from '@mui/icons-material/Report';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';
import WarningIcon from '@mui/icons-material/Warning';
import LogoutIcon from '@mui/icons-material/Logout';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import GradeIcon from '@mui/icons-material/Grade';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

// Styled components for Modern Gradient Theme
const LogoSection = styled(Box)(({ theme, collapsed }) => ({
    padding: collapsed ? theme.spacing(2, 1) : theme.spacing(3, 2),
    textAlign: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    marginBottom: theme.spacing(2),
    transition: 'all 0.3s ease',
    overflow: 'hidden',
}));

const LogoAvatar = styled(Avatar)(({ theme, collapsed }) => ({
    width: collapsed ? 40 : 60,
    height: collapsed ? 40 : 60,
    margin: '0 auto',
    marginBottom: collapsed ? 0 : theme.spacing(1),
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    color: '#667eea',
    fontSize: collapsed ? '1.5rem' : '2rem',
    fontWeight: 'bold',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, active, collapsed }) => ({
    margin: collapsed ? '4px 6px' : '6px 12px',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    backgroundColor: active ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
    border: active ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
    justifyContent: collapsed ? 'center' : 'flex-start',
    minHeight: collapsed ? 48 : 56,
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        transform: collapsed ? 'scale(1.05)' : 'translateX(8px)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        '& .MuiListItemIcon-root': {
            transform: 'scale(1.1)',
        },
    },
    '& .MuiListItemIcon-root': {
        transition: 'transform 0.3s ease',
        minWidth: collapsed ? 0 : 40,
        marginRight: collapsed ? 0 : theme.spacing(1),
    },
    '& .MuiListItemText-root': {
        display: collapsed ? 'none' : 'block',
        '& .MuiListItemText-primary': {
            fontSize: '0.95rem',
            fontWeight: active ? 600 : 500,
            color: active ? '#ffffff' : 'rgba(255, 255, 255, 0.9)',
            letterSpacing: '0.5px',
        },
    },
}));

const StyledDivider = styled(Divider)(({ theme, collapsed }) => ({
    margin: collapsed ? '12px 6px' : '20px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    height: '1px',
    transition: 'all 0.3s ease',
}));



const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        border: '1px solid rgba(255,255,255,0.8)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        minWidth: 400,
    },
}));

const ConfirmButton = styled(Button)(({ theme, variant }) => ({
    borderRadius: '12px',
    textTransform: 'none',
    fontWeight: 600,
    padding: '10px 24px',
    transition: 'all 0.3s ease-in-out',
    ...(variant === 'confirm' && {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: 'white',
        '&:hover': {
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(239, 68, 68, 0.3)',
        },
    }),
    ...(variant === 'cancel' && {
        background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
        color: 'white',
        '&:hover': {
            background: 'linear-gradient(135deg, #4b5563 0%, #374151 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(107, 114, 128, 0.3)',
        },
    }),
}));

const SideBar = ({ isCollapsed = false }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const isActiveRoute = (path) => {
        return location.pathname === path;
    };

    const handleLogoutClick = () => {
        setLogoutDialogOpen(true);
    };

    const handleLogoutConfirm = () => {
        dispatch(authLogout());
        navigate('/');
        setLogoutDialogOpen(false);
    };

    const handleLogoutCancel = () => {
        setLogoutDialogOpen(false);
    };

    const menuItems = [
        { path: "/", icon: <DashboardIcon />, text: "Dashboard" },
        { path: "/Admin/classes", icon: <ClassOutlinedIcon />, text: "Class" },
        { path: "/Admin/subjects", icon: <AssignmentIcon />, text: "Subject" },
        { path: "/Admin/students", icon: <PersonOutlineIcon />, text: "Student" },
        { path: "/Admin/teachers", icon: <SupervisorAccountOutlinedIcon />, text: "Teacher" },
        { path: "/Admin/finances", icon: <AccountBalanceIcon />, text: "Finance" },
        { path: "/Admin/librarian", icon: <LocalLibraryIcon />, text: "Librarian" },
        { path: "/Admin/marksheets", icon: <GradeIcon />, text: "Marksheet" },
        { path: "/Admin/exam-timetables", icon: <EventNoteIcon />, text: "Exam Timetable" },
        { path: "/Admin/notices", icon: <AnnouncementOutlinedIcon />, text: "Notice" },
        { path: "/Admin/complains", icon: <ReportIcon />, text: "Complain" },
    ];

    const userMenuItems = [
        { path: "/Admin/profile", icon: <AccountCircleOutlinedIcon />, text: "Profile" },
        { path: "/logout", icon: <LogoutIcon />, text: "Logout" },
    ];

    const renderMenuItem = (item, isCollapsed) => {
        const isLogout = item.path === "/logout";
        
        const button = (
            <StyledListItemButton
                key={item.path}
                component={isLogout ? 'div' : Link}
                to={isLogout ? undefined : item.path}
                onClick={isLogout ? handleLogoutClick : undefined}
                active={isActiveRoute(item.path) ? 1 : 0}
                collapsed={isCollapsed ? 1 : 0}
                sx={isLogout ? { color: '#ef4444' } : {}}
            >
                <ListItemIcon sx={{ 
                    color: isLogout ? '#ef4444' : (isActiveRoute(item.path) ? '#ffffff' : 'rgba(255, 255, 255, 0.85)'),
                    fontSize: '1.2rem'
                }}>
                    {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
            </StyledListItemButton>
        );

        return isCollapsed ? (
            <Tooltip 
                key={item.path}
                title={item.text} 
                placement="right"
                arrow
                sx={{
                    '& .MuiTooltip-tooltip': {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color: '#ffffff',
                        fontSize: '0.875rem',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    }
                }}
            >
                {button}
            </Tooltip>
        ) : button;
    };

    return (
        <Box sx={{ py: 1 }}>
            {/* Logo Section */}
            <LogoSection collapsed={isCollapsed ? 1 : 0}>
                <LogoAvatar collapsed={isCollapsed ? 1 : 0}>
                    <SchoolIcon sx={{ fontSize: isCollapsed ? '1.5rem' : '2rem' }} />
                </LogoAvatar>
                {!isCollapsed && (
                    <>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                color: '#ffffff', 
                                fontWeight: 700, 
                                letterSpacing: '1px',
                                fontSize: '1.1rem'
                            }}
                        >
                            School Management
                        </Typography>
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                color: 'rgba(255,255,255,0.7)', 
                                letterSpacing: '0.5px',
                                fontSize: '0.75rem'
                            }}
                        >
                            Virtual Dashboard
                        </Typography>
                    </>
                )}
            </LogoSection>

            {/* Main Navigation */}
            <React.Fragment>
                {menuItems.map((item) => renderMenuItem(item, isCollapsed))}
            </React.Fragment>
            
            <StyledDivider collapsed={isCollapsed ? 1 : 0} />
            
            {/* User Section */}
            <React.Fragment>
                {userMenuItems.map((item) => renderMenuItem(item, isCollapsed))}
            </React.Fragment>

            {/* Logout Confirmation Dialog */}
            <StyledDialog
                open={logoutDialogOpen}
                onClose={handleLogoutCancel}
                aria-labelledby="logout-dialog-title"
                aria-describedby="logout-dialog-description"
            >
                <DialogTitle id="logout-dialog-title" sx={{ textAlign: 'center', pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        <Avatar
                            sx={{
                                width: 60,
                                height: 60,
                                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                mr: 2,
                            }}
                        >
                            <WarningIcon sx={{ fontSize: 30 }} />
                        </Avatar>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        Confirm Logout
                    </Typography>
                </DialogTitle>
                
                <DialogContent sx={{ textAlign: 'center', pb: 3 }}>
                    <Typography variant="body1" sx={{ color: '#64748b', mb: 2 }}>
                        Are you sure you want to logout from your account?
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        You will need to login again to access your dashboard.
                    </Typography>
                </DialogContent>
                
                <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'center', gap: 2 }}>
                    <ConfirmButton
                        variant="cancel"
                        onClick={handleLogoutCancel}
                    >
                        Cancel
                    </ConfirmButton>
                    <ConfirmButton
                        variant="confirm"
                        onClick={handleLogoutConfirm}
                        startIcon={<LogoutIcon />}
                        autoFocus
                    >
                        Yes, Logout
                    </ConfirmButton>
                </DialogActions>
            </StyledDialog>
        </Box>
    );
};

export default SideBar;

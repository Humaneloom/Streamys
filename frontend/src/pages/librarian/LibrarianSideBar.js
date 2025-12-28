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
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import BookIcon from '@mui/icons-material/Book';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ReportIcon from '@mui/icons-material/Report';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

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
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        '& .MuiDialogTitle-root': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
            padding: theme.spacing(3),
            '& .MuiTypography-root': {
                fontWeight: 600,
                fontSize: '1.25rem',
            },
        },
        '& .MuiDialogContent-root': {
            padding: theme.spacing(3),
            textAlign: 'center',
            '& .MuiTypography-root': {
                color: '#4a5568',
                fontSize: '1rem',
                lineHeight: 1.6,
            },
        },
        '& .MuiDialogActions-root': {
            padding: theme.spacing(2, 3, 3),
            justifyContent: 'center',
            gap: theme.spacing(1),
        },
    },
}));

const LibrarianSideBar = ({ isCollapsed = false }) => {
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
        { path: "/Librarian/dashboard", icon: <DashboardIcon />, text: "Dashboard" },
        { path: "/Librarian/books", icon: <BookIcon />, text: "Books Management" },
        { path: "/Librarian/students", icon: <PersonOutlineIcon />, text: "Students" },
        { path: "/Librarian/staff", icon: <PeopleIcon />, text: "Staff" },
    ];

    const userMenuItems = [
        { path: "/Librarian/profile", icon: <AccountCircleOutlinedIcon />, text: "Profile" },
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
                    <LocalLibraryIcon sx={{ fontSize: isCollapsed ? '1.5rem' : '2rem' }} />
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
                            Library System
                        </Typography>
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                color: 'rgba(255,255,255,0.7)', 
                                letterSpacing: '0.5px',
                                fontSize: '0.75rem'
                            }}
                        >
                            Management Dashboard
                        </Typography>
                    </>
                )}
            </LogoSection>

            {/* Main Menu Items */}
            <Box sx={{ px: isCollapsed ? 0 : 1 }}>
                {menuItems.map((item) => renderMenuItem(item, isCollapsed))}
            </Box>

            {/* Bottom Section */}
            <Box sx={{ mt: 'auto', pt: 2 }}>
                <StyledDivider collapsed={isCollapsed ? 1 : 0} />
                {userMenuItems.map((item) => renderMenuItem(item, isCollapsed))}
            </Box>

            {/* Logout Confirmation Dialog */}
            <StyledDialog
                open={logoutDialogOpen}
                onClose={handleLogoutCancel}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Confirm Logout
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to logout from your account?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleLogoutCancel}
                        variant="outlined"
                        sx={{ 
                            borderColor: '#cbd5e0',
                            color: '#4a5568',
                            '&:hover': {
                                borderColor: '#a0aec0',
                                backgroundColor: 'rgba(160, 174, 192, 0.04)',
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleLogoutConfirm}
                        variant="contained"
                        sx={{ 
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            color: 'white',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                            }
                        }}
                    >
                        Logout
                    </Button>
                </DialogActions>
            </StyledDialog>
        </Box>
    );
};

export default LibrarianSideBar;

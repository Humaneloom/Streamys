import React, { useState } from 'react';
import { 
    Box, 
    Avatar, 
    Menu, 
    MenuItem, 
    ListItemIcon, 
    ListItemText,
    Divider, 
    IconButton, 
    Tooltip, 
    Typography,
    Badge,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import { 
    Settings, 
    Logout, 
    Person, 
    AdminPanelSettings,
    School,
    Dashboard,
    Notifications,
    Security,
    Warning
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { authLogout } from '../redux/userRelated/userSlice';

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 40,
    height: 40,
    fontSize: '1.2rem',
    fontWeight: 600,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    border: '2px solid rgba(255, 255, 255, 0.8)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'scale(1.1)',
        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
    },
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: '16px',
        minWidth: 280,
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

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    borderRadius: '12px',
    margin: '4px 8px',
    padding: '12px 16px',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        transform: 'translateX(4px)',
        '& .MuiListItemIcon-root': {
            color: 'white',
        },
    },
    '& .MuiListItemIcon-root': {
        color: '#667eea',
        minWidth: 40,
    },
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

const AccountMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const { currentRole, currentUser } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogoutClick = () => {
        setLogoutDialogOpen(true);
        handleClose();
    };

    const handleLogoutConfirm = () => {
        dispatch(authLogout());
        navigate('/');
        setLogoutDialogOpen(false);
    };

    const handleLogoutCancel = () => {
        setLogoutDialogOpen(false);
    };

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A';
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'Admin':
                return <AdminPanelSettings />;
            case 'Teacher':
                return <School />;
            case 'Student':
                return <Person />;
            default:
                return <Person />;
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'Admin':
                return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            case 'Teacher':
                return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
            case 'Student':
                return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
            default:
                return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip 
                    title={`${currentUser?.name} - ${currentRole}`}
                    arrow
                    placement="bottom"
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{ 
                                ml: 2,
                                p: 0.5,
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                            }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                    <Box
                                        sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: '50%',
                                            background: '#10b981',
                                            border: '2px solid white',
                                        }}
                                    />
                                }
                            >
                                <StyledAvatar>
                                    {getInitials(currentUser?.name)}
                                </StyledAvatar>
                            </Badge>
                        </IconButton>
                    </motion.div>
                </Tooltip>
            </Box>

            <StyledMenu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {/* Profile Header */}
                <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                    <StyledAvatar sx={{ width: 60, height: 60, fontSize: '1.8rem', mx: 'auto', mb: 2 }}>
                        {getInitials(currentUser?.name)}
                    </StyledAvatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                        {currentUser?.name}
                    </Typography>
                    <Chip
                        icon={getRoleIcon(currentRole)}
                        label={currentRole}
                        size="small"
                        sx={{
                            background: getRoleColor(currentRole),
                            color: 'white',
                            fontWeight: 600,
                            '& .MuiChip-icon': {
                                color: 'white',
                            },
                        }}
                    />
                    <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
                        {currentUser?.schoolName}
                    </Typography>
                </Box>

                {/* Menu Items */}
                <StyledMenuItem component={Link} to={`/${currentRole}/profile`}>
                    <ListItemIcon>
                        <Person />
                    </ListItemIcon>
                    <ListItemText 
                        primary="My Profile" 
                        secondary="View and edit your profile"
                    />
                </StyledMenuItem>

                <StyledMenuItem component={Link} to={`/${currentRole}/dashboard`}>
                    <ListItemIcon>
                        <Dashboard />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Dashboard" 
                        secondary="Go to main dashboard"
                    />
                </StyledMenuItem>

                <StyledMenuItem>
                    <ListItemIcon>
                        <Notifications />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Notifications" 
                        secondary="View your notifications"
                    />
                </StyledMenuItem>

                <Divider sx={{ my: 1, mx: 2 }} />

                <StyledMenuItem>
                    <ListItemIcon>
                        <Settings />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Settings" 
                        secondary="Account settings"
                    />
                </StyledMenuItem>

                <StyledMenuItem>
                    <ListItemIcon>
                        <Security />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Security" 
                        secondary="Privacy and security"
                    />
                </StyledMenuItem>

                <Divider sx={{ my: 1, mx: 2 }} />

                <StyledMenuItem onClick={handleLogoutClick} sx={{ color: '#ef4444' }}>
                    <ListItemIcon>
                        <Logout sx={{ color: '#ef4444' }} />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Logout" 
                        secondary="Sign out of your account"
                    />
                </StyledMenuItem>
            </StyledMenu>

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
                            <Warning sx={{ fontSize: 30 }} />
                        </Avatar>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
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
                        startIcon={<Logout />}
                        autoFocus
                    >
                        Yes, Logout
                    </ConfirmButton>
                </DialogActions>
            </StyledDialog>
        </>
    );
};

export default AccountMenu;
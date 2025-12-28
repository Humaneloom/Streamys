import React from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Avatar,
    Grid,
    Chip,
    Divider,
    Fade,
    Zoom,
    Slide
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Business as BusinessIcon,
    School as SchoolIcon,
    Security as SecurityIcon,
    Verified as VerifiedIcon
} from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: '24px',
    border: '1px solid rgba(255,255,255,0.8)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    position: 'relative',
    '&:hover': {
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
        zIndex: 1,
    }
}));

const ProfileCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: '24px',
    border: '1px solid rgba(255,255,255,0.8)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    position: 'relative',
    '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
        zIndex: 1,
    }
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
    width: 140,
    height: 140,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontSize: '3.5rem',
    fontWeight: 'bold',
    boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)',
    border: '6px solid white',
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        background: 'linear-gradient(45deg, #667eea, #764ba2, #667eea)',
        borderRadius: '50%',
        zIndex: -1,
        animation: 'rotate 3s linear infinite',
    },
    '@keyframes rotate': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' }
    }
}));

const InfoCard = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid rgba(255,255,255,0.3)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    }
}));

const StatusChip = styled(Chip)(({ theme }) => ({
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    fontWeight: 600,
    borderRadius: '20px',
    '& .MuiChip-label': {
        padding: '8px 16px',
    }
}));

const FinanceProfile = () => {
    const { currentUser } = useSelector(state => state.user);
    
    // Use actual user data from Redux store
    const profileData = {
        name: currentUser.name || 'Finance User',
        email: currentUser.email || 'finance@school.com',
        phone: currentUser.phone || '+91 0000000000',
        department: currentUser.department || 'Finance Department',
        schoolName: currentUser.schoolName || 'School',
        role: currentUser.role || 'Finance',
        employeeId: currentUser._id || 'FIN001'
    };

    const profileInfo = [
        {
            icon: <PersonIcon />,
            label: 'Full Name',
            value: profileData.name,
            color: '#667eea'
        },
        {
            icon: <EmailIcon />,
            label: 'Email Address',
            value: profileData.email,
            color: '#10b981'
        },
        {
            icon: <PhoneIcon />,
            label: 'Phone Number',
            value: profileData.phone,
            color: '#f59e0b'
        },
        {
            icon: <BusinessIcon />,
            label: 'Department',
            value: profileData.department,
            color: '#8b5cf6'
        },
        {
            icon: <SchoolIcon />,
            label: 'School',
            value: profileData.schoolName,
            color: '#ef4444'
        }
    ];

    return (
        <Box sx={{ 
            p: 4, 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Pattern */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
                zIndex: 0
            }} />

            <Fade in timeout={1000}>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    {/* Header */}
                    <Box sx={{ mb: 6, textAlign: 'center' }}>
                        <Zoom in timeout={800}>
                            <Typography variant="h2" sx={{ 
                                fontWeight: 800, 
                                color: '#1e293b', 
                                mb: 2,
                                textShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                Finance Profile
                            </Typography>
                        </Zoom>
                        <Slide direction="up" in timeout={1200}>
                            <Typography variant="h6" sx={{ 
                                color: '#64748b', 
                                fontWeight: 500,
                                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                                Manage your finance account information and settings
                            </Typography>
                        </Slide>
                    </Box>

                    <Grid container spacing={4}>
                        {/* Profile Card */}
                        <Grid item xs={12} md={4}>
                            <Slide direction="right" in timeout={1000}>
                                <ProfileCard>
                                    <CardContent sx={{ p: 5, textAlign: 'center', position: 'relative' }}>
                                        <Zoom in timeout={1200}>
                                            <ProfileAvatar sx={{ mx: 'auto', mb: 4 }}>
                                                {profileData.name.charAt(0).toUpperCase()}
                                            </ProfileAvatar>
                                        </Zoom>
                                        
                                        <Fade in timeout={1400}>
                                            <Typography variant="h4" sx={{ 
                                                fontWeight: 700, 
                                                color: '#1e293b', 
                                                mb: 2,
                                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent'
                                            }}>
                                                {profileData.name}
                                            </Typography>
                                        </Fade>
                                        
                                        <Fade in timeout={1600}>
                                            <Typography variant="h6" sx={{ 
                                                color: '#64748b', 
                                                mb: 3,
                                                fontWeight: 500
                                            }}>
                                                {profileData.role}
                                            </Typography>
                                        </Fade>
                                        
                                        <Fade in timeout={1800}>
                                            <Chip
                                                label={`ID: ${profileData.employeeId.slice(-8)}`}
                                                sx={{
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    color: '#ffffff',
                                                    fontWeight: 600,
                                                    fontSize: '0.9rem',
                                                    mb: 3
                                                }}
                                            />
                                        </Fade>
                                        
                                        <Divider sx={{ my: 4, borderColor: 'rgba(102, 126, 234, 0.2)' }} />
                                        
                                        <Fade in timeout={2000}>
                                            <Box>
                                                <Typography variant="body1" sx={{ 
                                                    color: '#64748b',
                                                    fontWeight: 500,
                                                    mb: 1
                                                }}>
                                                    Finance Department Manager
                                                </Typography>
                                                <Typography variant="body2" sx={{ 
                                                    color: '#94a3b8',
                                                    lineHeight: 1.6
                                                }}>
                                                    Managing all financial operations, student payments, and expense tracking
                                                </Typography>
                                            </Box>
                                        </Fade>
                                    </CardContent>
                                </ProfileCard>
                            </Slide>
                        </Grid>

                        {/* Profile Information */}
                        <Grid item xs={12} md={8}>
                            <Slide direction="left" in timeout={1200}>
                                <StyledCard>
                                    <CardContent sx={{ p: 5, position: 'relative', zIndex: 2 }}>
                                        <Fade in timeout={1400}>
                                            <Typography variant="h5" sx={{ 
                                                fontWeight: 700, 
                                                color: '#1e293b', 
                                                mb: 4,
                                                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                            }}>
                                                Personal Information
                                            </Typography>
                                        </Fade>
                                        
                                        <Grid container spacing={3}>
                                            {profileInfo.map((info, index) => (
                                                <Grid item xs={12} sm={6} key={index}>
                                                    <Fade in timeout={1600 + index * 200}>
                                                        <InfoCard>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                                <Avatar
                                                                    sx={{
                                                                        bgcolor: info.color,
                                                                        color: 'white',
                                                                        width: 50,
                                                                        height: 50,
                                                                        mr: 3,
                                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                                                    }}
                                                                >
                                                                    {info.icon}
                                                                </Avatar>
                                                                <Box>
                                                                    <Typography variant="body2" sx={{ 
                                                                        color: '#64748b', 
                                                                        fontWeight: 600,
                                                                        mb: 0.5
                                                                    }}>
                                                                        {info.label}
                                                                    </Typography>
                                                                    <Typography variant="body1" sx={{ 
                                                                        color: '#1e293b', 
                                                                        fontWeight: 700,
                                                                        fontSize: '1.1rem'
                                                                    }}>
                                                                        {info.value}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </InfoCard>
                                                    </Fade>
                                                </Grid>
                                            ))}
                                        </Grid>
                                        
                                        <Divider sx={{ my: 5, borderColor: 'rgba(102, 126, 234, 0.2)' }} />
                                        
                                        {/* Account Information */}
                                        <Fade in timeout={2000}>
                                            <Typography variant="h5" sx={{ 
                                                fontWeight: 700, 
                                                color: '#1e293b', 
                                                mb: 4,
                                                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                            }}>
                                                Account Information
                                            </Typography>
                                        </Fade>
                                        
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <Fade in timeout={2200}>
                                                    <InfoCard>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                            <Avatar
                                                                sx={{
                                                                    bgcolor: '#10b981',
                                                                    color: 'white',
                                                                    width: 50,
                                                                    height: 50,
                                                                    mr: 3,
                                                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                                                                }}
                                                            >
                                                                <VerifiedIcon />
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="body2" sx={{ 
                                                                    color: '#64748b', 
                                                                    fontWeight: 600,
                                                                    mb: 0.5
                                                                }}>
                                                                    Account Status
                                                                </Typography>
                                                                <StatusChip
                                                                    label="Active"
                                                                    size="small"
                                                                />
                                                            </Box>
                                                        </Box>
                                                    </InfoCard>
                                                </Fade>
                                            </Grid>
                                            
                                            <Grid item xs={12} sm={6}>
                                                <Fade in timeout={2400}>
                                                    <InfoCard>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                            <Avatar
                                                                sx={{
                                                                    bgcolor: '#3b82f6',
                                                                    color: 'white',
                                                                    width: 50,
                                                                    height: 50,
                                                                    mr: 3,
                                                                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                                                                }}
                                                            >
                                                                <SecurityIcon />
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="body2" sx={{ 
                                                                    color: '#64748b', 
                                                                    fontWeight: 600,
                                                                    mb: 0.5
                                                                }}>
                                                                    Access Level
                                                                </Typography>
                                                                <Typography variant="body1" sx={{ 
                                                                    color: '#1e293b', 
                                                                    fontWeight: 700,
                                                                    fontSize: '1.1rem'
                                                                }}>
                                                                    Finance Manager
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </InfoCard>
                                                </Fade>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </StyledCard>
                            </Slide>
                        </Grid>
                    </Grid>
                </Box>
            </Fade>
        </Box>
    );
};

export default FinanceProfile; 
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotices } from '../redux/noticeRelated/noticeHandle';
import { Grid, Card, CardContent, Typography, Chip, Box, Skeleton, Fade, Zoom } from '@mui/material';
import { styled } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const NoticeCard = styled(Card)(({ theme }) => ({
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    border: '1px solid rgba(255,255,255,0.8)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'visible',
    position: 'relative',
    '&:hover': {
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px 20px 0 0',
        opacity: 0,
        transition: 'opacity 0.3s ease',
    },
    '&:hover::before': {
        opacity: 1,
    }
}));

const DateChip = styled(Chip)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '0.85rem',
    borderRadius: '12px',
    padding: '8px 12px',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
    }
}));

const NoticeTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    fontSize: '1.25rem',
    color: '#1e293b',
    marginBottom: '12px',
    lineHeight: 1.3,
    transition: 'color 0.3s ease',
}));

const NoticeDescription = styled(Typography)(({ theme }) => ({
    color: '#64748b',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    marginBottom: '16px',
    fontWeight: 400,
}));

const SectionHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    padding: '16px 0',
    borderBottom: '2px solid rgba(102, 126, 234, 0.1)',
}));

const HeaderIcon = styled(Box)(({ theme }) => ({
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    '& svg': {
        color: '#ffffff',
        fontSize: '24px',
    }
}));

const LoadingSkeleton = () => (
    <Grid container spacing={3}>
        {[1, 2, 3].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
                <NoticeCard>
                    <CardContent sx={{ p: 3 }}>
                        <Skeleton variant="text" width="80%" height={32} sx={{ mb: 2 }} />
                        <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
                        <Skeleton variant="rectangular" width="120px" height={32} sx={{ borderRadius: '12px' }} />
                    </CardContent>
                </NoticeCard>
            </Grid>
        ))}
    </Grid>
);

const EmptyState = () => (
    <Box sx={{ 
        textAlign: 'center', 
        py: 8, 
        px: 4,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderRadius: '20px',
        border: '2px dashed rgba(102, 126, 234, 0.2)'
    }}>
        <NotificationsIcon sx={{ 
            fontSize: 64, 
            color: '#94a3b8', 
            mb: 2,
            opacity: 0.6
        }} />
        <Typography variant="h6" sx={{ 
            fontWeight: 600, 
            color: '#64748b', 
            mb: 1 
        }}>
            No Notices Available
        </Typography>
        <Typography variant="body2" sx={{ 
            color: '#94a3b8',
            maxWidth: '400px',
            mx: 'auto'
        }}>
            There are currently no notices to display. Check back later for updates!
        </Typography>
    </Box>
);

const SeeNotice = () => {
    const dispatch = useDispatch();
    const { currentUser, currentRole } = useSelector(state => state.user);
    const { noticesList, loading, error, response } = useSelector((state) => state.notice);

    useEffect(() => {
        if (currentRole === "Admin") {
            dispatch(getAllNotices(currentUser._id, "Notice"));
        }
        else {
            dispatch(getAllNotices(currentUser.school._id, "Notice"));
        }
    }, [dispatch]);

    if (error) {
        console.log(error);
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (date.toString() === "Invalid Date") return "Invalid Date";
        
        const today = new Date();
        const diffTime = Math.abs(today - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return "Today";
        if (diffDays === 2) return "Yesterday";
        if (diffDays <= 7) return `${diffDays - 1} days ago`;
        
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    return (
        <Box sx={{ mt: 2, mr: 2 }}>
            <SectionHeader>
                <HeaderIcon>
                    <NotificationsIcon />
                </HeaderIcon>
                <Box>
                    <Typography variant="h4" sx={{ 
                        fontWeight: 700, 
                        color: '#1e293b',
                        fontSize: { xs: '1.75rem', md: '2.125rem' }
                    }}>
                        Notices
                    </Typography>
                    <Typography variant="body2" sx={{ 
                        color: '#64748b',
                        mt: 0.5
                    }}>
                        Stay updated with the latest announcements
                    </Typography>
                </Box>
            </SectionHeader>

            {loading ? (
                <LoadingSkeleton />
            ) : response ? (
                <EmptyState />
            ) : (
                <Fade in={true} timeout={800}>
                    <Grid container spacing={3}>
                        {Array.isArray(noticesList) && noticesList.length > 0 &&
                            noticesList.map((notice, index) => {
                                const dateString = formatDate(notice.date);
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={notice._id}>
                                        <Zoom in={true} timeout={600 + (index * 100)}>
                                            <NoticeCard>
                                                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                    <Box>
                                                        <NoticeTitle variant="h6" gutterBottom>
                                                            {notice.title}
                                                        </NoticeTitle>
                                                        <NoticeDescription variant="body2">
                                                            {notice.details}
                                                        </NoticeDescription>
                                                    </Box>
                                                    <Box sx={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'space-between',
                                                        mt: 2
                                                    }}>
                                                        <DateChip 
                                                            label={dateString} 
                                                            icon={<AccessTimeIcon sx={{ fontSize: '16px' }} />}
                                                        />
                                                    </Box>
                                                </CardContent>
                                            </NoticeCard>
                                        </Zoom>
                                    </Grid>
                                );
                            })
                        }
                    </Grid>
                </Fade>
            )}
        </Box>
    )
}

export default SeeNotice
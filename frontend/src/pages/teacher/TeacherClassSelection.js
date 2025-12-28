import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Grid, Card, CardContent, Button, 
    Container, Avatar, Chip, CircularProgress
} from '@mui/material';
import {
    School as SchoolIcon,
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    TrendingUp as TrendingUpIcon,
    ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { getTeacherClasses } from '../../redux/sclassRelated/sclassHandle';

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: 16,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: '2px solid transparent',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
        borderColor: '#3b82f6',
    },
}));

const ClassAvatar = styled(Avatar)(({ theme }) => ({
    width: 80,
    height: 80,
    fontSize: '2rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    margin: '0 auto',
    marginBottom: theme.spacing(2),
}));

const TeacherClassSelection = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { sclassStudents, loading } = useSelector((state) => state.sclass);

    useEffect(() => {
        if (currentUser?._id) {
            console.log('Fetching classes for teacher:', currentUser._id);
            dispatch(getTeacherClasses(currentUser._id));
        }
    }, [dispatch, currentUser?._id]);

    console.log('Current user:', currentUser);
    console.log('Sclass students (classes):', sclassStudents);

    const handleClassSelect = (classId) => {
        // Navigate to the specific class details page
        navigate(`/Teacher/class/${classId}`);
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Header Section */}
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography 
                    variant="h3" 
                    sx={{ 
                        fontWeight: 800, 
                        mb: 2,
                        background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                >
                    Select Your Class
                </Typography>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        color: 'text.secondary',
                        mb: 2
                    }}
                >
                    Choose a class to view its details and manage students
                </Typography>
                <Typography 
                    variant="body1" 
                    sx={{ 
                        color: 'text.secondary',
                        maxWidth: 600,
                        mx: 'auto'
                    }}
                >
                    You can view student lists, manage attendance, grades, and more for each class.
                </Typography>
            </Box>

            {/* Classes Grid */}
            <Grid container spacing={4}>
                {sclassStudents && sclassStudents.length > 0 ? (
                    sclassStudents.map((classItem, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={classItem.classId}>
                            <StyledCard onClick={() => handleClassSelect(classItem.classId)}>
                                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                                                                    <ClassAvatar>
                                    {classItem.className}
                                </ClassAvatar>
                                    
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
                                        {classItem.className}
                                    </Typography>
                                    
                                    <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                                        {classItem.subjectName}
                                    </Typography>

                                    {/* Statistics */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <PeopleIcon sx={{ color: '#3b82f6', fontSize: 24, mb: 0.5 }} />
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                {classItem.studentCount || 0}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                Students
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <TrendingUpIcon sx={{ color: '#10b981', fontSize: 24, mb: 0.5 }} />
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                {classItem.attendancePercentage || 0}%
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                Attendance
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Action Button */}
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{
                                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                            color: 'white',
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            py: 1.5,
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 8px 25px rgba(37, 99, 235, 0.3)'
                                            },
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        View Class
                                    </Button>
                                </CardContent>
                            </StyledCard>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <SchoolIcon sx={{ fontSize: 64, color: '#64748b', mb: 2 }} />
                            <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                                No Classes Assigned
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                You haven't been assigned to any classes yet. Please contact your administrator.
                            </Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>

            {/* Loading State */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            )}
        </Container>
    );
};

export default TeacherClassSelection; 
import React, { useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Container,
    Avatar,
    Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import CountUp from 'react-countup';
import { getClassStudents, getSubjectDetails } from '../../redux/sclassRelated/sclassHandle';
import SeeNotice from '../../components/SeeNotice';
import Students from "../../assets/img1.png";
import Lessons from "../../assets/subjects.svg";
import Tests from "../../assets/assignment.svg";
import Time from "../../assets/time.svg";
import TeacherSchedule from './TeacherSchedule';
import TeacherDailySchedule from './TeacherDailySchedule';
import TeacherQuickStats from './TeacherQuickStats';
import axios from 'axios';
import { useState } from 'react';

const GradientCard = styled(Card)(({ theme, gradient }) => ({
    background: gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease-in-out',
    overflow: 'visible',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
    },
}));

const StatsCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #ffffff 0%, #e8ecf1 100%)',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
    border: '1px solid rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease-in-out',
    overflow: 'visible',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    },
}));

const GradientIcon = styled(Box)(({ theme, color }) => ({
    width: 60,
    height: 60,
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    '& img': {
        width: 36,
        height: 36,
    },
}));

const TeacherHomePage = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { subjectDetails, sclassStudents } = useSelector((state) => state.sclass);
    const classID = currentUser.teachSclass?._id;
    const subjectID = currentUser.teachSubject?._id;

    // Schedule state
    const [schedule, setSchedule] = useState(null);
    const [loadingSchedule, setLoadingSchedule] = useState(true);
    const [scheduleError, setScheduleError] = useState('');
    const teacherId = currentUser?._id;
    const API_BASE_URL = process.env.REACT_APP_BASE_URL || '';

    useEffect(() => {
        dispatch(getSubjectDetails(subjectID, "Subject"));
        dispatch(getClassStudents(classID));
    }, [dispatch, subjectID, classID]);

    useEffect(() => {
        const fetchSchedule = async () => {
            setLoadingSchedule(true);
            setScheduleError('');
            try {
                const res = await axios.get(`${API_BASE_URL}/Teacher/${teacherId}/schedule`);
                if (res.data && res.data.schedule && Object.keys(res.data.schedule).length > 0) {
                    setSchedule(res.data.schedule);
                } else {
                    setSchedule(null);
                }
            } catch (err) {
                setScheduleError('Failed to load schedule.');
            } finally {
                setLoadingSchedule(false);
            }
        };
        if (teacherId) fetchSchedule();
    }, [teacherId]);

    const numberOfStudents = sclassStudents && sclassStudents.length;
    const numberOfSessions = subjectDetails && subjectDetails.sessions;
    const teacherName = currentUser?.name || "Teacher";

    // Stats cards for teacher
    const statsCards = [
        {
            title: "Active Students",
            value: numberOfStudents,
            icon: <img src={Students} alt="Students" />,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
        {
            title: "Teaching Sessions",
            value: numberOfSessions,
            icon: <img src={Lessons} alt="Lessons" />,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        },
        {
            title: "Assignments Graded",
            value: 24,
            icon: <img src={Tests} alt="Tests" />,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        },
        {
            title: "Teaching Hours",
            value: 30,
            icon: <img src={Time} alt="Time" />,
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            suffix: "hrs"
        },
    ];

    // Teacher subject for schedule
    const teacherSubject = currentUser?.teachSubject?.subName || '';

    return (
        <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
            {/* Welcome Section */}
            <GradientCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" sx={{ mb: 4, p: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>
                        {`Welcome back, ${teacherName}!`} <span role="img" aria-label="wave">👋</span>
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                        Here's your teaching overview and today's class schedule
                    </Typography>
                    <Chip
                        label="Last updated: 2 minutes ago"
                        sx={{
                            background: 'rgba(255,255,255,0.2)',
                            color: '#ffffff',
                            border: '1px solid rgba(255,255,255,0.3)'
                        }}
                    />
                </Box>
            </GradientCard>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {statsCards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <StatsCard>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontWeight: 500 }}>
                                            {card.title}
                                        </Typography>
                                        <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                            <CountUp start={0} end={card.value} duration={2} suffix={card.suffix || ''} />
                                        </Typography>
                                    </Box>
                                    <GradientIcon color={card.gradient}>
                                        {card.icon}
                                    </GradientIcon>
                                </Box>
                            </CardContent>
                        </StatsCard>
                    </Grid>
                ))}
            </Grid>

            {/* Daily Schedule and Quick Stats Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Quick Stats Column */}
                <Grid item xs={12} md={4}>
                    <TeacherQuickStats 
                        currentUser={currentUser}
                        sclassStudents={sclassStudents}
                        subjectDetails={subjectDetails}
                    />
                </Grid>
                
                {/* Daily Schedule Column */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ 
                        borderRadius: '16px', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                        border: '1px solid rgba(0,0,0,0.08)',
                        transition: 'all 0.3s ease-in-out',
                        height: '100%',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                        }
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            {loadingSchedule ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                                    <Typography>Loading schedule...</Typography>
                                </Box>
                            ) : scheduleError ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                                    <Typography color="error">{scheduleError}</Typography>
                                </Box>
                            ) : (
                                <TeacherDailySchedule schedule={schedule} />
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Weekly Schedule Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                    <Card sx={{ 
                        borderRadius: '16px', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        background: 'linear-gradient(135deg, #ffffff 0%, #e8ecf1 100%)',
                        border: '1px solid rgba(0,0,0,0.08)',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                        }
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea', mb: 2 }}>
                                Weekly Schedule Overview
                            </Typography>
                            <TeacherSchedule schedule={schedule} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Notices Section */}
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card sx={{ 
                        borderRadius: '16px', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        background: 'linear-gradient(135deg, #ffffff 0%, #e8ecf1 100%)',
                        border: '1px solid rgba(0,0,0,0.08)',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                        }
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea', mb: 2 }}>
                                School Notices & Announcements
                            </Typography>
                            <SeeNotice />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default TeacherHomePage;
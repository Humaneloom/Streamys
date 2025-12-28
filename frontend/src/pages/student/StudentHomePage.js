import React, { useEffect, useState } from 'react';
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
import { calculateOverallAttendancePercentage } from '../../components/attendanceCalculator';
import CustomAttendanceGrid from '../../components/CustomAttendanceGrid';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import SeeNotice from '../../components/SeeNotice';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import Subject from "../../assets/subjects.svg";
import Assignment from "../../assets/assignment.svg";
import Students from "../../assets/img1.png";
import Time from "../../assets/time.svg";
import StudentSchedule from './StudentSchedule';
import StudentCalendar from '../../components/StudentCalendar';
import axios from 'axios';

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

const StudentHomePage = () => {
    const dispatch = useDispatch();
    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);
    
    // Get the student data from the array
    const studentData = userDetails && userDetails.length > 0 ? userDetails[0] : null;

    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [schedule, setSchedule] = useState({});
    const [loadingSchedule, setLoadingSchedule] = useState(false);
    const [scheduleError, setScheduleError] = useState('');

    const classID = currentUser.sclassName._id;
    const studentId = currentUser._id;
    const API_BASE_URL = process.env.REACT_APP_BASE_URL || '';

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
        dispatch(getSubjectList(classID, "ClassSubjects"));
    }, [dispatch, currentUser._id, classID]);

    useEffect(() => {
        const fetchSchedule = async () => {
            setLoadingSchedule(true);
            setScheduleError('');
            try {
                const res = await axios.get(`${API_BASE_URL}/Student/${studentId}/schedule`);
                if (res.data && res.data.schedule && Object.keys(res.data.schedule).length > 0) {
                    setSchedule(res.data.schedule);
                } else {
                    // Set a default schedule if none exists
                    setSchedule({
                        'Monday': ['Mathematics', 'English', 'Physics', 'Chemistry', 'Lunch Break', 'Biology', 'History', 'Computer Science'],
                        'Tuesday': ['English', 'Mathematics', 'Chemistry', 'Physics', 'Lunch Break', 'Biology', 'Geography', 'Art'],
                        'Wednesday': ['Physics', 'Mathematics', 'English', 'Biology', 'Lunch Break', 'Chemistry', 'History', 'Physical Education'],
                        'Thursday': ['Chemistry', 'English', 'Mathematics', 'Physics', 'Lunch Break', 'Biology', 'Geography', 'Music'],
                        'Friday': ['Biology', 'Mathematics', 'Chemistry', 'English', 'Lunch Break', 'Physics', 'History', 'Computer Science'],
                    });
                }
            } catch (err) {
                console.error('Schedule fetch error:', err);
                setScheduleError('Failed to load schedule.');
                // Set default schedule on error
                setSchedule({
                    'Monday': ['Mathematics', 'English', 'Physics', 'Chemistry', 'Lunch Break', 'Biology', 'History', 'Computer Science'],
                    'Tuesday': ['English', 'Mathematics', 'Chemistry', 'Physics', 'Lunch Break', 'Biology', 'Geography', 'Art'],
                    'Wednesday': ['Physics', 'Mathematics', 'English', 'Biology', 'Lunch Break', 'Chemistry', 'History', 'Physical Education'],
                    'Thursday': ['Chemistry', 'English', 'Mathematics', 'Physics', 'Lunch Break', 'Biology', 'Geography', 'Music'],
                    'Friday': ['Biology', 'Mathematics', 'Chemistry', 'English', 'Lunch Break', 'Physics', 'History', 'Computer Science'],
                });
            } finally {
                setLoadingSchedule(false);
            }
        };
        if (studentId) fetchSchedule();
    }, [studentId]);

    const numberOfSubjects = subjectsList && subjectsList.length;

    useEffect(() => {
        if (studentData) {
            setSubjectAttendance(studentData.attendance || []);
        }
    }, [studentData]);

    // Calculate attendance data more accurately
    const calculateAttendanceData = (attendance) => {
        if (!attendance || !Array.isArray(attendance) || attendance.length === 0) {
            return [
                { name: 'Present', value: 0 },
                { name: 'Absent', value: 0 }
            ];
        }

        let presentCount = 0;
        let absentCount = 0;

        attendance.forEach(item => {
            if (item.status === 'Present') {
                presentCount++;
            } else if (item.status === 'Absent') {
                absentCount++;
            }
        });

        const total = presentCount + absentCount;
        
        if (total === 0) {
            return [
                { name: 'Present', value: 0 },
                { name: 'Absent', value: 0 }
            ];
        }

        const presentPercentage = (presentCount / total) * 100;
        const absentPercentage = (absentCount / total) * 100;

        return [
            { name: 'Present', value: presentPercentage },
            { name: 'Absent', value: absentPercentage }
        ];
    };

    const chartData = calculateAttendanceData(subjectAttendance);
    const overallAttendancePercentage = chartData[0]?.value || 0;
    
    // Debug logging
    console.log('Subject Attendance Data:', subjectAttendance);
    console.log('Calculated Chart Data:', chartData);
    console.log('Overall Attendance Percentage:', overallAttendancePercentage);

    const studentName = currentUser?.name || "Student";

    // Stats cards for student
    const statsCards = [
        {
            title: "Total Subjects",
            value: numberOfSubjects,
            icon: <img src={Subject} alt="Subjects" />,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
        {
            title: "Total Assignments",
            value: 15,
            icon: <img src={Assignment} alt="Assignments" />,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        },
        {
            title: "Attendance Rate",
            value: overallAttendancePercentage,
            icon: <img src={Students} alt="Attendance" />,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            suffix: "%"
        },
        {
            title: "Study Hours",
            value: 6,
            icon: <img src={Time} alt="Time" />,
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            suffix: "hrs"
        },
    ];

    return (
        <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
            {/* Welcome Section */}
            <GradientCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" sx={{ mb: 4, p: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>
                        {`Welcome back, ${studentName}!`} <span role="img" aria-label="wave">👋</span>
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                        Here's your learning progress and today's schedule
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

            {/* Calendar and Schedule Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Calendar Column */}
                <Grid item xs={12} md={4}>
                    <StudentCalendar />
                </Grid>
                
                {/* Schedule Column */}
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
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea', mb: 2 }}>
                                Today's Schedule
                            </Typography>
                            {loadingSchedule ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                                    <Typography>Loading schedule...</Typography>
                                </Box>
                            ) : scheduleError ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                                    <Typography color="error">{scheduleError}</Typography>
                                </Box>
                            ) : (
                                <StudentSchedule schedule={schedule} />
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Attendance Chart */}
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
                                Attendance Overview
                            </Typography>
                            <Box sx={{ minHeight: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {response ? (
                                    <Typography variant="h6">No Attendance Found</Typography>
                                ) : loading ? (
                                    <Typography variant="h6">Loading...</Typography>
                                ) : subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ? (
                                    <CustomAttendanceGrid data={subjectAttendance} />
                                ) : (
                                    <Typography variant="h6">No Attendance Found</Typography>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Notices Section */}
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <SeeNotice />
                </Grid>
            </Grid>
        </Container>
    );
};

export default StudentHomePage;
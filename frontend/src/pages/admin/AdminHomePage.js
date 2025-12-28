import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Chip,
    List,
    ListItem,
    ListItemText,
    Container,
    Avatar,
    Divider
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    People as PeopleIcon,
    School as SchoolIcon,
    Class as ClassIcon,
    Book as BookIcon,
    SupervisorAccount as SupervisorAccountIcon,
    AttachMoney as AttachMoneyIcon,
    Assignment as AssignmentIcon,
    Announcement as AnnouncementIcon,
    AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import CountUp from 'react-countup';
import CustomPieChart from '../../components/CustomPieChart';
import CustomLineChart from '../../components/CustomLineChart';
import { Link } from 'react-router-dom';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import CustomBarChart from '../../components/CustomBarChart';
import axios from 'axios';

// Styled Components for Modern Gradient Theme
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

const ChartCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #f1f5f9 0%, #dbe4f0 100%)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    border: '1px solid rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
    },
}));

const ActivityCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #f1f5f9 0%, #dbe4f0 100%)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    border: '1px solid rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
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
    '& .MuiSvgIcon-root': {
        fontSize: '2rem',
        color: '#ffffff',
    },
}));

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const [financeData, setFinanceData] = useState(null);
    const [financeLoading, setFinanceLoading] = useState(false);
    const [lastFinanceUpdate, setLastFinanceUpdate] = useState(null);
    const [financeError, setFinanceError] = useState(null);
    
    const { studentsList } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { teachersList } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector(state => state.user);

    const adminID = currentUser._id;

    // Function to fetch finance data
    const fetchFinanceData = async () => {
        try {
            setFinanceLoading(true);
            setFinanceError(null); // Clear previous errors
            // Use school name instead of admin ID for finance data
            const schoolName = currentUser?.schoolName || 'Default School';
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/FinanceDashboard/${encodeURIComponent(schoolName)}`);
            setFinanceData(response.data);
            setLastFinanceUpdate(new Date());
        } catch (error) {
            console.error('Error fetching finance data:', error);
            setFinanceError('Failed to load financial data.');
        } finally {
            setFinanceLoading(false);
        }
    };

    // Helper function to format time difference
    const formatTimeDifference = (date) => {
        if (!date) return 'Never';
        
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    };

    useEffect(() => {
        dispatch(getAllStudents(adminID));
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllTeachers(adminID));
        fetchFinanceData();
        
        // Refresh finance data every 5 minutes
        const financeInterval = setInterval(fetchFinanceData, 5 * 60 * 1000);
        
        return () => clearInterval(financeInterval);
    }, [adminID, dispatch]);

    const numberOfStudents = studentsList?.length || 0;
    const numberOfClasses = sclassesList?.length || 0;
    const numberOfTeachers = teachersList?.length || 0;

    // Calculate real gender distribution from actual student data
    const calculateGenderDistribution = () => {
        console.log('StudentsList:', studentsList);
        console.log('StudentsList length:', studentsList?.length);
        
        if (!studentsList || studentsList.length === 0) {
            console.log('No students found, returning default values');
            return [
                { name: 'Male', value: 0 },
                { name: 'Female', value: 0 },
                { name: 'Other', value: 0 }
            ];
        }

        const genderCounts = studentsList.reduce((acc, student) => {
            const gender = student.gender || 'Other';
            acc[gender] = (acc[gender] || 0) + 1;
            return acc;
        }, {});

        console.log('Gender counts:', genderCounts);

        return [
            { name: 'Male', value: genderCounts.Male || 0 },
            { name: 'Female', value: genderCounts.Female || 0 },
            { name: 'Other', value: genderCounts.Other || 0 }
        ];
    };

    // Calculate real attendance statistics
    const calculateAttendanceStats = () => {
        console.log('Calculating attendance stats for students:', studentsList?.length);
        
        if (!studentsList || studentsList.length === 0) {
            console.log('No students found for attendance calculation');
            return { attendanceRate: 0, presentDays: 0, totalDays: 0 };
        }

        let totalPresentDays = 0;
        let totalDays = 0;

        studentsList.forEach(student => {
            console.log('Student:', student.name, 'Attendance:', student.attendance);
            if (student.attendance && Array.isArray(student.attendance)) {
                student.attendance.forEach(att => {
                    totalDays++;
                    if (att.status === 'Present') {
                        totalPresentDays++;
                    }
                });
            }
        });

        const attendanceRate = totalDays > 0 ? (totalPresentDays / totalDays) * 100 : 0;

        console.log('Attendance calculation results:', { totalPresentDays, totalDays, attendanceRate });

        return {
            attendanceRate: attendanceRate.toFixed(1),
            presentDays: totalPresentDays,
            totalDays: totalDays
        };
    };

    const studentData = calculateGenderDistribution();
    const attendanceStats = calculateAttendanceStats();

    // Calculate total from studentData for accurate percentages
    const totalStudents = studentData.reduce((sum, item) => sum + item.value, 0);

    const performanceData = [
        { subject: 'Class A', performance: 85 },
        { subject: 'Class B', performance: 78 },
        { subject: 'Class C', performance: 92 },
        { subject: 'Class D', performance: 88 }
    ];

    // New linear chart data
    const studentGrowthData = [
        { name: 'Jan', students: 120, teachers: 15, classes: 8 },
        { name: 'Feb', students: 135, teachers: 18, classes: 10 },
        { name: 'Mar', students: 150, teachers: 20, classes: 12 },
        { name: 'Apr', students: 165, teachers: 22, classes: 14 },
        { name: 'May', students: 180, teachers: 25, classes: 16 },
        { name: 'Jun', students: numberOfStudents, teachers: numberOfTeachers, classes: numberOfClasses }
    ];

    const attendanceData = [
        { name: 'Mon', attendance: 92 },
        { name: 'Tue', attendance: 88 },
        { name: 'Wed', attendance: 95 },
        { name: 'Thu', attendance: 90 },
        { name: 'Fri', attendance: 87 },
        { name: 'Sat', attendance: 85 }
    ];

    const revenueData = financeData?.monthlyData?.map(month => ({
        name: month.month,
        revenue: month.revenue
    })) || [
        { name: 'Jan', revenue: 18000 },
        { name: 'Feb', revenue: 22000 },
        { name: 'Mar', revenue: 25000 },
        { name: 'Apr', revenue: 28000 },
        { name: 'May', revenue: 32000 },
        { name: 'Jun', revenue: 35000 }
    ];

    const recentActivities = [
        { type: 'New Student', message: 'John Doe joined Class A', time: '2 hours ago', icon: <PeopleIcon />, color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { type: 'New Class', message: 'Class D was created', time: '3 hours ago', icon: <ClassIcon />, color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { type: 'Assignment', message: 'Math homework posted', time: '5 hours ago', icon: <BookIcon />, color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
        { type: 'Notice', message: 'Holiday announcement', time: '1 day ago', icon: <AnnouncementIcon />, color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    ];

    const statsCards = [
        {
            title: "Total Students",
            value: numberOfStudents,
            icon: <PeopleIcon />,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            change: "+12%",
            changeType: "positive",
            suffix: ""
        },
        {
            title: "Active Classes",
            value: numberOfClasses,
            icon: <SchoolIcon />,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            change: "+5%",
            changeType: "positive",
            suffix: ""
        },
        {
            title: "Teachers",
            value: numberOfTeachers,
            icon: <SupervisorAccountIcon />,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            change: "+8%",
            changeType: "positive",
            suffix: ""
        },
        {
            title: "Revenue",
            value: financeData?.overview?.totalRevenue || 0,
            icon: <AttachMoneyIcon />,
            gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            change: financeData ? 
                (() => {
                    const revenue = financeData.overview?.totalRevenue || 0;
                    const profit = financeData.overview?.netProfit || 0;
                    if (revenue === 0) return "0%";
                    const percentage = Math.round((profit / revenue) * 100);
                    return (profit >= 0 ? "+" : "") + percentage + "%";
                })() : 
                financeError ? "Error loading" : "-3%",
            changeType: financeData ? 
                (financeData.overview?.netProfit >= 0 ? "positive" : "negative") : 
                financeError ? "error" : "negative",
            suffix: financeError ? "" : "₹"
        }
    ];

    return (
        <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <GradientCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" sx={{ mb: 4, p: 3 }}>
                    <Box>
                        <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>
                            Welcome back, Admin! 👋
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                            Here's what's happening with your school today
                        </Typography>
                        <Chip 
                            label={`Last updated: ${formatTimeDifference(lastFinanceUpdate)}`} 
                            sx={{ 
                                background: 'rgba(255,255,255,0.2)', 
                                color: '#ffffff',
                                border: '1px solid rgba(255,255,255,0.3)'
                            }} 
                        />
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={fetchFinanceData}
                            disabled={financeLoading}
                            sx={{ 
                                ml: 2,
                                color: '#ffffff',
                                borderColor: 'rgba(255,255,255,0.5)',
                                '&:hover': {
                                    borderColor: '#ffffff',
                                    backgroundColor: 'rgba(255,255,255,0.1)'
                                }
                            }}
                        >
                            {financeLoading ? 'Refreshing...' : 'Refresh Finance'}
                        </Button>
                    </Box>
                </GradientCard>
            </motion.div>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {statsCards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <StatsCard>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box>
                                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontWeight: 500 }}>
                                                {card.title}
                                            </Typography>
                                            <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                                {card.title === "Revenue" && financeLoading ? (
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Box sx={{ width: 60, height: 40, bgcolor: 'grey.300', borderRadius: 1, mr: 1 }} />
                                                        <Typography variant="h6" sx={{ color: 'text.secondary' }}>Loading...</Typography>
                                                    </Box>
                                                ) : (
                                                    <CountUp start={0} end={card.value} duration={2} prefix={card.suffix} />
                                                )}
                                            </Typography>
                                        </Box>
                                        <GradientIcon color={card.gradient}>
                                            {card.icon}
                                        </GradientIcon>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {card.changeType === "positive" ? (
                                            <TrendingUpIcon sx={{ color: '#4caf50', mr: 1 }} />
                                        ) : card.changeType === "error" ? (
                                            <Box sx={{ width: 20, height: 20, bgcolor: '#ff9800', borderRadius: '50%', mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Typography variant="caption" sx={{ color: '#fff', fontSize: '10px' }}>!</Typography>
                                            </Box>
                                        ) : (
                                            <TrendingDownIcon sx={{ color: '#f44336', mr: 1 }} />
                                        )}
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: card.changeType === "positive" ? '#4caf50' : 
                                                       card.changeType === "error" ? '#ff9800' : '#f44336',
                                                fontWeight: 600
                                            }}
                                        >
                                            {card.change} {card.changeType === "error" ? "" : "from last month"}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </StatsCard>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            {/* Linear Charts Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} lg={8}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <ChartCard>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
                                    School Growth Trends
                                </Typography>
                                <Box sx={{ height: 350, width: '100%' }}>
                                    <CustomLineChart 
                                        data={studentGrowthData} 
                                        dataKey="students" 
                                        strokeColor="#667eea"
                                    />
                                </Box>
                            </CardContent>
                        </ChartCard>
                    </motion.div>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <ChartCard>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
                                    Weekly Attendance
                                </Typography>
                                <Box sx={{ height: 350, width: '100%' }}>
                                    <CustomLineChart 
                                        data={attendanceData} 
                                        dataKey="attendance" 
                                        strokeColor="#43e97b"
                                    />
                                </Box>
                            </CardContent>
                        </ChartCard>
                    </motion.div>
                </Grid>
            </Grid>

            {/* Revenue Chart and Class Performance */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} lg={6}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <ChartCard>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
                                    Revenue Trends
                                </Typography>
                                <Box sx={{ height: 300, width: '100%' }}>
                                    <CustomLineChart 
                                        data={revenueData} 
                                        dataKey="revenue" 
                                        strokeColor="#f093fb"
                                    />
                                </Box>
                            </CardContent>
                        </ChartCard>
                    </motion.div>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                    >
                        <ChartCard>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
                                    Class Performance Overview
                                </Typography>
                                <Box sx={{ height: 300, width: '100%' }}>
                                    <CustomBarChart chartData={performanceData} dataKey="performance" />
                                </Box>
                            </CardContent>
                        </ChartCard>
                    </motion.div>
                </Grid>
            </Grid>

            {/* Recent Activities and Quick Actions */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} lg={6}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <ActivityCard>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
                                    Recent Activities
                                </Typography>
                                <List>
                                    {recentActivities.map((activity, index) => (
                                        <React.Fragment key={index}>
                                            <ListItem sx={{ px: 0 }}>
                                                <Avatar 
                                                    sx={{ 
                                                        mr: 2, 
                                                        background: activity.color,
                                                        width: 40,
                                                        height: 40
                                                    }}
                                                >
                                                    {activity.icon}
                                                </Avatar>
                                                <ListItemText 
                                                    primary={
                                                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                            {activity.message}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                            {activity.time}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                            {index < recentActivities.length - 1 && (
                                                <Divider sx={{ my: 1, opacity: 0.3 }} />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </CardContent>
                        </ActivityCard>
                    </motion.div>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.9 }}
                    >
                        <ActivityCard>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
                                    Quick Actions
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Button 
                                            component={Link}
                                            to="/Admin/addstudents"
                                            variant="contained" 
                                            fullWidth
                                            startIcon={<PeopleIcon />}
                                            sx={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                borderRadius: '12px',
                                                py: 1.5,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                                }
                                            }}
                                        >
                                            Add Student
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button 
                                            component={Link}
                                            to="/Admin/addnotice"
                                            variant="contained" 
                                            fullWidth
                                            startIcon={<AnnouncementIcon />}
                                            sx={{
                                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                                borderRadius: '12px',
                                                py: 1.5,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #e082ea 0%, #e5465b 100%)',
                                                }
                                            }}
                                        >
                                            Post Notice
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button 
                                            component={Link}
                                            to="/Admin/addclass"
                                            variant="contained" 
                                            fullWidth
                                            startIcon={<ClassIcon />}
                                            sx={{
                                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                                borderRadius: '12px',
                                                py: 1.5,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #3e9bed 0%, #00d9e5 100%)',
                                                }
                                            }}
                                        >
                                            Add Class
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button 
                                            component={Link}
                                            to="/Admin/teachers/chooseclass"
                                            variant="contained" 
                                            fullWidth
                                            startIcon={<AssignmentIcon />}
                                            sx={{
                                                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                                borderRadius: '12px',
                                                py: 1.5,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #32d66a 0%, #27e6c6 100%)',
                                                }
                                            }}
                                        >
                                            Assign Teacher
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button 
                                            component={Link}
                                            to="/Admin/finances/add"
                                            variant="contained" 
                                            fullWidth
                                            startIcon={<AccountBalanceIcon />}
                                            sx={{
                                                background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                                                borderRadius: '12px',
                                                py: 1.5,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #ff8a8e 0%, #febfdf 100%)',
                                                }
                                            }}
                                        >
                                            Add Finance
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </ActivityCard>
                    </motion.div>
                </Grid>
            </Grid>

            {/* Student Gender Distribution - Moved to the end */}
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.0 }}
                    >
                        <ChartCard>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
                                            Student Gender Distribution
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                            Demographic overview of student population
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Chip 
                                            label={`Total: ${totalStudents}`} 
                                            sx={{ 
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                color: '#ffffff',
                                                fontWeight: 600,
                                                fontSize: '0.9rem'
                                            }} 
                                        />
                                        <Chip 
                                            label="Live Data" 
                                            sx={{ 
                                                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                                color: '#ffffff',
                                                fontWeight: 600,
                                                fontSize: '0.9rem'
                                            }} 
                                        />
                                    </Box>
                                </Box>
                                
                                <Grid container spacing={4} alignItems="center">
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ height: 350, width: '100%', display: 'flex', justifyContent: 'center', position: 'relative' }}>
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 0.8, delay: 1.2 }}
                                            >
                                                <CustomPieChart data={studentData} />
                                            </motion.div>
                                        </Box>
                                    </Grid>
                                    
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ pl: { md: 4 } }}>
                                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
                                                Distribution Breakdown
                                            </Typography>
                                            
                                            {studentData.map((item, index) => (
                                                <motion.div
                                                    key={item.name}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                                                >
                                                    <Box 
                                                        sx={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            justifyContent: 'space-between',
                                                            p: 2,
                                                            mb: 2,
                                                            borderRadius: '12px',
                                                            background: index === 0 
                                                                ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                                                                : 'linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%)',
                                                            border: index === 0 
                                                                ? '1px solid rgba(102, 126, 234, 0.2)'
                                                                : '1px solid rgba(240, 147, 251, 0.2)',
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': {
                                                                transform: 'translateX(8px)',
                                                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                                            }
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Box 
                                                                sx={{ 
                                                                    width: 12, 
                                                                    height: 12, 
                                                                    borderRadius: '50%',
                                                                    mr: 2,
                                                                    background: index === 0 
                                                                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                                                        : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                                                }}
                                                            />
                                                            <Box>
                                                                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                                                    {item.name}
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                                                    {Math.round((item.value / totalStudents) * 100)}% of total
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                        <Box sx={{ textAlign: 'right' }}>
                                                            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                                                                <CountUp start={0} end={item.value} duration={2} delay={1.5 + index * 0.2} />
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                                                Students
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </motion.div>
                                            ))}
                                            
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.6, delay: 1.8 }}
                                            >
                                                <Box 
                                                    sx={{ 
                                                        mt: 3, 
                                                        p: 3, 
                                                        borderRadius: '16px',
                                                        background: 'linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.1) 100%)',
                                                        border: '1px solid rgba(67, 233, 123, 0.2)',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                                                        Gender Balance Index
                                                    </Typography>
                                                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#43e97b', mb: 1 }}>
                                                        {totalStudents > 0 && Math.abs(studentData[0].value - studentData[1].value) <= Math.max(1, totalStudents * 0.1) ? 'Balanced' : 'Diverse'}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                                        {totalStudents > 0 && Math.abs(studentData[0].value - studentData[1].value) <= Math.max(1, totalStudents * 0.1)
                                                            ? 'Excellent gender balance maintained' 
                                                            : 'Diverse student population'
                                                        }
                                                    </Typography>
                                                </Box>
                                            </motion.div>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </ChartCard>
                    </motion.div>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AdminHomePage;
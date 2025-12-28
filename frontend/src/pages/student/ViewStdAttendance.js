import React, { useEffect, useState } from 'react'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { 
    BottomNavigation, 
    BottomNavigationAction, 
    Box, 
    Button, 
    Collapse, 
    Paper, 
    Table, 
    TableBody, 
    TableHead, 
    Typography,
    Container,
    Card,
    CardContent,
    Grid,
    Chip,
    Avatar,
    LinearProgress,
    Divider,
    IconButton,
    Tooltip,
    Fade,
    Zoom,
    Slide,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';

import CustomBarChart from '../../components/CustomBarChart'

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

const ViewStdAttendance = () => {
    const dispatch = useDispatch();

    const [openStates, setOpenStates] = useState({});

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);
    
    // Get the student data from the array
    const studentData = userDetails && userDetails.length > 0 ? userDetails[0] : null;

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
    }, [dispatch, currentUser._id]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [selectedSection, setSelectedSection] = useState('overview');

    useEffect(() => {
        if (studentData) {
            console.log('Student data received:', studentData);
            console.log('Attendance data:', studentData.attendance);
            setSubjectAttendance(studentData.attendance || []);
        }
    }, [studentData])

    const attendanceBySubject = groupAttendanceBySubject(subjectAttendance)
    console.log('Processed attendance by subject:', attendanceBySubject);

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    console.log('Overall attendance percentage:', overallAttendancePercentage);

    const subjectData = Object.entries(attendanceBySubject).map(([subName, { subCode, present, sessions }]) => {
        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
        return {
            subject: subName,
            attendancePercentage: subjectAttendancePercentage,
            totalClasses: sessions,
            attendedClasses: present
        };
    });

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    // Calculate attendance statistics
    const calculateAttendanceStats = () => {
        if (!subjectAttendance || subjectAttendance.length === 0) return null;
        
        const totalSessions = subjectAttendance.reduce((sum, att) => sum + parseInt(att.subName.sessions || 0), 0);
        const totalPresent = subjectAttendance.filter(att => att.status === 'Present').length;
        const totalAbsent = subjectAttendance.filter(att => att.status === 'Absent').length;
        const subjectsCount = Object.keys(attendanceBySubject).length;
        
        return { totalSessions, totalPresent, totalAbsent, subjectsCount };
    };

    const getAttendanceColor = (percentage) => {
        if (percentage >= 90) return '#4caf50';
        if (percentage >= 80) return '#8bc34a';
        if (percentage >= 70) return '#ffc107';
        if (percentage >= 60) return '#ff9800';
        return '#f44336';
    };

    const getAttendanceStatus = (percentage) => {
        if (percentage >= 90) return 'Excellent';
        if (percentage >= 80) return 'Good';
        if (percentage >= 70) return 'Fair';
        if (percentage >= 60) return 'Needs Improvement';
        return 'Poor';
    };

    const stats = calculateAttendanceStats();

    const renderOverviewSection = () => {
        return (
            <Fade in timeout={800}>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    {/* Header Section */}
                    <Box sx={{ 
                        textAlign: 'center', 
                        mb: 6,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '16px',
                        padding: '40px 20px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                    }}>
                        <Typography variant="h3" component="h1" gutterBottom sx={{ 
                            fontWeight: 'bold',
                            color: 'white',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}>
                            My Attendance Overview
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 3, color: 'rgba(255,255,255,0.8)' }}>
                            Track your attendance across all subjects
                        </Typography>
                    </Box>

                    {/* All Statistics Cards */}
                    {stats && (
                        <Slide direction="up" in timeout={1200}>
                            <Grid container spacing={3} sx={{ mb: 6 }}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ 
                                        background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                                        color: 'white',
                                        height: '100%'
                                    }}>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <Avatar sx={{ 
                                                bgcolor: 'rgba(255,255,255,0.2)', 
                                                mx: 'auto', 
                                                mb: 2 
                                            }}>
                                                <TrendingUpIcon />
                                            </Avatar>
                                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                                {overallAttendancePercentage.toFixed(1)}%
                                            </Typography>
                                            <Typography variant="body2">Overall Attendance</Typography>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={overallAttendancePercentage} 
                                                sx={{ 
                                                    height: 8, 
                                                    borderRadius: 4,
                                                    bgcolor: 'rgba(255,255,255,0.3)',
                                                    mt: 1,
                                                    '& .MuiLinearProgress-bar': {
                                                        bgcolor: 'white',
                                                        borderRadius: 4
                                                    }
                                                }} 
                                            />
                                            <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.9 }}>
                                                {getAttendanceStatus(overallAttendancePercentage)}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ 
                                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                        color: 'white',
                                        height: '100%'
                                    }}>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <Avatar sx={{ 
                                                bgcolor: 'rgba(255,255,255,0.2)', 
                                                mx: 'auto', 
                                                mb: 2 
                                            }}>
                                                <CheckCircleIcon />
                                            </Avatar>
                                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                                {stats.totalPresent}
                                            </Typography>
                                            <Typography variant="body2">Classes Attended</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ 
                                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                        color: 'white',
                                        height: '100%'
                                    }}>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <Avatar sx={{ 
                                                bgcolor: 'rgba(255,255,255,0.2)', 
                                                mx: 'auto', 
                                                mb: 2 
                                            }}>
                                                <CancelIcon />
                                            </Avatar>
                                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                                {stats.totalAbsent}
                                            </Typography>
                                            <Typography variant="body2">Classes Missed</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ 
                                        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                        color: 'white',
                                        height: '100%'
                                    }}>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <Avatar sx={{ 
                                                bgcolor: 'rgba(255,255,255,0.2)', 
                                                mx: 'auto', 
                                                mb: 2 
                                            }}>
                                                <SchoolIcon />
                                            </Avatar>
                                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                                {stats.subjectsCount}
                                            </Typography>
                                            <Typography variant="body2">Total Subjects</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Slide>
                    )}

                    {/* Subject Attendance Cards */}
                    <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
                        Subject-wise Attendance
                    </Typography>
                    
                    {Object.entries(attendanceBySubject).length > 0 ? (
                        <Grid container spacing={3}>
                            {Object.entries(attendanceBySubject).map(([subName, { present, allData, subId, sessions }], index) => {
                                const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
                                const color = getAttendanceColor(subjectAttendancePercentage);
                                const status = getAttendanceStatus(subjectAttendancePercentage);
                                
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Slide direction="up" in timeout={1600 + index * 200}>
                                            <Card sx={{ 
                                                height: '100%',
                                                transition: 'transform 0.3s ease-in-out',
                                                '&:hover': {
                                                    transform: 'translateY(-8px)',
                                                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                                }
                                            }}>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                        <Avatar sx={{ 
                                                            bgcolor: color, 
                                                            mr: 2,
                                                            width: 56,
                                                            height: 56
                                                        }}>
                                                            <SchoolIcon />
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                                                {subName}
                                                            </Typography>
                                                            <Chip 
                                                                label={status} 
                                                                size="small" 
                                                                sx={{ 
                                                                    bgcolor: color, 
                                                                    color: 'white',
                                                                    fontWeight: 'bold'
                                                                }} 
                                                            />
                                                        </Box>
                                                    </Box>
                                                    
                                                    <Box sx={{ mb: 2 }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Attendance
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                {subjectAttendancePercentage}%
                                                            </Typography>
                                                        </Box>
                                                        <LinearProgress 
                                                            variant="determinate" 
                                                            value={subjectAttendancePercentage} 
                                                            sx={{ 
                                                                height: 8, 
                                                                borderRadius: 4,
                                                                bgcolor: 'rgba(0,0,0,0.1)',
                                                                '& .MuiLinearProgress-bar': {
                                                                    bgcolor: color,
                                                                    borderRadius: 4
                                                                }
                                                            }} 
                                                        />
                                                    </Box>
                                                    
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Present: {present}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Total: {sessions}
                                                        </Typography>
                                                    </Box>
                                                    
                                                    <Divider sx={{ my: 2 }} />
                                                    
                                                    <Button 
                                                        variant="outlined" 
                                                        fullWidth
                                                        onClick={() => handleOpen(subId)}
                                                        endIcon={openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                    >
                                                        View Details
                                                    </Button>
                                                    
                                                    <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                                        <Box sx={{ mt: 2 }}>
                                                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                                Recent Attendance
                                                            </Typography>
                                                            <List dense>
                                                                {allData.slice(-5).map((data, idx) => {
                                                                    const date = new Date(data.date);
                                                                    const dateString = date.toString() !== "Invalid Date" ? 
                                                                        date.toLocaleDateString() : "Invalid Date";
                                                                    return (
                                                                        <ListItem key={idx} sx={{ px: 0 }}>
                                                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                                                {data.status === 'Present' ? 
                                                                                    <CheckCircleIcon sx={{ color: '#4caf50' }} /> : 
                                                                                    <CancelIcon sx={{ color: '#f44336' }} />
                                                                                }
                                                                            </ListItemIcon>
                                                                            <ListItemText 
                                                                                primary={dateString}
                                                                                secondary={data.status}
                                                                            />
                                                                        </ListItem>
                                                                    );
                                                                })}
                                                            </List>
                                                        </Box>
                                                    </Collapse>
                                                </CardContent>
                                            </Card>
                                        </Slide>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    ) : (
                        <Card sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No attendance records available
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Your attendance records will appear here once they are updated
                            </Typography>
                        </Card>
                    )}
                </Container>
            </Fade>
        );
    };

    const renderTableSection = () => {
        return (
            <Fade in timeout={800}>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Box sx={{ 
                        textAlign: 'center', 
                        mb: 6,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '16px',
                        padding: '40px 20px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                    }}>
                        <Typography variant="h4" align="center" gutterBottom sx={{ 
                            mb: 4, 
                            fontWeight: 'bold',
                            color: 'white',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}>
                            Detailed Attendance Table
                        </Typography>
                    </Box>
                    
                    {stats && (
                        <Card sx={{ mb: 4, p: 3, background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)', color: 'white' }}>
                            <Typography variant="h6" gutterBottom>
                                Overall Attendance: {overallAttendancePercentage.toFixed(2)}%
                            </Typography>
                            <LinearProgress 
                                variant="determinate" 
                                value={overallAttendancePercentage} 
                                sx={{ 
                                    height: 8, 
                                    borderRadius: 4,
                                    bgcolor: 'rgba(255,255,255,0.3)',
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: 'white',
                                        borderRadius: 4
                                    }
                                }} 
                            />
                        </Card>
                    )}
                    
                    <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <Table>
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell>Subject</StyledTableCell>
                                    <StyledTableCell align="center">Present</StyledTableCell>
                                    <StyledTableCell align="center">Total Sessions</StyledTableCell>
                                    <StyledTableCell align="center">Attendance %</StyledTableCell>
                                    <StyledTableCell align="center">Status</StyledTableCell>
                                    <StyledTableCell align="center">Actions</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(attendanceBySubject).map(([subName, { present, allData, subId, sessions }], index) => {
                                    const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
                                    const color = getAttendanceColor(subjectAttendancePercentage);
                                    const status = getAttendanceStatus(subjectAttendancePercentage);

                                    return (
                                        <React.Fragment key={index}>
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Avatar sx={{ bgcolor: color, mr: 2, width: 32, height: 32 }}>
                                                            <SchoolIcon fontSize="small" />
                                                        </Avatar>
                                                        {subName}
                                                    </Box>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                        {present}
                                                    </Typography>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">{sessions}</StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                                                            {subjectAttendancePercentage}%
                                                        </Typography>
                                                        <LinearProgress 
                                                            variant="determinate" 
                                                            value={subjectAttendancePercentage} 
                                                            sx={{ 
                                                                width: 60, 
                                                                height: 6, 
                                                                borderRadius: 3,
                                                                bgcolor: 'rgba(0,0,0,0.1)',
                                                                '& .MuiLinearProgress-bar': {
                                                                    bgcolor: color,
                                                                    borderRadius: 3
                                                                }
                                                            }} 
                                                        />
                                                    </Box>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <Chip 
                                                        label={status} 
                                                        size="small" 
                                                        sx={{ 
                                                            bgcolor: color, 
                                                            color: 'white',
                                                            fontWeight: 'bold'
                                                        }} 
                                                    />
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <Button 
                                                        variant="outlined" 
                                                        size="small"
                                                        onClick={() => handleOpen(subId)}
                                                        endIcon={openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                    >
                                                        Details
                                                    </Button>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                    <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                                        <Box sx={{ margin: 1 }}>
                                                            <Typography variant="h6" gutterBottom component="div">
                                                                Attendance Details
                                                            </Typography>
                                                            <Table size="small" aria-label="attendance details">
                                                                <TableHead>
                                                                    <StyledTableRow>
                                                                        <StyledTableCell>Date</StyledTableCell>
                                                                        <StyledTableCell align="center">Status</StyledTableCell>
                                                                    </StyledTableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {allData.map((data, idx) => {
                                                                        const date = new Date(data.date);
                                                                        const dateString = date.toString() !== "Invalid Date" ? 
                                                                            date.toLocaleDateString() : "Invalid Date";
                                                                        return (
                                                                            <StyledTableRow key={idx}>
                                                                                <StyledTableCell component="th" scope="row">
                                                                                    {dateString}
                                                                                </StyledTableCell>
                                                                                <StyledTableCell align="center">
                                                                                    <Chip 
                                                                                        label={data.status} 
                                                                                        size="small" 
                                                                                        sx={{ 
                                                                                            bgcolor: data.status === 'Present' ? '#4caf50' : '#f44336', 
                                                                                            color: 'white',
                                                                                            fontWeight: 'bold'
                                                                                        }} 
                                                                                    />
                                                                                </StyledTableCell>
                                                                            </StyledTableRow>
                                                                        )
                                                                    })}
                                                                </TableBody>
                                                            </Table>
                                                        </Box>
                                                    </Collapse>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        </React.Fragment>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                </Container>
            </Fade>
        )
    }

    const renderChartSection = () => {
        return (
            <Fade in timeout={800}>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Box sx={{ 
                        textAlign: 'center', 
                        mb: 6,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '16px',
                        padding: '40px 20px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                    }}>
                        <Typography variant="h4" align="center" gutterBottom sx={{ 
                            mb: 4, 
                            fontWeight: 'bold',
                            color: 'white',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}>
                            Attendance Analytics
                        </Typography>
                    </Box>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
                    </Paper>
                </Container>
            </Fade>
        )
    };

    return (
        <Box sx={{ 
            minHeight: '100vh',
            backgroundColor: '#f8fafc'
        }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <LinearProgress sx={{ width: '50%' }} />
                </Box>
            ) : (
                <div>
                    {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ?
                        <>
                            {selectedSection === 'overview' && renderOverviewSection()}
                            {selectedSection === 'table' && renderTableSection()}
                            {selectedSection === 'chart' && renderChartSection()}
    
                            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={8}>
                                <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                    <BottomNavigationAction
                                        label="Overview"
                                        value="overview"
                                        icon={selectedSection === 'overview' ? <EventIcon /> : <EventIcon />}
                                    />
                                    <BottomNavigationAction
                                        label="Table"
                                        value="table"
                                        icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                    />
                                    <BottomNavigationAction
                                        label="Chart"
                                        value="chart"
                                        icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                    />
                                </BottomNavigation>
                            </Paper>
                        </>
                        :
                        <>
                            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                                <Card sx={{ p: 6 }}>
                                    <Avatar sx={{ 
                                        width: 80, 
                                        height: 80, 
                                        bgcolor: 'primary.main',
                                        mx: 'auto',
                                        mb: 3
                                    }}>
                                        <EventIcon fontSize="large" />
                                    </Avatar>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        No Attendance Records Available
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Your attendance records will appear here once they are updated by your teachers.
                                    </Typography>
                                </Card>
                            </Container>
                        </>
                    }
                </div>
            )}
        </Box>
    )
    }
    

export default ViewStdAttendance
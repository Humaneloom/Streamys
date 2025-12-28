import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import { 
    BottomNavigation, 
    BottomNavigationAction, 
    Container, 
    Paper, 
    Table, 
    TableBody, 
    TableHead, 
    Typography,
    Box,
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
    Slide
} from '@mui/material';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import CustomBarChart from '../../components/CustomBarChart'

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

// Import the subjects SVG
import subjectsSvg from '../../assets/subjects.svg';

const StudentSubjects = () => {

    const dispatch = useDispatch();
    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);
    const { subjectsList, sclassDetails } = useSelector((state) => state.sclass);
    
    // Get the student data from the array
    const studentData = userDetails && userDetails.length > 0 ? userDetails[0] : null;

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
    }, [dispatch, currentUser._id])

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [subjectMarks, setSubjectMarks] = useState([]);
    const [selectedSection, setSelectedSection] = useState('overview');

    useEffect(() => {
        if (studentData) {
            setSubjectMarks(studentData.examResult || []);
        }
    }, [studentData])

    useEffect(() => {
        if (subjectMarks.length === 0) {
            dispatch(getSubjectList(currentUser.sclassName._id, "ClassSubjects"));
        }
    }, [subjectMarks, dispatch, currentUser.sclassName._id]);

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    // Calculate performance metrics
    const calculatePerformance = () => {
        if (!subjectMarks || subjectMarks.length === 0) return null;
        
        const totalMarks = subjectMarks.reduce((sum, result) => sum + (result.marksObtained || 0), 0);
        const averageMarks = totalMarks / subjectMarks.length;
        const maxMarks = Math.max(...subjectMarks.map(result => result.marksObtained || 0));
        const minMarks = Math.min(...subjectMarks.map(result => result.marksObtained || 0));
        
        return { totalMarks, averageMarks, maxMarks, minMarks };
    };

    const getGradeColor = (marks) => {
        if (marks >= 90) return '#4caf50';
        if (marks >= 80) return '#8bc34a';
        if (marks >= 70) return '#ffc107';
        if (marks >= 60) return '#ff9800';
        return '#f44336';
    };

    const getGrade = (marks) => {
        if (marks >= 90) return 'A+';
        if (marks >= 80) return 'A';
        if (marks >= 70) return 'B';
        if (marks >= 60) return 'C';
        return 'D';
    };

    const performance = calculatePerformance();

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
                            My Academic Performance
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 3, color: 'rgba(255,255,255,0.8)' }}>
                            Class {sclassDetails && sclassDetails.sclassName} • {subjectsList?.length || 0} Subjects
                        </Typography>
                    </Box>

                    {/* Performance Summary Cards */}
                    {performance && (
                        <Slide direction="up" in timeout={1200}>
                            <Grid container spacing={3} sx={{ mb: 6 }}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ 
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                                                {performance.averageMarks.toFixed(1)}%
                                            </Typography>
                                            <Typography variant="body2">Average Score</Typography>
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
                                                <EmojiEventsIcon />
                                            </Avatar>
                                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                                {performance.maxMarks}%
                                            </Typography>
                                            <Typography variant="body2">Highest Score</Typography>
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
                                                <SchoolIcon />
                                            </Avatar>
                                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                                {subjectMarks.length}
                                            </Typography>
                                            <Typography variant="body2">Subjects Taken</Typography>
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
                                                <StarIcon />
                                            </Avatar>
                                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                                {getGrade(performance.averageMarks)}
                                            </Typography>
                                            <Typography variant="body2">Overall Grade</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Slide>
                    )}

                    {/* Subject Performance Cards */}
                    <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
                        Subject Performance
                    </Typography>
                    
                    {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0 ? (
                        <Grid container spacing={3}>
                            {subjectMarks.map((result, index) => {
                                if (!result.subName || !result.marksObtained) return null;
                                
                                const marks = result.marksObtained;
                                const grade = getGrade(marks);
                                const color = getGradeColor(marks);
                                
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Slide direction="up" in timeout={1400 + index * 200}>
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
                                                            <BookIcon />
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                                                {result.subName.subName}
                                                            </Typography>
                                                            <Chip 
                                                                label={grade} 
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
                                                                Score
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                {marks}%
                                                            </Typography>
                                                        </Box>
                                                        <LinearProgress 
                                                            variant="determinate" 
                                                            value={marks} 
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
                                                    
                                                    <Divider sx={{ my: 2 }} />
                                                    
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Performance
                                                        </Typography>
                                                        <Tooltip title={marks >= 80 ? "Excellent!" : marks >= 60 ? "Good job!" : "Keep improving!"}>
                                                            <IconButton size="small">
                                                                {marks >= 80 ? <StarIcon sx={{ color: '#ffd700' }} /> : 
                                                                 marks >= 60 ? <TrendingUpIcon sx={{ color: '#4caf50' }} /> : 
                                                                 <SchoolIcon sx={{ color: '#ff9800' }} />}
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
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
                                No exam results available yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Your exam results will appear here once they are published
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
                <Container maxWidth="md" sx={{ py: 4 }}>
                    <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
                        Detailed Results Table
                    </Typography>
                    <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <Table>
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell>Subject</StyledTableCell>
                                    <StyledTableCell align="center">Marks (%)</StyledTableCell>
                                    <StyledTableCell align="center">Grade</StyledTableCell>
                                    <StyledTableCell align="center">Performance</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {subjectMarks.map((result, index) => {
                                    if (!result.subName || !result.marksObtained) {
                                        return null;
                                    }
                                    const marks = result.marksObtained;
                                    const grade = getGrade(marks);
                                    const color = getGradeColor(marks);
                                    
                                    return (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar sx={{ bgcolor: color, mr: 2, width: 32, height: 32 }}>
                                                        <BookIcon fontSize="small" />
                                                    </Avatar>
                                                    {result.subName.subName}
                                                </Box>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                    {marks}%
                                                </Typography>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <Chip 
                                                    label={grade} 
                                                    size="small" 
                                                    sx={{ 
                                                        bgcolor: color, 
                                                        color: 'white',
                                                        fontWeight: 'bold'
                                                    }} 
                                                />
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={marks} 
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
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                </Container>
            </Fade>
        );
    };

    const renderChartSection = () => {
        return (
            <Fade in timeout={800}>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
                        Performance Analytics
                    </Typography>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
                    </Paper>
                </Container>
            </Fade>
        );
    };

    const renderClassDetailsSection = () => {
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
                        <Typography variant="h3" component="h1" gutterBottom sx={{ 
                            fontWeight: 'bold',
                            color: 'white',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}>
                            Class Information
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        Current Class
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                                        Class {sclassDetails && sclassDetails.sclassName}
                                    </Typography>
                                    <Typography variant="body1">
                                        You are currently enrolled in this class and have access to all the subjects listed below.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        Total Subjects
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                                        {subjectsList?.length || 0} Subjects
                                    </Typography>
                                    <Typography variant="body1">
                                        These are all the subjects available in your current class curriculum.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Typography variant="h5" gutterBottom sx={{ mt: 6, mb: 3, fontWeight: 'bold' }}>
                        Available Subjects
                    </Typography>
                    
                    <Grid container spacing={3}>
                        {subjectsList && subjectsList.map((subject, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Slide direction="up" in timeout={1000 + index * 200}>
                                    <Card sx={{ 
                                        height: '100%',
                                        transition: 'transform 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                        }
                                    }}>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <Avatar sx={{ 
                                                bgcolor: 'primary.main', 
                                                mx: 'auto', 
                                                mb: 2,
                                                width: 64,
                                                height: 64
                                            }}>
                                                <BookIcon fontSize="large" />
                                            </Avatar>
                                            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                {subject.subName}
                                            </Typography>
                                            <Chip 
                                                label={`Code: ${subject.subCode}`} 
                                                variant="outlined" 
                                                size="small"
                                                sx={{ mb: 2 }}
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                {subject.sessions || 'N/A'} sessions per week
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Slide>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Fade>
        );
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
                    {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0
                        ?
                        (<>
                            {selectedSection === 'overview' && renderOverviewSection()}
                            {selectedSection === 'table' && renderTableSection()}
                            {selectedSection === 'chart' && renderChartSection()}

                            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={8}>
                                <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                    <BottomNavigationAction
                                        label="Overview"
                                        value="overview"
                                        icon={selectedSection === 'overview' ? <SchoolIcon /> : <SchoolIcon />}
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
                        </>)
                        :
                        (<>
                            {renderClassDetailsSection()}
                        </>)
                    }
                </div>
            )}
        </Box>
    );
};

export default StudentSubjects;
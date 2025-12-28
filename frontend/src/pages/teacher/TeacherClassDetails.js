import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";
import { 
    Box, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    Button, 
    Chip, 
    TextField, 
    InputAdornment,
    Avatar,
    IconButton,
    Tooltip,
    Fade,
    Grow,
    Container
} from '@mui/material';
import { 
    Search as SearchIcon,
    People as PeopleIcon,
    School as SchoolIcon,
    Assignment as AssignmentIcon,
    Visibility as VisibilityIcon,
    CheckCircle as CheckCircleIcon,
    Grade as GradeIcon,
    TrendingUp as TrendingUpIcon,
    ArrowBack as ArrowBackIcon,
    HowToReg as HowToRegIcon
} from '@mui/icons-material';


const TeacherClassDetails = () => {
    const navigate = useNavigate()
    const { classId } = useParams();
    const dispatch = useDispatch();
    const { sclassStudents, loading, error, getresponse } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector((state) => state.user);
    const classID = currentUser.teachSclass?._id
    const subjectID = currentUser.teachSubject?._id
    const [searchTerm, setSearchTerm] = useState('');
    const [classSummary, setClassSummary] = useState(null);

    useEffect(() => {
        // Use the classId from URL if available, otherwise use the teacher's assigned class
        const targetClassId = classId || classID;
        if (targetClassId) {
            dispatch(getClassStudents(targetClassId));
        }
    }, [dispatch, classId, classID])

    // Fetch class summary (with attendancePercentage) from backend
    useEffect(() => {
        if (currentUser?._id && classId) {
            axios.get(`${process.env.REACT_APP_BASE_URL}/TeacherClasses/${currentUser._id}`)
                .then(res => {
                    const foundClass = res.data.find(cls => cls.classId === classId);
                    setClassSummary(foundClass);
                });
        }
    }, [currentUser?._id, classId]);

    if (error) {
        console.log(error)
    }

    // Filter students based on search term
    const filteredStudents = sclassStudents?.filter(student =>
        (student?.name && student.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student?.rollNum && student.rollNum.toString().includes(searchTerm))
    ) || [];

    // Statistics
    const totalStudents = sclassStudents?.length || 0;
    const presentToday = Math.floor(totalStudents * 0.85); // Mock data

    // Loading check
    if (!sclassStudents || sclassStudents.length === 0) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <Typography variant="h5">Loading...</Typography>
                </Box>
            </Container>
        );
    }

    // Find the class name from sclassStudents if available
    let className = currentUser.teachSclass?.sclassName || '';
    if (classSummary && classSummary.className) {
        className = classSummary.className;
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Back Button */}
            <Box sx={{ mb: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/Teacher/class')}
                    sx={{
                        color: '#64748b',
                        '&:hover': {
                            backgroundColor: 'rgba(100, 116, 139, 0.1)',
                        }
                    }}
                >
                    Back to Classes
                </Button>
            </Box>
            
            {/* Header Section */}
            <Box sx={{ mb: 4 }}>
                <Typography 
                    variant="h3" 
                    sx={{ 
                        fontWeight: 800, 
                        mb: 2, 
                        textAlign: 'center',
                        background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                >
                    Class {className} Dashboard
                </Typography>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        textAlign: 'center', 
                        color: 'text.secondary',
                        mb: 4
                    }}
                >
                    {className} • {currentUser.teachSubject?.subName}
                </Typography>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Grow in timeout={500}>
                        <Card sx={{ 
                            borderRadius: 4, 
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': { transform: 'translateY(-8px)' }
                        }}>
                            <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                <PeopleIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                    {totalStudents}
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                    Total Students
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grow>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Grow in timeout={700}>
                        <Card sx={{ 
                            borderRadius: 4, 
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            color: 'white',
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': { transform: 'translateY(-8px)' }
                        }}>
                            <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                <CheckCircleIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                    {presentToday}
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                    Present Today
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grow>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Grow in timeout={900}>
                        <Card sx={{ 
                            borderRadius: 4, 
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
                            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                            color: 'white',
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': { transform: 'translateY(-8px)' }
                        }}>
                            <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                <TrendingUpIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                    {classSummary && classSummary.attendancePercentage !== undefined ? classSummary.attendancePercentage : 0}%
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                    Avg Attendance
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grow>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Grow in timeout={1100}>
                        <Card sx={{ 
                            borderRadius: 4, 
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
                            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                            color: 'white',
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': { transform: 'translateY(-8px)' }
                        }}>
                            <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                <AssignmentIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                    {Math.floor(totalStudents * 0.92)}
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                    Assignments
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grow>
                </Grid>
            </Grid>

            {/* Search Bar and Mark Attendance Button */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <TextField
                    placeholder="Search students by name or roll number..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ 
                        flex: 1,
                        maxWidth: 500,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            '&:hover': {
                                boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                            }
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />
                
                <Button
                    variant="contained"
                    startIcon={<HowToRegIcon />}
                    onClick={() => navigate(`/Teacher/class/mark-attendance/${classId || classID}`)}
                    sx={{
                        background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 600,
                        boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)'
                        }
                    }}
                >
                    Mark Attendance for All
                </Button>
            </Box>

            {/* Students Grid */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Typography variant="h6" sx={{ color: 'text.secondary' }}>Loading students...</Typography>
                </Box>
            ) : getresponse ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
                        <SchoolIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                            No Students Found
                        </Typography>
                    </Card>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {filteredStudents.map((student, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={student._id}>
                            <Fade in timeout={300 + index * 100}>
                                <Card sx={{ 
                                    borderRadius: 4, 
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    justifyContent: 'space-between', 
                                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': { 
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 16px 48px rgba(0,0,0,0.2)'
                                    }
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        {/* Student Avatar and Name */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Avatar 
                                                sx={{ 
                                                    width: 56, 
                                                    height: 56, 
                                                    mr: 2,
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    fontSize: '1.5rem',
                                                    fontWeight: 700
                                                }}
                                            >
                                                {student.name.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                                    {student.name}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    Roll #{student.rollNum}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Student ID Chip */}
                                        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                                            <Chip 
                                                label={`ID: ${student._id.slice(-5)}`} 
                                                size="small" 
                                                sx={{ 
                                                    background: 'rgba(102, 126, 234, 0.1)',
                                                    color: '#667eea',
                                                    fontWeight: 600
                                                }} 
                                            />
                                        </Box>

                                        {/* Action Buttons */}
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <Tooltip title="View student details">
                                                <Button
                                                    variant="contained"
                                                    startIcon={<VisibilityIcon />}
                                                    onClick={() => navigate("/Teacher/class/student/" + student._id)}
                                                    sx={{ 
                                                        borderRadius: 2,
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        '&:hover': {
                                                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                                                        }
                                                    }}
                                                >
                                                    View Details
                                                </Button>
                                            </Tooltip>
                                            
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Tooltip title="Take attendance">
                                                    <IconButton
                                                        onClick={() => navigate(`/Teacher/class/student/attendance/${student._id}/${subjectID}`)}
                                                        sx={{ 
                                                            background: 'rgba(76, 175, 80, 0.1)',
                                                            color: '#4caf50',
                                                            '&:hover': {
                                                                background: 'rgba(76, 175, 80, 0.2)'
                                                            }
                                                        }}
                                                    >
                                                        <CheckCircleIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                
                                                <Tooltip title="Provide marks">
                                                    <IconButton
                                                        onClick={() => navigate(`/Teacher/class/student/marks/${student._id}/${subjectID}`)}
                                                        sx={{ 
                                                            background: 'rgba(255, 152, 0, 0.1)',
                                                            color: '#ff9800',
                                                            '&:hover': {
                                                                background: 'rgba(255, 152, 0, 0.2)'
                                                            }
                                                        }}
                                                    >
                                                        <GradeIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Fade>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* No Results Message */}
            {!loading && !getresponse && filteredStudents.length === 0 && searchTerm && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
                        <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                            No students found
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Try adjusting your search terms
                        </Typography>
                    </Card>
                </Box>
            )}
        </Container>
    );
};

export default TeacherClassDetails;
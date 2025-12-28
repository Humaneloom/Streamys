import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authLogout } from '../../redux/userRelated/userSlice';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    AppBar,
    Toolbar,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    CircularProgress,
    Alert,
    Divider,
    TextField,
    Tooltip
} from '@mui/material';
import {
    School as SchoolIcon,
    People as PeopleIcon,
    Book as BookIcon,
    Notifications as NotificationsIcon,
    ExitToApp as LogoutIcon,
    Visibility as ViewIcon,
    Dashboard as DashboardIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease-in-out',
    borderRadius: 16,
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    border: '1px solid rgba(0,0,0,0.05)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    '&:hover': {
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        border: '1px solid rgba(102, 126, 234, 0.3)',
    },
}));

const StatCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    textAlign: 'center',
    padding: theme.spacing(3),
    borderRadius: 16,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease-in-out',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
        opacity: 0,
        transition: 'opacity 0.3s ease-in-out',
    },
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
        '&::before': {
            opacity: 1,
        },
    },
}));

const SuperAdminDashboard = () => {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [statsDialogOpen, setStatsDialogOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [studentDialogOpen, setStudentDialogOpen] = useState(false);
    const [teacherDialogOpen, setTeacherDialogOpen] = useState(false);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [passwordType, setPasswordType] = useState(''); // 'student' or 'teacher'
    const [newPassword, setNewPassword] = useState('');

    // Helper function to safely format dates
    const formatDate = (dateValue) => {
        if (!dateValue) return 'N/A';

        try {
            // Handle different date formats
            let date;

            if (typeof dateValue === 'string') {
                // Try to parse ISO string or other formats
                date = new Date(dateValue);
            } else if (dateValue instanceof Date) {
                date = dateValue;
            } else if (typeof dateValue === 'number') {
                // Handle timestamp
                date = new Date(dateValue);
            } else {
                return `Invalid: ${String(dateValue)}`;
            }

            // Check if the date is valid
            if (isNaN(date.getTime())) {
                return `Invalid: ${String(dateValue)}`;
            }

            return date.toLocaleDateString();
        } catch (error) {
            console.error('Error formatting date:', error);
            return `Error: ${String(dateValue)}`;
        }
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.user);

    useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        try {
            const response = await fetch('/api/SchoolsOverview');
            if (response.ok) {
                const data = await response.json();
                setSchools(data);
            } else {
                setError('Failed to fetch schools data');
            }
        } catch (error) {
            setError('Network error while fetching schools');
        } finally {
            setLoading(false);
        }
    };

    const handleViewSchool = async (schoolName) => {
        try {
            const response = await fetch(`/api/SchoolDetails/${schoolName}`);
            if (response.ok) {
                const data = await response.json();
                setSelectedSchool(data);
                setViewDialogOpen(true);
            } else {
                setError('Failed to fetch school details');
            }
        } catch (error) {
            setError('Network error while fetching school details');
        }
    };

    const handleViewStudent = async (studentId) => {
        try {
            const response = await fetch(`/api/StudentDetails/${studentId}`);
            if (response.ok) {
                const data = await response.json();
                setSelectedStudent(data);
                setStudentDialogOpen(true);
            } else {
                setError('Failed to fetch student details');
            }
        } catch (error) {
            setError('Network error while fetching student details');
        }
    };

    const handleViewTeacher = async (teacherId) => {
        try {
            const response = await fetch(`/api/TeacherDetails/${teacherId}`);
            if (response.ok) {
                const data = await response.json();
                setSelectedTeacher(data);
                setTeacherDialogOpen(true);
            } else {
                setError('Failed to fetch teacher details');
            }
        } catch (error) {
            setError('Network error while fetching teacher details');
        }
    };

    const handleChangePassword = (type, id) => {
        setPasswordType(type);
        if (type === 'student') {
            setSelectedStudent({ _id: id });
        } else {
            setSelectedTeacher({ _id: id });
        }
        setPasswordDialogOpen(true);
    };

    const handlePasswordUpdate = async () => {
        try {
            const endpoint = passwordType === 'student'
                ? `/api/StudentPassword/${selectedStudent._id}`
                : `/api/TeacherPassword/${selectedTeacher._id}`;

            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword })
            });

            if (response.ok) {
                setError('');
                setPasswordDialogOpen(false);
                setNewPassword('');
                // Refresh the data
                if (selectedSchool) {
                    handleViewSchool(selectedSchool.schoolName);
                }
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to update password');
            }
        } catch (error) {
            setError('Network error while updating password');
        }
    };

    const handleLogout = () => {
        dispatch(authLogout());
        navigate('/choose');
    };

    const totalStats = schools.reduce((acc, school) => {
        acc.students += school.stats.students;
        acc.teachers += school.stats.teachers;
        acc.financeStaff += school.stats.financeStaff;
        acc.librarians += school.stats.librarians;
        acc.classes += school.stats.classes;
        acc.subjects += school.stats.subjects;
        acc.books += school.stats.books;
        acc.notices += school.stats.notices;
        return acc;
    }, {
        students: 0,
        teachers: 0,
        financeStaff: 0,
        librarians: 0,
        classes: 0,
        subjects: 0,
        books: 0,
        notices: 0
    });

    if (loading) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                sx={{
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                }}
            >
                <CircularProgress
                    size={80}
                    thickness={4}
                    sx={{
                        color: '#667eea',
                        mb: 3
                    }}
                />
                <Typography
                    variant="h6"
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 'bold'
                    }}
                >
                    Loading Super Admin Dashboard...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <Toolbar>
                    <DashboardIcon sx={{ mr: 2 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Super Admin Dashboard
                    </Typography>
                    <Typography variant="body2" sx={{ mr: 2 }}>
                        Welcome, {user?.name}
                    </Typography>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{
                mt: 4,
                mb: 4,
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                minHeight: '100vh',
                py: 4,
                borderRadius: 3,
                boxShadow: 'inset 0 0 50px rgba(0,0,0,0.05)'
            }}>
                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                            boxShadow: '0 4px 20px rgba(244, 67, 54, 0.2)',
                            border: '1px solid rgba(244, 67, 54, 0.3)'
                        }}
                    >
                        {error}
                    </Alert>
                )}

                {/* Overall Statistics */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h4" gutterBottom sx={{
                        mb: 4,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 'bold'
                    }}>
                        System Overview
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard>
                                <SchoolIcon sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4">{schools.length}</Typography>
                                <Typography variant="body2">Total Schools</Typography>
                            </StatCard>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard>
                                <PeopleIcon sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4">{totalStats.students}</Typography>
                                <Typography variant="body2">Total Students</Typography>
                            </StatCard>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard>
                                <PeopleIcon sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4">{totalStats.teachers}</Typography>
                                <Typography variant="body2">Total Teachers</Typography>
                            </StatCard>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard>
                                <BookIcon sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4">{totalStats.books}</Typography>
                                <Typography variant="body2">Total Books</Typography>
                            </StatCard>
                        </Grid>
                    </Grid>
                </Box>

                {/* Schools List */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" gutterBottom sx={{
                        mb: 4,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 'bold'
                    }}>
                        Registered Schools
                    </Typography>

                    <Grid container spacing={3}>
                        {schools.map((school) => (
                            <Grid item xs={12} sm={6} md={4} key={school._id}>
                                <StyledCard>
                                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                        <Box sx={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            p: 2,
                                            borderRadius: 2,
                                            mb: 2,
                                            textAlign: 'center'
                                        }}>
                                            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                {school.schoolName}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body1" sx={{
                                                color: 'text.primary',
                                                fontWeight: 'medium',
                                                display: 'flex',
                                                alignItems: 'center',
                                                mb: 1
                                            }}>
                                                👨‍💼 Admin: {school.adminName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                📧 {school.adminEmail}
                                            </Typography>
                                            <Tooltip title={`Raw value: ${school.createdAt || 'null'}`} arrow>
                                                <Typography variant="body2" color="text.secondary">
                                                    📅 Created: {formatDate(school.createdAt)}
                                                </Typography>
                                            </Tooltip>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Box sx={{
                                                    textAlign: 'center',
                                                    p: 1,
                                                    borderRadius: 1,
                                                    background: 'rgba(102, 126, 234, 0.1)'
                                                }}>
                                                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                                        {school.stats.students}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Students
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box sx={{
                                                    textAlign: 'center',
                                                    p: 1,
                                                    borderRadius: 1,
                                                    background: 'rgba(118, 75, 162, 0.1)'
                                                }}>
                                                    <Typography variant="h6" color="secondary" sx={{ fontWeight: 'bold' }}>
                                                        {school.stats.teachers}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Teachers
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box sx={{
                                                    textAlign: 'center',
                                                    p: 1,
                                                    borderRadius: 1,
                                                    background: 'rgba(240, 147, 251, 0.1)'
                                                }}>
                                                    <Typography variant="h6" sx={{
                                                        fontWeight: 'bold',
                                                        color: '#f093fb'
                                                    }}>
                                                        {school.stats.classes}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Classes
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box sx={{
                                                    textAlign: 'center',
                                                    p: 1,
                                                    borderRadius: 1,
                                                    background: 'rgba(255, 193, 7, 0.1)'
                                                }}>
                                                    <Typography variant="h6" sx={{
                                                        fontWeight: 'bold',
                                                        color: '#ffc107'
                                                    }}>
                                                        {school.stats.books}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Books
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                    <CardActions sx={{ p: 2, pt: 0 }}>
                                        <Button
                                            variant="contained"
                                            size="medium"
                                            startIcon={<ViewIcon />}
                                            onClick={() => handleViewSchool(school.schoolName)}
                                            sx={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                borderRadius: 2,
                                                px: 3,
                                                py: 1,
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                                                    transform: 'translateY(-2px)',
                                                }
                                            }}
                                        >
                                            View Details
                                        </Button>
                                    </CardActions>
                                </StyledCard>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* School Details Dialog */}
                <Dialog
                    open={viewDialogOpen}
                    onClose={() => setViewDialogOpen(false)}
                    maxWidth="lg"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                        }
                    }}
                >
                    <DialogTitle sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        borderRadius: '12px 12px 0 0',
                        p: 3
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <SchoolIcon sx={{ fontSize: 32 }} />
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                {selectedSchool?.schoolName}
                            </Typography>
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ p: 3 }}>
                        {selectedSchool && (
                            <Box>
                                {/* Overview Section */}
                                <Box sx={{
                                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                    p: 3,
                                    borderRadius: 2,
                                    mb: 4,
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                }}>
                                    <Typography variant="h6" gutterBottom sx={{
                                        mb: 2,
                                        color: '#667eea',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        📊 Overview
                                    </Typography>


                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={4}>
                                            <Box sx={{
                                                textAlign: 'center',
                                                p: 2,
                                                borderRadius: 2,
                                                background: 'rgba(102, 126, 234, 0.1)',
                                                border: '1px solid rgba(102, 126, 234, 0.2)'
                                            }}>
                                                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                                    👨‍💼 {selectedSchool.adminName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    School Administrator
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Box sx={{
                                                textAlign: 'center',
                                                p: 2,
                                                borderRadius: 2,
                                                background: 'rgba(118, 75, 162, 0.1)',
                                                border: '1px solid rgba(118, 75, 162, 0.2)'
                                            }}>
                                                <Typography variant="h6" color="secondary" sx={{ fontWeight: 'bold' }}>
                                                    📧 {selectedSchool.adminEmail}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Contact Email
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Box sx={{
                                                textAlign: 'center',
                                                p: 2,
                                                borderRadius: 2,
                                                background: 'rgba(240, 147, 251, 0.1)',
                                                border: '1px solid rgba(240, 147, 251, 0.2)'
                                            }}>
                                                <Tooltip title={`Raw value: ${selectedSchool.createdAt || 'null'}`} arrow>
                                                    <Typography variant="h6" sx={{
                                                        fontWeight: 'bold',
                                                        color: '#f093fb'
                                                    }}>
                                                        📅 {formatDate(selectedSchool.createdAt)}
                                                    </Typography>
                                                </Tooltip>
                                                <Typography variant="caption" color="text.secondary">
                                                    Established Date
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* Students Section */}
                                <Box sx={{
                                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                    p: 3,
                                    borderRadius: 2,
                                    mb: 4,
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                }}>
                                    <Typography variant="h6" gutterBottom sx={{
                                        mb: 3,
                                        color: '#667eea',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        👥 Students ({selectedSchool.details.students.length})
                                    </Typography>
                                    <TableContainer component={Paper} sx={{
                                        maxHeight: 300,
                                        borderRadius: 2,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                    }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Class</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Roll No</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {selectedSchool.details.students.map((student, index) => (
                                                    <TableRow
                                                        key={index}
                                                        sx={{
                                                            '&:nth-of-type(odd)': {
                                                                backgroundColor: 'rgba(102, 126, 234, 0.05)'
                                                            },
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(102, 126, 234, 0.1)'
                                                            }
                                                        }}
                                                    >
                                                        <TableCell sx={{ fontWeight: 'medium' }}>{student.name}</TableCell>
                                                        <TableCell>{student.email}</TableCell>
                                                        <TableCell sx={{
                                                            color: '#667eea',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {student.sclassName?.sclassName || 'N/A'}
                                                        </TableCell>
                                                        <TableCell sx={{
                                                            color: '#764ba2',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {student.rollNum}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                onClick={() => handleViewStudent(student._id)}
                                                                sx={{
                                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                    borderRadius: 2,
                                                                    px: 2,
                                                                    py: 0.5,
                                                                    textTransform: 'none',
                                                                    fontWeight: 'bold',
                                                                    boxShadow: '0 2px 10px rgba(102, 126, 234, 0.3)',
                                                                    '&:hover': {
                                                                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                                                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                                                        transform: 'translateY(-1px)',
                                                                    }
                                                                }}
                                                            >
                                                                👁️ View
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>

                                {/* Teachers Section */}
                                <Box sx={{
                                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                    p: 3,
                                    borderRadius: 2,
                                    mb: 4,
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                }}>
                                    <Typography variant="h6" gutterBottom sx={{
                                        mb: 3,
                                        color: '#764ba2',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        👨‍🏫 Teachers ({selectedSchool.details.teachers.length})
                                    </Typography>
                                    <TableContainer component={Paper} sx={{
                                        maxHeight: 300,
                                        borderRadius: 2,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                    }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ background: 'linear-gradient(135deg, #764ba2 0%, #f093fb 100%)' }}>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subject</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Class</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {selectedSchool.details.teachers.map((teacher, index) => (
                                                    <TableRow
                                                        key={index}
                                                        sx={{
                                                            '&:nth-of-type(odd)': {
                                                                backgroundColor: 'rgba(118, 75, 162, 0.05)'
                                                            },
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(118, 75, 162, 0.1)'
                                                            }
                                                        }}
                                                    >
                                                        <TableCell sx={{ fontWeight: 'medium' }}>{teacher.name}</TableCell>
                                                        <TableCell>{teacher.email}</TableCell>
                                                        <TableCell sx={{
                                                            color: '#764ba2',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {teacher.teachSubject?.subName || 'N/A'}
                                                        </TableCell>
                                                        <TableCell sx={{
                                                            color: '#f093fb',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {teacher.teachSclass?.sclassName || 'N/A'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                onClick={() => handleViewTeacher(teacher._id)}
                                                                sx={{
                                                                    background: 'linear-gradient(135deg, #764ba2 0%, #f093fb 100%)',
                                                                    borderRadius: 2,
                                                                    px: 2,
                                                                    py: 0.5,
                                                                    textTransform: 'none',
                                                                    fontWeight: 'bold',
                                                                    boxShadow: '0 2px 10px rgba(118, 75, 162, 0.3)',
                                                                    '&:hover': {
                                                                        background: 'linear-gradient(135deg, #6a4190 0%, #d885e8 100%)',
                                                                        boxShadow: '0 4px 15px rgba(118, 75, 162, 0.4)',
                                                                        transform: 'translateY(-1px)',
                                                                    }
                                                                }}
                                                            >
                                                                👁️ View
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>

                                {/* Classes Section */}
                                <Box sx={{
                                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                    p: 3,
                                    borderRadius: 2,
                                    mb: 4,
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                }}>
                                    <Typography variant="h6" gutterBottom sx={{
                                        mb: 3,
                                        color: '#f093fb',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        🏫 Classes ({selectedSchool.details.classes.length})
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {selectedSchool.details.classes.map((cls, index) => (
                                            <Grid item xs={12} sm={6} md={4} key={index}>
                                                <Box sx={{
                                                    background: 'linear-gradient(135deg, #f093fb 0%, #e0c3fc 100%)',
                                                    color: 'white',
                                                    p: 2,
                                                    borderRadius: 2,
                                                    textAlign: 'center',
                                                    boxShadow: '0 4px 15px rgba(240, 147, 251, 0.3)',
                                                    transition: 'all 0.3s ease-in-out',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 8px 25px rgba(240, 147, 251, 0.4)',
                                                    }
                                                }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                        {cls.sclassName}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>

                                {/* Subjects Section */}
                                <Box sx={{
                                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                    p: 3,
                                    borderRadius: 2,
                                    mb: 4,
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                }}>
                                    <Typography variant="h6" gutterBottom sx={{
                                        mb: 3,
                                        color: '#ffc107',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        📚 Subjects ({selectedSchool.details.subjects.length})
                                    </Typography>
                                    <TableContainer component={Paper} sx={{
                                        maxHeight: 300,
                                        borderRadius: 2,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                    }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)' }}>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subject Name</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subject Code</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Class</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {selectedSchool.details.subjects.map((subject, index) => (
                                                    <TableRow
                                                        key={index}
                                                        sx={{
                                                            '&:nth-of-type(odd)': {
                                                                backgroundColor: 'rgba(255, 193, 7, 0.05)'
                                                            },
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(255, 193, 7, 0.1)'
                                                            }
                                                        }}
                                                    >
                                                        <TableCell sx={{ fontWeight: 'medium' }}>{subject.subName}</TableCell>
                                                        <TableCell sx={{
                                                            color: '#ffc107',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {subject.subCode}
                                                        </TableCell>
                                                        <TableCell sx={{
                                                            color: '#ff9800',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {subject.sclassName?.sclassName || 'N/A'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>

                                {/* Books Section */}
                                <Box sx={{
                                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                    p: 3,
                                    borderRadius: 2,
                                    mb: 4,
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                }}>
                                    <Typography variant="h6" gutterBottom sx={{
                                        mb: 3,
                                        color: '#4caf50',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        📖 Books ({selectedSchool.details.books.length})
                                    </Typography>
                                    <TableContainer component={Paper} sx={{
                                        maxHeight: 300,
                                        borderRadius: 2,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                    }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)' }}>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Author</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Availability</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {selectedSchool.details.books.map((book, index) => (
                                                    <TableRow
                                                        key={index}
                                                        sx={{
                                                            '&:nth-of-type(odd)': {
                                                                backgroundColor: 'rgba(76, 175, 80, 0.05)'
                                                            },
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(76, 175, 80, 0.1)'
                                                            }
                                                        }}
                                                    >
                                                        <TableCell sx={{ fontWeight: 'medium' }}>{book.title}</TableCell>
                                                        <TableCell>{book.author}</TableCell>
                                                        <TableCell sx={{
                                                            color: '#4caf50',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {book.category}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={book.availability}
                                                                color={book.availability === 'Available' ? 'success' : 'error'}
                                                                size="small"
                                                                sx={{ fontWeight: 'bold' }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>

                                {/* Notices Section */}
                                <Box sx={{
                                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                    p: 3,
                                    borderRadius: 2,
                                    mb: 4,
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                }}>
                                    <Typography variant="h6" gutterBottom sx={{
                                        mb: 3,
                                        color: '#ff5722',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        📢 Notices ({selectedSchool.details.notices.length})
                                    </Typography>
                                    <TableContainer component={Paper} sx={{
                                        maxHeight: 300,
                                        borderRadius: 2,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                    }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ background: 'linear-gradient(135deg, #ff5722 0%, #ff7043 100%)' }}>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Content</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {selectedSchool.details.notices.map((notice, index) => (
                                                    <TableRow
                                                        key={index}
                                                        sx={{
                                                            '&:nth-of-type(odd)': {
                                                                backgroundColor: 'rgba(255, 87, 34, 0.05)'
                                                            },
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(255, 87, 34, 0.1)'
                                                            }
                                                        }}
                                                    >
                                                        <TableCell sx={{ fontWeight: 'medium' }}>{notice.title}</TableCell>
                                                        <TableCell sx={{ maxWidth: 200 }}>
                                                            <Typography variant="body2" sx={{
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap'
                                                            }}>
                                                                {notice.content}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell sx={{
                                                            color: '#ff5722',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {formatDate(notice.date)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 0 }}>
                        <Button
                            variant="contained"
                            onClick={() => setViewDialogOpen(false)}
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: 2,
                                px: 4,
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                                    transform: 'translateY(-2px)',
                                }
                            }}
                        >
                            ✨ Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Student Details Dialog */}
                <Dialog
                    open={studentDialogOpen}
                    onClose={() => setStudentDialogOpen(false)}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                        }
                    }}
                >
                    <DialogTitle sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        borderRadius: '12px 12px 0 0',
                        p: 3
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <PeopleIcon sx={{ fontSize: 32 }} />
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                Student Details: {selectedStudent?.name}
                            </Typography>
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ p: 3 }}>
                        {selectedStudent && (
                            <Box>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{
                                            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                            p: 3,
                                            borderRadius: 2,
                                            border: '1px solid rgba(102, 126, 234, 0.2)',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                        }}>
                                            <Typography variant="h6" sx={{
                                                color: '#667eea',
                                                fontWeight: 'bold',
                                                mb: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }}>
                                                👤 Personal Information
                                            </Typography>
                                            <Box sx={{ space: 2 }}>
                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                    <strong>Name:</strong> {selectedStudent.name}
                                                </Typography>
                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                    <strong>Email:</strong> {selectedStudent.email}
                                                </Typography>
                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                    <strong>Roll Number:</strong> {selectedStudent.rollNum}
                                                </Typography>
                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                    <strong>Gender:</strong> {selectedStudent.gender}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{
                                            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                            p: 3,
                                            borderRadius: 2,
                                            border: '1px solid rgba(118, 75, 162, 0.2)',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                        }}>
                                            <Typography variant="h6" sx={{
                                                color: '#764ba2',
                                                fontWeight: 'bold',
                                                mb: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }}>
                                                🏫 Academic Information
                                            </Typography>
                                            <Box sx={{ space: 2 }}>
                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                    <strong>Class:</strong> {selectedStudent.sclassName?.sclassName || 'N/A'}
                                                </Typography>
                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                    <strong>School:</strong> {selectedStudent.school?.schoolName || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 0 }}>
                        <Button
                            variant="contained"
                            onClick={() => handleChangePassword('student', selectedStudent?._id)}
                            sx={{
                                background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
                                borderRadius: 2,
                                px: 3,
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #45a049 0%, #7cb342 100%)',
                                    boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
                                    transform: 'translateY(-2px)',
                                }
                            }}
                        >
                            🔐 Change Password
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => setStudentDialogOpen(false)}
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: 2,
                                px: 3,
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                                    transform: 'translateY(-2px)',
                                }
                            }}
                        >
                            ✨ Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Teacher Details Dialog */}
                <Dialog
                    open={teacherDialogOpen}
                    onClose={() => setTeacherDialogOpen(false)}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                        }
                    }}
                >
                    <DialogTitle sx={{
                        background: 'linear-gradient(135deg, #764ba2 0%, #f093fb 100%)',
                        color: 'white',
                        borderRadius: '12px 12px 0 0',
                        p: 3
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <PeopleIcon sx={{ fontSize: 32 }} />
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                Teacher Details: {selectedTeacher?.name}
                            </Typography>
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ p: 3 }}>
                        {selectedTeacher && (
                            <Box>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{
                                            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                            p: 3,
                                            borderRadius: 2,
                                            border: '1px solid rgba(118, 75, 162, 0.2)',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                        }}>
                                            <Typography variant="h6" sx={{
                                                color: '#764ba2',
                                                fontWeight: 'bold',
                                                mb: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }}>
                                                👤 Personal Information
                                            </Typography>
                                            <Box sx={{ space: 2 }}>
                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                    <strong>Name:</strong> {selectedTeacher.name}
                                                </Typography>
                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                    <strong>Email:</strong> {selectedTeacher.email}
                                                </Typography>
                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                    <strong>Phone:</strong> {selectedTeacher.phone}
                                                </Typography>
                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                    <strong>Qualification:</strong> {selectedTeacher.qualification}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{
                                            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                            p: 3,
                                            borderRadius: 2,
                                            border: '1px solid rgba(240, 147, 251, 0.2)',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                        }}>
                                            <Typography variant="h6" sx={{
                                                color: '#f093fb',
                                                fontWeight: 'bold',
                                                mb: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }}>
                                                🏫 Academic Information
                                            </Typography>
                                            <Box sx={{ space: 2 }}>
                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                    <strong>Subject:</strong> {selectedTeacher.teachSubject?.subName || 'N/A'}
                                                </Typography>
                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                    <strong>Class:</strong> {selectedTeacher.teachSclass?.sclassName || 'N/A'}
                                                </Typography>
                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                    <strong>Experience:</strong> {selectedTeacher.experience}
                                                </Typography>
                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                    <strong>Salary:</strong> ₹{selectedTeacher.salary}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 0 }}>
                        <Button
                            variant="contained"
                            onClick={() => handleChangePassword('teacher', selectedTeacher?._id)}
                            sx={{
                                background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
                                borderRadius: 2,
                                px: 3,
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #45a049 0%, #7cb342 100%)',
                                    boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
                                    transform: 'translateY(-2px)',
                                }
                            }}
                        >
                            🔐 Change Password
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => setTeacherDialogOpen(false)}
                            sx={{
                                background: 'linear-gradient(135deg, #764ba2 0%, #f093fb 100%)',
                                borderRadius: 2,
                                px: 3,
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 15px rgba(118, 75, 162, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #6a4190 0%, #d885e8 100%)',
                                    boxShadow: '0 6px 20px rgba(118, 75, 162, 0.4)',
                                    transform: 'translateY(-2px)',
                                }
                            }}
                        >
                            ✨ Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Password Change Dialog */}
                <Dialog
                    open={passwordDialogOpen}
                    onClose={() => setPasswordDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                        }
                    }}
                >
                    <DialogTitle sx={{
                        background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
                        color: 'white',
                        borderRadius: '12px 12px 0 0',
                        p: 3
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                🔐 Change {passwordType === 'student' ? 'Student' : 'Teacher'} Password
                            </Typography>
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ p: 3 }}>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body1" gutterBottom sx={{ mb: 3, color: 'text.secondary' }}>
                                Enter new password for <strong>{passwordType === 'student' ? selectedStudent?.name : selectedTeacher?.name}</strong>:
                            </Typography>
                            <TextField
                                fullWidth
                                type="password"
                                label="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                sx={{
                                    mt: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&:hover fieldset': {
                                            borderColor: '#4caf50',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#4caf50',
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#4caf50',
                                    },
                                }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 0 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setPasswordDialogOpen(false)}
                            sx={{
                                borderColor: '#667eea',
                                color: '#667eea',
                                borderRadius: 2,
                                px: 3,
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 'bold',
                                '&:hover': {
                                    borderColor: '#5a6fd8',
                                    backgroundColor: 'rgba(102, 126, 234, 0.04)',
                                }
                            }}
                        >
                            ❌ Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handlePasswordUpdate}
                            disabled={!newPassword.trim()}
                            sx={{
                                background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
                                borderRadius: 2,
                                px: 3,
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #45a049 0%, #7cb342 100%)',
                                    boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
                                    transform: 'translateY(-2px)',
                                },
                                '&:disabled': {
                                    background: '#ccc',
                                    boxShadow: 'none',
                                    transform: 'none',
                                }
                            }}
                        >
                            ✅ Update Password
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default SuperAdminDashboard;

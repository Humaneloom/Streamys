import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    Chip,
    Button,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    CircularProgress,
    Alert,
    IconButton,
    Tooltip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Badge
} from '@mui/material';
import {
    LocalLibrary,
    Book,
    School,
    People,
    Assignment,
    TrendingUp,
    Notifications,
    CheckCircle,
    Warning,
    Info,
    Refresh,
    Add,
    Search,
    Work,
    Person,
    LibraryBooks,
    Category,
    Inventory,
    Build,
    Clear,
    ArrowForward
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import { fetchBooks, fetchBookStats, fetchBookCategories } from '../../redux/bookRelated/bookHandle';
import axios from 'axios';


// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
    transition: 'all 0.3s ease',
    height: '100%',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 16px 48px rgba(102, 126, 234, 0.4)',
    },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.8)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    },
}));

const StatCard = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3),
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(255,255,255,0.8)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    },
}));

const StatIcon = styled(Avatar)(({ theme, color }) => ({
    width: 60,
    height: 60,
    marginRight: theme.spacing(2),
    background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
    boxShadow: `0 4px 20px ${color}40`,
}));

const ActivityItem = styled(ListItem)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: '12px',
    margin: theme.spacing(0.5, 0),
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(102, 126, 234, 0.05)',
        transform: 'translateX(8px)',
    },
}));

const LibrarianHomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    const { sclassesList: sclassesListFromRedux, loading: classesLoadingFromRedux } = useSelector((state) => state.sclass);
    const { teachersList, loading: teachersLoading } = useSelector((state) => state.teacher);
    const { books, stats, categories, loading: booksLoading } = useSelector((state) => state.books);

    // Local state for dashboard data
    const [dashboardData, setDashboardData] = useState({
        studentLoans: [],
        staffLoans: [],
        recentActivities: [],
        loading: true,
        error: null
    });



    // Get school name from current user or localStorage
    const schoolName = currentUser?.schoolName || localStorage.getItem('schoolName') || 'Default School';
    


    useEffect(() => {
        if (schoolName) {
            fetchDashboardData();
            dispatch(getAllSclasses(schoolName, "Sclass"));
            dispatch(getAllTeachers(schoolName));
            
            // Fetch books
            dispatch(fetchBooks(schoolName, {}, 1, 50));
            
            // Try to fetch stats, but don't fail if endpoint doesn't exist
            try {
                dispatch(fetchBookStats(schoolName));
            } catch (error) {
                // Book stats endpoint not available, using calculated stats
            }
            
            try {
                dispatch(fetchBookCategories(schoolName));
            } catch (error) {
                // Book categories endpoint not available, using fallback
            }
        }
    }, [schoolName, dispatch]);



    const fetchDashboardData = async () => {
        setDashboardData(prev => ({ ...prev, loading: true, error: null }));
        
        try {
            // Fetch student book loans
            const studentLoansResponse = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/BookLoans/${schoolName}/students`);
            const studentLoans = studentLoansResponse.data?.data || studentLoansResponse.data || [];

            // Fetch staff book loans
            const staffLoansResponse = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/BookLoans/${schoolName}/teachers`);
            const staffLoans = staffLoansResponse.data?.data || staffLoansResponse.data || [];

            // Generate recent activities from loans
            const allLoans = [...studentLoans, ...staffLoans];
            const recentActivities = generateRecentActivities(allLoans);

            setDashboardData({
                studentLoans,
                staffLoans,
                recentActivities,
                loading: false,
                error: null
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setDashboardData(prev => ({
                ...prev,
                loading: false,
                error: 'Failed to load dashboard data'
            }));
        }
    };

    const generateRecentActivities = (loans) => {
        const activities = [];
        
        // Add recent book loans
        loans.slice(0, 5).forEach(loan => {
            const borrowerName = loan.student?.name || loan.teacher?.name || 'Unknown';
            const bookTitle = loan.book?.title || 'Unknown Book';
            
            activities.push({
                id: `loan-${loan._id}`,
                type: 'success',
                title: 'Book Issued',
                description: `${bookTitle} issued to ${borrowerName}`,
                time: formatTimeAgo(loan.issueDate),
                icon: <Book />,
                timestamp: new Date(loan.issueDate)
            });
        });

        // Add overdue warnings
        const overdueLoans = loans.filter(loan => {
            if (loan.status === 'returned') return false;
            const dueDate = new Date(loan.dueDate);
            const today = new Date();
            return dueDate < today;
        });

        overdueLoans.slice(0, 3).forEach(loan => {
            const borrowerName = loan.student?.name || loan.teacher?.name || 'Unknown';
            const bookTitle = loan.book?.title || 'Unknown Book';
            
            activities.push({
                id: `overdue-${loan._id}`,
                type: 'warning',
                title: 'Book Overdue',
                description: `${bookTitle} overdue for ${borrowerName}`,
                time: formatTimeAgo(loan.dueDate),
                icon: <Warning />,
                timestamp: new Date(loan.dueDate)
            });
        });

        // Sort by timestamp and take top 8
        return activities
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 8);
    };

    const formatTimeAgo = (dateString) => {
        if (!dateString) return 'Unknown time';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'borrowed': return 'primary';
            case 'overdue': return 'error';
            case 'returned': return 'success';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'borrowed': return 'Borrowed';
            case 'overdue': return 'Overdue';
            case 'returned': return 'Returned';
            default: return 'Unknown';
        }
    };

    // Calculate statistics
    const totalBooks = stats?.totalBooks || books?.length || 0;
    const totalAvailable = stats?.totalAvailable || books?.reduce((sum, book) => sum + (book.availableQuantity || 0), 0) || 0;
    const totalStudents = sclassesListFromRedux?.reduce((sum, cls) => sum + (cls.students?.length || 0), 0) || 0;
    const totalTeachers = teachersList?.length || 0;
    const totalStudentLoans = dashboardData.studentLoans.length;
    const totalStaffLoans = dashboardData.staffLoans.length;
    const activeStudentLoans = dashboardData.studentLoans.filter(loan => loan.status === 'borrowed').length;
    const activeStaffLoans = dashboardData.staffLoans.filter(loan => loan.status === 'borrowed').length;
    const overdueStudentLoans = dashboardData.studentLoans.filter(loan => {
        if (loan.status === 'returned') return false;
        const dueDate = new Date(loan.dueDate);
        const today = new Date();
        return dueDate < today;
    }).length;
    const overdueStaffLoans = dashboardData.staffLoans.filter(loan => {
        if (loan.status === 'returned') return false;
        const dueDate = new Date(loan.dueDate);
        const today = new Date();
        return dueDate < today;
    }).length;

    // Calculate book stats from books array if stats API fails
    const calculatedStats = {
        totalBooks: books?.length || 0,
        totalAvailable: books?.reduce((sum, book) => sum + (book.availableQuantity || 0), 0) || 0,
        totalTitles: books?.length || 0,
        categories: categories?.length || 0
    };

    // Function to calculate stats from books array
    const calculateStatsFromBooks = (booksArray) => {
        if (!booksArray || booksArray.length === 0) {
            return {
                totalBooks: 0,
                totalAvailable: 0,
                totalTitles: 0,
                totalOutOfStock: 0
            };
        }

        const stats = {
            totalBooks: booksArray.reduce((sum, book) => sum + (book.quantity || 0), 0),
            totalAvailable: booksArray.reduce((sum, book) => sum + (book.availableQuantity || 0), 0),
            totalTitles: booksArray.length,
            totalOutOfStock: booksArray.filter(book => (book.availableQuantity || 0) === 0).length
        };

        return stats;
    };

    // Use calculated stats as fallback
    const finalStats = stats && Object.keys(stats).length > 0 ? stats : calculateStatsFromBooks(books);

    // Only use fallback categories if API fails AND no categories exist
    const finalCategories = categories && categories.length > 0 ? categories : [];

    const statsData = [
        {
            title: 'Total Books',
            value: finalStats.totalBooks.toLocaleString(),
            icon: <Book />,
            color: '#667eea',
            change: `${finalStats.totalAvailable} available`,
            changeType: 'info'
        },
        {
            title: 'Active Students',
            value: totalStudents.toLocaleString(),
            icon: <School />,
            color: '#10b981',
            change: `${activeStudentLoans} books borrowed`,
            changeType: 'info'
        },
        {
            title: 'Staff Members',
            value: totalTeachers.toLocaleString(),
            icon: <Work />,
            color: '#f59e0b',
            change: `${activeStaffLoans} books borrowed`,
            changeType: 'info'
        },
        {
            title: 'Overdue Books',
            value: (overdueStudentLoans + overdueStaffLoans).toString(),
            icon: <Warning />,
            color: '#ef4444',
            change: `${overdueStudentLoans} students, ${overdueStaffLoans} staff`,
            changeType: 'warning'
        }
    ];

    const quickActions = [
        {
            title: 'Manage Books',
            description: 'Add, edit, or remove books',
            icon: <Book />,
            color: '#667eea',
            path: '/Librarian/books'
        },
        {
            title: 'Student Loans',
            description: 'Manage student book loans',
            icon: <School />,
            color: '#10b981',
            path: '/Librarian/students'
        },
        {
            title: 'Staff Loans',
            description: 'Manage staff book loans',
            icon: <Work />,
            color: '#f59e0b',
            path: '/Librarian/staff'
        },
        {
            title: 'Library Reports',
            description: 'Generate activity reports',
            icon: <TrendingUp />,
            color: '#ef4444',
            path: '/Librarian/reports'
        }
    ];

    const getChangeColor = (type) => {
        switch (type) {
            case 'positive': return '#10b981';
            case 'warning': return '#f59e0b';
            case 'info': return '#667eea';
            default: return '#6b7280';
        }
    };

    const handleQuickAction = (path) => {
        navigate(path);
    };

    const handleViewAll = (type) => {
        if (type === 'students') {
            navigate('/Librarian/students');
        } else if (type === 'staff') {
            navigate('/Librarian/staff');
        }
    };

    const handleRefreshBooks = () => {
        // Force refresh books with higher limit
        dispatch(fetchBooks(schoolName, {}, 1, 100));
        
        // Try to fetch stats, but don't fail if endpoint doesn't exist
        try {
            dispatch(fetchBookStats(schoolName));
        } catch (error) {
            // Book stats endpoint not available, using calculated stats
        }
        try {
            dispatch(fetchBookCategories(schoolName));
        } catch (error) {
            // Book categories endpoint not available, using fallback
        }
        
        // Also refresh dashboard data
        fetchDashboardData();
    };











    if (dashboardData.loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={60} sx={{ color: '#667eea', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#667eea' }}>
                        Loading Library Dashboard...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            p: 3, 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '100vh'
        }}>
            {/* Error Alert */}
            {dashboardData.error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {dashboardData.error}
                    <Button 
                        size="small" 
                        onClick={fetchDashboardData}
                        sx={{ ml: 2 }}
                    >
                        Retry
                    </Button>
                </Alert>
            )}

            {/* Welcome Header */}
            <StyledCard sx={{ mb: 4, p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                mr: 3,
                                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                color: '#667eea',
                                fontSize: '2.5rem'
                            }}
                        >
                            <LocalLibrary />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                Welcome back, Librarian!
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                                Managing {schoolName} Library • {new Date().toLocaleDateString()}
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={fetchDashboardData}
                        sx={{ 
                            color: 'white', 
                            borderColor: 'rgba(255,255,255,0.3)',
                            '&:hover': { borderColor: 'white' }
                        }}
                    >
                        Refresh Data
                    </Button>
                </Box>
            </StyledCard>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {statsData.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <StatCard>
                            <StatIcon color={stat.color}>
                                {stat.icon}
                            </StatIcon>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a202c', mb: 0.5 }}>
                                    {booksLoading && stat.title === 'Total Books' ? (
                                        <CircularProgress size={24} sx={{ color: stat.color }} />
                                    ) : (
                                        stat.value
                                    )}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#718096', mb: 1 }}>
                                    {stat.title}
                                </Typography>
                                <Chip
                                    label={booksLoading && stat.title === 'Total Books' ? 'Loading...' : stat.change}
                                    size="small"
                                    sx={{
                                        backgroundColor: getChangeColor(stat.changeType),
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.75rem'
                                    }}
                                />
                            </Box>
                        </StatCard>
                    </Grid>
                ))}
            </Grid>



            {/* Main Content Grid */}
            <Grid container spacing={3}>
                {/* Recent Activities */}
                <Grid item xs={12} lg={8}>
                    <StyledPaper sx={{ p: 3, height: 'fit-content' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Notifications sx={{ mr: 2, color: '#667eea', fontSize: '2rem' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748' }}>
                                    Recent Activities
                                </Typography>
                            </Box>
                            <Badge badgeContent={dashboardData.recentActivities.length} color="primary">
                                <Chip 
                                    label="Live Updates" 
                                    size="small" 
                                    color="primary" 
                                    variant="outlined"
                                />
                            </Badge>
                        </Box>
                        
                        {dashboardData.recentActivities.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Book sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
                                <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                                    No recent activities
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                    Start by issuing some books to see activities here
                                </Typography>
                            </Box>
                        ) : (
                            <List>
                                {dashboardData.recentActivities.map((activity, index) => (
                                    <React.Fragment key={activity.id}>
                                        <ActivityItem>
                                            <ListItemIcon>
                                                <Avatar
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        backgroundColor: activity.type === 'success' ? '#10b981' :
                                                                       activity.type === 'warning' ? '#f59e0b' : '#667eea'
                                                    }}
                                                >
                                                    {activity.icon}
                                                </Avatar>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={activity.title}
                                                secondary={
                                                    <React.Fragment>
                                                        <Box component="span" sx={{ color: '#718096', mb: 0.5, display: 'block' }}>
                                                            {activity.description}
                                                        </Box>
                                                        <Box component="span" sx={{ color: '#a0aec0', display: 'block' }}>
                                                            {activity.time}
                                                        </Box>
                                                    </React.Fragment>
                                                }
                                                primaryTypographyProps={{
                                                    variant: 'subtitle1',
                                                    sx: { fontWeight: 600, color: '#2d3748' }
                                                }}
                                            />
                                        </ActivityItem>
                                        {index < dashboardData.recentActivities.length - 1 && (
                                            <Divider sx={{ mx: 2, opacity: 0.3 }} />
                                        )}
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </StyledPaper>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12} lg={4}>
                    <StyledPaper sx={{ p: 3, height: 'fit-content' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
                            Quick Actions
                        </Typography>
                        <Grid container spacing={2}>
                            {quickActions.map((action, index) => (
                                <Grid item xs={12} key={index}>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        startIcon={
                                            <Avatar
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    backgroundColor: action.color,
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                {action.icon}
                                            </Avatar>
                                        }
                                        endIcon={<ArrowForward />}
                                        onClick={() => handleQuickAction(action.path)}
                                        sx={{
                                            justifyContent: 'space-between',
                                            textAlign: 'left',
                                            p: 2,
                                            borderRadius: '12px',
                                            borderColor: action.color,
                                            color: action.color,
                                            '&:hover': {
                                                backgroundColor: `${action.color}10`,
                                                borderColor: action.color,
                                                transform: 'translateY(-2px)',
                                            },
                                        }}
                                    >
                                        <Box sx={{ textAlign: 'left' }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, display: 'block' }}>
                                                {action.title}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#718096', display: 'block' }}>
                                                {action.description}
                                            </Typography>
                                        </Box>
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                    </StyledPaper>
                </Grid>
            </Grid>

            {/* Recent Book Loans Summary */}
            <Grid container spacing={3} sx={{ mt: 3 }}>
                {/* Student Loans Summary */}
                <Grid item xs={12} md={6}>
                    <StyledPaper sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <School sx={{ mr: 2, color: '#10b981', fontSize: '2rem' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748' }}>
                                    Recent Student Loans
                                </Typography>
                            </Box>
                            <Chip 
                                label={`${totalStudentLoans} total`} 
                                color="primary" 
                                size="small"
                            />
                        </Box>
                        
                        {dashboardData.studentLoans.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 3 }}>
                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                    No student loans found
                                </Typography>
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Book</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dashboardData.studentLoans.slice(0, 5).map((loan) => (
                                            <TableRow key={loan._id} hover>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                                                            <Person />
                                                        </Avatar>
                                                        <Typography variant="body2">
                                                            {loan.student?.name || 'Unknown'}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                                                        {loan.book?.title || 'Unknown'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={getStatusText(loan.status)} 
                                                        color={getStatusColor(loan.status)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'N/A'}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                        
                        {totalStudentLoans > 5 && (
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <Button 
                                    size="small" 
                                    endIcon={<ArrowForward />}
                                    onClick={() => handleViewAll('students')}
                                    sx={{ color: '#10b981' }}
                                >
                                    View All ({totalStudentLoans})
                                </Button>
                            </Box>
                        )}
                    </StyledPaper>
                </Grid>

                {/* Staff Loans Summary */}
                <Grid item xs={12} md={6}>
                    <StyledPaper sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Work sx={{ mr: 2, color: '#f59e0b', fontSize: '2rem' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748' }}>
                                    Recent Staff Loans
                                </Typography>
                            </Box>
                            <Chip 
                                label={`${totalStaffLoans} total`} 
                                color="warning" 
                                size="small"
                            />
                        </Box>
                        
                        {dashboardData.staffLoans.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 3 }}>
                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                    No staff loans found
                                </Typography>
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>Staff</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Book</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dashboardData.staffLoans.slice(0, 5).map((loan) => (
                                            <TableRow key={loan._id} hover>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'warning.main' }}>
                                                            <Work />
                                                        </Avatar>
                                                        <Typography variant="body2">
                                                            {loan.teacher?.name || 'Unknown'}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                                                        {loan.book?.title || 'Unknown'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={getStatusText(loan.status)} 
                                                        color={getStatusColor(loan.status)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'N/A'}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                        
                        {totalStaffLoans > 5 && (
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <Button 
                                    size="small" 
                                    endIcon={<ArrowForward />}
                                    onClick={() => handleViewAll('staff')}
                                    sx={{ color: '#f59e0b' }}
                                >
                                    View All ({totalStaffLoans})
                                </Button>
                            </Box>
                        )}
                    </StyledPaper>
                </Grid>
            </Grid>

            {/* Book Collection Summary */}
            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={12}>
                    <StyledPaper sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LibraryBooks sx={{ mr: 2, color: '#667eea', fontSize: '2rem' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748' }}>
                                    Book Collection Overview
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Chip 
                                    label={`${finalStats.totalBooks} total books`} 
                                    color="primary" 
                                    size="small"
                                />
                                <Chip 
                                    label={`${finalCategories.length} categories`} 
                                    color="secondary" 
                                    size="small"
                                />
                            </Box>
                        </Box>
                        
                        {booksLoading ? (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <CircularProgress size={40} sx={{ color: '#667eea', mb: 2 }} />
                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                    Loading book collection...
                                </Typography>
                            </Box>
                        ) : books.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Book sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
                                <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                                    No books in collection
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                    Start building your library by adding books
                                </Typography>
                            </Box>
                        ) : (
                            <Grid container spacing={2}>
                                {books.slice(0, 6).map((book) => (
                                    <Grid item xs={12} sm={6} md={4} lg={2} key={book._id}>
                                        <Card 
                                            sx={{ 
                                                height: '100%',
                                                transition: 'all 0.3s ease',
                                                '&:hover': { transform: 'translateY(-4px)' }
                                            }}
                                        >
                                            <Box sx={{ 
                                                height: 120, 
                                                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                p: 2
                                            }}>
                                                <Book sx={{ fontSize: 40, color: '#667eea' }} />
                                            </Box>
                                            <CardContent sx={{ p: 2 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }} noWrap>
                                                    {book.title}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 1 }}>
                                                    by {book.author}
                                                </Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Chip 
                                                        label={book.category} 
                                                        size="small" 
                                                        variant="outlined"
                                                        sx={{ fontSize: '0.7rem' }}
                                                    />
                                                    <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                                        {book.availableQuantity}/{book.quantity}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                        
                        {books.length > 6 && (
                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <Button 
                                    variant="outlined"
                                    endIcon={<ArrowForward />}
                                    onClick={() => handleQuickAction('/Librarian/books')}
                                    sx={{ 
                                        color: '#667eea',
                                        borderColor: '#667eea',
                                        '&:hover': { borderColor: '#5a6fd8' }
                                    }}
                                >
                                    View All Books ({books.length})
                                </Button>
                            </Box>
                        )}
                    </StyledPaper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LibrarianHomePage;

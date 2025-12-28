import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
    Box,
    CssBaseline,
    Toolbar,
    Typography,
    IconButton,
    Badge,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Chip,
    Button,
    AppBar,
    Drawer,
    List
} from '@mui/material';
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    Search as SearchIcon,
    Notifications as NotificationsIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    Class as ClassIcon,
    Book as BookIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Info as InfoIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { InputBase } from '@mui/material';
import AccountMenu from '../../components/AccountMenu';
import SideBar from './SideBar';
import AdminHomePage from './AdminHomePage';
import AdminProfile from './AdminProfile';
import AddClass from './classRelated/AddClass';
import ShowClasses from './classRelated/ShowClasses';
import ClassDetails from './classRelated/ClassDetails';
import AddStudent from './studentRelated/AddStudent';
import ShowStudents from './studentRelated/ShowStudents';
import ViewStudent from './studentRelated/ViewStudent';
import StudentAttendance from './studentRelated/StudentAttendance';
import StudentBulkAttendance from './studentRelated/StudentBulkAttendance';
import StudentExamMarks from './studentRelated/StudentExamMarks';
import AddTeacher from './teacherRelated/AddTeacher';
import ShowTeachers from './teacherRelated/ShowTeachers';
import TeacherDetails from './teacherRelated/TeacherDetails';
import ChooseClass from './teacherRelated/ChooseClass';
import ChooseSubject from './teacherRelated/ChooseSubject';
import AddNotice from './noticeRelated/AddNotice';
import ShowNotices from './noticeRelated/ShowNotices';
import ShowExamTimetables from './examTimetableRelated/ShowExamTimetables';
import AddExamTimetable from './examTimetableRelated/AddExamTimetable';
import ShowSubjects from './subjectRelated/ShowSubjects';
import SubjectForm from './subjectRelated/SubjectForm';
import ViewSubject from './subjectRelated/ViewSubject';
import SeeComplains from './studentRelated/SeeComplains';
import AddFinance from './financeRelated/AddFinance';
import ShowFinances from './financeRelated/ShowFinances';
import LibrarianHomePage from './libraryRelated/LibrarianHomePage';
import AddLibrarian from './libraryRelated/AddLibrarian';
import LibrarianDetails from './libraryRelated/LibrarianDetails';
import ShowMarksheets from './marksheetRelated/ShowMarksheets';
import CreateMarksheet from './marksheetRelated/CreateMarksheet';
import MarksheetDetails from './marksheetRelated/MarksheetDetails';
import Logout from '../Logout';

const StyledMenu = styled(Menu)(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: '16px',
        minWidth: 320,
        maxWidth: 400,
        maxHeight: 500,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        border: '1px solid rgba(255,255,255,0.8)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        overflow: 'visible',
        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
        mt: 1.5,
        '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
            borderLeft: '1px solid rgba(255,255,255,0.8)',
            borderTop: '1px solid rgba(255,255,255,0.8)',
        },
    },
}));

const NotificationItem = styled(MenuItem)(({ theme, type }) => ({
    borderRadius: '12px',
    margin: '4px 8px',
    padding: '12px 16px',
    transition: 'all 0.3s ease-in-out',
    borderLeft: `4px solid ${
        type === 'warning' ? '#f59e0b' :
        type === 'success' ? '#10b981' :
        type === 'error' ? '#ef4444' :
        '#3b82f6'
    }`,
    '&:hover': {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        transform: 'translateX(4px)',
        '& .MuiListItemIcon-root': {
            color: 'white',
        },
        '& .MuiChip-root': {
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
        },
    },
    '& .MuiListItemIcon-root': {
        color: '#667eea',
        minWidth: 40,
    },
}));

// Styled Components for Modern Gradient Theme
const GradientAppBar = styled(AppBar)(({ theme, open }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    width: `calc(100% - ${open ? 240 : 64}px)`,
    marginLeft: open ? '240px' : '64px',
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.down('md')]: {
        width: '100%',
        marginLeft: 0,
    },
}));

const GradientDrawer = styled(Drawer)(({ theme, open }) => ({
    '& .MuiDrawer-paper': {
        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        border: 'none',
        boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
        width: open ? 240 : 64, // Adjust width based on open state
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden', // Hide overflow when collapsed
        '& .MuiListItemIcon-root': {
            color: '#ffffff',
        },
        '& .MuiListItemText-root': {
            color: '#ffffff',
        },
    },
}));

const SearchBar = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: '25px',
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: '#ffffff',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
        '&::placeholder': {
            color: alpha(theme.palette.common.white, 0.7),
            opacity: 1,
        },
    },
}));

const MainContent = styled(Box)(({ theme, open }) => ({
    backgroundColor: '#f8fafc',
    backgroundImage: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    minHeight: '100vh',
    flexGrow: 1,
    overflow: 'auto',
    padding: theme.spacing(3),
    marginLeft: open ? '240px' : '64px', // Adjust margin based on drawer state
    marginTop: '64px', // Account for fixed AppBar height
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.down('md')]: {
        marginLeft: 0, // No margin on mobile
        marginTop: '64px', // Keep top margin for AppBar
    },
}));

const AdminDashboard = () => {
    const [open, setOpen] = useState(true);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    
    const toggleDrawer = () => {
        setOpen(!open);
    };

    // Sample notifications data
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: 'New Student Registration',
            message: 'John Doe has been registered in Class 10A',
            type: 'success',
            time: '2 minutes ago',
            icon: <PersonIcon />
        },
        {
            id: 2,
            title: 'Attendance Alert',
            message: 'Low attendance detected in Class 9B',
            type: 'warning',
            time: '15 minutes ago',
            icon: <ClassIcon />
        },
        {
            id: 3,
            title: 'Exam Results Updated',
            message: 'Mid-term results for Class 11 have been published',
            type: 'info',
            time: '1 hour ago',
            icon: <BookIcon />
        },
        {
            id: 4,
            title: 'System Maintenance',
            message: 'Scheduled maintenance will begin at 10 PM',
            type: 'error',
            time: '2 hours ago',
            icon: <WarningIcon />
        },
        {
            id: 5,
            title: 'Teacher Assignment',
            message: 'Ms. Sarah assigned to Class 8 Mathematics',
            type: 'success',
            time: '3 hours ago',
            icon: <SchoolIcon />
        }
    ]);

    const handleNotificationClick = (event) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchorEl(null);
    };

    const handleNotificationRead = (notificationId) => {
        setNotifications(prev => 
            prev.filter(notification => notification.id !== notificationId)
        );
    };

    const handleMarkAllRead = () => {
        setNotifications([]);
        handleNotificationClose();
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon />;
            case 'warning':
                return <WarningIcon />;
            case 'error':
                return <WarningIcon />;
            default:
                return <InfoIcon />;
        }
    };

    const notificationOpen = Boolean(notificationAnchorEl);

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <GradientAppBar open={open} position='fixed'>
                    <Toolbar sx={{ pr: '24px' }}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        
                        {/* Search Bar */}
                        <SearchBar>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search..."
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </SearchBar>
                        
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1, fontWeight: 600 }}
                        >
                            School Management Dashboard
                        </Typography>
                        
                        {/* Notifications */}
                        <IconButton 
                            color="inherit" 
                            sx={{ mr: 2 }}
                            onClick={handleNotificationClick}
                            aria-controls={notificationOpen ? 'notification-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={notificationOpen ? 'true' : undefined}
                        >
                            <Badge badgeContent={notifications.length} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>

                        <StyledMenu
                            anchorEl={notificationAnchorEl}
                            id="notification-menu"
                            open={notificationOpen}
                            onClose={handleNotificationClose}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            {/* Notification Header */}
                            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                        Notifications
                                    </Typography>
                                    <Chip 
                                        label={notifications.length} 
                                        size="small" 
                                        sx={{ 
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            fontWeight: 600,
                                        }}
                                    />
                                </Box>
                                {notifications.length > 0 && (
                                    <Button
                                        size="small"
                                        startIcon={<ClearIcon />}
                                        onClick={handleMarkAllRead}
                                        sx={{ 
                                            color: '#64748b',
                                            textTransform: 'none',
                                            '&:hover': { color: '#ef4444' }
                                        }}
                                    >
                                        Mark all as read
                                    </Button>
                                )}
                            </Box>

                            {/* Notification Items */}
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        type={notification.type}
                                        onClick={() => handleNotificationRead(notification.id)}
                                    >
                                        <ListItemIcon>
                                            {getNotificationIcon(notification.type)}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                        {notification.title}
                                                    </Typography>
                                                    <Chip
                                                        label={notification.time}
                                                        size="small"
                                                        sx={{
                                                            background: 'rgba(102, 126, 234, 0.1)',
                                                            color: '#667eea',
                                                            fontSize: '0.7rem',
                                                        }}
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                                                    {notification.message}
                                                </Typography>
                                            }
                                        />
                                    </NotificationItem>
                                ))
                            ) : (
                                <Box sx={{ p: 3, textAlign: 'center' }}>
                                    <CheckCircleIcon sx={{ fontSize: 48, color: '#10b981', mb: 2 }} />
                                    <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
                                        All caught up!
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                        No new notifications
                                    </Typography>
                                </Box>
                            )}
                        </StyledMenu>
                        

                        
                        <AccountMenu />
                    </Toolbar>
                </GradientAppBar>
                
                <GradientDrawer variant="permanent" open={open}>
                    <Toolbar sx={styles.toolBarStyled}>
                        <IconButton onClick={toggleDrawer} sx={{ color: '#ffffff' }}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
                    <List component="nav">
                        <SideBar isCollapsed={!open} />
                    </List>
                </GradientDrawer>
                
                <MainContent component="main" open={open}>
                    <Routes>
                        <Route path="/" element={<AdminHomePage />} />
                        <Route path='*' element={<Navigate to="/" />} />
                        <Route path="/Admin/dashboard" element={<AdminHomePage />} />
                        <Route path="/Admin/profile" element={<AdminProfile />} />
                        <Route path="/Admin/complains" element={<SeeComplains />} />

                        {/* Notice */}
                        <Route path="/Admin/addnotice" element={<AddNotice />} />
                        <Route path="/Admin/notices" element={<ShowNotices />} />

                        {/* Exam Timetables */}
                        <Route path="/Admin/exam-timetables" element={<ShowExamTimetables />} />
                        <Route path="/Admin/exam-timetables/add" element={<AddExamTimetable />} />

                        {/* Subject */}
                        <Route path="/Admin/subjects" element={<ShowSubjects />} />
                        <Route path="/Admin/subjects/subject/:classID/:subjectID" element={<ViewSubject />} />
                        <Route path="/Admin/subjects/chooseclass" element={<ChooseClass situation="Subject" />} />

                        <Route path="/Admin/addsubject/:id" element={<SubjectForm />} />
                        <Route path="/Admin/class/subject/:classID/:subjectID" element={<ViewSubject />} />

                        <Route path="/Admin/subject/student/attendance/:studentID/:subjectID" element={<StudentAttendance situation="Subject" />} />
                        <Route path="/Admin/subject/student/bulk-attendance/:studentID/:subjectID" element={<StudentBulkAttendance situation="Subject" />} />
                        <Route path="/Admin/subject/student/marks/:studentID/:subjectID" element={<StudentExamMarks situation="Subject" />} />

                        {/* Class */}
                        <Route path="/Admin/addclass" element={<AddClass />} />
                        <Route path="/Admin/classes" element={<ShowClasses />} />
                        <Route path="/Admin/classes/class/:id" element={<ClassDetails />} />
                        <Route path="/Admin/class/addstudents/:id" element={<AddStudent situation="Class" />} />

                        {/* Student */}
                        <Route path="/Admin/addstudents" element={<AddStudent situation="Student" />} />
                        <Route path="/Admin/students" element={<ShowStudents />} />
                        <Route path="/Admin/students/student/:id" element={<ViewStudent />} />
                        <Route path="/Admin/students/student/attendance/:id" element={<StudentAttendance situation="Student" />} />
                        <Route path="/Admin/students/student/bulk-attendance/:id" element={<StudentBulkAttendance situation="Student" />} />
                        <Route path="/Admin/students/student/marks/:id" element={<StudentExamMarks situation="Student" />} />

                        {/* Teacher */}
                        <Route path="/Admin/teachers" element={<ShowTeachers />} />
                        <Route path="/Admin/teachers/teacher/:id" element={<TeacherDetails />} />
                        <Route path="/Admin/teachers/chooseclass" element={<ChooseClass situation="Teacher" />} />
                        <Route path="/Admin/teachers/choosesubject/:id" element={<ChooseSubject situation="Norm" />} />
                        <Route path="/Admin/teachers/choosesubject/:classID/:teacherID" element={<ChooseSubject situation="Teacher" />} />
                        <Route path="/Admin/teachers/addteacher/:id" element={<AddTeacher />} />

                        {/* Marksheets */}
                        <Route path="/Admin/marksheets" element={<ShowMarksheets />} />
                        <Route path="/Admin/marksheet/create" element={<CreateMarksheet />} />
                        <Route path="/Admin/marksheet/:id" element={<MarksheetDetails />} />
                        <Route path="/Admin/marksheet/edit/:id" element={<CreateMarksheet />} />

                        {/* Finance */}
                        <Route path="/Admin/finances" element={<ShowFinances />} />
                        <Route path="/Admin/finances/add" element={<AddFinance />} />

                        {/* Librarian */}
                        <Route path="/Admin/librarian" element={<LibrarianHomePage />} />
                        <Route path="/Admin/addlibrarian" element={<AddLibrarian />} />
                        <Route path="/Admin/librarian/:id" element={<LibrarianDetails />} />

                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </MainContent>
            </Box>
        </>
    );
}

export default AdminDashboard

const styles = {
    toolBarStyled: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: [1],
    },
    drawerStyled: {
        display: "flex"
    },
    hideDrawer: {
        display: 'flex',
        '@media (max-width: 600px)': {
            display: 'none',
        },
    },
}
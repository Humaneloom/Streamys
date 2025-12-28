import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
    Box,
    CssBaseline,
    Toolbar,
    Typography,
    IconButton,
    Badge,
    Divider,
    List,
    Drawer as MuiDrawer,
    AppBar as MuiAppBar,
    InputBase
} from '@mui/material';
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    Notifications as NotificationsIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import AccountMenu from '../../components/AccountMenu';
import TeacherSideBar from './TeacherSideBar';
import TeacherHomePage from './TeacherHomePage';
import TeacherProfile from './TeacherProfile';
import TeacherClassDetails from './TeacherClassDetails';
import TeacherClassSelection from './TeacherClassSelection';
import TeacherComplain from './TeacherComplain';
import TeacherViewStudent from './TeacherViewStudent';
import StudentAttendance from '../admin/studentRelated/StudentAttendance';
import StudentBulkAttendance from '../admin/studentRelated/StudentBulkAttendance';
import StudentExamMarks from '../admin/studentRelated/StudentExamMarks';
import Logout from '../Logout';
import TeacherScheduleEdit from './TeacherScheduleEdit';
import AssessmentDashboard from './assessment/AssessmentDashboard';
import TeacherDoubts from './TeacherDoubts';
import TeacherInteractions from './TeacherInteractions';
import TeacherMarkAttendance from './TeacherMarkAttendance';
import ShowExamTimetables from './examTimetableRelated/ShowExamTimetables';
import AddExamTimetable from './examTimetableRelated/AddExamTimetable';
import TeacherMarksheetReview from './marksheetRelated/TeacherMarksheetReview';
import TeacherLibrary from './TeacherLibrary';

const GradientAppBar = styled(MuiAppBar)(({ theme, open }) => ({
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
    zIndex: theme.zIndex.drawer + 1,
    [theme.breakpoints.down('md')]: {
        width: '100%',
        marginLeft: 0,
    },
}));

const GradientDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })
(({ theme, open }) => ({
    '& .MuiDrawer-paper': {
        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        border: 'none',
        boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
        width: open ? 240 : 64,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
        color: '#fff',
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
    marginLeft: open ? '240px' : '64px',
    marginTop: '64px',
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.down('md')]: {
        marginLeft: 0,
        marginTop: '64px',
    },
}));

const TeacherDashboard = () => {
    const [open, setOpen] = useState(true);
    const notifications = [];
    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <GradientAppBar open={open} position="fixed">
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
                        Teacher Dashboard
                    </Typography>
                    <IconButton color="inherit" sx={{ mr: 2 }}>
                        <Badge badgeContent={notifications.length} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <AccountMenu />
                </Toolbar>
            </GradientAppBar>
            <GradientDrawer variant="permanent" open={open}>
                <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1] }}>
                    <IconButton onClick={toggleDrawer} sx={{ color: '#ffffff' }}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
                <List component="nav">
                    <TeacherSideBar isCollapsed={!open} />
                </List>
            </GradientDrawer>
            <MainContent component="main" open={open}>
                <Routes>
                    <Route path="/" element={<TeacherHomePage />} />
                    <Route path='*' element={<Navigate to="/" />} />
                    <Route path="/Teacher/dashboard" element={<TeacherHomePage />} />
                    <Route path="/Teacher/profile" element={<TeacherProfile />} />
                    <Route path="/Teacher/complain" element={<TeacherComplain />} />
                    <Route path="/Teacher/class" element={<TeacherClassSelection />} />
                    <Route path="/Teacher/marksheet-review" element={<TeacherMarksheetReview />} />
                    <Route path="/Teacher/class/:classId" element={<TeacherClassDetails />} />
                    <Route path="/Teacher/class/mark-attendance/:classId" element={<TeacherMarkAttendance />} />
                    <Route path="/Teacher/class/student/:id" element={<TeacherViewStudent />} />
                    <Route path="/Teacher/class/student/attendance/:studentID/:subjectID" element={<StudentAttendance situation="Subject" />} />
                    <Route path="/Teacher/class/student/bulk-attendance/:studentID/:subjectID" element={<StudentBulkAttendance situation="Subject" />} />
                    <Route path="/Teacher/class/student/marks/:studentID/:subjectID" element={<StudentExamMarks situation="Subject" />} />
                    <Route path="/Teacher/schedule-edit" element={<TeacherScheduleEdit />} />
                    <Route path="/Teacher/assessment" element={<AssessmentDashboard />} />
                    <Route path="/Teacher/doubts" element={<TeacherDoubts />} />
                    <Route path="/Teacher/interactions" element={<TeacherInteractions />} />
                    <Route path="/Teacher/library" element={<TeacherLibrary />} />
                    <Route path="/Teacher/exam-timetables" element={<ShowExamTimetables />} />
                    <Route path="/Teacher/exam-timetables/add" element={<AddExamTimetable />} />
                    <Route path="/logout" element={<Logout />} />
                </Routes>
            </MainContent>
        </Box>
    );
};

export default TeacherDashboard;
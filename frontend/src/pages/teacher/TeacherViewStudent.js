import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, Collapse, Typography, Grid, Chip, Divider, Container } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, ArrowBack, PieChart as PieChartIcon, TableChart as TableChartIcon } from '@mui/icons-material';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';
import AttendancePieChart from '../../components/AttendancePieChart'
import { PurpleButton } from '../../components/buttonStyles';

const TeacherViewStudent = () => {
    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch();
    const { currentUser, userDetails, response, loading, error } = useSelector((state) => state.user);
    const address = "Student"
    const studentID = params.id
    const teachSubject = currentUser.teachSubject?.subName
    const teachSubjectID = currentUser.teachSubject?._id

    // Validate student ID format (MongoDB ObjectId is 24 characters)
    const isValidStudentId = studentID && studentID.length === 24;
    
    // Get the student data from the array
    const studentData = userDetails && userDetails.length > 0 ? userDetails[0] : null;

    // All React hooks must be called before any conditional returns
    const [sclassName, setSclassName] = useState('');
    const [studentSchool, setStudentSchool] = useState('');
    const [subjectMarks, setSubjectMarks] = useState('');
    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [openStates, setOpenStates] = useState({});
    const [showAttendanceChart, setShowAttendanceChart] = useState(false);

    useEffect(() => {
        if (isValidStudentId) {
            dispatch(getUserDetails(studentID, address));
        }
    }, [dispatch, studentID, isValidStudentId]);

    useEffect(() => {
        if (studentData) {
            setSclassName(studentData.sclassName || '');
            setStudentSchool(studentData.school || '');
            setSubjectMarks(studentData.examResult || '');
            setSubjectAttendance(studentData.attendance || []);
        }
    }, [studentData]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    // Show loading state
    if (loading) {
        return (
            <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <Typography sx={{ fontSize: 20 }}>Loading student details...</Typography>
                </Box>
            </Container>
        );
    }

    // Show error state
    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <Typography sx={{ fontSize: 20, color: 'error.main' }}>Error loading student details: {error.message}</Typography>
                </Box>
            </Container>
        );
    }

    // Show invalid student ID error
    if (!isValidStudentId) {
        return (
            <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <Typography sx={{ fontSize: 20, color: 'error.main' }}>Invalid student ID format: {studentID}</Typography>
                </Box>
            </Container>
        );
    }

    // Show no data state
    if (!studentData) {
        return (
            <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <Typography sx={{ fontSize: 20 }}>No student data found</Typography>
                </Box>
            </Container>
        );
    }

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;
    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    return (
        <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
            {/* Back Button */}
            <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/Teacher/class')}
                sx={{ mb: 3, color: '#64748b', '&:hover': { backgroundColor: 'rgba(100, 116, 139, 0.1)' } }}
            >
                Back to Class
            </Button>
            
            <Box sx={{ p: 3, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                {/* Student Info Section */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
                        {studentData.name}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" sx={{ mb: 1, color: '#64748b' }}>
                                <strong>Roll Number:</strong> {studentData.rollNum}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" sx={{ mb: 1, color: '#64748b' }}>
                                <strong>Class:</strong> {sclassName.sclassName}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" sx={{ mb: 1, color: '#64748b' }}>
                                <strong>School:</strong> {studentSchool.schoolName}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" sx={{ mb: 1, color: '#64748b' }}>
                                <strong>ID:</strong> {studentData._id?.slice(-5)}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Attendance Section */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
                        Attendance
                    </Typography>
                    
                    {/* Overall Attendance */}
                    {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 && (
                        <>
                            {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, allData, subId, sessions }], index) => {
                                if (subName === teachSubject) {
                                    const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
                                    return (
                                        <Box key={index} sx={{ mb: 3, p: 2, backgroundColor: 'white', borderRadius: 1, border: '1px solid #e2e8f0' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', textAlign: 'center' }}>
                                                {subjectAttendancePercentage}% Avg Attendance
                                            </Typography>
                                        </Box>
                                    );
                                }
                                return null;
                            })}
                        </>
                    )}

                    {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 && (
                        <>
                            {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, allData, subId, sessions }], index) => {
                                if (subName === teachSubject) {
                                    const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
                                    return (
                                        <Box key={index} sx={{ mb: 3 }}>
                                            <Typography variant="body1" sx={{ mb: 1, color: '#64748b' }}>
                                                <strong>Subject:</strong> {subName}
                                            </Typography>
                                            <Typography variant="body1" sx={{ mb: 1, color: '#64748b' }}>
                                                <strong>Present:</strong> {present} / <strong>Total:</strong> {sessions}
                                            </Typography>
                                            <Typography variant="body1" sx={{ mb: 2, color: '#64748b' }}>
                                                <strong>Percentage:</strong> {subjectAttendancePercentage}%
                                            </Typography>
                                            
                                            {/* Buttons */}
                                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                                <Button 
                                                    variant="outlined" 
                                                    size="small" 
                                                    onClick={() => handleOpen(subId)}
                                                    sx={{ borderColor: '#3b82f6', color: '#3b82f6' }}
                                                >
                                                    {openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />} Details
                                                </Button>
                                                
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => setShowAttendanceChart(!showAttendanceChart)}
                                                    startIcon={showAttendanceChart ? <TableChartIcon /> : <PieChartIcon />}
                                                    sx={{
                                                        borderColor: '#3b82f6',
                                                        color: '#3b82f6',
                                                        '&:hover': {
                                                            borderColor: '#2563eb',
                                                            backgroundColor: 'rgba(59, 130, 246, 0.1)'
                                                        }
                                                    }}
                                                >
                                                    {showAttendanceChart ? 'Hide Chart' : 'Show Chart'}
                                                </Button>
                                            </Box>

                                            <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                                <Box sx={{ mt: 2, p: 2, backgroundColor: 'white', borderRadius: 1, border: '1px solid #e2e8f0' }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
                                                        Attendance Details
                                                    </Typography>
                                                    <Box sx={{ maxHeight: 150, overflowY: 'auto' }}>
                                                        {allData.map((data, idx) => {
                                                            const date = new Date(data.date);
                                                            const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                            return (
                                                                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, p: 1, backgroundColor: '#f8fafc', borderRadius: 1 }}>
                                                                    <Typography variant="body2">{dateString}</Typography>
                                                                    <Chip 
                                                                        label={data.status} 
                                                                        size="small" 
                                                                        color={data.status === 'Present' ? 'success' : 'error'}
                                                                    />
                                                                </Box>
                                                            );
                                                        })}
                                                    </Box>
                                                </Box>
                                            </Collapse>

                                            {/* Chart */}
                                            {showAttendanceChart && (
                                                <Box sx={{ height: 300, mt: 2, p: 2, backgroundColor: 'white', borderRadius: 1, border: '1px solid #e2e8f0' }}>
                                                    <AttendancePieChart data={chartData} />
                                                </Box>
                                            )}

                                            <Button
                                                variant="contained"
                                                size="small"
                                                sx={{ 
                                                    mt: 2, 
                                                    backgroundColor: '#3b82f6',
                                                    '&:hover': { backgroundColor: '#2563eb' }
                                                }}
                                                onClick={() =>
                                                    navigate(
                                                        `/Teacher/class/student/attendance/${studentID}/${teachSubjectID}`
                                                    )
                                                }
                                            >
                                                Add Attendance
                                            </Button>
                                        </Box>
                                    )
                                }
                                return null;
                            })}
                        </>
                    )}
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Marks Section */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
                        Subject Marks
                    </Typography>
                    {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0 && (
                        <>
                            {subjectMarks.map((result, index) => {
                                if (result.subName.subName === teachSubject) {
                                    return (
                                        <Box key={index} sx={{ mb: 2 }}>
                                            <Typography variant="body1" sx={{ mb: 1, color: '#64748b' }}>
                                                <strong>Subject:</strong> {result.subName.subName}
                                            </Typography>
                                            <Typography variant="body1" sx={{ mb: 2, color: '#64748b' }}>
                                                <strong>Marks:</strong> {result.marksObtained}
                                            </Typography>
                                        </Box>
                                    )
                                }
                                return null;
                            })}
                        </>
                    )}
                    <PurpleButton 
                        variant="contained" 
                        size="small"
                        onClick={() =>
                            navigate(
                                `/Teacher/class/student/marks/${studentID}/${teachSubjectID}`
                            )}>
                        Add Marks
                    </PurpleButton>
                </Box>
            </Box>
        </Container>
    )
}

export default TeacherViewStudent
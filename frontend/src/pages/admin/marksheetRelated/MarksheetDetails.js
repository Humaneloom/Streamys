import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Box,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Button,
    IconButton,
    Divider,
    Avatar,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Download as DownloadIcon,
    Print as PrintIcon,
    Publish as PublishIcon,
    Lock as FinalizeIcon,
    School as SchoolIcon,
    Person as PersonIcon,
    Assignment as AssignmentIcon,
    Grade as GradeIcon,
    TrendingUp as TrendingUpIcon,
    CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import { 
    getMarksheetById, 
    publishMarksheet, 
    finalizeMarksheet 
} from '../../../redux/marksheetRelated/marksheetHandle';
import { clearMarksheetDetails, clearState } from '../../../redux/marksheetRelated/marksheetSlice';
import Popup from '../../../components/Popup';

const MarksheetDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { marksheetDetails, loading, error, response, statestatus } = useSelector(state => state.marksheet);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        dispatch(getMarksheetById(id));
        
        return () => {
            dispatch(clearMarksheetDetails());
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (response) {
            setMessage(response);
            setShowPopup(true);
            dispatch(clearState());
            // Refresh data after successful actions
            if (statestatus === 'published' || statestatus === 'finalized') {
                dispatch(getMarksheetById(id));
            }
        } else if (error) {
            setMessage(error);
            setShowPopup(true);
            dispatch(clearState());
        }
    }, [response, error, statestatus, dispatch, id]);

    const handlePublish = () => {
        dispatch(publishMarksheet(id));
    };

    const handleFinalize = () => {
        dispatch(finalizeMarksheet(id));
    };

    const handleEdit = () => {
        navigate(`/Admin/marksheet/edit/${id}`);
    };

    const handleDownloadPDF = () => {
        // Implement PDF download functionality
        setMessage('PDF download functionality will be implemented soon');
        setShowPopup(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Draft': return 'default';
            case 'Published': return 'success';
            case 'Finalized': return 'error';
            default: return 'default';
        }
    };

    const getGradeColor = (grade) => {
        const gradeColors = {
            'A+': '#4caf50',
            'A': '#8bc34a',
            'B+': '#2196f3',
            'B': '#03a9f4',
            'C+': '#ff9800',
            'C': '#ffc107',
            'D': '#ff5722',
            'F': '#f44336'
        };
        return gradeColors[grade] || '#9e9e9e';
    };

    const canEdit = marksheetDetails?.status === 'Draft';
    const canPublish = marksheetDetails?.status === 'Draft';
    const canFinalize = marksheetDetails?.status === 'Published';

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress size={60} />
                </Box>
            </Container>
        );
    }

    if (!marksheetDetails) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error">Marksheet not found</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={() => navigate('/Admin/marksheets')} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        Marksheet Details
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {canEdit && (
                        <Button
                            startIcon={<EditIcon />}
                            onClick={handleEdit}
                            variant="outlined"
                        >
                            Edit
                        </Button>
                    )}
                    {canPublish && (
                        <GreenButton
                            startIcon={<PublishIcon />}
                            onClick={handlePublish}
                        >
                            Publish
                        </GreenButton>
                    )}
                    {canFinalize && (
                        <Button
                            startIcon={<FinalizeIcon />}
                            onClick={handleFinalize}
                            variant="contained"
                            color="warning"
                        >
                            Finalize
                        </Button>
                    )}
                    <BlueButton
                        startIcon={<DownloadIcon />}
                        onClick={handleDownloadPDF}
                    >
                        Download PDF
                    </BlueButton>
                </Box>
            </Box>

            {/* Student Information Card */}
            <Card sx={{ 
                mb: 4, 
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
                <CardContent sx={{ p: 4 }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item>
                            <Avatar sx={{ 
                                width: 80, 
                                height: 80, 
                                bgcolor: 'rgba(255,255,255,0.2)',
                                fontSize: '2rem'
                            }}>
                                <PersonIcon fontSize="large" />
                            </Avatar>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                {marksheetDetails.student?.name}
                            </Typography>
                            <Grid container spacing={3} sx={{ mt: 1 }}>
                                <Grid item>
                                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                        <strong>Roll Number:</strong> {marksheetDetails.student?.rollNum}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                        <strong>Class:</strong> {marksheetDetails.class?.sclassName}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                        <strong>Gender:</strong> {marksheetDetails.student?.gender}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Chip
                                label={marksheetDetails.status}
                                size="large"
                                color={getStatusColor(marksheetDetails.status)}
                                sx={{ 
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    color: 'white'
                                }}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Exam Information */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                        <CalendarIcon sx={{ mr: 1 }} />
                        Exam Information
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">Academic Year</Typography>
                            <Typography variant="h6">{marksheetDetails.academicYear}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">Term</Typography>
                            <Typography variant="h6">{marksheetDetails.term}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">Exam Type</Typography>
                            <Typography variant="h6">{marksheetDetails.examType}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">Generated On</Typography>
                            <Typography variant="h6">
                                {new Date(marksheetDetails.createdAt).toLocaleDateString()}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Overall Performance */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                        <TrendingUpIcon sx={{ mr: 1 }} />
                        Overall Performance
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}>
                                <Typography variant="h3" sx={{ 
                                    fontWeight: 'bold', 
                                    color: getGradeColor(marksheetDetails.overall?.grade),
                                    mb: 1
                                }}>
                                    {marksheetDetails.overall?.grade}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">Overall Grade</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0f9ff', borderRadius: 2 }}>
                                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                                    {marksheetDetails.overall?.percentage}%
                                </Typography>
                                <Typography variant="body2" color="text.secondary">Percentage</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fdf2f8', borderRadius: 2 }}>
                                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#9c27b0', mb: 1 }}>
                                    {marksheetDetails.overall?.cgpa}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">CGPA</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0fdf4', borderRadius: 2 }}>
                                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#16a34a', mb: 1 }}>
                                    {marksheetDetails.overall?.rank || '-'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Rank {marksheetDetails.overall?.totalStudents && `/ ${marksheetDetails.overall.totalStudents}`}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Subject-wise Marks */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                        <AssignmentIcon sx={{ mr: 1 }} />
                        Subject-wise Performance
                    </Typography>
                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Subject</TableCell>
                                    <TableCell>Theory</TableCell>
                                    <TableCell>Practical</TableCell>
                                    <TableCell>Total Marks</TableCell>
                                    <TableCell>Marks Obtained</TableCell>
                                    <TableCell>Percentage</TableCell>
                                    <TableCell>Grade</TableCell>
                                    <TableCell>Attendance</TableCell>
                                    <TableCell>Remarks</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {marksheetDetails.subjects?.map((subject) => (
                                    <TableRow key={subject._id} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600}>
                                                {subject.subject?.subName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {subject.subject?.subCode}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {subject.theory?.marksObtained}/{subject.theory?.totalMarks}
                                        </TableCell>
                                        <TableCell>
                                            {subject.practical?.totalMarks > 0 ? 
                                                `${subject.practical?.marksObtained}/${subject.practical?.totalMarks}` : 
                                                'N/A'
                                            }
                                        </TableCell>
                                        <TableCell>{subject.overall?.totalMarks}</TableCell>
                                        <TableCell>{subject.overall?.marksObtained}</TableCell>
                                        <TableCell>{subject.overall?.percentage}%</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={subject.overall?.grade}
                                                size="small"
                                                sx={{
                                                    backgroundColor: getGradeColor(subject.overall?.grade),
                                                    color: 'white',
                                                    fontWeight: 600
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {subject.attendance?.total > 0 ? 
                                                `${subject.attendance?.percentage}%` : 
                                                'N/A'
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {subject.remarks || '-'}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Attendance Summary */}
            {marksheetDetails.attendance?.totalDays > 0 && (
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 3 }}>Overall Attendance</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#16a34a' }}>
                                        {marksheetDetails.attendance.totalPresent}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">Present Days</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                        {marksheetDetails.attendance.totalDays}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">Total Days</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                                        {marksheetDetails.attendance.percentage}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">Attendance Percentage</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}

            {/* Conduct and Remarks */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 3 }}>Conduct & Remarks</Typography>
                    
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                Discipline
                            </Typography>
                            <Chip
                                label={marksheetDetails.conduct?.discipline}
                                color="primary"
                                variant="outlined"
                                sx={{ mb: 2 }}
                            />
                            
                            {marksheetDetails.conduct?.remarks && (
                                <>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                        Conduct Remarks
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 2, p: 2, backgroundColor: '#f8fafc', borderRadius: 1 }}>
                                        {marksheetDetails.conduct.remarks}
                                    </Typography>
                                </>
                            )}
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            {marksheetDetails.classTeacherRemarks && (
                                <>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                        Class Teacher Remarks
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 2, p: 2, backgroundColor: '#f0f9ff', borderRadius: 1 }}>
                                        {marksheetDetails.classTeacherRemarks}
                                    </Typography>
                                </>
                            )}
                            
                            {marksheetDetails.principalRemarks && (
                                <>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                        Principal Remarks
                                    </Typography>
                                    <Typography variant="body2" sx={{ p: 2, backgroundColor: '#fdf2f8', borderRadius: 1 }}>
                                        {marksheetDetails.principalRemarks}
                                    </Typography>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    );
};

export default MarksheetDetails;
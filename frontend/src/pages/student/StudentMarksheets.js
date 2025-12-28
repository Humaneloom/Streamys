import React, { useEffect, useState } from 'react';
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
    Avatar,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import {
    School as SchoolIcon,
    Grade as GradeIcon,
    TrendingUp as TrendingUpIcon,
    Assignment as AssignmentIcon,
    Download as DownloadIcon,
    ExpandMore as ExpandMoreIcon,
    Timeline as TimelineIcon,
    EmojiEvents as TrophyIcon,
    CalendarToday as CalendarIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { BlueButton } from '../../components/buttonStyles';
import { getStudentMarksheets } from '../../redux/marksheetRelated/marksheetHandle';
import { clearStudentMarksheets } from '../../redux/marksheetRelated/marksheetSlice';

const StudentMarksheets = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { studentMarksheets, loading, error } = useSelector(state => state.marksheet);

    const [selectedYear, setSelectedYear] = useState('');
    const [selectedTerm, setSelectedTerm] = useState('');
    const [expandedMarksheet, setExpandedMarksheet] = useState(null);

    useEffect(() => {
        const params = {};
        if (selectedYear) params.academicYear = selectedYear;
        if (selectedTerm) params.term = selectedTerm;
        
        dispatch(getStudentMarksheets(currentUser._id, params));
        
        return () => {
            dispatch(clearStudentMarksheets());
        };
    }, [dispatch, currentUser._id, selectedYear, selectedTerm]);

    // Get unique academic years and terms from marksheets
    const academicYears = [...new Set(studentMarksheets.map(m => m.academicYear))].sort().reverse();
    const terms = [...new Set(studentMarksheets.map(m => m.term))];

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

    const calculateAveragePerformance = () => {
        if (studentMarksheets.length === 0) return null;
        
        const totalPercentage = studentMarksheets.reduce((sum, marksheet) => 
            sum + parseFloat(marksheet.overall?.percentage || 0), 0);
        const averagePercentage = totalPercentage / studentMarksheets.length;
        
        const totalCGPA = studentMarksheets.reduce((sum, marksheet) => 
            sum + parseFloat(marksheet.overall?.cgpa || 0), 0);
        const averageCGPA = totalCGPA / studentMarksheets.length;
        
        return {
            averagePercentage: averagePercentage.toFixed(2),
            averageCGPA: averageCGPA.toFixed(2),
            totalExams: studentMarksheets.length
        };
    };

    const handleDownloadPDF = (marksheetId) => {
        // Implement PDF download functionality
        console.log('Download PDF for marksheet:', marksheetId);
    };

    const handleAccordionChange = (marksheetId) => (event, isExpanded) => {
        setExpandedMarksheet(isExpanded ? marksheetId : null);
    };

    const averagePerformance = calculateAveragePerformance();

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress size={60} />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'primary.main',
                    margin: '0 auto',
                    mb: 2
                }}>
                    <SchoolIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                    My Marksheets
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    View your academic performance and exam results
                </Typography>
            </Box>

            {/* Filters */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Academic Year</InputLabel>
                                <Select
                                    value={selectedYear}
                                    label="Academic Year"
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                >
                                    <MenuItem value="">All Years</MenuItem>
                                    {academicYears.map(year => (
                                        <MenuItem key={year} value={year}>{year}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Term</InputLabel>
                                <Select
                                    value={selectedTerm}
                                    label="Term"
                                    onChange={(e) => setSelectedTerm(e.target.value)}
                                >
                                    <MenuItem value="">All Terms</MenuItem>
                                    {terms.map(term => (
                                        <MenuItem key={term} value={term}>{term}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => {
                                    setSelectedYear('');
                                    setSelectedTerm('');
                                }}
                            >
                                Clear Filters
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Performance Summary */}
            {averagePerformance && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white'
                        }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <TrophyIcon sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {averagePerformance.averagePercentage}%
                                </Typography>
                                <Typography variant="body2">Average Percentage</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ 
                            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                            color: 'white'
                        }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <GradeIcon sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {averagePerformance.averageCGPA}
                                </Typography>
                                <Typography variant="body2">Average CGPA</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ 
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            color: 'white'
                        }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <TimelineIcon sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {averagePerformance.totalExams}
                                </Typography>
                                <Typography variant="body2">Total Exams</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Marksheets List */}
            {error ? (
                <Alert severity="error" sx={{ mb: 4 }}>
                    {error}
                </Alert>
            ) : studentMarksheets.length === 0 ? (
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 8 }}>
                        <SchoolIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                            No marksheets found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Your marksheets will appear here once they are published by your teachers
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <AnimatePresence>
                    {studentMarksheets.map((marksheet, index) => (
                        <motion.div
                            key={marksheet._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Accordion
                                expanded={expandedMarksheet === marksheet._id}
                                onChange={handleAccordionChange(marksheet._id)}
                                sx={{ mb: 2, boxShadow: 3 }}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                <Box>
                                                    <Typography variant="body1" fontWeight={600}>
                                                        {marksheet.academicYear}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {marksheet.term} • {marksheet.examType}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <Chip
                                                label={marksheet.overall?.grade}
                                                sx={{
                                                    backgroundColor: getGradeColor(marksheet.overall?.grade),
                                                    color: 'white',
                                                    fontWeight: 600
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <Typography variant="h6" color="primary">
                                                {marksheet.overall?.percentage}%
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <Typography variant="body2" color="text.secondary">
                                                CGPA: {marksheet.overall?.cgpa}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <Chip
                                                label={marksheet.status}
                                                color={getStatusColor(marksheet.status)}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={1}>
                                            <Button
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDownloadPDF(marksheet._id);
                                                }}
                                            >
                                                <DownloadIcon />
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </AccordionSummary>
                                
                                <AccordionDetails>
                                    <Divider sx={{ mb: 3 }} />
                                    
                                    {/* Detailed Performance */}
                                    <Grid container spacing={3} sx={{ mb: 3 }}>
                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}>
                                                <Typography variant="h5" sx={{ 
                                                    fontWeight: 'bold', 
                                                    color: getGradeColor(marksheet.overall?.grade)
                                                }}>
                                                    {marksheet.overall?.grade}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">Grade</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0f9ff', borderRadius: 2 }}>
                                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                                    {marksheet.overall?.percentage}%
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">Percentage</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fdf2f8', borderRadius: 2 }}>
                                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                                                    {marksheet.overall?.cgpa}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">CGPA</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0fdf4', borderRadius: 2 }}>
                                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#16a34a' }}>
                                                    {marksheet.overall?.rank || '-'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Class Rank
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>

                                    {/* Subject-wise Details */}
                                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                        <AssignmentIcon sx={{ mr: 1 }} />
                                        Subject-wise Performance
                                    </Typography>
                                    
                                    <TableContainer component={Paper} elevation={0}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Subject</TableCell>
                                                    <TableCell>Marks Obtained</TableCell>
                                                    <TableCell>Total Marks</TableCell>
                                                    <TableCell>Percentage</TableCell>
                                                    <TableCell>Grade</TableCell>
                                                    <TableCell>Attendance</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {marksheet.subjects?.map((subject) => (
                                                    <TableRow key={subject._id} hover>
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight={600}>
                                                                {subject.subject?.subName}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>{subject.overall?.marksObtained}</TableCell>
                                                        <TableCell>{subject.overall?.totalMarks}</TableCell>
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
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    {/* Remarks */}
                                    {(marksheet.classTeacherRemarks || marksheet.principalRemarks) && (
                                        <Box sx={{ mt: 3 }}>
                                            <Typography variant="h6" sx={{ mb: 2 }}>Remarks</Typography>
                                            {marksheet.classTeacherRemarks && (
                                                <Alert severity="info" sx={{ mb: 2 }}>
                                                    <Typography variant="subtitle2">Class Teacher:</Typography>
                                                    <Typography variant="body2">{marksheet.classTeacherRemarks}</Typography>
                                                </Alert>
                                            )}
                                            {marksheet.principalRemarks && (
                                                <Alert severity="success">
                                                    <Typography variant="subtitle2">Principal:</Typography>
                                                    <Typography variant="body2">{marksheet.principalRemarks}</Typography>
                                                </Alert>
                                            )}
                                        </Box>
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        </motion.div>
                    ))}
                </AnimatePresence>
            )}
        </Container>
    );
};

export default StudentMarksheets;
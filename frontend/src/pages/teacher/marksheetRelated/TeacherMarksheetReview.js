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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Avatar,
    Alert,
    CircularProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    School as SchoolIcon,
    ExpandMore as ExpandMoreIcon,
    Visibility as ViewIcon,
    Comment as CommentIcon,
    Grade as GradeIcon,
    Analytics as AnalyticsIcon,
    Class as ClassIcon,
    FilterList as FilterIcon,
    TrendingUp as TrendingUpIcon,
    Assignment as AssignmentIcon,
    Download as DownloadIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import { getClassMarksheets } from '../../../redux/marksheetRelated/marksheetHandle';
import { getTeacherClasses } from '../../../redux/sclassRelated/sclassHandle';

const TeacherMarksheetReview = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { classMarksheets, loading, error } = useSelector(state => state.marksheet);
    const { sclassStudents, loading: classLoading } = useSelector(state => state.sclass);

    const [selectedClass, setSelectedClass] = useState('');
    const [selectedTerm, setSelectedTerm] = useState('');
    const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
    const [expandedMarksheet, setExpandedMarksheet] = useState(null);
    const [commentDialog, setCommentDialog] = useState({ open: false, marksheet: null });
    const [teacherComment, setTeacherComment] = useState('');

    useEffect(() => {
        if (currentUser?._id) {
            dispatch(getTeacherClasses(currentUser._id));
        }
    }, [dispatch, currentUser._id]);

    useEffect(() => {
        if (selectedClass) {
            const params = {};
            if (selectedTerm) params.term = selectedTerm;
            if (selectedAcademicYear) params.academicYear = selectedAcademicYear;
            
            dispatch(getClassMarksheets(selectedClass, params));
        }
    }, [dispatch, selectedClass, selectedTerm, selectedAcademicYear]);

    // Get unique values for filters
    const academicYears = [...new Set(classMarksheets.map(m => m.academicYear))].sort().reverse();
    const terms = [...new Set(classMarksheets.map(m => m.term))];

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

    const calculateClassStatistics = () => {
        if (classMarksheets.length === 0) return null;

        const totalStudents = classMarksheets.length;
        const totalPercentage = classMarksheets.reduce((sum, m) => sum + parseFloat(m.overall?.percentage || 0), 0);
        const averagePercentage = (totalPercentage / totalStudents).toFixed(2);
        
        const gradeDistribution = classMarksheets.reduce((acc, m) => {
            const grade = m.overall?.grade || 'F';
            acc[grade] = (acc[grade] || 0) + 1;
            return acc;
        }, {});

        const passedStudents = classMarksheets.filter(m => parseFloat(m.overall?.percentage || 0) >= 33).length;
        const passPercentage = ((passedStudents / totalStudents) * 100).toFixed(1);

        return {
            totalStudents,
            averagePercentage,
            gradeDistribution,
            passedStudents,
            passPercentage
        };
    };

    const handleAccordionChange = (marksheetId) => (event, isExpanded) => {
        setExpandedMarksheet(isExpanded ? marksheetId : null);
    };

    const handleCommentOpen = (marksheet) => {
        setCommentDialog({ open: true, marksheet });
        setTeacherComment(marksheet.teacherRemarks || '');
    };

    const handleCommentClose = () => {
        setCommentDialog({ open: false, marksheet: null });
        setTeacherComment('');
    };

    const handleCommentSave = () => {
        // This would save the teacher comment to the marksheet
        console.log('Saving teacher comment:', teacherComment);
        handleCommentClose();
    };

    const statistics = calculateClassStatistics();

    // Get teacher's classes from sclassStudents
    const availableClasses = sclassStudents || [];
    
    // Debug logging
    console.log('Current User:', currentUser);
    console.log('Sclass students (classes):', sclassStudents);
    console.log('Available classes:', availableClasses);

    if (loading || classLoading) {
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
                    <GradeIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                    Marksheet Review
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Review and analyze student marksheets for your classes
                </Typography>
            </Box>

            {/* Class and Filter Selection */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                        <FilterIcon sx={{ mr: 1 }} />
                        Filter Marksheets
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Select Class</InputLabel>
                                <Select
                                    value={selectedClass}
                                    label="Select Class"
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                >
                                    {availableClasses.map((classInfo) => (
                                        <MenuItem key={classInfo.classId} value={classInfo.classId}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <ClassIcon sx={{ mr: 1, fontSize: 20 }} />
                                                {classInfo.className}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                    {availableClasses.length === 0 && (
                                        <MenuItem disabled>
                                            <Typography variant="body2" color="text.secondary">
                                                No classes assigned
                                            </Typography>
                                        </MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Academic Year</InputLabel>
                                <Select
                                    value={selectedAcademicYear}
                                    label="Academic Year"
                                    onChange={(e) => setSelectedAcademicYear(e.target.value)}
                                >
                                    <MenuItem value="">All Years</MenuItem>
                                    {academicYears.map(year => (
                                        <MenuItem key={year} value={year}>{year}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
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
                        <Grid item xs={12} md={3}>
                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{ height: '56px' }}
                                onClick={() => {
                                    setSelectedAcademicYear('');
                                    setSelectedTerm('');
                                }}
                            >
                                Clear Filters
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Class Statistics */}
            {statistics && selectedClass && (
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                            <AnalyticsIcon sx={{ mr: 1 }} />
                            Class Performance Statistics
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={3}>
                                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0f9ff', borderRadius: 2 }}>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                        {statistics.totalStudents}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">Total Students</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0fdf4', borderRadius: 2 }}>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#16a34a' }}>
                                        {statistics.averagePercentage}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">Class Average</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fefce8', borderRadius: 2 }}>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ca8a04' }}>
                                        {statistics.passedStudents}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">Students Passed</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fdf2f8', borderRadius: 2 }}>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                                        {statistics.passPercentage}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">Pass Rate</Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Grade Distribution */}
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle1" sx={{ mb: 2 }}>Grade Distribution</Typography>
                            <Grid container spacing={2}>
                                {Object.entries(statistics.gradeDistribution).map(([grade, count]) => (
                                    <Grid item key={grade}>
                                        <Chip
                                            label={`${grade}: ${count}`}
                                            sx={{
                                                backgroundColor: getGradeColor(grade),
                                                color: 'white',
                                                fontWeight: 600
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Marksheets List */}
            {!selectedClass ? (
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 8 }}>
                        <ClassIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                            Select a Class
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Choose a class from the dropdown to view marksheets
                        </Typography>
                    </CardContent>
                </Card>
            ) : error ? (
                <Alert severity="error" sx={{ mb: 4 }}>
                    {error}
                </Alert>
            ) : classMarksheets.length === 0 ? (
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 8 }}>
                        <SchoolIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                            No marksheets found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            No marksheets available for the selected filters
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <AnimatePresence>
                    {classMarksheets.map((marksheet, index) => (
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
                                                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                                    {marksheet.student?.name?.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body1" fontWeight={600}>
                                                        {marksheet.student?.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Roll: {marksheet.student?.rollNum}
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
                                            <Tooltip title="Add Comment">
                                                <IconButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCommentOpen(marksheet);
                                                    }}
                                                    size="small"
                                                >
                                                    <CommentIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                </AccordionSummary>
                                
                                <AccordionDetails>
                                    {/* Subject-wise Performance */}
                                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                        <AssignmentIcon sx={{ mr: 1 }} />
                                        Subject-wise Performance
                                    </Typography>
                                    
                                    <TableContainer component={Paper} elevation={0}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Subject</TableCell>
                                                    <TableCell>Theory</TableCell>
                                                    <TableCell>Practical</TableCell>
                                                    <TableCell>Total</TableCell>
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
                                                        <TableCell>
                                                            {subject.theory?.marksObtained}/{subject.theory?.totalMarks}
                                                        </TableCell>
                                                        <TableCell>
                                                            {subject.practical?.totalMarks > 0 ? 
                                                                `${subject.practical?.marksObtained}/${subject.practical?.totalMarks}` : 
                                                                'N/A'
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {subject.overall?.marksObtained}/{subject.overall?.totalMarks}
                                                        </TableCell>
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

                                    {/* Existing Remarks */}
                                    {(marksheet.classTeacherRemarks || marksheet.principalRemarks) && (
                                        <Box sx={{ mt: 3 }}>
                                            <Typography variant="h6" sx={{ mb: 2 }}>Existing Remarks</Typography>
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

            {/* Comment Dialog */}
            <Dialog 
                open={commentDialog.open} 
                onClose={handleCommentClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Add Teacher Comment
                    {commentDialog.marksheet && (
                        <Typography variant="body2" color="text.secondary">
                            Student: {commentDialog.marksheet.student?.name}
                        </Typography>
                    )}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={teacherComment}
                        onChange={(e) => setTeacherComment(e.target.value)}
                        placeholder="Enter your comments about this student's performance..."
                        variant="outlined"
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCommentClose}>Cancel</Button>
                    <BlueButton onClick={handleCommentSave}>
                        Save Comment
                    </BlueButton>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default TeacherMarksheetReview;
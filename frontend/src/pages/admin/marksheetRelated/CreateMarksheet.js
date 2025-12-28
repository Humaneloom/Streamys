import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Box,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Stepper,
    Step,
    StepLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Alert,
    Chip
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Preview as PreviewIcon
} from '@mui/icons-material';
import { BlueButton, RedButton } from '../../../components/buttonStyles';
import { createMarksheet } from '../../../redux/marksheetRelated/marksheetHandle';
import { getAllStudents } from '../../../redux/studentRelated/studentHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { clearState } from '../../../redux/marksheetRelated/marksheetSlice';
import Popup from '../../../components/Popup';

const steps = ['Basic Information', 'Subject Marks', 'Review & Submit'];

const CreateMarksheet = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { currentUser } = useSelector(state => state.user);
    const { studentsList } = useSelector(state => state.student);
    const { subjectsList } = useSelector(state => state.sclass);
    const { loading, error, response, statestatus } = useSelector(state => state.marksheet);

    const [activeStep, setActiveStep] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    // Form states
    const [basicInfo, setBasicInfo] = useState({
        studentId: '',
        academicYear: '',
        term: '',
        examType: '',
        classTeacherRemarks: '',
        principalRemarks: '',
        conduct: {
            discipline: 'Good',
            remarks: ''
        }
    });

    const [subjects, setSubjects] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');

    useEffect(() => {
        if (response) {
            setMessage(response);
            setShowPopup(true);
            if (statestatus === 'added') {
                setTimeout(() => {
                    navigate('/Admin/marksheets');
                }, 2000);
            }
            dispatch(clearState());
        } else if (error) {
            setMessage(error);
            setShowPopup(true);
            dispatch(clearState());
        }
    }, [response, error, statestatus, dispatch, navigate]);

    // Load students when a student is selected (to get their class)
    useEffect(() => {
        if (basicInfo.studentId) {
            const selectedStudent = studentsList.find(s => s._id === basicInfo.studentId);
            if (selectedStudent && selectedStudent.sclassName._id !== selectedClass) {
                setSelectedClass(selectedStudent.sclassName._id);
                dispatch(getSubjectList(selectedStudent.sclassName._id, "ClassSubjects"));
            }
        }
    }, [basicInfo.studentId, studentsList, selectedClass, dispatch]);

    // Initialize subjects when subjectsList changes
    useEffect(() => {
        if (subjectsList.length > 0) {
            const initialSubjects = subjectsList.map(subject => ({
                subject: subject._id,
                subjectName: subject.subName,
                theory: {
                    marksObtained: '',
                    totalMarks: 100
                },
                practical: {
                    marksObtained: '',
                    totalMarks: 0
                },
                attendance: {
                    present: '',
                    total: '',
                    percentage: 0
                },
                remarks: ''
            }));
            setSubjects(initialSubjects);
        }
    }, [subjectsList]);

    // Load students on component mount
    useEffect(() => {
        dispatch(getAllStudents(currentUser._id));
    }, [dispatch, currentUser._id]);

    const handleBasicInfoChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setBasicInfo(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setBasicInfo(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleSubjectChange = (index, field, value) => {
        const updatedSubjects = [...subjects];
        
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            updatedSubjects[index][parent][child] = value;
            
            // Calculate attendance percentage
            if (parent === 'attendance' && (child === 'present' || child === 'total')) {
                const present = parseFloat(updatedSubjects[index].attendance.present) || 0;
                const total = parseFloat(updatedSubjects[index].attendance.total) || 0;
                updatedSubjects[index].attendance.percentage = total > 0 ? 
                    ((present / total) * 100).toFixed(2) : 0;
            }
        } else {
            updatedSubjects[index][field] = value;
        }
        
        setSubjects(updatedSubjects);
    };

    const calculateGrade = (percentage) => {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B+';
        if (percentage >= 60) return 'B';
        if (percentage >= 50) return 'C+';
        if (percentage >= 40) return 'C';
        if (percentage >= 33) return 'D';
        return 'F';
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

    const calculateSubjectGrade = (subject) => {
        const theoryMarks = parseFloat(subject.theory.marksObtained) || 0;
        const practicalMarks = parseFloat(subject.practical.marksObtained) || 0;
        const theoryTotal = parseFloat(subject.theory.totalMarks) || 0;
        const practicalTotal = parseFloat(subject.practical.totalMarks) || 0;
        
        const totalMarks = theoryMarks + practicalMarks;
        const totalMaxMarks = theoryTotal + practicalTotal;
        
        if (totalMaxMarks === 0) return { percentage: 0, grade: 'F' };
        
        const percentage = (totalMarks / totalMaxMarks) * 100;
        return {
            percentage: percentage.toFixed(2),
            grade: calculateGrade(percentage)
        };
    };

    const calculateOverallGrade = () => {
        if (subjects.length === 0) return { percentage: 0, grade: 'F', cgpa: 0 };
        
        let totalMarks = 0;
        let totalMaxMarks = 0;
        let totalGradePoints = 0;
        
        subjects.forEach(subject => {
            const theoryMarks = parseFloat(subject.theory.marksObtained) || 0;
            const practicalMarks = parseFloat(subject.practical.marksObtained) || 0;
            const theoryTotal = parseFloat(subject.theory.totalMarks) || 0;
            const practicalTotal = parseFloat(subject.practical.totalMarks) || 0;
            
            totalMarks += theoryMarks + practicalMarks;
            totalMaxMarks += theoryTotal + practicalTotal;
            
            const subjectGrade = calculateSubjectGrade(subject);
            const gradePoints = {
                'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 
                'C+': 6, 'C': 5, 'D': 4, 'F': 0
            };
            totalGradePoints += gradePoints[subjectGrade.grade] || 0;
        });
        
        const percentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;
        const cgpa = subjects.length > 0 ? totalGradePoints / subjects.length : 0;
        
        return {
            percentage: percentage.toFixed(2),
            grade: calculateGrade(percentage),
            cgpa: cgpa.toFixed(2)
        };
    };

    const handleNext = () => {
        if (activeStep === 0) {
            // Validate basic info
            if (!basicInfo.studentId || !basicInfo.academicYear || !basicInfo.term || !basicInfo.examType) {
                setMessage('Please fill in all required fields');
                setShowPopup(true);
                return;
            }
        } else if (activeStep === 1) {
            // Validate subject marks
            const hasInvalidMarks = subjects.some(subject => {
                const theoryMarks = parseFloat(subject.theory.marksObtained);
                const theoryTotal = parseFloat(subject.theory.totalMarks);
                return isNaN(theoryMarks) || theoryMarks < 0 || theoryMarks > theoryTotal;
            });
            
            if (hasInvalidMarks) {
                setMessage('Please enter valid marks for all subjects');
                setShowPopup(true);
                return;
            }
        }
        
        setActiveStep(prev => prev + 1);
    };

    const handleBack = () => {
        setActiveStep(prev => prev - 1);
    };

    const handleSubmit = () => {
        const selectedStudent = studentsList.find(s => s._id === basicInfo.studentId);
        
        if (!selectedStudent) {
            setMessage('Please select a valid student');
            setShowPopup(true);
            return;
        }

        const marksheetData = {
            studentId: basicInfo.studentId,
            classId: selectedStudent.sclassName._id,
            schoolId: currentUser._id,
            academicYear: basicInfo.academicYear,
            term: basicInfo.term,
            examType: basicInfo.examType,
            subjects: subjects.map(subject => ({
                subject: subject.subject,
                theory: {
                    marksObtained: parseFloat(subject.theory.marksObtained) || 0,
                    totalMarks: parseFloat(subject.theory.totalMarks) || 0
                },
                practical: {
                    marksObtained: parseFloat(subject.practical.marksObtained) || 0,
                    totalMarks: parseFloat(subject.practical.totalMarks) || 0
                },
                attendance: {
                    present: parseFloat(subject.attendance.present) || 0,
                    total: parseFloat(subject.attendance.total) || 0,
                    percentage: parseFloat(subject.attendance.percentage) || 0
                },
                remarks: subject.remarks
            })),
            conduct: basicInfo.conduct,
            classTeacherRemarks: basicInfo.classTeacherRemarks,
            principalRemarks: basicInfo.principalRemarks,
            generatedBy: currentUser._id
        };

        dispatch(createMarksheet(marksheetData));
    };

    const renderBasicInfo = () => (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>Basic Information</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth required>
                            <InputLabel>Select Student</InputLabel>
                            <Select
                                value={basicInfo.studentId}
                                label="Select Student"
                                onChange={(e) => handleBasicInfoChange('studentId', e.target.value)}
                            >
                                {studentsList.map((student) => (
                                    <MenuItem key={student._id} value={student._id}>
                                        {student.name} - Roll: {student.rollNum} ({student.sclassName.sclassName})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            required
                            label="Academic Year"
                            value={basicInfo.academicYear}
                            onChange={(e) => handleBasicInfoChange('academicYear', e.target.value)}
                            placeholder="e.g., 2023-24"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth required>
                            <InputLabel>Term</InputLabel>
                            <Select
                                value={basicInfo.term}
                                label="Term"
                                onChange={(e) => handleBasicInfoChange('term', e.target.value)}
                            >
                                <MenuItem value="Term 1">Term 1</MenuItem>
                                <MenuItem value="Term 2">Term 2</MenuItem>
                                <MenuItem value="Final">Final</MenuItem>
                                <MenuItem value="Annual">Annual</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth required>
                            <InputLabel>Exam Type</InputLabel>
                            <Select
                                value={basicInfo.examType}
                                label="Exam Type"
                                onChange={(e) => handleBasicInfoChange('examType', e.target.value)}
                            >
                                <MenuItem value="Unit Test">Unit Test</MenuItem>
                                <MenuItem value="Mid Term">Mid Term</MenuItem>
                                <MenuItem value="Final">Final</MenuItem>
                                <MenuItem value="Annual">Annual</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Discipline</InputLabel>
                            <Select
                                value={basicInfo.conduct.discipline}
                                label="Discipline"
                                onChange={(e) => handleBasicInfoChange('conduct.discipline', e.target.value)}
                            >
                                <MenuItem value="Excellent">Excellent</MenuItem>
                                <MenuItem value="Very Good">Very Good</MenuItem>
                                <MenuItem value="Good">Good</MenuItem>
                                <MenuItem value="Satisfactory">Satisfactory</MenuItem>
                                <MenuItem value="Needs Improvement">Needs Improvement</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Conduct Remarks"
                            value={basicInfo.conduct.remarks}
                            onChange={(e) => handleBasicInfoChange('conduct.remarks', e.target.value)}
                            multiline
                            rows={2}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Class Teacher Remarks"
                            value={basicInfo.classTeacherRemarks}
                            onChange={(e) => handleBasicInfoChange('classTeacherRemarks', e.target.value)}
                            multiline
                            rows={3}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Principal Remarks"
                            value={basicInfo.principalRemarks}
                            onChange={(e) => handleBasicInfoChange('principalRemarks', e.target.value)}
                            multiline
                            rows={3}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );

    const renderSubjectMarks = () => (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>Subject Marks</Typography>
                {subjects.length === 0 ? (
                    <Alert severity="info">
                        Please select a student first to load subjects for their class.
                    </Alert>
                ) : (
                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Subject</TableCell>
                                    <TableCell>Theory Marks</TableCell>
                                    <TableCell>Theory Total</TableCell>
                                    <TableCell>Practical Marks</TableCell>
                                    <TableCell>Practical Total</TableCell>
                                    <TableCell>Present Days</TableCell>
                                    <TableCell>Total Days</TableCell>
                                    <TableCell>Attendance %</TableCell>
                                    <TableCell>Grade</TableCell>
                                    <TableCell>Remarks</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {subjects.map((subject, index) => {
                                    const subjectGrade = calculateSubjectGrade(subject);
                                    return (
                                        <TableRow key={subject.subject}>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {subject.subjectName}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    size="small"
                                                    type="number"
                                                    value={subject.theory.marksObtained}
                                                    onChange={(e) => handleSubjectChange(index, 'theory.marksObtained', e.target.value)}
                                                    inputProps={{ min: 0, max: subject.theory.totalMarks }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    size="small"
                                                    type="number"
                                                    value={subject.theory.totalMarks}
                                                    onChange={(e) => handleSubjectChange(index, 'theory.totalMarks', e.target.value)}
                                                    inputProps={{ min: 1 }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    size="small"
                                                    type="number"
                                                    value={subject.practical.marksObtained}
                                                    onChange={(e) => handleSubjectChange(index, 'practical.marksObtained', e.target.value)}
                                                    inputProps={{ min: 0, max: subject.practical.totalMarks }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    size="small"
                                                    type="number"
                                                    value={subject.practical.totalMarks}
                                                    onChange={(e) => handleSubjectChange(index, 'practical.totalMarks', e.target.value)}
                                                    inputProps={{ min: 0 }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    size="small"
                                                    type="number"
                                                    value={subject.attendance.present}
                                                    onChange={(e) => handleSubjectChange(index, 'attendance.present', e.target.value)}
                                                    inputProps={{ min: 0 }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    size="small"
                                                    type="number"
                                                    value={subject.attendance.total}
                                                    onChange={(e) => handleSubjectChange(index, 'attendance.total', e.target.value)}
                                                    inputProps={{ min: 0 }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {subject.attendance.percentage}%
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={`${subjectGrade.grade} (${subjectGrade.percentage}%)`}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: getGradeColor(subjectGrade.grade),
                                                        color: 'white',
                                                        fontWeight: 600
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    size="small"
                                                    value={subject.remarks}
                                                    onChange={(e) => handleSubjectChange(index, 'remarks', e.target.value)}
                                                    placeholder="Subject remarks"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </CardContent>
        </Card>
    );

    const renderReview = () => {
        const selectedStudent = studentsList.find(s => s._id === basicInfo.studentId);
        const overallGrade = calculateOverallGrade();
        
        return (
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 3 }}>Review & Submit</Typography>
                    
                    {/* Student Summary */}
                    <Card sx={{ mb: 3, backgroundColor: '#f8fafc' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>Student Information</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography><strong>Student:</strong> {selectedStudent?.name}</Typography>
                                    <Typography><strong>Roll Number:</strong> {selectedStudent?.rollNum}</Typography>
                                    <Typography><strong>Class:</strong> {selectedStudent?.sclassName?.sclassName}</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography><strong>Academic Year:</strong> {basicInfo.academicYear}</Typography>
                                    <Typography><strong>Term:</strong> {basicInfo.term}</Typography>
                                    <Typography><strong>Exam Type:</strong> {basicInfo.examType}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Overall Performance */}
                    <Card sx={{ mb: 3, backgroundColor: '#f0fdf4' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>Overall Performance</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: getGradeColor(overallGrade.grade) }}>
                                            {overallGrade.grade}
                                        </Typography>
                                        <Typography variant="body2">Overall Grade</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                            {overallGrade.percentage}%
                                        </Typography>
                                        <Typography variant="body2">Percentage</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                                            {overallGrade.cgpa}
                                        </Typography>
                                        <Typography variant="body2">CGPA</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Subjects Summary */}
                    <TableContainer component={Paper} elevation={0}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Subject</TableCell>
                                    <TableCell>Total Marks</TableCell>
                                    <TableCell>Marks Obtained</TableCell>
                                    <TableCell>Percentage</TableCell>
                                    <TableCell>Grade</TableCell>
                                    <TableCell>Attendance</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {subjects.map((subject) => {
                                    const subjectGrade = calculateSubjectGrade(subject);
                                    const totalMarks = (parseFloat(subject.theory.totalMarks) || 0) + (parseFloat(subject.practical.totalMarks) || 0);
                                    const obtainedMarks = (parseFloat(subject.theory.marksObtained) || 0) + (parseFloat(subject.practical.marksObtained) || 0);
                                    
                                    return (
                                        <TableRow key={subject.subject}>
                                            <TableCell>{subject.subjectName}</TableCell>
                                            <TableCell>{totalMarks}</TableCell>
                                            <TableCell>{obtainedMarks}</TableCell>
                                            <TableCell>{subjectGrade.percentage}%</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={subjectGrade.grade}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: getGradeColor(subjectGrade.grade),
                                                        color: 'white',
                                                        fontWeight: 600
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>{subject.attendance.percentage}%</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        );
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate('/Admin/marksheets')} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    Create Marksheet
                </Typography>
            </Box>

            {/* Stepper */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </CardContent>
            </Card>

            {/* Step Content */}
            <Box sx={{ mb: 3 }}>
                {activeStep === 0 && renderBasicInfo()}
                {activeStep === 1 && renderSubjectMarks()}
                {activeStep === 2 && renderReview()}
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    startIcon={<ArrowBackIcon />}
                >
                    Back
                </Button>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {activeStep === steps.length - 1 ? (
                        <BlueButton
                            onClick={handleSubmit}
                            disabled={loading}
                            startIcon={<SaveIcon />}
                        >
                            Create Marksheet
                        </BlueButton>
                    ) : (
                        <BlueButton onClick={handleNext}>
                            Next
                        </BlueButton>
                    )}
                </Box>
            </Box>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    );
};

export default CreateMarksheet;
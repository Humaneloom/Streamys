import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';

import Popup from '../../../components/Popup';
import { BlueButton } from '../../../components/buttonStyles';
import {
    Box, InputLabel,
    MenuItem, Select,
    Typography, Stack,
    TextField, CircularProgress, FormControl,
    Card, CardContent, Button, Container,
    Avatar, Divider, Chip
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    School as SchoolIcon,
    Person as PersonIcon,
    Assignment as AssignmentIcon,
    Grade as GradeIcon
} from '@mui/icons-material';

const StudentExamMarks = ({ situation }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser, userDetails, loading } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);
    const { response, error, statestatus } = useSelector((state) => state.student);
    const params = useParams()

    const [studentID, setStudentID] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [chosenSubName, setChosenSubName] = useState("");
    const [marksObtained, setMarksObtained] = useState("");

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        if (situation === "Student") {
            setStudentID(params.id);
            const stdID = params.id
            dispatch(getUserDetails(stdID, "Student"));
        }
        else if (situation === "Subject") {
            const { studentID, subjectID } = params
            setStudentID(studentID);
            dispatch(getUserDetails(studentID, "Student"));
            setChosenSubName(subjectID);
        }
    }, [situation]);

    useEffect(() => {
        if (userDetails && userDetails.sclassName && situation === "Student") {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails]);

    const changeHandler = (event) => {
        const selectedSubject = subjectsList.find(
            (subject) => subject.subName === event.target.value
        );
        setSubjectName(selectedSubject.subName);
        setChosenSubName(selectedSubject._id);
    }

    const fields = { subName: chosenSubName, marksObtained }

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(updateStudentFields(studentID, fields, "UpdateExamResult"))
    }

    const handleBack = () => {
        if (situation === "Student") {
            navigate(`/Admin/student/${studentID}`);
        } else if (situation === "Subject") {
            navigate(`/Admin/subject/student/${studentID}/${chosenSubName}`);
        }
    }

    useEffect(() => {
        if (response) {
            setLoader(false)
            setShowPopup(true)
            setMessage(response)
        }
        else if (error) {
            setLoader(false)
            setShowPopup(true)
            setMessage("error")
        }
        else if (statestatus === "added") {
            setLoader(false)
            setShowPopup(true)
            setMessage("Done Successfully")
        }
    }, [response, statestatus, error])

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress size={60} />
                </Box>
            ) : (
                <>
                    {/* Back Button */}
                    <Box sx={{ mb: 3 }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={handleBack}
                            sx={{
                                color: '#64748b',
                                '&:hover': {
                                    backgroundColor: 'rgba(100, 116, 139, 0.1)',
                                }
                            }}
                        >
                            Back to Student Details
                        </Button>
                    </Box>

                    {/* Header Card */}
                    <Card sx={{ 
                        mb: 4, 
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                                <Avatar sx={{ 
                                    width: 60, 
                                    height: 60, 
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    fontSize: '1.5rem'
                                }}>
                                    <PersonIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                        {userDetails?.name || 'Student Name'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                        {userDetails?.sclassName?.sclassName} • Roll No: {userDetails?.rollNum}
                                    </Typography>
                                </Box>
                            </Box>
                            
                            {currentUser?.teachSubject && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AssignmentIcon sx={{ fontSize: 20 }} />
                                    <Typography variant="body1">
                                        Subject: {currentUser.teachSubject.subName}
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>

                    {/* Exam Marks Form Card */}
                    <Card sx={{ 
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        border: '1px solid #e2e8f0'
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Avatar sx={{ 
                                    width: 48, 
                                    height: 48, 
                                    bgcolor: '#3b82f6',
                                    fontSize: '1.2rem'
                                }}>
                                    <GradeIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                        Add Exam Marks
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                                        Enter the marks obtained by the student
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 4 }} />

                            <form onSubmit={submitHandler}>
                                <Stack spacing={4}>
                                    {situation === "Student" && (
                                        <FormControl fullWidth>
                                            <InputLabel id="subject-select-label">
                                                Select Subject
                                            </InputLabel>
                                            <Select
                                                labelId="subject-select-label"
                                                id="subject-select"
                                                value={subjectName}
                                                label="Select Subject"
                                                onChange={changeHandler}
                                                required
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                    }
                                                }}
                                            >
                                                {subjectsList ? (
                                                    subjectsList.map((subject, index) => (
                                                        <MenuItem key={index} value={subject.subName}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                <SchoolIcon sx={{ fontSize: 20, color: '#64748b' }} />
                                                                {subject.subName}
                                                            </Box>
                                                        </MenuItem>
                                                    ))
                                                ) : (
                                                    <MenuItem value="Select Subject">
                                                        Add Subjects For Marks
                                                    </MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
                                    )}

                                    <FormControl fullWidth>
                                        <TextField
                                            type="number"
                                            label="Enter Marks Obtained"
                                            value={marksObtained}
                                            required
                                            onChange={(e) => setMarksObtained(e.target.value)}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                }
                                            }}
                                            inputProps={{
                                                min: 0,
                                                max: 100,
                                                step: 0.01
                                            }}
                                        />
                                        <Typography variant="caption" sx={{ color: '#64748b', mt: 1 }}>
                                            Enter marks between 0 and 100
                                        </Typography>
                                    </FormControl>

                                    {/* Submit Button */}
                                    <Box sx={{ pt: 2 }}>
                                        <BlueButton
                                            fullWidth
                                            size="large"
                                            variant="contained"
                                            type="submit"
                                            disabled={loader}
                                            sx={{
                                                borderRadius: 2,
                                                py: 1.5,
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 8px 25px rgba(37, 99, 235, 0.3)'
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {loader ? (
                                                <CircularProgress size={24} color="inherit" />
                                            ) : (
                                                'Submit Marks'
                                            )}
                                        </BlueButton>
                                    </Box>
                                </Stack>
                            </form>
                        </CardContent>
                    </Card>

                    <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
                </>
            )}
        </Container>
    )
}

export default StudentExamMarks
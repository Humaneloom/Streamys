import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';
import {
    Box, InputLabel, MenuItem, Select, Typography, Stack,
    TextField, CircularProgress, FormControl, IconButton,
    Paper, Breadcrumbs, Container, Button, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import { PurpleButton } from '../../../components/buttonStyles';
import Popup from '../../../components/Popup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styled, { keyframes } from 'styled-components';

const StudentAttendance = ({ situation }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser, userDetails, loading } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);
    const { response, error, statestatus } = useSelector((state) => state.student);
    const params = useParams()
    
    // Get the student data from the array
    const studentData = userDetails && userDetails.length > 0 ? userDetails[0] : null;

    const [studentID, setStudentID] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [chosenSubName, setChosenSubName] = useState("");
    const [status, setStatus] = useState('');
    const [date, setDate] = useState('');
    const [attendanceMode, setAttendanceMode] = useState('single');

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
        if (studentData && studentData.sclassName && situation === "Student") {
            dispatch(getSubjectList(studentData.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, studentData, situation]);

    const changeHandler = (event) => {
        const selectedSubject = subjectsList.find(
            (subject) => subject.subName === event.target.value
        );
        setSubjectName(selectedSubject.subName);
        setChosenSubName(selectedSubject._id);
    }

    const fields = { subName: chosenSubName, status, date }

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(updateStudentFields(studentID, fields, "StudentAttendance"))
    }

    const handleModeChange = (event, newMode) => {
        if (newMode !== null) {
            setAttendanceMode(newMode);
        }
    };

    const navigateToBulkAttendance = () => {
        if (situation === "Subject") {
            navigate(`/Teacher/class/student/bulk-attendance/${studentID}/${chosenSubName}`);
        } else {
            navigate(`/Admin/students/student/bulk-attendance/${studentID}`);
        }
    };

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
        <StyledContainer>
            <HeaderContainer>
                <BreadcrumbsContainer>
                    <IconButton onClick={() => navigate(-1)} sx={{ 
                        mr: 2,
                        '&:hover': {
                            transform: 'scale(1.1)',
                            color: '#2c2c6c'
                        }
                    }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <StyledBreadcrumbs>
                        <Typography sx={{ fontSize: '1.1rem', cursor: 'pointer' }} onClick={() => navigate("/Admin/students")}>
                            Students
                        </Typography>
                        <Typography sx={{ fontSize: '1.1rem', cursor: 'pointer' }} onClick={() => navigate(`/Admin/students/student/${studentID}`)}>
                            {studentData?.name}
                        </Typography>
                        <Typography sx={{ fontSize: '1.1rem' }} color="text.primary">
                            Attendance
                        </Typography>
                    </StyledBreadcrumbs>
                </BreadcrumbsContainer>
            </HeaderContainer>

            {loading ? (
                <LoadingContainer>
                    <div className="loading-spinner"></div>
                    <Typography variant="h6" sx={{ color: '#4b4b80', mt: 2 }}>
                        Loading...
                    </Typography>
                </LoadingContainer>
            ) : (
                <StyledPaper elevation={3}>
                    <Box sx={{
                        flex: '1 1 auto',
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Box sx={{
                            maxWidth: 550,
                            width: '100%',
                            py: 3
                        }}>
                            <Stack spacing={3}>
                                <Typography variant="h4" sx={{ color: '#2c2c6c', fontWeight: 'bold', textAlign: 'center' }}>
                                    Mark Attendance
                                </Typography>
                                <Typography variant="h5" sx={{ color: '#4b4b80' }}>
                                    Student: {studentData?.name}
                                </Typography>
                                {currentUser.teachSubject &&
                                    <Typography variant="h5" sx={{ color: '#4b4b80' }}>
                                        Subject: {currentUser.teachSubject?.subName}
                                    </Typography>
                                }
                            </Stack>

                            <Box sx={{ mt: 3, mb: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2, color: '#2c2c6c' }}>
                                    Attendance Mode
                                </Typography>
                                <ToggleButtonGroup
                                    value={attendanceMode}
                                    exclusive
                                    onChange={handleModeChange}
                                    aria-label="attendance mode"
                                    sx={{ width: '100%' }}
                                >
                                    <ToggleButton value="single" aria-label="single date" sx={{ flex: 1 }}>
                                        Single Date
                                    </ToggleButton>
                                    <ToggleButton value="bulk" aria-label="multiple dates" sx={{ flex: 1 }}>
                                        Multiple Dates
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>

                            {attendanceMode === 'single' ? (
                                <form onSubmit={submitHandler}>
                                    <FormContainer spacing={3}>
                                        {situation === "Student" && (
                                            <FormControl fullWidth>
                                                <InputLabel>Select Subject</InputLabel>
                                                <Select
                                                    value={subjectName}
                                                    label="Select Subject"
                                                    onChange={changeHandler}
                                                    required
                                                >
                                                    {subjectsList ?
                                                        subjectsList.map((subject, index) => (
                                                            <MenuItem key={index} value={subject.subName}>
                                                                {subject.subName}
                                                            </MenuItem>
                                                        )) : (
                                                            <MenuItem value="Select Subject">
                                                                Add Subjects For Attendance
                                                            </MenuItem>
                                                        )
                                                    }
                                                </Select>
                                            </FormControl>
                                        )}
                                        <FormControl fullWidth>
                                            <InputLabel>Attendance Status</InputLabel>
                                            <Select
                                                value={status}
                                                label="Attendance Status"
                                                onChange={(event) => setStatus(event.target.value)}
                                                required
                                            >
                                                <MenuItem value="Present">Present</MenuItem>
                                                <MenuItem value="Absent">Absent</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth>
                                            <TextField
                                                label="Select Date"
                                                type="date"
                                                value={date}
                                                onChange={(event) => setDate(event.target.value)}
                                                required
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </FormControl>

                                        <PurpleButton
                                            fullWidth
                                            size="large"
                                            type="submit"
                                            disabled={loader}
                                            sx={{
                                                mt: 3,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 4px 20px rgba(138, 43, 226, 0.2)'
                                                }
                                            }}
                                        >
                                            {loader ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                                        </PurpleButton>
                                    </FormContainer>
                                </form>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="h6" sx={{ mb: 3, color: '#2c2c6c' }}>
                                        Bulk Attendance Mode
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 3, color: '#4b4b80' }}>
                                        Select multiple dates and mark attendance for all of them at once.
                                    </Typography>
                                    <PurpleButton
                                        variant="contained"
                                        size="large"
                                        onClick={navigateToBulkAttendance}
                                        sx={{
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 20px rgba(138, 43, 226, 0.2)'
                                            }
                                        }}
                                    >
                                        Go to Bulk Attendance
                                    </PurpleButton>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </StyledPaper>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </StyledContainer>
    );
};

export default StudentAttendance;

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

const StyledContainer = styled(Container)`
    padding: 20px;
    animation: ${fadeIn} 0.5s ease-out;
`;

const HeaderContainer = styled.div`
    margin-bottom: 20px;
`;

const BreadcrumbsContainer = styled.div`
    display: flex;
    align-items: center;
`;

const StyledBreadcrumbs = styled(Breadcrumbs)`
    .MuiBreadcrumbs-separator {
        margin: 0 8px;
    }
`;

const StyledPaper = styled(Paper)`
    padding: 20px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(138, 43, 226, 0.1);
    transition: all 0.3s ease;
    animation: ${fadeIn} 0.5s ease-out;

    &:hover {
        box-shadow: 0 8px 25px rgba(138, 43, 226, 0.15);
    }
`;

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;

    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 5px solid #f3f3f3;
        border-top: 5px solid #8a2be2;
        border-radius: 50%;
        animation: ${spin} 1s linear infinite;
    }
`;

const FormContainer = styled(Stack)`
    margin-top: 2rem;
    gap: 1.5rem;
`;
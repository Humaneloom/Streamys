import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { updateStudentBulkAttendance } from '../../../redux/studentRelated/studentHandle';
import {
    Box, InputLabel, MenuItem, Select, Typography, Stack,
    TextField, CircularProgress, FormControl, IconButton,
    Paper, Breadcrumbs, Container, Chip, Button, Grid,
    FormControlLabel, Checkbox, Alert
} from '@mui/material';
import { PurpleButton } from '../../../components/buttonStyles';
import Popup from '../../../components/Popup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styled, { keyframes } from 'styled-components';

const StudentBulkAttendance = ({ situation }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser, userDetails, loading } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);
    const { response, error, statestatus } = useSelector((state) => state.student);
    const params = useParams()

    const [studentID, setStudentID] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [chosenSubName, setChosenSubName] = useState("");
    const [status, setStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedDates, setSelectedDates] = useState([]);
    const [dateRange, setDateRange] = useState([]);

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

    // Generate date range when start and end dates change
    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const dates = [];
            
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                dates.push(new Date(d).toISOString().split('T')[0]);
            }
            
            setDateRange(dates);
            setSelectedDates(dates); // Select all dates by default
        } else {
            setDateRange([]);
            setSelectedDates([]);
        }
    }, [startDate, endDate]);

    const changeHandler = (event) => {
        const selectedSubject = subjectsList.find(
            (subject) => subject.subName === event.target.value
        );
        setSubjectName(selectedSubject.subName);
        setChosenSubName(selectedSubject._id);
    }

    const handleDateToggle = (date) => {
        setSelectedDates(prev => 
            prev.includes(date) 
                ? prev.filter(d => d !== date)
                : [...prev, date]
        );
    };

    const handleSelectAll = () => {
        setSelectedDates(dateRange);
    };

    const handleDeselectAll = () => {
        setSelectedDates([]);
    };

    const handleSelectWeekdays = () => {
        const weekdays = dateRange.filter(date => {
            const day = new Date(date).getDay();
            return day !== 0 && day !== 6; // Exclude Sunday (0) and Saturday (6)
        });
        setSelectedDates(weekdays);
    };

    const fields = { subName: chosenSubName, status, dates: selectedDates }

    const submitHandler = (event) => {
        event.preventDefault()
        if (selectedDates.length === 0) {
            setShowPopup(true);
            setMessage("Please select at least one date");
            return;
        }
        setLoader(true)
        dispatch(updateStudentBulkAttendance(studentID, fields))
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
                            {userDetails?.name}
                        </Typography>
                        <Typography sx={{ fontSize: '1.1rem' }} color="text.primary">
                            Bulk Attendance
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
                            maxWidth: 800,
                            width: '100%',
                            py: 3
                        }}>
                            <Stack spacing={3}>
                                <Typography variant="h4" sx={{ color: '#2c2c6c', fontWeight: 'bold', textAlign: 'center' }}>
                                    Mark Bulk Attendance
                                </Typography>
                                <Typography variant="h5" sx={{ color: '#4b4b80' }}>
                                    Student: {userDetails?.name}
                                </Typography>
                                {currentUser.teachSubject &&
                                    <Typography variant="h5" sx={{ color: '#4b4b80' }}>
                                        Subject: {currentUser.teachSubject?.subName}
                                    </Typography>
                                }
                            </Stack>

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

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    label="Start Date"
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(event) => setStartDate(event.target.value)}
                                                    required
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    label="End Date"
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(event) => setEndDate(event.target.value)}
                                                    required
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>

                                    {dateRange.length > 0 && (
                                        <Box>
                                            <Typography variant="h6" sx={{ mb: 2, color: '#2c2c6c' }}>
                                                Select Dates ({selectedDates.length} of {dateRange.length} selected)
                                            </Typography>
                                            
                                            <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                <Button 
                                                    variant="outlined" 
                                                    size="small" 
                                                    onClick={handleSelectAll}
                                                    sx={{ fontSize: '0.75rem' }}
                                                >
                                                    Select All
                                                </Button>
                                                <Button 
                                                    variant="outlined" 
                                                    size="small" 
                                                    onClick={handleDeselectAll}
                                                    sx={{ fontSize: '0.75rem' }}
                                                >
                                                    Deselect All
                                                </Button>
                                                <Button 
                                                    variant="outlined" 
                                                    size="small" 
                                                    onClick={handleSelectWeekdays}
                                                    sx={{ fontSize: '0.75rem' }}
                                                >
                                                    Select Weekdays Only
                                                </Button>
                                            </Box>

                                            <Box sx={{ 
                                                display: 'flex', 
                                                flexWrap: 'wrap', 
                                                gap: 1,
                                                maxHeight: '200px',
                                                overflowY: 'auto',
                                                p: 2,
                                                border: '1px solid #e0e0e0',
                                                borderRadius: 1
                                            }}>
                                                {dateRange.map((date) => (
                                                    <Chip
                                                        key={date}
                                                        label={new Date(date).toLocaleDateString()}
                                                        onClick={() => handleDateToggle(date)}
                                                        color={selectedDates.includes(date) ? "primary" : "default"}
                                                        variant={selectedDates.includes(date) ? "filled" : "outlined"}
                                                        sx={{ 
                                                            cursor: 'pointer',
                                                            '&:hover': {
                                                                transform: 'scale(1.05)'
                                                            }
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    )}

                                    {selectedDates.length > 0 && (
                                        <Alert severity="info">
                                            You are about to mark attendance for {selectedDates.length} date(s) as "{status}"
                                        </Alert>
                                    )}

                                    <PurpleButton
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        disabled={loader || selectedDates.length === 0}
                                        sx={{
                                            mt: 3,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 20px rgba(138, 43, 226, 0.2)'
                                            }
                                        }}
                                    >
                                        {loader ? <CircularProgress size={24} color="inherit" /> : `Submit (${selectedDates.length} dates)`}
                                    </PurpleButton>
                                </FormContainer>
                            </form>
                        </Box>
                    </Box>
                </StyledPaper>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </StyledContainer>
    );
};

export default StudentBulkAttendance;

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
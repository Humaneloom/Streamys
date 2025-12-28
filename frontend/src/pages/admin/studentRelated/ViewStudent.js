import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom'
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { Box, Button, Collapse, IconButton, Table, TableBody, TableHead, Typography, Tab, Paper, BottomNavigation, BottomNavigationAction, Container, Breadcrumbs } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { KeyboardArrowUp, KeyboardArrowDown, Delete as DeleteIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { removeStuff, updateStudentFields } from '../../../redux/studentRelated/studentHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../../components/attendanceCalculator';
import CustomBarChart from '../../../components/CustomBarChart'
import { StyledTableCell, StyledTableRow } from '../../../components/styles';
import styled, { keyframes } from 'styled-components';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import Popup from '../../../components/Popup';

const ViewStudent = () => {
    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch()
    const { userDetails, response, error, loading } = useSelector((state) => state.user);

    const studentID = params.id
    const address = "Student"
    
    console.log('ViewStudent component - params:', params);
    console.log('ViewStudent component - studentID:', studentID);
    console.log('ViewStudent component - address:', address);
    
    // Validate student ID format (MongoDB ObjectId is 24 characters)
    const isValidStudentId = studentID && studentID.length === 24;
    console.log('ViewStudent component - isValidStudentId:', isValidStudentId);
    
    // Get the student data from the array
    const studentData = userDetails && userDetails.length > 0 ? userDetails[0] : null;
    
    console.log('ViewStudent component - userDetails:', userDetails);
    console.log('ViewStudent component - studentData:', studentData);

    // All React hooks must be called before any conditional returns
    const [sclassName, setSclassName] = useState('');
    const [studentSchool, setStudentSchool] = useState('');
    const [subjectMarks, setSubjectMarks] = useState('');
    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [openStates, setOpenStates] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [value, setValue] = useState('1');
    const [selectedSection, setSelectedSection] = useState('table');
    const [showAttendanceChart, setShowAttendanceChart] = useState(false);
    const [showMarksChart, setShowMarksChart] = useState(false);

    useEffect(() => {
        if (isValidStudentId) {
            console.log('Dispatching getUserDetails with:', { studentID, address });
            dispatch(getUserDetails(studentID, address));
        } else {
            console.error('Invalid student ID format:', studentID);
        }
    }, [dispatch, studentID, isValidStudentId])

    useEffect(() => {
        console.log('userDetails changed:', userDetails);
        console.log('studentData:', studentData);
        if (studentData && studentData.sclassName && studentData.sclassName._id !== undefined) {
            dispatch(getSubjectList(studentData.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, studentData, userDetails]);

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
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Typography variant="h6">Loading student details...</Typography>
            </Container>
        );
    }

    // Show error state
    if (error) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Typography variant="h6" color="error">Error loading student details: {error.message}</Typography>
            </Container>
        );
    }

    // Show invalid student ID error
    if (!isValidStudentId) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Typography variant="h6" color="error">Invalid student ID format: {studentID}</Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>Student ID must be a valid 24-character MongoDB ObjectId.</Typography>
            </Container>
        );
    }

    // Show no data state
    if (!studentData) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Typography variant="h6">No student data found</Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>The student with ID {studentID} was not found in the database.</Typography>
            </Container>
        );
    }

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const deleteHandler = () => {
        setMessage("Sorry the delete function has been disabled for now.")
        setShowPopup(true)

        // dispatch(deleteUser(studentID, address))
        //     .then(() => {
        //         navigate(-1)
        //     })
    }

    const removeHandler = (id, deladdress) => {
        dispatch(removeStuff(id, deladdress))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
            })
    }

    const removeSubAttendance = (subId) => {
        dispatch(updateStudentFields(studentID, { subId }, "RemoveStudentSubAtten"))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
            })
    }

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);



    const subjectData = Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { subCode, present, sessions }]) => {
        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
        return {
            subject: subName,
            attendancePercentage: subjectAttendancePercentage,
            totalClasses: sessions,
            attendedClasses: present
        };
    });

    const StudentAttendanceSection = () => {
        const renderTableSection = () => {
            return (
                <>
                    <h3>Attendance:</h3>
                    <Table>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Subject</StyledTableCell>
                                <StyledTableCell>Present</StyledTableCell>
                                <StyledTableCell>Total Sessions</StyledTableCell>
                                <StyledTableCell>Attendance Percentage</StyledTableCell>
                                <StyledTableCell align="center">Actions</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, allData, subId, sessions }], index) => {
                            const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
                            return (
                                <TableBody key={index}>
                                    <StyledTableRow>
                                        <StyledTableCell>{subName}</StyledTableCell>
                                        <StyledTableCell>{present}</StyledTableCell>
                                        <StyledTableCell>{sessions}</StyledTableCell>
                                        <StyledTableCell>{subjectAttendancePercentage}%</StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Button variant="contained"
                                                onClick={() => handleOpen(subId)}>
                                                {openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}Details
                                            </Button>
                                            <IconButton onClick={() => removeSubAttendance(subId)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                            <Button variant="contained" sx={styles.attendanceButton}
                                                onClick={() => navigate(`/Admin/subject/student/attendance/${studentID}/${subId}`)}>
                                                Change
                                            </Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                            <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 1 }}>
                                                    <Typography variant="h6" gutterBottom component="div">
                                                        Attendance Details
                                                    </Typography>
                                                    <Table size="small" aria-label="purchases">
                                                        <TableHead>
                                                            <StyledTableRow>
                                                                <StyledTableCell>Date</StyledTableCell>
                                                                <StyledTableCell align="right">Status</StyledTableCell>
                                                            </StyledTableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {allData.map((data, index) => {
                                                                const date = new Date(data.date);
                                                                const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                                return (
                                                                    <StyledTableRow key={index}>
                                                                        <StyledTableCell component="th" scope="row">
                                                                            {dateString}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell align="right">{data.status}</StyledTableCell>
                                                                    </StyledTableRow>
                                                                )
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Collapse>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            )
                        }
                        )}
                    </Table>
                    <div>
                        Overall Attendance Percentage: {overallAttendancePercentage.toFixed(2)}%
                    </div>
                    <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => removeHandler(studentID, "RemoveStudentAtten")}>Delete All</Button>
                    <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/students/student/attendance/" + studentID)}>
                        Add Attendance
                    </Button>
                </>
            )
        }
        const renderChartSection = () => {
            return (
                <>
                    <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
                </>
            )
        }
        return (
            <>
                {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ? (
                    <>
                        {/* Toggle Button for Chart */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                            <Button
                                variant="outlined"
                                onClick={() => setShowAttendanceChart(!showAttendanceChart)}
                                startIcon={showAttendanceChart ? <TableChartIcon /> : <InsertChartIcon />}
                                sx={{
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1,
                                    borderColor: '#2c2c6c',
                                    color: '#2c2c6c',
                                    '&:hover': {
                                        borderColor: '#2c2c6c',
                                        backgroundColor: 'rgba(44, 44, 108, 0.1)'
                                    }
                                }}
                            >
                                {showAttendanceChart ? 'Show Table' : 'Show Chart'}
                            </Button>
                        </Box>

                        {/* Content */}
                        {showAttendanceChart ? renderChartSection() : renderTableSection()}
                    </>
                ) : (
                    <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/students/student/attendance/" + studentID)}>
                        Add Attendance
                    </Button>
                )}
            </>
        )
    }

    const StudentMarksSection = () => {
        const renderTableSection = () => {
            return (
                <>
                    <h3>Subject Marks:</h3>
                    <Table>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Subject</StyledTableCell>
                                <StyledTableCell>Marks</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {subjectMarks.map((result, index) => {
                                if (!result.subName || !result.marksObtained) {
                                    return null;
                                }
                                return (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>{result.subName.subName}</StyledTableCell>
                                        <StyledTableCell>{result.marksObtained}</StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/students/student/marks/" + studentID)}>
                        Add Marks
                    </Button>
                </>
            )
        }
        const renderChartSection = () => {
            return (
                <>
                    <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
                </>
            )
        }
        return (
            <>
                {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0 ? (
                    <>
                        {/* Toggle Button for Chart */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                            <Button
                                variant="outlined"
                                onClick={() => setShowMarksChart(!showMarksChart)}
                                startIcon={showMarksChart ? <TableChartIcon /> : <InsertChartIcon />}
                                sx={{
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1,
                                    borderColor: '#2c2c6c',
                                    color: '#2c2c6c',
                                    '&:hover': {
                                        borderColor: '#2c2c6c',
                                        backgroundColor: 'rgba(44, 44, 108, 0.1)'
                                    }
                                }}
                            >
                                {showMarksChart ? 'Show Table' : 'Show Chart'}
                            </Button>
                        </Box>

                        {/* Content */}
                        {showMarksChart ? renderChartSection() : renderTableSection()}
                    </>
                ) : (
                    <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/students/student/marks/" + studentID)}>
                        Add Marks
                    </Button>
                )}
            </>
        )
    }

    const StudentDetailsSection = () => {
        return (
            <DetailsContainer>
                {/* Student Information Card */}
                <DetailCard elevation={3}>
                    <Typography variant="h4" sx={{ color: '#2c2c6c', fontWeight: 'bold', mb: 3 }}>
                        Student Information
                    </Typography>
                    
                    <DetailRow>
                        <DetailLabel>Name:</DetailLabel>
                        <DetailValue variant="body1">{studentData?.name}</DetailValue>
                    </DetailRow>
                    
                    <DetailRow>
                        <DetailLabel>Roll Number:</DetailLabel>
                        <DetailValue variant="body1">{studentData?.rollNum}</DetailValue>
                    </DetailRow>
                    
                    <DetailRow>
                        <DetailLabel>Gender:</DetailLabel>
                        <DetailValue variant="body1">{studentData?.gender || 'Not specified'}</DetailValue>
                    </DetailRow>
                    
                    <DetailRow>
                        <DetailLabel>Class:</DetailLabel>
                        <DetailValue variant="body1">{sclassName.sclassName}</DetailValue>
                    </DetailRow>
                    
                    <DetailRow>
                        <DetailLabel>School:</DetailLabel>
                        <DetailValue variant="body1">{studentSchool.schoolName}</DetailValue>
                    </DetailRow>
                </DetailCard>

                {/* Compact Stats Cards */}
                {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 && (
                    <CompactStatsContainer>
                        <CompactStatCard elevation={3}>
                            <Box sx={{ 
                                backgroundColor: '#e3f2fd', 
                                borderRadius: '12px', 
                                width: 50, 
                                height: 50, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                mb: 1
                            }}>
                                <Typography variant="h6" sx={{ color: '#2c2c6c', fontWeight: 'bold' }}>
                                    {Math.round(overallAttendancePercentage)}%
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: '#2c2c6c', fontWeight: 'bold', textAlign: 'center' }}>
                                Attendance
                            </Typography>
                        </CompactStatCard>

                        <CompactStatCard elevation={3}>
                            <Box sx={{ 
                                backgroundColor: '#fff3e0', 
                                borderRadius: '12px', 
                                width: 50, 
                                height: 50, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                mb: 1
                            }}>
                                <Typography variant="h6" sx={{ color: '#2c2c6c', fontWeight: 'bold' }}>
                                    {subjectAttendance.length}
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: '#2c2c6c', fontWeight: 'bold', textAlign: 'center' }}>
                                Subjects
                            </Typography>
                        </CompactStatCard>

                        <CompactStatCard elevation={3}>
                            <Box sx={{ 
                                backgroundColor: '#f3e5f5', 
                                borderRadius: '12px', 
                                width: 50, 
                                height: 50, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                mb: 1
                            }}>
                                <Typography variant="h6" sx={{ color: '#2c2c6c', fontWeight: 'bold' }}>
                                    {subjectMarks ? subjectMarks.length : 0}
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: '#2c2c6c', fontWeight: 'bold', textAlign: 'center' }}>
                                Marks
                            </Typography>
                        </CompactStatCard>
                    </CompactStatsContainer>
                )}

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
                    <Button 
                        variant="contained" 
                        onClick={deleteHandler}
                        sx={{
                            backgroundColor: '#ff4444',
                            '&:hover': {
                                backgroundColor: '#cc0000'
                            }
                        }}
                        startIcon={<DeleteIcon />}
                    >
                        Delete Student
                    </Button>
                </Box>
            </DetailsContainer>
        )
    }

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
                        <Typography sx={{ fontSize: '1.1rem' }} color="text.primary">
                            {studentData?.name}
                        </Typography>
                    </StyledBreadcrumbs>
                </BreadcrumbsContainer>
            </HeaderContainer>

            <StyledPaper elevation={3}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} 
                            sx={{
                                '& .MuiTab-root': {
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    '&.Mui-selected': {
                                        color: '#2c2c6c'
                                    }
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#2c2c6c'
                                }
                            }}
                        >
                            <Tab label="Details" value="1" />
                            <Tab label="Attendance" value="2" />
                            <Tab label="Marks" value="3" />
                        </TabList>
                    </Box>
                    <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                        <TabPanel value="1">
                            <StudentDetailsSection />
                        </TabPanel>
                        <TabPanel value="2">
                            <StudentAttendanceSection />
                        </TabPanel>
                        <TabPanel value="3">
                            <StudentMarksSection />
                        </TabPanel>
                    </Container>
                </TabContext>
            </StyledPaper>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </StyledContainer>
    )
}

export default ViewStudent

const styles = {
    attendanceButton: {
        marginLeft: "20px",
        backgroundColor: "#270843",
        "&:hover": {
            backgroundColor: "#3f1068",
        }
    },
    styledButton: {
        margin: "20px",
        backgroundColor: "#02250b",
        "&:hover": {
            backgroundColor: "#106312",
        }
    }
}

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

const DetailsContainer = styled.div`
    animation: ${fadeIn} 0.5s ease-out;
    padding: 20px;
`;

const StatsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
`;

const CompactStatsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 15px;
    margin-top: 20px;
    margin-bottom: 20px;
`;

const CompactStatCard = styled(Paper)`
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: default;
    min-height: 100px;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.1);
    }
`;

const StatCard = styled(Paper)`
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: default;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }
`;

const StatContent = styled.div`
    display: flex;
    flex-direction: column;
`;

const DetailCard = styled(Paper)`
    padding: 24px;
    margin-bottom: 20px;
    background: linear-gradient(135deg, #ffffff 0%, #f5f5fc 100%);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }
`;

const DetailRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    gap: 10px;
`;

const DetailLabel = styled(Typography)`
    color: #666;
    font-weight: 500;
    min-width: 120px;
`;

const DetailValue = styled(Typography)`
    color: #2c2c6c;
    font-weight: 600;
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


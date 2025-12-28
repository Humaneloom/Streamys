import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { getClassDetails, getClassStudents, getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import { getAllTeachers } from "../../../redux/teacherRelated/teacherHandle";
import {
    Box, Container, Typography, Tab, IconButton, Paper, Breadcrumbs
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { BlueButton, GreenButton, PurpleButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from '@mui/icons-material/PostAdd';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupIcon from '@mui/icons-material/Group';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import styled, { keyframes } from 'styled-components';

const ClassDetails = () => {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { subjectsList, sclassStudents, sclassDetails, error, response, getresponse } = useSelector((state) => state.sclass);
    const { teachersList, response: teachersResponse } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector((state) => state.user);

    const classID = params.id

    useEffect(() => {
        dispatch(getClassDetails(classID, "Sclass"));
        dispatch(getSubjectList(classID, "ClassSubjects"))
        dispatch(getClassStudents(classID));
        dispatch(getAllTeachers(currentUser._id));
    }, [dispatch, classID, currentUser._id])

    if (error) {
        console.log(error)
    }

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        setMessage("Sorry the delete function has been disabled for now.")
        setShowPopup(true)
        // dispatch(deleteUser(deleteID, address))
        //     .then(() => {
        //         dispatch(getClassStudents(classID));
        //         dispatch(resetSubjects())
        //         dispatch(getSubjectList(classID, "ClassSubjects"))
        //     })
    }

    const subjectColumns = [
        { id: 'name', label: 'Subject Name', minWidth: 170 },
        { id: 'code', label: 'Subject Code', minWidth: 100 },
    ]

    const subjectRows = subjectsList && subjectsList.length > 0 ? subjectsList.map((subject) => {
        return {
            name: subject.subName,
            code: subject.subCode,
            id: subject._id,
        };
    }) : []

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Subject")}>
                    <DeleteIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    onClick={() => {
                        navigate(`/Admin/class/subject/${classID}/${row.id}`)
                    }}
                >
                    View
                </BlueButton >
            </>
        );
    };

    const subjectActions = [
        {
            icon: <PostAddIcon color="primary" />, name: 'Add New Subject',
            action: () => navigate("/Admin/addsubject/" + classID)
        },
        {
            icon: <DeleteIcon color="error" />, name: 'Delete All Subjects',
            action: () => deleteHandler(classID, "SubjectsClass")
        }
    ];

    const ClassSubjectsSection = () => {
        return (
            <>
                {response ?
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <GreenButton
                            variant="contained"
                            onClick={() => navigate("/Admin/addsubject/" + classID)}
                        >
                            Add Subjects
                        </GreenButton>
                    </Box>
                    :
                    <>
                        <Typography variant="h5" gutterBottom>
                            Subjects List:
                        </Typography>

                        <TableTemplate buttonHaver={SubjectsButtonHaver} columns={subjectColumns} rows={subjectRows} />
                        <SpeedDialTemplate actions={subjectActions} />
                    </>
                }
            </>
        )
    }

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
    ]

    const studentRows = sclassStudents && sclassStudents.length > 0 ? sclassStudents.map((student) => {
        return {
            name: student.name,
            rollNum: student.rollNum,
            id: student._id,
        };
    }) : []

    const StudentsButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Student")}>
                    <PersonRemoveIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    onClick={() => navigate("/Admin/students/student/" + row.id)}
                >
                    View
                </BlueButton>
                <PurpleButton
                    variant="contained"
                    onClick={() =>
                        navigate("/Admin/students/student/attendance/" + row.id)
                    }
                >
                    Attendance
                </PurpleButton>
            </>
        );
    };

    const studentActions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Add New Student',
            action: () => navigate("/Admin/class/addstudents/" + classID)
        },
        {
            icon: <PersonRemoveIcon color="error" />, name: 'Delete All Students',
            action: () => deleteHandler(classID, "StudentsClass")
        },
    ];

    const ClassStudentsSection = () => {
        return (
            <>
                {getresponse ? (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <GreenButton
                                variant="contained"
                                onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                            >
                                Add Students
                            </GreenButton>
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography variant="h5" gutterBottom>
                            Students List:
                        </Typography>

                        <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
                        <SpeedDialTemplate actions={studentActions} />
                    </>
                )}
            </>
        )
    }

    // Filter teachers for this specific class
    const classTeachers = teachersList && teachersList.length > 0 ? teachersList.filter(teacher => 
        teacher.teachSclass && teacher.teachSclass._id === classID
    ) : [];

    const teacherColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'teachSubject', label: 'Subject', minWidth: 100 },
        { id: 'email', label: 'Email', minWidth: 200 },
    ]

    const teacherRows = classTeachers.map((teacher) => {
        return {
            name: teacher.name,
            teachSubject: teacher.teachSubject?.subName || 'Not Assigned',
            email: teacher.email,
            id: teacher._id,
        };
    })

    const TeachersButtonHaver = ({ row }) => {
        return (
            <>
                <BlueButton
                    variant="contained"
                    onClick={() => navigate("/Admin/teachers/teacher/" + row.id)}
                >
                    View
                </BlueButton>
            </>
        );
    };

    const teacherActions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Add New Teacher',
            action: () => navigate("/Admin/teachers/chooseclass")
        },
    ];

    const ClassTeachersSection = () => {
        return (
            <>
                {teachersResponse ? (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2, p: 3 }}>
                            <Typography variant="h6" sx={{ color: '#4b4b80' }}>
                                No Teachers Found
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', mb: 2 }}>
                                To add teachers, you need to first add subjects to this class, then assign teachers to those subjects.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <GreenButton
                                    variant="contained"
                                    onClick={() => navigate("/Admin/addsubject/" + classID)}
                                >
                                    Add Subjects First
                                </GreenButton>
                                <GreenButton
                                    variant="contained"
                                    onClick={() => navigate("/Admin/teachers/chooseclass")}
                                >
                                    Add Teacher
                                </GreenButton>
                            </Box>
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography variant="h5" gutterBottom>
                            Teachers List:
                        </Typography>

                        <TableTemplate buttonHaver={TeachersButtonHaver} columns={teacherColumns} rows={teacherRows} />
                        <SpeedDialTemplate actions={teacherActions} />
                    </>
                )}
            </>
        )
    }



    return (
        <StyledContainer>
            <HeaderContainer>
                <BreadcrumbsContainer>
                    <IconButton onClick={() => navigate("/Admin/classes")} sx={{ 
                        mr: 2,
                        '&:hover': {
                            transform: 'scale(1.1)',
                            color: '#2c2c6c'
                        }
                    }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <StyledBreadcrumbs>
                        <Typography sx={{ fontSize: '1.1rem', cursor: 'pointer' }} onClick={() => navigate("/Admin/classes")}>
                            Classes
                        </Typography>
                        <Typography sx={{ fontSize: '1.1rem' }} color="text.primary">
                            {sclassDetails && sclassDetails.sclassName}
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
                            <Tab label="Overview" value="1" />
                            <Tab label="Subjects" value="2" />
                            <Tab label="Students" value="3" />
                            <Tab label="Teachers" value="4" />
                        </TabList>
                    </Box>

                    <StyledTabPanel value="1">
                        <OverviewContainer>
                            <Typography variant="h4" sx={{ color: '#2c2c6c', fontWeight: 'bold', mb: 4 }}>
                                Class {sclassDetails && sclassDetails.sclassName}
                            </Typography>
                            
                            <StatsContainer>
                                <StatCard>
                                    <MenuBookIcon sx={{ fontSize: 40, color: '#2c2c6c' }} />
                                    <StatContent>
                                        <Typography variant="h4" sx={{ color: '#2c2c6c', fontWeight: 'bold' }}>
                                            {subjectsList.length}
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ color: '#4b4b80' }}>
                                            Subjects
                                        </Typography>
                                    </StatContent>
                                </StatCard>

                                <StatCard>
                                    <GroupIcon sx={{ fontSize: 40, color: '#2c2c6c' }} />
                                    <StatContent>
                                        <Typography variant="h4" sx={{ color: '#2c2c6c', fontWeight: 'bold' }}>
                                            {sclassStudents.length}
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ color: '#4b4b80' }}>
                                            Students
                                        </Typography>
                                    </StatContent>
                                </StatCard>

                                <StatCard>
                                    <SupervisorAccountIcon sx={{ fontSize: 40, color: '#2c2c6c' }} />
                                    <StatContent>
                                        <Typography variant="h4" sx={{ color: '#2c2c6c', fontWeight: 'bold' }}>
                                            {classTeachers.length}
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ color: '#4b4b80' }}>
                                            Teachers
                                        </Typography>
                                    </StatContent>
                                </StatCard>
                            </StatsContainer>

                            <ActionButtons>
                                {getresponse &&
                                    <GreenButton
                                        variant="contained"
                                        onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                                        sx={{
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 20px rgba(138, 43, 226, 0.2)'
                                            }
                                        }}
                                    >
                                        Add Students
                                    </GreenButton>
                                }
                                {response &&
                                    <GreenButton
                                        variant="contained"
                                        onClick={() => navigate("/Admin/addsubject/" + classID)}
                                        sx={{
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 20px rgba(138, 43, 226, 0.2)'
                                            }
                                        }}
                                    >
                                        Add Subjects
                                    </GreenButton>
                                }
                            </ActionButtons>
                        </OverviewContainer>
                    </StyledTabPanel>

                    <StyledTabPanel value="2">
                        <ClassSubjectsSection />
                    </StyledTabPanel>

                    <StyledTabPanel value="3">
                        <ClassStudentsSection />
                    </StyledTabPanel>

                    <StyledTabPanel value="4">
                        <ClassTeachersSection />
                    </StyledTabPanel>
                </TabContext>
            </StyledPaper>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </StyledContainer>
    );
};

export default ClassDetails;

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

const StyledTabPanel = styled(TabPanel)`
    padding: 20px 0;
`;

const OverviewContainer = styled.div`
    text-align: center;
`;

const StatsContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-bottom: 40px;
    flex-wrap: wrap;
`;

const StatCard = styled.div`
    background: white;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(138, 43, 226, 0.1);
    display: flex;
    align-items: center;
    gap: 20px;
    min-width: 200px;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(138, 43, 226, 0.15);
    }
`;

const StatContent = styled.div`
    text-align: left;
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 20px;
    justify-content: center;
    margin-top: 20px;
`;
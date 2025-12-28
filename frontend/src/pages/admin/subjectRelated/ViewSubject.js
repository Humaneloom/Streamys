import React, { useEffect, useState } from 'react'
import { getClassStudents, getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Tab, Container, Typography, BottomNavigation, BottomNavigationAction, Paper, IconButton, Breadcrumbs, Divider } from '@mui/material';
import { BlueButton, GreenButton, PurpleButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import styled, { keyframes } from 'styled-components';

const ViewSubject = () => {
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch();
  const { subloading, subjectDetails, sclassStudents, getresponse, error } = useSelector((state) => state.sclass);

  const { classID, subjectID } = params

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
    dispatch(getClassStudents(classID));
  }, [dispatch, subjectID, classID]);

  if (error) {
    console.log(error)
  }

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectedSection, setSelectedSection] = useState('attendance');
  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const studentColumns = [
    { id: 'rollNum', label: 'Roll No.', minWidth: 100 },
    { id: 'name', label: 'Name', minWidth: 170 },
  ]

  const studentRows = sclassStudents.map((student) => {
    return {
      rollNum: student.rollNum,
      name: student.name,
      id: student._id,
    };
  })

  const StudentsAttendanceButtonHaver = ({ row }) => {
    return (
      <>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/students/student/" + row.id)}
        >
          View
        </BlueButton>
        <PurpleButton
          variant="contained"
          onClick={() =>
            navigate(`/Admin/subject/student/attendance/${row.id}/${subjectID}`)
          }
        >
          Take Attendance
        </PurpleButton>
      </>
    );
  };

  const StudentsMarksButtonHaver = ({ row }) => {
    return (
      <>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/students/student/" + row.id)}
        >
          View
        </BlueButton>
        <PurpleButton variant="contained"
          onClick={() => navigate(`/Admin/subject/student/marks/${row.id}/${subjectID}`)}>
          Provide Marks
        </PurpleButton>
      </>
    );
  };

  const SubjectStudentsSection = () => {
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

            {selectedSection === 'attendance' &&
              <TableTemplate buttonHaver={StudentsAttendanceButtonHaver} columns={studentColumns} rows={studentRows} />
            }
            {selectedSection === 'marks' &&
              <TableTemplate buttonHaver={StudentsMarksButtonHaver} columns={studentColumns} rows={studentRows} />
            }

            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
              <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                <BottomNavigationAction
                  label="Attendance"
                  value="attendance"
                  icon={selectedSection === 'attendance' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                />
                <BottomNavigationAction
                  label="Marks"
                  value="marks"
                  icon={selectedSection === 'marks' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                />
              </BottomNavigation>
            </Paper>

          </>
        )}
      </>
    )
  }

  const SubjectDetailsSection = () => {
    const numberOfStudents = sclassStudents.length;

    return (
      <>
        <Typography variant="h4" align="center" gutterBottom>
          Subject Details
        </Typography>
        <Typography variant="h6" gutterBottom>
          Subject Name : {subjectDetails && subjectDetails.subName}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Subject Code : {subjectDetails && subjectDetails.subCode}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Subject Sessions : {subjectDetails && subjectDetails.sessions}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Number of Students: {numberOfStudents}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Class Name : {subjectDetails && subjectDetails.sclassName && subjectDetails.sclassName.sclassName}
        </Typography>
        {subjectDetails && subjectDetails.teacher ?
          <Typography variant="h6" gutterBottom>
            Teacher Name : {subjectDetails.teacher.name}
          </Typography>
          :
          <GreenButton variant="contained"
            onClick={() => navigate("/Admin/teachers/addteacher/" + subjectDetails._id)}>
            Add Subject Teacher
          </GreenButton>
        }
      </>
    );
  }

  return (
    <StyledContainer>
      <HeaderContainer>
        <BreadcrumbsContainer>
          <IconButton onClick={() => navigate(`/Admin/classes/class/${classID}`)} sx={{ 
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
            <Typography sx={{ fontSize: '1.1rem', cursor: 'pointer' }} onClick={() => navigate(`/Admin/classes/class/${classID}`)}>
              {subjectDetails && subjectDetails.sclassName && subjectDetails.sclassName.sclassName}
            </Typography>
            <Typography sx={{ fontSize: '1.1rem' }} color="text.primary">
              {subjectDetails && subjectDetails.subName}
            </Typography>
          </StyledBreadcrumbs>
        </BreadcrumbsContainer>
      </HeaderContainer>

      {subloading ? (
        <LoadingContainer>
          <div className="loading-spinner"></div>
          <Typography variant="h6" sx={{ color: '#4b4b80', mt: 2 }}>
            Loading Subject Details...
          </Typography>
        </LoadingContainer>
      ) : (
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
                <Tab label="Students" value="2" />
              </TabList>
            </Box>

            <StyledTabPanel value="1">
              <OverviewContainer>
                <Typography variant="h4" sx={{ color: '#2c2c6c', fontWeight: 'bold', mb: 4 }}>
                  {subjectDetails && subjectDetails.subName}
                </Typography>

                <StatsContainer>
                  <StatCard>
                    <MenuBookIcon sx={{ fontSize: 40, color: '#2c2c6c' }} />
                    <StatContent>
                      <Typography variant="h6" sx={{ color: '#4b4b80' }}>
                        Subject Code
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#2c2c6c', fontWeight: 'bold' }}>
                        {subjectDetails && subjectDetails.subCode}
                      </Typography>
                    </StatContent>
                  </StatCard>

                  <StatCard>
                    <SchoolIcon sx={{ fontSize: 40, color: '#2c2c6c' }} />
                    <StatContent>
                      <Typography variant="h6" sx={{ color: '#4b4b80' }}>
                        Sessions
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#2c2c6c', fontWeight: 'bold' }}>
                        {subjectDetails && subjectDetails.sessions}
                      </Typography>
                    </StatContent>
                  </StatCard>

                  <StatCard>
                    <GroupIcon sx={{ fontSize: 40, color: '#2c2c6c' }} />
                    <StatContent>
                      <Typography variant="h6" sx={{ color: '#4b4b80' }}>
                        Students
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#2c2c6c', fontWeight: 'bold' }}>
                        {sclassStudents.length}
                      </Typography>
                    </StatContent>
                  </StatCard>
                </StatsContainer>

                <TeacherSection>
                  <Typography variant="h5" sx={{ color: '#2c2c6c', mb: 2 }}>
                    Subject Teacher
                  </Typography>
                  {subjectDetails && subjectDetails.teacher ? (
                    <TeacherCard>
                      <Typography variant="h6" sx={{ color: '#4b4b80' }}>
                        {subjectDetails.teacher.name}
                      </Typography>
                    </TeacherCard>
                  ) : (
                    <GreenButton variant="contained"
                      onClick={() => navigate("/Admin/teachers/addteacher/" + subjectDetails._id)}
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 20px rgba(138, 43, 226, 0.2)'
                        }
                      }}
                    >
                      Add Subject Teacher
                    </GreenButton>
                  )}
                </TeacherSection>
              </OverviewContainer>
            </StyledTabPanel>

            <StyledTabPanel value="2">
              <StudentsContainer>
                <Typography variant="h5" sx={{ color: '#2c2c6c', mb: 3 }}>
                  Students List
                </Typography>
                {getresponse ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
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
                  </Box>
                ) : (
                  <>
                    {selectedSection === 'attendance' &&
                      <TableTemplate buttonHaver={StudentsAttendanceButtonHaver} columns={studentColumns} rows={studentRows} />
                    }
                    {selectedSection === 'marks' &&
                      <TableTemplate buttonHaver={StudentsMarksButtonHaver} columns={studentColumns} rows={studentRows} />
                    }
                  </>
                )}
              </StudentsContainer>

              <StyledBottomNavigation>
                <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                  <BottomNavigationAction
                    label="Attendance"
                    value="attendance"
                    icon={selectedSection === 'attendance' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                  />
                  <BottomNavigationAction
                    label="Marks"
                    value="marks"
                    icon={selectedSection === 'marks' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                  />
                </BottomNavigation>
              </StyledBottomNavigation>
            </StyledTabPanel>
          </TabContext>
        </StyledPaper>
      )}
    </StyledContainer>
  );
};

export default ViewSubject;

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

const TeacherSection = styled.div`
  margin-top: 40px;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(138, 43, 226, 0.1);
`;

const TeacherCard = styled.div`
  padding: 20px;
  background: rgba(138, 43, 226, 0.05);
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(138, 43, 226, 0.1);
  }
`;

const StudentsContainer = styled.div`
  margin-bottom: 70px;
`;

const StyledBottomNavigation = styled(Paper)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 -4px 20px rgba(138, 43, 226, 0.1);
`;
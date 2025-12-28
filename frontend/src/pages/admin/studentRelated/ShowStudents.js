import React, { useEffect, useState, useMemo } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Chip,
    Container,
    Avatar,
    IconButton,
    Tooltip,
    Menu,
    MenuItem,
    ListItemIcon,
    LinearProgress,
    Grow,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    Fade
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Delete as DeleteIcon,
    Search as SearchIcon,
    FilterList as FilterListIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { getAllStudents } from '../../../redux/studentRelated/studentHandle';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import AddCardIcon from '@mui/icons-material/AddCard';
import ClassIcon from '@mui/icons-material/Class';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import GradeIcon from '@mui/icons-material/Grade';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { motion } from 'framer-motion';

// Styled Components for Modern Gradient Theme
const GradientCard = styled(Card)(({ theme, gradient }) => ({
    background: gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease-in-out',
    overflow: 'visible',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
    },
}));

const StatsCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(102, 126, 234, 0.1)',
    transition: 'all 0.3s ease-in-out',
    overflow: 'visible',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        border: '1px solid rgba(102, 126, 234, 0.2)',
    },
}));

const SearchContainer = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: '16px',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(102, 126, 234, 0.1)',
}));

const StudentCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(102, 126, 234, 0.1)',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        border: '1px solid rgba(102, 126, 234, 0.2)',
        '& .MuiCardContent-root': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#ffffff',
        }
    },
    '& .MuiCardContent-root': {
        transition: 'all 0.3s ease-in-out',
    }
}));

const GradientIcon = styled(Box)(({ theme, color }) => ({
    width: 60,
    height: 60,
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    '& .MuiSvgIcon-root': {
        fontSize: '2rem',
        color: '#ffffff',
    },
}));

const ShowStudents = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const { studentsList, loading, error, response } = useSelector((state) => state.student);
  const { currentUser } = useSelector(state => state.user)

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'cards' or 'table'

  const adminID = currentUser._id

  useEffect(() => {
    let isMounted = true;
    
    if (adminID && isMounted) {
      dispatch(getAllStudents(adminID));
    }
    
    return () => {
      isMounted = false;
    };
  }, [adminID, dispatch]);

  if (error) {
    console.log(error)
  }

  const [showPopup, setShowPopup] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    content: '',
    id: '',
    address: ''
  });

  const handleDelete = (id, address) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Confirmation',
      content: `Are you sure you want to delete this ${address.toLowerCase()}?`,
      id: id,
      address: address
    });
  };

  const deleteHandler = () => {
    const { id, address } = confirmDialog;
    dispatch(deleteUser(id, address))
      .then(() => {
        dispatch(getAllStudents(adminID));
        setConfirmDialog({ ...confirmDialog, open: false });
      })
  }

  // Filter and search logic
  const filteredStudents = Array.isArray(studentsList) ? studentsList.filter(student => {
    if (!student || !student.sclassName) return false;
    
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNum.toString().includes(searchTerm) ||
      (student.gender && student.gender.toLowerCase().includes(searchTerm.toLowerCase())) ||
      student.sclassName.sclassName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.sclassName._id === selectedClass;
    return matchesSearch && matchesClass;
  }) : [];

  // Get unique classes for filter with better deduplication
  const classOptions = useMemo(() => {
    const classMap = new Map();
    if (Array.isArray(studentsList) && studentsList.length > 0 && !loading) {
      studentsList.forEach(student => {
        if (student.sclassName && student.sclassName._id && student.sclassName.sclassName) {
          classMap.set(student.sclassName._id, student.sclassName.sclassName);
        }
      });
    }
    
    return Array.from(classMap.entries()).map(([id, name]) => ({
      id,
      name
    }));
  }, [studentsList, loading]);

  // Debug logging to identify duplicates
  console.log('Students List:', studentsList);
  console.log('Class Options:', classOptions);

  // Statistics
  const totalStudents = studentsList.length;
  const totalClasses = classOptions.length;
  const averageRollNumber = studentsList.length > 0 ? 
    Math.round(studentsList.reduce((sum, student) => sum + student.rollNum, 0) / studentsList.length) : 0;

  const handleStudentClick = (student) => {
    navigate("/Admin/students/student/" + student._id);
  };

  const handleAttendance = (studentId) => {
    navigate("/Admin/students/student/attendance/" + studentId);
  };

  const handleMarks = (studentId) => {
    navigate("/Admin/students/student/marks/" + studentId);
  };

  const studentColumns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
    { id: 'gender', label: 'Gender', minWidth: 100 },
    { id: 'sclassName', label: 'Class', minWidth: 170 },
  ]

  const studentRows = filteredStudents && filteredStudents.length > 0 && filteredStudents.map((student) => {
    return {
      name: student.name,
      rollNum: student.rollNum,
      gender: student.gender || 'Not specified',
      sclassName: student.sclassName.sclassName,
      id: student._id,
    };
  })

  const StudentButtonHaver = ({ row }) => {
    const actions = [
      { icon: <AssignmentIcon />, name: 'Take Attendance', action: () => handleAttendance(row.id) },
      { icon: <GradeIcon />, name: 'Provide Marks', action: () => handleMarks(row.id) },
    ];
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => handleDelete(row.id, "Student")} color="secondary">
          <DeleteIcon color="error" />
        </IconButton>
        <BlueButton variant="contained"
          onClick={() => navigate("/Admin/students/student/" + row.id)}>
          View
        </BlueButton>
        <ActionMenu actions={actions} />
      </Box>
    );
  };

  const ActionMenu = ({ actions }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <Tooltip title="Student Actions">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <h5>Actions</h5>
              <SpeedDialIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: styles.styledPaper,
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {actions.map((action, index) => (
            <MenuItem key={action.name || index} onClick={action.action}>
              <ListItemIcon fontSize="small">
                {action.icon}
              </ListItemIcon>
              {action.name}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  const actions = [
    {
      icon: <AddCardIcon color="primary" />, name: 'Add New Student',
      action: () => navigate("/Admin/addstudents")
    },
    {
      icon: <DeleteIcon color="error" />, name: 'Delete All Students',
      action: () => handleDelete(adminID, "Students")
    },
  ];

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress />
          <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
            Loading students...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GradientCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" sx={{ mb: 4, p: 3 }}>
            <Box>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>
                    Student Management
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                    Manage all students and their records
                </Typography>
                <Chip 
                    label={`Total Students: ${studentsList?.length || 0}`}
                    sx={{ 
                        background: 'rgba(255,255,255,0.2)', 
                        color: '#ffffff',
                        border: '1px solid rgba(255,255,255,0.3)'
                    }} 
                />
            </Box>
        </GradientCard>
      </motion.div>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Grow in={true} timeout={500}>
            <StatsCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontWeight: 500 }}>
                      Total Students
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {totalStudents}
                    </Typography>
                  </Box>
                  <GradientIcon color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                    <PersonIcon />
                  </GradientIcon>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                    +4% from last month
                  </Typography>
                </Box>
              </CardContent>
            </StatsCard>
          </Grow>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Grow in={true} timeout={700}>
            <StatsCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontWeight: 500 }}>
                      Active Classes
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {totalClasses}
                    </Typography>
                  </Box>
                  <GradientIcon color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
                    <ClassIcon />
                  </GradientIcon>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                    Well Distributed
                  </Typography>
                </Box>
              </CardContent>
            </StatsCard>
          </Grow>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Grow in={true} timeout={900}>
            <StatsCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontWeight: 500 }}>
                      Avg Roll Number
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {averageRollNumber}
                    </Typography>
                  </Box>
                  <GradientIcon color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
                    <GradeIcon />
                  </GradientIcon>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                    Balanced Distribution
                  </Typography>
                </Box>
              </CardContent>
            </StatsCard>
          </Grow>
        </Grid>
      </Grid>

      {/* Search and Filter Section */}
      <SearchContainer>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search students by name, roll number, gender, or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(102, 126, 234, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(102, 126, 234, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(102, 126, 234, 0.6)',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(102, 126, 234, 0.6)' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filter by Class</InputLabel>
              <Select
                value={selectedClass}
                label="Filter by Class"
                onChange={(e) => setSelectedClass(e.target.value)}
                disabled={loading || !Array.isArray(studentsList)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(102, 126, 234, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(102, 126, 234, 0.4)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(102, 126, 234, 0.6)',
                    },
                  },
                }}
              >
                <MenuItem value="all">All Classes</MenuItem>
                {!loading && Array.isArray(studentsList) && classOptions.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={viewMode === 'cards' ? 'outlined' : 'contained'}
                onClick={() => setViewMode('cards')}
                startIcon={<PersonIcon />}
                disabled={loading}
                sx={{
                  background: viewMode === 'cards' ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: viewMode === 'cards' ? 'rgba(102, 126, 234, 0.1)' : 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  }
                }}
              >
                Cards
              </Button>
              <Button
                variant={viewMode === 'table' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('table')}
                startIcon={<FilterListIcon />}
                disabled={loading}
                sx={{
                  background: viewMode === 'table' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                  '&:hover': {
                    background: viewMode === 'table' ? 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)' : 'rgba(102, 126, 234, 0.1)',
                  }
                }}
              >
                Table
              </Button>
            </Box>
          </Grid>
        </Grid>
        {loading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress sx={{ borderRadius: 1 }} />
          </Box>
        )}
      </SearchContainer>

      {response ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <StatsCard>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2, p: 4 }}>
              <Typography variant="h6" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                No Students Added Yet
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mb: 2 }}>
                Start by adding your first student to manage attendance and marks
              </Typography>
              <GreenButton
                variant="contained"
                onClick={() => navigate("/Admin/addstudents")}
                startIcon={<AddCardIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  borderRadius: '12px',
                  py: 1.5,
                  px: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #32d66a 0%, #27e6c6 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(67, 233, 123, 0.3)'
                  }
                }}
              >
                Add Your First Student
              </GreenButton>
            </Box>
          </StatsCard>
        </motion.div>
      ) : (
        <>
          {viewMode === 'cards' ? (
            // Card View
            <Grid container spacing={3}>
              {filteredStudents.map((student, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={student._id}>
                  <Fade in={true} timeout={500 + (index * 100)}>
                    <StudentCard onClick={() => handleStudentClick(student)}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                            <PersonIcon />
                          </Avatar>
                          <Typography variant="h6" component="div" noWrap>
                            {student.name}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Chip 
                            label={student.sclassName.sclassName}
                            color="primary"
                            variant="outlined"
                            size="small"
                            sx={{ mb: 1 }}
                          />
                          <Chip 
                            label={`Roll #${student.rollNum}`}
                            color="secondary"
                            variant="outlined"
                            size="small"
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Button 
                            variant="outlined" 
                            size="small"
                            startIcon={<AssignmentIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAttendance(student._id);
                            }}
                          >
                            Attendance
                          </Button>
                          <Button 
                            variant="outlined" 
                            size="small"
                            startIcon={<GradeIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarks(student._id);
                            }}
                          >
                            Marks
                          </Button>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Chip 
                            label={`Roll #${student.rollNum}`}
                            size="small"
                            color="info"
                          />
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(student._id, "Student");
                            }}
                          >
                            <DeleteIcon color="error" fontSize="small" />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </StudentCard>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          ) : (
            // Table View
            <StatsCard sx={{ 
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid rgba(102, 126, 234, 0.1)',
            }}>
              <CardContent sx={{ p: 3 }}>
                {Array.isArray(filteredStudents) && filteredStudents.length > 0 ? (
                  <Box sx={{ 
                    borderRadius: '16px', 
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                  }}>
                    <TableTemplate buttonHaver={StudentButtonHaver} columns={studentColumns} rows={studentRows} />
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No students available
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Add your first student to get started
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </StatsCard>
          )}
          
          {filteredStudents.length === 0 && searchTerm && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No students found matching "{searchTerm}"
              </Typography>
            </Box>
          )}
          
          <SpeedDialTemplate actions={actions} />
        </>
      )}
      
      <Popup setShowPopup={setShowPopup} showPopup={showPopup} />
      <ConfirmDialog
        open={confirmDialog.open}
        handleClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        handleConfirm={deleteHandler}
        title={confirmDialog.title}
        content={confirmDialog.content}
      />
    </Container>
  );
};

export default ShowStudents;

const styles = {
  styledPaper: {
    overflow: 'visible',
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    mt: 1.5,
    '& .MuiAvatar-root': {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: 'background.paper',
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0,
    },
  }
};
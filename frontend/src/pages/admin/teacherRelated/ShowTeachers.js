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
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import AddCardIcon from '@mui/icons-material/AddCard';
import ClassIcon from '@mui/icons-material/Class';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import SubjectIcon from '@mui/icons-material/Subject';
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

const TeacherCard = styled(Card)(({ theme }) => ({
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

const ShowTeachers = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const { teachersList, loading, error, response } = useSelector((state) => state.teacher);
  const { currentUser } = useSelector(state => state.user)

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'cards' or 'table'

  const adminID = currentUser._id

  useEffect(() => {
    let isMounted = true;
    
    if (adminID && isMounted) {
      dispatch(getAllTeachers(adminID));
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
        dispatch(getAllTeachers(adminID));
        setConfirmDialog({ ...confirmDialog, open: false });
      })
  }

  // Filter and search logic
  const filteredTeachers = Array.isArray(teachersList) ? teachersList.filter(teacher => {
    if (!teacher || !teacher.teachSclass) return false;
    
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (teacher.teachSubject?.subName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        teacher.teachSclass.sclassName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || teacher.teachSclass._id === selectedClass;
    return matchesSearch && matchesClass;
  }) : [];

  // Get unique classes for filter with better deduplication
  const classOptions = useMemo(() => {
    const classMap = new Map();
    if (Array.isArray(teachersList) && teachersList.length > 0 && !loading) {
      teachersList.forEach(teacher => {
        if (teacher.teachSclass && teacher.teachSclass._id && teacher.teachSclass.sclassName) {
          classMap.set(teacher.teachSclass._id, teacher.teachSclass.sclassName);
        }
      });
    }
    
    return Array.from(classMap.entries()).map(([id, name]) => ({
      id,
      name
    }));
  }, [teachersList, loading]);

  // Debug logging to identify duplicates
  console.log('Teachers List:', teachersList);
  console.log('Class Options:', classOptions);

  // Statistics
  const totalTeachers = teachersList.length;
  const totalClasses = classOptions.length;
  const teachersWithSubjects = teachersList.filter(teacher => teacher.teachSubject).length;

  const handleTeacherClick = (teacher) => {
    navigate("/Admin/teachers/teacher/" + teacher._id);
  };

  const teacherColumns = [
    { id: 'name', label: 'Teacher Name', minWidth: 170 },
    { id: 'subject', label: 'Subject', minWidth: 170 },
    { id: 'class', label: 'Class', minWidth: 170 },
  ]

  const teacherRows = filteredTeachers && filteredTeachers.length > 0 && filteredTeachers.map((teacher) => {
    return {
      name: teacher.name,
      subject: teacher.teachSubject ? teacher.teachSubject.subName : 'No Subject',
      class: teacher.teachSclass.sclassName,
      id: teacher._id,
    };
  })

  const TeachersButtonHaver = ({ row }) => {
    const actions = [
      { icon: <AssignmentIcon />, name: 'View Details', action: () => navigate("/Admin/teachers/teacher/" + row.id) },
      { icon: <SubjectIcon />, name: 'Assign Subject', action: () => navigate(`/Admin/teachers/choosesubject/${row.id}`) },
    ];
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => handleDelete(row.id, "Teacher")} color="secondary">
          <DeleteIcon color="error" />
        </IconButton>
        <BlueButton variant="contained"
          onClick={() => navigate("/Admin/teachers/teacher/" + row.id)}>
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
          <Tooltip title="Teacher Actions">
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
      icon: <AddCardIcon color="primary" />, name: 'Add New Teacher',
      action: () => navigate("/Admin/teachers/chooseclass")
    },
    {
      icon: <DeleteIcon color="error" />, name: 'Delete All Teachers',
      action: () => handleDelete(adminID, "Teachers")
    },
  ];

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress />
          <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
            Loading teachers...
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
                    Teacher Management
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                    Manage all teachers and their assignments
                </Typography>
                <Chip 
                    label={`Total Teachers: ${teachersList?.length || 0}`}
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
                      Total Teachers
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {totalTeachers}
                    </Typography>
                  </Box>
                  <GradientIcon color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                    <PersonIcon />
                  </GradientIcon>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                    +2% from last month
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
                      With Subjects
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {teachersWithSubjects}
                    </Typography>
                  </Box>
                  <GradientIcon color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
                    <SubjectIcon />
                  </GradientIcon>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                    {totalTeachers > 0 ? `${Math.round((teachersWithSubjects / totalTeachers) * 100)}% assigned` : 'No teachers'}
                  </Typography>
                </Box>
              </CardContent>
            </StatsCard>
          </Grow>
        </Grid>
      </Grid>

      {/* Search and Filter Section */}
      <SearchContainer>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search teachers by name, subject, or class..."
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
                disabled={loading || !Array.isArray(teachersList)}
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
                {!loading && Array.isArray(teachersList) && classOptions.map((cls) => (
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
                No Teachers Added Yet
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mb: 2 }}>
                Start by adding your first teacher to manage classes and subjects
              </Typography>
              <GreenButton
                variant="contained"
                onClick={() => navigate("/Admin/teachers/chooseclass")}
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
                Add Your First Teacher
              </GreenButton>
            </Box>
          </StatsCard>
        </motion.div>
      ) : (
        <>
          {viewMode === 'cards' ? (
            // Card View
            <Grid container spacing={3}>
              {filteredTeachers.map((teacher, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={teacher._id}>
                  <Fade in={true} timeout={500 + (index * 100)}>
                    <TeacherCard onClick={() => handleTeacherClick(teacher)}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                            <PersonIcon />
                          </Avatar>
                          <Typography variant="h6" component="div" noWrap>
                            {teacher.name}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Chip 
                            label={teacher.teachSclass.sclassName}
                            color="primary"
                            variant="outlined"
                            size="small"
                            sx={{ mb: 1 }}
                          />
                          {teacher.teachSubject ? (
                            <Chip 
                              label={teacher.teachSubject.subName}
                              color="secondary"
                              variant="outlined"
                              size="small"
                            />
                          ) : (
                            <Button 
                              variant="contained" 
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/Admin/teachers/choosesubject/${teacher.teachSclass._id}/${teacher._id}`);
                              }}
                              startIcon={<SubjectIcon />}
                            >
                              Add Subject
                            </Button>
                          )}
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Chip 
                            label={teacher.teachSubject ? 'Subject Assigned' : 'No Subject'}
                            size="small"
                            color={teacher.teachSubject ? 'success' : 'warning'}
                          />
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(teacher._id, "Teacher");
                            }}
                          >
                            <DeleteIcon color="error" fontSize="small" />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </TeacherCard>
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
                {Array.isArray(filteredTeachers) && filteredTeachers.length > 0 ? (
                  <Box sx={{ 
                    borderRadius: '16px', 
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                  }}>
                    <TableTemplate buttonHaver={TeachersButtonHaver} columns={teacherColumns} rows={teacherRows} />
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No teachers available
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Add your first teacher to get started
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </StatsCard>
          )}
          
          {filteredTeachers.length === 0 && searchTerm && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No teachers found matching "{searchTerm}"
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

export default ShowTeachers;

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
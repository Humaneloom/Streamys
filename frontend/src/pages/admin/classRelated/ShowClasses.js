import React, { useEffect, useState } from 'react';
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
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AddCardIcon from '@mui/icons-material/AddCard';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
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

const ClassCard = styled(Card)(({ theme }) => ({
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

const ShowClasses = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector(state => state.user)

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'cards' or 'table'

  const adminID = currentUser._id

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
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
        dispatch(getAllSclasses(adminID, "Sclass"));
        setConfirmDialog({ ...confirmDialog, open: false });
      })
  }

  // Filter and search logic
  const filteredClasses = sclassesList.filter(sclass => {
    return sclass.sclassName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Statistics
  const totalClasses = sclassesList.length;
  const activeClasses = sclassesList.length; // All classes are considered active
  const averageStudentsPerClass = totalClasses > 0 ? Math.round(100 / totalClasses) : 0; // Sample calculation

  const handleClassClick = (sclass) => {
    navigate("/Admin/classes/class/" + sclass._id);
  };

  const sclassColumns = [
    { id: 'name', label: 'Class Name', minWidth: 170 },
  ]

  const sclassRows = filteredClasses && filteredClasses.length > 0 && filteredClasses.map((sclass) => {
    return {
      name: sclass.sclassName,
      id: sclass._id,
    };
  })

  const SclassButtonHaver = ({ row }) => {
    const actions = [
      { icon: <PostAddIcon />, name: 'Add Subjects', action: () => navigate("/Admin/addsubject/" + row.id) },
      { icon: <PersonAddAlt1Icon />, name: 'Add Student', action: () => navigate("/Admin/class/addstudents/" + row.id) },
    ];
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => handleDelete(row.id, "Sclass")} color="secondary">
          <DeleteIcon color="error" />
        </IconButton>
        <BlueButton variant="contained"
          onClick={() => navigate("/Admin/classes/class/" + row.id)}>
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
          <Tooltip title="Add Students & Subjects">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <h5>Add</h5>
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
      icon: <AddCardIcon color="primary" />, name: 'Add New Class',
      action: () => navigate("/Admin/addclass")
    },
    {
      icon: <DeleteIcon color="error" />, name: 'Delete All Classes',
      action: () => handleDelete(adminID, "Sclasses")
    },
  ];

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress />
          <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
            Loading classes...
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
                    Class Management
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                    Manage all classes and their details
                </Typography>
                <Chip 
                    label={`Total Classes: ${sclassesList?.length || 0}`}
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
                      Total Classes
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {totalClasses}
                    </Typography>
                  </Box>
                  <GradientIcon color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                    <ClassIcon />
                  </GradientIcon>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                    +5% from last month
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
                      {activeClasses}
                    </Typography>
                  </Box>
                  <GradientIcon color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
                    <SchoolIcon />
                  </GradientIcon>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                    100% Active
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
                      Avg Students/Class
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {averageStudentsPerClass}
                    </Typography>
                  </Box>
                  <GradientIcon color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
                    <GroupIcon />
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
      </Grid>

      {/* Search and Filter Section */}
      <SearchContainer>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={viewMode === 'cards' ? 'outlined' : 'contained'}
                onClick={() => setViewMode('cards')}
                startIcon={<ClassIcon />}
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
      </SearchContainer>

      {getresponse ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <StatsCard>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2, p: 4 }}>
              <Typography variant="h6" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                No Classes Added Yet
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mb: 2 }}>
                Start by adding your first class to manage students and subjects
              </Typography>
              <GreenButton
                variant="contained"
                onClick={() => navigate("/Admin/addclass")}
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
                Add Your First Class
              </GreenButton>
            </Box>
          </StatsCard>
        </motion.div>
      ) : (
        <>
          {viewMode === 'cards' ? (
            // Card View
            <Grid container spacing={3}>
              {filteredClasses.map((sclass, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={sclass._id}>
                  <Fade in={true} timeout={500 + (index * 100)}>
                    <ClassCard onClick={() => handleClassClick(sclass)}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                            <ClassIcon />
                          </Avatar>
                          <Typography variant="h6" component="div" noWrap>
                            {sclass.sclassName}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Chip 
                            label="Active Class"
                            color="success"
                            variant="outlined"
                            size="small"
                            sx={{ mb: 1 }}
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Button 
                            variant="outlined" 
                            size="small"
                            startIcon={<PersonAddAlt1Icon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/Admin/class/addstudents/" + sclass._id);
                            }}
                          >
                            Add Students
                          </Button>
                          <Button 
                            variant="outlined" 
                            size="small"
                            startIcon={<AssignmentIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/Admin/addsubject/" + sclass._id);
                            }}
                          >
                            Add Subjects
                          </Button>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Chip 
                            label={sclass.sclassName}
                            size="small"
                            color="primary"
                          />
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(sclass._id, "Sclass");
                            }}
                          >
                            <DeleteIcon color="error" fontSize="small" />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </ClassCard>
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
                {Array.isArray(filteredClasses) && filteredClasses.length > 0 ? (
                  <Box sx={{ 
                    borderRadius: '16px', 
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                  }}>
                    <TableTemplate buttonHaver={SclassButtonHaver} columns={sclassColumns} rows={sclassRows} />
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No classes available
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Add your first class to get started
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </StatsCard>
          )}
          
          {filteredClasses.length === 0 && searchTerm && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No classes found matching "{searchTerm}"
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

export default ShowClasses;

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
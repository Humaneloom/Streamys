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
    FormControl,
    InputLabel,
    Select,
    Fade,
    Checkbox
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Search as SearchIcon,
    FilterList as FilterListIcon,
    Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllComplains } from '../../../redux/complainRelated/complainHandle';
import TableTemplate from '../../../components/TableTemplate';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import AddCardIcon from '@mui/icons-material/AddCard';
import ReportIcon from '@mui/icons-material/Report';
import PersonIcon from '@mui/icons-material/Person';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
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
    background: 'linear-gradient(135deg, #ffffff 0%, #e8ecf1 100%)',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
    border: '1px solid rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease-in-out',
    overflow: 'visible',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    },
}));

const SearchContainer = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #ffffff 0%, #e8ecf1 100%)',
    borderRadius: '16px',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
    border: '1px solid rgba(0,0,0,0.08)',
}));

const ComplainCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #ffffff 0%, #e8ecf1 100%)',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
    border: '1px solid rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
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

const SeeComplains = () => {
  const dispatch = useDispatch();
  const { complainsList, loading, error, response } = useSelector((state) => state.complain);
  const { currentUser } = useSelector(state => state.user)

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [resolvedComplaints, setResolvedComplaints] = useState(new Set());

  const adminID = currentUser._id

  useEffect(() => {
    dispatch(getAllComplains(adminID, "Complain"));
  }, [adminID, dispatch]);

  if (error) {
    console.log(error)
  }

  // Filter and search logic
  const filteredComplaints = complainsList.filter(complain => {
    const matchesSearch = complain.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complain.complaint.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedStatus === 'all') return matchesSearch;
    if (selectedStatus === 'resolved') return matchesSearch && resolvedComplaints.has(complain._id);
    if (selectedStatus === 'pending') return matchesSearch && !resolvedComplaints.has(complain._id);
    
    return matchesSearch;
  });

  // Statistics
  const totalComplaints = complainsList.length;
  const resolvedCount = resolvedComplaints.size;
  const pendingCount = totalComplaints - resolvedCount;

  const handleResolveComplaint = (complaintId) => {
    setResolvedComplaints(prev => {
      const newSet = new Set(prev);
      if (newSet.has(complaintId)) {
        newSet.delete(complaintId);
      } else {
        newSet.add(complaintId);
      }
      return newSet;
    });
  };

  const handleComplaintClick = (complain) => {
    // You can implement a modal or navigate to a detailed view
    console.log('Complaint clicked:', complain);
  };

  const complainColumns = [
    { id: 'user', label: 'User', minWidth: 170 },
    { id: 'complaint', label: 'Complaint', minWidth: 100 },
    { id: 'date', label: 'Date', minWidth: 170 },
    { id: 'status', label: 'Status', minWidth: 100 },
  ];

  const complainRows = filteredComplaints && filteredComplaints.length > 0 && filteredComplaints.map((complain) => {
    const date = new Date(complain.date);
    const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
    const isResolved = resolvedComplaints.has(complain._id);
    
    return {
      user: complain.user.name,
      complaint: complain.complaint,
      date: dateString,
      status: isResolved ? 'Resolved' : 'Pending',
      id: complain._id,
    };
  });

  const ComplainButtonHaver = ({ row }) => {
    const isResolved = resolvedComplaints.has(row.id);
    const actions = [
      { icon: <AssignmentIcon />, name: 'View Details', action: () => handleComplaintClick({ _id: row.id }) },
      { icon: <DateRangeIcon />, name: 'Mark as Resolved', action: () => handleResolveComplaint(row.id) },
    ];
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Checkbox 
          checked={isResolved}
          onChange={() => handleResolveComplaint(row.id)}
          icon={<WarningIcon color="warning" />}
          checkedIcon={<CheckCircleIcon color="success" />}
        />
        <Chip 
          label={isResolved ? 'Resolved' : 'Pending'}
          color={isResolved ? 'success' : 'warning'}
          size="small"
        />
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
          <Tooltip title="Complaint Actions">
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
      icon: <AddCardIcon color="primary" />, name: 'Add New Complaint',
      action: () => console.log('Add complaint functionality')
    },
    {
      icon: <CheckCircleIcon color="success" />, name: 'Mark All Resolved',
      action: () => {
        const allIds = complainsList.map(complain => complain._id);
        setResolvedComplaints(new Set(allIds));
      }
    },
  ];

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress />
          <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
            Loading complaints...
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
              Complaint Management
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
              Review and manage student complaints
            </Typography>
            <Chip 
              label={`Total Complaints: ${complainsList?.length || 0}`}
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
                      Total Complaints
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {totalComplaints}
                    </Typography>
                  </Box>
                  <GradientIcon color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                    <ReportIcon />
                  </GradientIcon>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                    {totalComplaints > 0 ? `${Math.round((resolvedCount / totalComplaints) * 100)}% resolved` : 'No complaints'}
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
                      Resolved
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {resolvedCount}
                    </Typography>
                  </Box>
                  <GradientIcon color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
                    <CheckCircleIcon />
                  </GradientIcon>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                    Successfully Handled
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
                      Pending
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {pendingCount}
                    </Typography>
                  </Box>
                  <GradientIcon color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
                    <WarningIcon />
                  </GradientIcon>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#ff9800', fontWeight: 600 }}>
                    Needs Attention
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
              variant="outlined"
              placeholder="Search complaints by user or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={selectedStatus}
                label="Filter by Status"
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <MenuItem value="all">All Complaints</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={viewMode === 'cards' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('cards')}
                startIcon={<ReportIcon />}
                sx={{
                  background: viewMode === 'cards' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                  '&:hover': {
                    background: viewMode === 'cards' ? 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)' : 'rgba(102, 126, 234, 0.1)',
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

      {response ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <StatsCard>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2, p: 4 }}>
              <Typography variant="h6" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                No Complaints Right Now
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mb: 2 }}>
                Great! All issues have been resolved or no complaints have been submitted yet
              </Typography>
              <Chip 
                label="All Clear" 
                color="success" 
                icon={<CheckCircleIcon />}
                sx={{ fontSize: '1rem', py: 1 }}
              />
            </Box>
          </StatsCard>
        </motion.div>
      ) : (
        <>
          {viewMode === 'cards' ? (
            // Card View
            <Grid container spacing={3}>
              {filteredComplaints.map((complain, index) => {
                const date = new Date(complain.date);
                const dateString = date.toString() !== "Invalid Date" ? 
                  date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  }) : "Invalid Date";
                const isResolved = resolvedComplaints.has(complain._id);
                
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={complain._id}>
                    <Fade in={true} timeout={500 + (index * 100)}>
                      <ComplainCard onClick={() => handleComplaintClick(complain)}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                              <PersonIcon />
                            </Avatar>
                            <Typography variant="h6" component="div" noWrap>
                              {complain.user.name}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ mb: 2 }}>
                            <Chip 
                              label={dateString}
                              color="primary"
                              variant="outlined"
                              size="small"
                              sx={{ mb: 1 }}
                            />
                            <Chip 
                              label={isResolved ? 'Resolved' : 'Pending'}
                              color={isResolved ? 'success' : 'warning'}
                              variant="outlined"
                              size="small"
                              icon={isResolved ? <CheckCircleIcon /> : <WarningIcon />}
                            />
                          </Box>
                          
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              mb: 2, 
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {complain.complaint}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Chip 
                              label={dateString}
                              size="small"
                              color="secondary"
                            />
                            <Checkbox 
                              checked={isResolved}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleResolveComplaint(complain._id);
                              }}
                              icon={<WarningIcon color="warning" />}
                              checkedIcon={<CheckCircleIcon color="success" />}
                            />
                          </Box>
                        </CardContent>
                      </ComplainCard>
                    </Fade>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            // Table View
            <StatsCard>
              <CardContent sx={{ p: 3 }}>
                {Array.isArray(filteredComplaints) && filteredComplaints.length > 0 && (
                  <TableTemplate buttonHaver={ComplainButtonHaver} columns={complainColumns} rows={complainRows} />
                )}
              </CardContent>
            </StatsCard>
          )}
          
          {filteredComplaints.length === 0 && searchTerm && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No complaints found matching "{searchTerm}"
              </Typography>
            </Box>
          )}
          
          <SpeedDialTemplate actions={actions} />
        </>
      )}
      
      <Popup setShowPopup={() => {}} showPopup={false} />
      <ConfirmDialog
        open={false}
        handleClose={() => {}}
        handleConfirm={() => {}}
        title=""
        content=""
      />
    </Container>
  );
};

export default SeeComplains;

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
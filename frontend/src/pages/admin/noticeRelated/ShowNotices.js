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
    Fade
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Delete as DeleteIcon,
    Search as SearchIcon,
    FilterList as FilterListIcon,
    Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { getAllNotices } from '../../../redux/noticeRelated/noticeHandle';
import { GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AddCardIcon from '@mui/icons-material/AddCard';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import DateRangeIcon from '@mui/icons-material/DateRange';
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

const NoticeCard = styled(Card)(({ theme }) => ({
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

const ShowNotices = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const { noticesList, loading, error, response } = useSelector((state) => state.notice);
  const { currentUser } = useSelector(state => state.user)

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'


  const adminID = currentUser._id

  useEffect(() => {
    dispatch(getAllNotices(adminID, "Notice"));
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
        dispatch(getAllNotices(adminID, "Notice"));
        setConfirmDialog({ ...confirmDialog, open: false });
      })
  }

  // Filter and search logic
  const filteredNotices = noticesList.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        notice.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedMonth === 'all') return matchesSearch;
    
    const noticeDate = new Date(notice.date);
    const noticeMonth = noticeDate.getMonth() + 1; // getMonth() returns 0-11
    const selectedMonthNum = parseInt(selectedMonth);
    
    return matchesSearch && noticeMonth === selectedMonthNum;
  });

  // Get unique months for filter
  const uniqueMonths = [...new Set(noticesList.map(notice => {
    const date = new Date(notice.date);
    return date.getMonth() + 1;
  }))];

  const monthOptions = uniqueMonths.map(month => ({
    value: month,
    label: new Date(2024, month - 1).toLocaleString('default', { month: 'long' })
  }));

  // Statistics
  const totalNotices = noticesList.length;
  const thisMonthNotices = noticesList.filter(notice => {
    const noticeDate = new Date(notice.date);
    const currentDate = new Date();
    return noticeDate.getMonth() === currentDate.getMonth() && 
           noticeDate.getFullYear() === currentDate.getFullYear();
  }).length;
  const averageNoticesPerMonth = totalNotices > 0 ? 
    Math.round(totalNotices / Math.max(uniqueMonths.length, 1)) : 0;

  const handleNoticeClick = (notice) => {
    // You can implement a modal or navigate to a detailed view
    console.log('Notice clicked:', notice);
  };

  const noticeColumns = [
    { id: 'title', label: 'Title', minWidth: 170 },
    { id: 'details', label: 'Details', minWidth: 100 },
    { id: 'date', label: 'Date', minWidth: 170 },
  ];

  const noticeRows = filteredNotices && filteredNotices.length > 0 && filteredNotices.map((notice) => {
    const date = new Date(notice.date);
    const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
    return {
      title: notice.title,
      details: notice.details,
      date: dateString,
      id: notice._id,
    };
  });

  const NoticeButtonHaver = ({ row }) => {
    const actions = [
      { icon: <AssignmentIcon />, name: 'View Details', action: () => handleNoticeClick({ _id: row.id }) },
      { icon: <DateRangeIcon />, name: 'Edit Notice', action: () => navigate("/Admin/addnotice") },
    ];
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => handleDelete(row.id, "Notice")} color="secondary">
          <DeleteIcon color="error" />
        </IconButton>
        <GreenButton variant="contained"
          onClick={() => handleNoticeClick({ _id: row.id })}>
          View
        </GreenButton>
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
          <Tooltip title="Notice Actions">
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
      icon: <AddCardIcon color="primary" />, name: 'Add New Notice',
      action: () => navigate("/Admin/addnotice")
    },
    {
      icon: <DeleteIcon color="error" />, name: 'Delete All Notices',
      action: () => handleDelete(adminID, "Notices")
    },
  ];

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress />
          <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
            Loading notices...
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
                    Notice Management
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                    Manage all notices and announcements
                </Typography>
                <Chip 
                    label={`Total Notices: ${noticesList?.length || 0}`}
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
                      Total Notices
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {totalNotices}
                    </Typography>
                  </Box>
                  <GradientIcon color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                    <AnnouncementIcon />
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
                      This Month
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {thisMonthNotices}
                    </Typography>
                  </Box>
                  <GradientIcon color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
                    <DateRangeIcon />
                  </GradientIcon>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                    Active Communication
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
                      Avg per Month
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {averageNoticesPerMonth}
                    </Typography>
                  </Box>
                  <GradientIcon color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
                    <NoteAddIcon />
                  </GradientIcon>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                    Consistent Updates
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
              placeholder="Search notices by title or details..."
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
              <InputLabel>Filter by Month</InputLabel>
              <Select
                value={selectedMonth}
                label="Filter by Month"
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <MenuItem value="all">All Months</MenuItem>
                {monthOptions.map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={viewMode === 'cards' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('cards')}
                startIcon={<AnnouncementIcon />}
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
                No Notices Added Yet
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mb: 2 }}>
                Start by adding your first notice to communicate with students and staff
              </Typography>
              <GreenButton
                variant="contained"
                onClick={() => navigate("/Admin/addnotice")}
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
                Add Your First Notice
              </GreenButton>
            </Box>
          </StatsCard>
        </motion.div>
      ) : (
        <>
          {viewMode === 'cards' ? (
            // Card View
            <Grid container spacing={3}>
              {filteredNotices.map((notice, index) => {
                const date = new Date(notice.date);
                const dateString = date.toString() !== "Invalid Date" ? 
                  date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  }) : "Invalid Date";
                
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={notice._id}>
                    <Fade in={true} timeout={500 + (index * 100)}>
                      <NoticeCard onClick={() => handleNoticeClick(notice)}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                              <AnnouncementIcon />
                            </Avatar>
                            <Typography variant="h6" component="div" noWrap>
                              {notice.title}
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
                            {notice.details}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Chip 
                              label={dateString}
                              size="small"
                              color="secondary"
                            />
                            <IconButton 
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(notice._id, "Notice");
                              }}
                            >
                              <DeleteIcon color="error" fontSize="small" />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </NoticeCard>
                    </Fade>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            // Table View
            <StatsCard>
              <CardContent sx={{ p: 3 }}>
                {Array.isArray(filteredNotices) && filteredNotices.length > 0 && (
                  <TableTemplate buttonHaver={NoticeButtonHaver} columns={noticeColumns} rows={noticeRows} />
                )}
              </CardContent>
            </StatsCard>
          )}
          
          {filteredNotices.length === 0 && searchTerm && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No notices found matching "{searchTerm}"
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

export default ShowNotices;

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
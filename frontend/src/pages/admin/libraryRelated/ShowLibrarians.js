import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { 
  CircularProgress, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Grid, 
  Avatar, 
  IconButton, 
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Fade
} from '@mui/material';
import { 
  Add as AddIcon, 
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled Components for Modern Design
const GradientCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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

const LibrarianCard = styled(Card)(({ theme }) => ({
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

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
  border: '1px solid rgba(0,0,0,0.08)',
  overflow: 'hidden',
  '& .MuiTableHead-root': {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '& .MuiTableCell-head': {
      color: '#ffffff',
      fontWeight: 600,
      fontSize: '1rem',
    }
  },
  '& .MuiTableRow-root:hover': {
    background: 'rgba(102, 126, 234, 0.05)',
  }
}));

const ShowLibrarians = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { currentUser } = useSelector(state => state.user)
  const { userDetails, status } = useSelector(state => state.user)

  // Debug logging
  console.log('Users List:', userDetails);
  console.log('Status:', status);

  // Ensure userDetails is always an array
  const safeUserDetails = Array.isArray(userDetails) ? userDetails : [];

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    console.log('Current User:', currentUser);
    console.log('School Name:', currentUser?.schoolName);
    if (currentUser?.schoolName) {
      dispatch(getUsers(currentUser.schoolName, "Librarian"))
    }
  }, [dispatch, currentUser?.schoolName])

  useEffect(() => {
    if (status === 'deleted') {
      dispatch(underControl())
      setShowPopup(true)
      setMessage("Librarian deleted successfully")
      setLoader(false)
    }
    else if (status === 'failed') {
      setMessage("Network Error")
      setShowPopup(true)
      setLoader(false)
    }
    else if (status === 'error') {
      setMessage("Network Error")
      setShowPopup(true)
      setLoader(false)
    }
  }, [status, dispatch])

  const deleteHandler = (id) => {
    setLoader(true)
    dispatch(deleteUser(id, "Librarian"))
  }

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      <Fade in timeout={800}>
        <Box>
          {/* Header Section */}
          <GradientCard sx={{ mb: 4, p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>
                  Library Personnel Management
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 400 }}>
                  Manage your school's library team
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={() => {
                    if (currentUser?.schoolName) {
                      dispatch(getUsers(currentUser.schoolName, "Librarian"))
                    }
                  }}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    color: '#ffffff',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: '#ffffff',
                      background: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/Admin/addlibrarian')}
                  sx={{
                    background: 'rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.3)',
                    }
                  }}
                >
                  Add Library Personnel
                </Button>
              </Box>
            </Box>
          </GradientCard>

          {/* Stats Section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <GradientIcon sx={{ mx: 'auto', mb: 2 }}>
                    <PersonIcon />
                  </GradientIcon>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                    {safeUserDetails.length || 0}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                    Total Personnel
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <GradientIcon color="linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" sx={{ mx: 'auto', mb: 2 }}>
                    <BusinessIcon />
                  </GradientIcon>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                    {currentUser?.schoolName || 'N/A'}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                    School Name
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <GradientIcon color="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" sx={{ mx: 'auto', mb: 2 }}>
                    <EmailIcon />
                  </GradientIcon>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                    {safeUserDetails.filter(f => f.email).length || 0}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                    Active Accounts
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <GradientIcon color="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" sx={{ mx: 'auto', mb: 2 }}>
                    <PhoneIcon />
                  </GradientIcon>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                    {safeUserDetails.filter(f => f.phone).length || 0}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                    Contact Info
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
          </Grid>

          {/* Library Personnel List */}
          {status === 'loading' ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <CircularProgress size={60} sx={{ color: '#667eea' }} />
            </Box>
          ) : safeUserDetails.length > 0 ? (
            <Box>
              {/* Table View */}
              <StyledTableContainer component={Paper} sx={{ mb: 4 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {safeUserDetails.map((librarian, index) => (
                      <TableRow key={librarian._id} sx={{ '&:hover': { background: 'rgba(102, 126, 234, 0.05)' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: '#667eea', width: 40, height: 40 }}>
                              {librarian.name?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {librarian.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon sx={{ fontSize: 16, color: '#667eea' }} />
                            <Typography variant="body2">{librarian.email}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon sx={{ fontSize: 16, color: '#667eea' }} />
                            <Typography variant="body2">{librarian.phone}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={librarian.department} 
                            size="small" 
                            sx={{ 
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: '#ffffff',
                              fontWeight: 500
                            }} 
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Delete Library Personnel">
                            <IconButton
                              onClick={() => deleteHandler(librarian._id)}
                              disabled={loader}
                              sx={{
                                color: '#e74c3c',
                                '&:hover': {
                                  background: 'rgba(231, 76, 60, 0.1)',
                                }
                              }}
                            >
                              {loader ? (
                                <CircularProgress size={20} color="inherit" />
                              ) : (
                                <DeleteIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>

              {/* Card View */}
              <Grid container spacing={3}>
                {safeUserDetails.map((librarian, index) => (
                  <Grid item xs={12} sm={6} md={4} key={librarian._id}>
                    <LibrarianCard>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Avatar sx={{ bgcolor: '#667eea', width: 50, height: 50, fontSize: '1.5rem' }}>
                            {librarian.name?.charAt(0)?.toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {librarian.name}
                            </Typography>
                            <Chip 
                              label={librarian.department} 
                              size="small" 
                              sx={{ 
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: '#ffffff',
                                fontWeight: 500
                              }} 
                            />
                          </Box>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <EmailIcon sx={{ fontSize: 16, color: '#667eea' }} />
                            <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                              {librarian.email}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon sx={{ fontSize: 16, color: '#667eea' }} />
                            <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                              {librarian.phone}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Tooltip title="Delete Library Personnel">
                            <IconButton
                              onClick={() => deleteHandler(librarian._id)}
                              disabled={loader}
                              sx={{
                                color: '#e74c3c',
                                '&:hover': {
                                  background: 'rgba(231, 76, 60, 0.1)',
                                }
                              }}
                            >
                              {loader ? (
                                <CircularProgress size={20} color="inherit" />
                              ) : (
                                <DeleteIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </LibrarianCard>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Box sx={{ 
              textAlign: 'center', 
              py: 8, 
              px: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #e8ecf1 100%)',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
            }}>
              <GradientIcon sx={{ mx: 'auto', mb: 3 }}>
                <PersonIcon />
              </GradientIcon>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#2c3e50', mb: 2 }}>
                No Library Personnel Found
              </Typography>
              <Typography variant="body1" sx={{ color: '#7f8c8d', mb: 3, maxWidth: '400px', mx: 'auto' }}>
                Get started by adding your first library personnel to manage your school's library operations.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/Admin/addlibrarian')}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  }
                }}
              >
                Add First Library Personnel
              </Button>
            </Box>
          )}
        </Box>
      </Fade>
      <Popup showPopup={showPopup} setShowPopup={setShowPopup} message={message} />
    </Box>
  )
}

export default ShowLibrarians

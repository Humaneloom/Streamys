import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  TextField, 
  Button, 
  IconButton, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Fade,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { 
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  AttachMoney as MoneyIcon,
  School as SchoolIcon,
  Class as ClassIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import axios from 'axios';

// Styled Components
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

const FeeCard = styled(Card)(({ theme }) => ({
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
    },
    '& .fee-label': {
      color: 'rgba(255, 255, 255, 0.9) !important',
    },
    '& .fee-value': {
      color: '#ffffff !important',
      fontWeight: '600 !important',
    },
    '& .class-name': {
      color: '#ffffff !important',
    },
    '& .fee-chip': {
      background: 'rgba(255, 255, 255, 0.2) !important',
      color: '#ffffff !important',
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

const FeeManagement = () => {
  const [feeStructure, setFeeStructure] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { currentUser } = useSelector(state => state.user);

  // Fetch fee structures from database
  const fetchFeeStructures = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/FeeStructures/${currentUser.schoolName}`);
      setFeeStructure(response.data);
    } catch (error) {
      console.error('Error fetching fee structures:', error);
      setSnackbar({ open: true, message: 'Error fetching fee structures', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Initialize default fee structures if none exist
  const initializeFeeStructures = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/FeeStructures/${currentUser.schoolName}/initialize`);
      fetchFeeStructures();
      setSnackbar({ open: true, message: 'Default fee structures initialized!', severity: 'success' });
    } catch (error) {
      console.error('Error initializing fee structures:', error);
      setSnackbar({ open: true, message: 'Error initializing fee structures', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchFeeStructures();
  }, [currentUser.schoolName]);

  // Calculate totals
  const totalRevenue = feeStructure.reduce((sum, fee) => sum + fee.total, 0);
  const averageFee = feeStructure.length > 0 ? Math.round(totalRevenue / feeStructure.length) : 0;

  const handleEdit = (fee) => {
    setEditingId(fee._id);
    setEditData({ ...fee });
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        monthlyFee: editData.monthlyFee,
        admissionFee: editData.admissionFee,
        examFee: editData.examFee,
        otherFees: editData.otherFees
      };
      
      await axios.put(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/FeeStructures/${editingId}`, updatedData);
      
      setEditingId(null);
      setEditData({});
      fetchFeeStructures(); // Refresh the data
      setSnackbar({ open: true, message: 'Fee structure updated successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error updating fee structure:', error);
      setSnackbar({ open: true, message: 'Error updating fee structure', severity: 'error' });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: parseInt(value) || 0 }));
  };

  const handleAddNewClass = () => {
    setOpenDialog(true);
  };

  const handleAddClass = async () => {
    try {
      const newClassData = {
        className: editData.className,
        monthlyFee: editData.monthlyFee || 0,
        admissionFee: editData.admissionFee || 0,
        examFee: editData.examFee || 0,
        otherFees: editData.otherFees || 0
      };
      
      await axios.post(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/FeeStructures/${currentUser.schoolName}`, newClassData);
      
      setOpenDialog(false);
      setEditData({});
      fetchFeeStructures(); // Refresh the data
      setSnackbar({ open: true, message: 'New class fee structure added!', severity: 'success' });
    } catch (error) {
      console.error('Error adding fee structure:', error);
      setSnackbar({ open: true, message: 'Error adding fee structure', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/FeeStructures/${id}`);
      fetchFeeStructures(); // Refresh the data
      setSnackbar({ open: true, message: 'Fee structure deleted successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error deleting fee structure:', error);
      setSnackbar({ open: true, message: 'Error deleting fee structure', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      <Fade in timeout={800}>
        <Box>
          {/* Header Section */}
          <GradientCard sx={{ mb: 4, p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>
                  Fee Structure Management
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 400 }}>
                  Set and manage fees for each class
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddNewClass}
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
                Add New Class
              </Button>
            </Box>
          </GradientCard>

          {/* Stats Section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <GradientIcon sx={{ mx: 'auto', mb: 2 }}>
                    <SchoolIcon />
                  </GradientIcon>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                    {feeStructure.length}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                    Total Classes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <GradientIcon color="linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" sx={{ mx: 'auto', mb: 2 }}>
                    <MoneyIcon />
                  </GradientIcon>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                    ₹{totalRevenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                    Total Revenue
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <GradientIcon color="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" sx={{ mx: 'auto', mb: 2 }}>
                    <ClassIcon />
                  </GradientIcon>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                    ₹{averageFee.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                    Average Fee
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <GradientIcon color="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" sx={{ mx: 'auto', mb: 2 }}>
                    <MoneyIcon />
                  </GradientIcon>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                    ₹{feeStructure.length > 0 ? Math.max(...feeStructure.map(f => f.total)).toLocaleString() : '0'}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                    Highest Fee
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Fee Structure Table */}
          <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', mb: 4 }}>
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Class</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Monthly Fee</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Admission Fee</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Exam Fee</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Other Fees</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Total</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }} align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : feeStructure.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Box sx={{ py: 3 }}>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                              No fee structures found
                            </Typography>
                            <Button
                              variant="contained"
                              onClick={initializeFeeStructures}
                              sx={{ mt: 2 }}
                            >
                              Initialize Default Fee Structures
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      feeStructure.map((fee) => (
                        <TableRow key={fee._id} sx={{ '&:hover': { background: 'rgba(102, 126, 234, 0.05)' } }}>
                          <TableCell>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {fee.className}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {editingId === fee._id ? (
                              <TextField
                                size="small"
                                value={editData.monthlyFee || ''}
                                onChange={(e) => handleInputChange('monthlyFee', e.target.value)}
                                sx={{ width: 100 }}
                              />
                            ) : (
                              <Typography variant="body2">₹{fee.monthlyFee.toLocaleString()}</Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingId === fee._id ? (
                              <TextField
                                size="small"
                                value={editData.admissionFee || ''}
                                onChange={(e) => handleInputChange('admissionFee', e.target.value)}
                                sx={{ width: 100 }}
                              />
                            ) : (
                              <Typography variant="body2">₹{fee.admissionFee.toLocaleString()}</Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingId === fee._id ? (
                              <TextField
                                size="small"
                                value={editData.examFee || ''}
                                onChange={(e) => handleInputChange('examFee', e.target.value)}
                                sx={{ width: 100 }}
                              />
                            ) : (
                              <Typography variant="body2">₹{fee.examFee.toLocaleString()}</Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingId === fee._id ? (
                              <TextField
                                size="small"
                                value={editData.otherFees || ''}
                                onChange={(e) => handleInputChange('otherFees', e.target.value)}
                                sx={{ width: 100 }}
                              />
                            ) : (
                              <Typography variant="body2">₹{fee.otherFees.toLocaleString()}</Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={`₹${(editingId === fee._id ? 
                                (editData.monthlyFee || 0) + (editData.admissionFee || 0) + (editData.examFee || 0) + (editData.otherFees || 0) : 
                                fee.total).toLocaleString()}`}
                              size="small" 
                              sx={{ 
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: '#ffffff',
                                fontWeight: 600
                              }} 
                            />
                          </TableCell>
                          <TableCell align="center">
                            {editingId === fee._id ? (
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Save Changes">
                                  <IconButton
                                    onClick={handleSave}
                                    sx={{
                                      color: '#27ae60',
                                      '&:hover': {
                                        background: 'rgba(39, 174, 96, 0.1)',
                                      }
                                    }}
                                  >
                                    <SaveIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Cancel">
                                  <IconButton
                                    onClick={handleCancel}
                                    sx={{
                                      color: '#e74c3c',
                                      '&:hover': {
                                        background: 'rgba(231, 76, 60, 0.1)',
                                      }
                                    }}
                                  >
                                    <CancelIcon />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            ) : (
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Edit Fee Structure">
                                  <IconButton
                                    onClick={() => handleEdit(fee)}
                                    sx={{
                                      color: '#667eea',
                                      '&:hover': {
                                        background: 'rgba(102, 126, 234, 0.1)',
                                      }
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Fee Structure">
                                  <IconButton
                                    onClick={() => handleDelete(fee._id)}
                                    sx={{
                                      color: '#e74c3c',
                                      '&:hover': {
                                        background: 'rgba(231, 76, 60, 0.1)',
                                      }
                                    }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Card View */}
          <Grid container spacing={3}>
            {feeStructure.map((fee) => (
              <Grid item xs={12} sm={6} md={4} key={fee._id}>
                <FeeCard>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }} className="class-name">
                        {fee.className}
                      </Typography>
                      <Chip 
                        label={`₹${fee.total.toLocaleString()}`}
                        size="small" 
                        className="fee-chip"
                        sx={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: '#ffffff',
                          fontWeight: 600
                        }} 
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#7f8c8d' }} className="fee-label">
                          Monthly Fee:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} className="fee-value">
                          ₹{fee.monthlyFee.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#7f8c8d' }} className="fee-label">
                          Admission Fee:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} className="fee-value">
                          ₹{fee.admissionFee.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#7f8c8d' }} className="fee-label">
                          Exam Fee:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} className="fee-value">
                          ₹{fee.examFee.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: '#7f8c8d' }} className="fee-label">
                          Other Fees:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} className="fee-value">
                          ₹{fee.otherFees.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Tooltip title="Edit Fee Structure">
                        <IconButton
                          onClick={() => handleEdit(fee)}
                          sx={{
                            color: '#667eea',
                            '&:hover': {
                              background: 'rgba(102, 126, 234, 0.1)',
                            }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Fee Structure">
                        <IconButton
                          onClick={() => handleDelete(fee._id)}
                          sx={{
                            color: '#e74c3c',
                            '&:hover': {
                              background: 'rgba(231, 76, 60, 0.1)',
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </FeeCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Fade>

      {/* Add New Class Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#ffffff' }}>
          Add New Class Fee Structure
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Class Name"
                value={editData.className || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, className: e.target.value }))}
                placeholder="e.g., Class 11"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Monthly Fee"
                type="number"
                value={editData.monthlyFee || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, monthlyFee: parseInt(e.target.value) || 0 }))}
                placeholder="5000"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Admission Fee"
                type="number"
                value={editData.admissionFee || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, admissionFee: parseInt(e.target.value) || 0 }))}
                placeholder="10000"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Exam Fee"
                type="number"
                value={editData.examFee || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, examFee: parseInt(e.target.value) || 0 }))}
                placeholder="2000"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Other Fees"
                type="number"
                value={editData.otherFees || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, otherFees: parseInt(e.target.value) || 0 }))}
                placeholder="1500"
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ p: 2, background: 'rgba(102, 126, 234, 0.1)', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 600 }}>
                  Total: ₹{((editData.monthlyFee || 0) + (editData.admissionFee || 0) + (editData.examFee || 0) + (editData.otherFees || 0)).toLocaleString()}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#7f8c8d' }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddClass}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              }
            }}
          >
            Add Class
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FeeManagement; 
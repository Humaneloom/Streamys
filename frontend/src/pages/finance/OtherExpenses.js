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
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { 
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  AttachMoney as MoneyIcon,
  Event as EventIcon,
  LocalCafe as CoffeeIcon,
  TempleHindu as TempleIcon,
  Celebration as CelebrationIcon,
  Receipt as ReceiptIcon
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

const ExpenseCard = styled(Card)(({ theme }) => ({
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
    '& .expense-label': {
      color: 'rgba(255, 255, 255, 0.9) !important',
    },
    '& .expense-value': {
      color: '#ffffff !important',
      fontWeight: '600 !important',
    },
    '& .expense-title': {
      color: '#ffffff !important',
    },
    '& .expense-chip': {
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

const OtherExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { currentUser } = useSelector(state => state.user);

  // Expense categories
  const expenseCategories = [
    { value: 'function', label: 'Function/Event', icon: <CelebrationIcon />, color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
    { value: 'temple', label: 'Temple Donation', icon: <TempleIcon />, color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
    { value: 'coffee', label: 'Coffee/Refreshments', icon: <CoffeeIcon />, color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
    { value: 'maintenance', label: 'Maintenance', icon: <ReceiptIcon />, color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { value: 'utilities', label: 'Utilities', icon: <MoneyIcon />, color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
    { value: 'other', label: 'Other', icon: <ReceiptIcon />, color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }
  ];

  // Fetch expenses from database
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/OtherExpenses/${currentUser.schoolName}`);
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setSnackbar({ open: true, message: 'Error fetching expenses', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [currentUser.schoolName]);

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageExpense = expenses.length > 0 ? Math.round(totalExpenses / expenses.length) : 0;

  // Calculate expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setEditData({ ...expense });
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        title: editData.title,
        description: editData.description,
        amount: editData.amount,
        category: editData.category,
        date: editData.date
      };
      
      await axios.put(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/OtherExpenses/${editingId}`, updatedData);
      
      setEditingId(null);
      setEditData({});
      fetchExpenses(); // Refresh the data
      setSnackbar({ open: true, message: 'Expense updated successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error updating expense:', error);
      setSnackbar({ open: true, message: 'Error updating expense', severity: 'error' });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddNewExpense = () => {
    setEditData({
      title: '',
      description: '',
      amount: '',
      category: 'other',
      date: new Date().toISOString().split('T')[0]
    });
    setOpenDialog(true);
  };

  const handleAddExpense = async () => {
    try {
      const newExpenseData = {
        title: editData.title,
        description: editData.description,
        amount: parseFloat(editData.amount) || 0,
        category: editData.category,
        date: editData.date
      };
      
      await axios.post(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/OtherExpenses/${currentUser.schoolName}`, newExpenseData);
      
      setOpenDialog(false);
      setEditData({});
      fetchExpenses(); // Refresh the data
      setSnackbar({ open: true, message: 'New expense added!', severity: 'success' });
    } catch (error) {
      console.error('Error adding expense:', error);
      setSnackbar({ open: true, message: 'Error adding expense', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/OtherExpenses/${id}`);
      fetchExpenses(); // Refresh the data
      setSnackbar({ open: true, message: 'Expense deleted successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error deleting expense:', error);
      setSnackbar({ open: true, message: 'Error deleting expense', severity: 'error' });
    }
  };

  const getCategoryIcon = (category) => {
    const categoryData = expenseCategories.find(cat => cat.value === category);
    return categoryData ? categoryData.icon : <ReceiptIcon />;
  };

  const getCategoryColor = (category) => {
    const categoryData = expenseCategories.find(cat => cat.value === category);
    return categoryData ? categoryData.color : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  const getCategoryLabel = (category) => {
    const categoryData = expenseCategories.find(cat => cat.value === category);
    return categoryData ? categoryData.label : 'Other';
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
                  Other Expenses Management
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 400 }}>
                  Track and manage miscellaneous expenses
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddNewExpense}
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
                Add New Expense
              </Button>
            </Box>
          </GradientCard>

          {/* Stats Section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <GradientIcon sx={{ mx: 'auto', mb: 2 }}>
                    <ReceiptIcon />
                  </GradientIcon>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                    {expenses.length}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                    Total Expenses
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
                    ₹{totalExpenses.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                    Total Amount
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <GradientIcon color="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" sx={{ mx: 'auto', mb: 2 }}>
                    <EventIcon />
                  </GradientIcon>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                    ₹{averageExpense.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                    Average Expense
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <GradientIcon color="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" sx={{ mx: 'auto', mb: 2 }}>
                    <CelebrationIcon />
                  </GradientIcon>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                    {Object.keys(expensesByCategory).length}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                    Categories
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>



          {/* Expenses Table */}
          <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', mb: 4 }}>
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Title</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Category</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Amount</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }} align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : expenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Box sx={{ py: 3 }}>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                              No expenses found
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Add your first expense to get started
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      expenses.map((expense) => (
                        <TableRow key={expense._id} sx={{ '&:hover': { background: 'rgba(102, 126, 234, 0.05)' } }}>
                          <TableCell>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {expense.title}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              icon={getCategoryIcon(expense.category)}
                              label={getCategoryLabel(expense.category)}
                              size="small" 
                              sx={{ 
                                background: getCategoryColor(expense.category),
                                color: '#ffffff',
                                fontWeight: 600
                              }} 
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {expense.description}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#e74c3c' }}>
                              ₹{expense.amount.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(expense.date).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="Edit Expense">
                                <IconButton
                                  onClick={() => handleEdit(expense)}
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
                              <Tooltip title="Delete Expense">
                                <IconButton
                                  onClick={() => handleDelete(expense._id)}
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
            {expenses.map((expense) => (
              <Grid item xs={12} sm={6} md={4} key={expense._id}>
                <ExpenseCard>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }} className="expense-title">
                        {expense.title}
                      </Typography>
                      <Chip 
                        icon={getCategoryIcon(expense.category)}
                        label={getCategoryLabel(expense.category)}
                        size="small" 
                        className="expense-chip"
                        sx={{ 
                          background: getCategoryColor(expense.category),
                          color: '#ffffff',
                          fontWeight: 600
                        }} 
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#7f8c8d' }} className="expense-label">
                          Amount:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#e74c3c' }} className="expense-value">
                          ₹{expense.amount.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#7f8c8d' }} className="expense-label">
                          Date:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} className="expense-value">
                          {new Date(expense.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ color: '#7f8c8d' }} className="expense-label">
                          Description:
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }} className="expense-value">
                          {expense.description}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Tooltip title="Edit Expense">
                        <IconButton
                          onClick={() => handleEdit(expense)}
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
                      <Tooltip title="Delete Expense">
                        <IconButton
                          onClick={() => handleDelete(expense._id)}
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
                </ExpenseCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Fade>

      {/* Add New Expense Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#ffffff' }}>
          Add New Expense
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Expense Title"
                value={editData.title || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Annual Function Expenses"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={editData.category || 'other'}
                  onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value }))}
                  label="Category"
                >
                  {expenseCategories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {category.icon}
                        {category.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={editData.description || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the expense details..."
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={editData.amount || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={editData.date || new Date().toISOString().split('T')[0]}
                onChange={(e) => setEditData(prev => ({ ...prev, date: e.target.value }))}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#7f8c8d' }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddExpense}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              }
            }}
          >
            Add Expense
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

export default OtherExpenses; 
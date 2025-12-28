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
  Alert,
  Snackbar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Avatar,
  Badge
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  AttachMoney as MoneyIcon,
  School as SchoolIcon,
  Class as ClassIcon,
  ExpandMore as ExpandMoreIcon,
  Payment as PaymentIcon,
  Discount as DiscountIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';

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

const StudentCard = styled(Card)(({ theme, status }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
  border: `2px solid ${
    status === 'Paid' ? '#10b981' :
    status === 'Partial' ? '#f59e0b' :
    status === 'Overdue' ? '#ef4444' : '#e5e7eb'
  }`,
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
  },
}));

const StatusChip = styled(Chip)(({ status }) => ({
  backgroundColor: 
    status === 'Paid' ? '#10b981' :
    status === 'Partial' ? '#f59e0b' :
    status === 'Overdue' ? '#ef4444' : '#6b7280',
  color: '#ffffff',
  fontWeight: 600,
  '& .MuiChip-label': {
    color: '#ffffff',
  },
}));

const StudentFees = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedClass, setSelectedClass] = useState('');
  const [studentFees, setStudentFees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [overallStats, setOverallStats] = useState(null);
  const [classesLoading, setClassesLoading] = useState(false);
  const [sclassesList, setSclassesList] = useState([]);
  const [editingFee, setEditingFee] = useState(null);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { currentUser } = useSelector(state => state.user);
  const { sclassesList: sclassesListFromRedux, loading: classesLoadingFromRedux } = useSelector((state) => state.sclass);
  
  // Debug logging
  console.log('Current User:', currentUser);
  console.log('Classes List:', sclassesListFromRedux);
  console.log('Classes Loading:', classesLoadingFromRedux);

  // Form states
  const [editForm, setEditForm] = useState({
    feeStructure: {
      monthlyFee: 0,
      admissionFee: 0,
      examFee: 0,
      otherFees: 0
    },
    scholarship: {
      type: 'None',
      percentage: 0,
      reason: ''
    },
    customDiscount: 0,
    notes: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    paidAmount: 0
  });

  const [feeStructureDialog, setFeeStructureDialog] = useState(false);
  const [feeStructure, setFeeStructure] = useState({
    monthlyFee: 3000,
    admissionFee: 5000,
    examFee: 1500,
    otherFees: 1000
  });

  // Predefined fee structure from FeeManagement page
  const predefinedFeeStructure = [
    { className: 'Nursery', monthlyFee: 3000, admissionFee: 8000, examFee: 1500, otherFees: 1000, total: 13500 },
    { className: 'LKG', monthlyFee: 3500, admissionFee: 8500, examFee: 1600, otherFees: 1100, total: 14700 },
    { className: 'UKG', monthlyFee: 4000, admissionFee: 9000, examFee: 1700, otherFees: 1200, total: 15900 },
    { className: 'Class 1', monthlyFee: 5000, admissionFee: 10000, examFee: 2000, otherFees: 1500, total: 18500 },
    { className: 'Class 2', monthlyFee: 5500, admissionFee: 11000, examFee: 2200, otherFees: 1600, total: 20300 },
    { className: 'Class 3', monthlyFee: 6000, admissionFee: 12000, examFee: 2400, otherFees: 1700, total: 22100 },
    { className: 'Class 4', monthlyFee: 6500, admissionFee: 13000, examFee: 2600, otherFees: 1800, total: 23900 },
    { className: 'Class 5', monthlyFee: 7000, admissionFee: 14000, examFee: 2800, otherFees: 1900, total: 25700 },
    { className: 'Class 6', monthlyFee: 7500, admissionFee: 15000, examFee: 3000, otherFees: 2000, total: 27500 },
    { className: 'Class 7', monthlyFee: 8000, admissionFee: 16000, examFee: 3200, otherFees: 2100, total: 29300 },
    { className: 'Class 8', monthlyFee: 8500, admissionFee: 17000, examFee: 3400, otherFees: 2200, total: 31100 },
    { className: 'Class 9', monthlyFee: 9000, admissionFee: 18000, examFee: 3600, otherFees: 2300, total: 32900 },
    { className: 'Class 10', monthlyFee: 9500, admissionFee: 19000, examFee: 3800, otherFees: 2400, total: 34700 },
    { className: 'Class 11', monthlyFee: 10000, admissionFee: 20000, examFee: 4000, otherFees: 2500, total: 36500 },
    { className: 'Class 12', monthlyFee: 10500, admissionFee: 21000, examFee: 4200, otherFees: 2600, total: 38300 },
    // Add mappings for database class names
    { className: '9th', monthlyFee: 9000, admissionFee: 18000, examFee: 3600, otherFees: 2300, total: 32900 },
    { className: '10th', monthlyFee: 9500, admissionFee: 19000, examFee: 3800, otherFees: 2400, total: 34700 },
  ];

  useEffect(() => {
    if (currentUser?.schoolName) {
      console.log('Dispatching getAllSclasses with school name:', currentUser.schoolName);
      dispatch(getAllSclasses(currentUser.schoolName, "Sclass"));
      
      // Fallback: also try direct API call if Redux fails
      const fetchClassesDirectly = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/SclassList/${currentUser.schoolName}`);
          console.log('Direct API call result:', response.data);
        } catch (error) {
          console.error('Direct API call failed:', error);
        }
      };
      fetchClassesDirectly();
      
      // Fetch overall statistics for all classes
      fetchOverallStats();
    }
  }, [currentUser, dispatch]);

  const fetchOverallStats = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/StudentFees/${currentUser.schoolName}`);
      const allFees = response.data;
      
      const overall = {
        totalStudents: allFees.length,
        totalFeeAmount: allFees.reduce((sum, fee) => sum + fee.totalFee, 0),
        totalPaidAmount: allFees.reduce((sum, fee) => sum + (fee.paidAmount || 0), 0),
        totalPendingAmount: allFees.reduce((sum, fee) => sum + fee.pendingAmount, 0),
        paidCount: allFees.filter(fee => fee.paymentStatus === 'Paid').length,
        partialCount: allFees.filter(fee => fee.paymentStatus === 'Partial').length,
        pendingCount: allFees.filter(fee => fee.paymentStatus === 'Pending').length,
        overdueCount: allFees.filter(fee => fee.paymentStatus === 'Overdue').length
      };
      
      setOverallStats(overall);
    } catch (error) {
      console.error('Error fetching overall stats:', error);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchStudentFees();
      fetchStats();
      
      // Automatically update fee structure when class is selected
      autoUpdateFeeStructure();
    }
  }, [selectedClass]);

  const autoUpdateFeeStructure = async () => {
    try {
      // Get the selected class name
      const selectedClassName = (sclassesListFromRedux || []).find(c => c._id === selectedClass)?.sclassName;
      
      if (selectedClassName) {
        console.log('Auto-updating fee structure for class:', selectedClassName);
        
        // Fetch the current fee structure from the database
        const feeStructureResponse = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/FeeStructures/${currentUser.schoolName}/class/${selectedClassName}`);
        const classFeeStructure = feeStructureResponse.data;
        
        console.log('Fetched fee structure:', classFeeStructure);
        
        if (classFeeStructure) {
          // Check if fee records exist for this class
          const existingFees = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/StudentFees/${currentUser.schoolName}/class/${selectedClass}`);
          
          if (existingFees.data && existingFees.data.length > 0) {
            // Update existing fee records with correct structure
            const response = await axios.put(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/StudentFees/${currentUser.schoolName}/class/${selectedClass}/feeStructure`, {
              feeStructure: {
                monthlyFee: classFeeStructure.monthlyFee,
                admissionFee: classFeeStructure.admissionFee,
                examFee: classFeeStructure.examFee,
                otherFees: classFeeStructure.otherFees
              }
            });
            
            console.log('Auto-updated fee structure:', response.data);
            
            // Refresh the data to show updated fees
            fetchStudentFees();
            fetchStats();
          }
        }
      }
    } catch (error) {
      console.error('Error auto-updating fee structure:', error);
    }
  };



  const fetchStudentFees = async () => {
    if (!selectedClass) return;
    
    setLoading(true);
    try {
      console.log('Fetching student fees for class:', selectedClass);
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/StudentFees/${currentUser.schoolName}/class/${selectedClass}`);
      console.log('Student fees response:', response.data);
      
      // Debug: Log each student fee structure and total
      response.data.forEach((fee, index) => {
        console.log(`Student ${index + 1}:`, {
          name: fee.student.name,
          feeStructure: fee.feeStructure,
          totalFee: fee.totalFee,
          calculatedTotal: fee.feeStructure.monthlyFee + fee.feeStructure.admissionFee + fee.feeStructure.examFee + fee.feeStructure.otherFees
        });
      });
      
      setStudentFees(response.data);
    } catch (error) {
      console.error('Error fetching student fees:', error);
      setSnackbar({ open: true, message: 'Error fetching student fees', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!selectedClass) return;
    
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/StudentFees/${currentUser.schoolName}/class/${selectedClass}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleEditFee = (studentFee) => {
    setEditingFee(studentFee);
    setEditForm({
      feeStructure: { ...studentFee.feeStructure },
      scholarship: { ...studentFee.scholarship },
      customDiscount: studentFee.customDiscount,
      notes: studentFee.notes
    });
    setEditDialogOpen(true);
  };

  const handleSaveFee = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/StudentFee/${editingFee._id}`, editForm);
      setEditDialogOpen(false);
      setEditingFee(null);
      fetchStudentFees();
      fetchStats();
      setSnackbar({ open: true, message: 'Fee updated successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error updating fee:', error);
      setSnackbar({ open: true, message: 'Error updating fee', severity: 'error' });
    }
  };

  const handlePayment = (studentFee) => {
    setSelectedStudent(studentFee);
    setPaymentForm({ paidAmount: 0 });
    setPaymentDialogOpen(true);
  };

  const handleSavePayment = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/StudentFee/${selectedStudent._id}/payment`, {
        paidAmount: parseFloat(paymentForm.paidAmount),
        lastPaymentDate: new Date()
      });
      setPaymentDialogOpen(false);
      setSelectedStudent(null);
      fetchStudentFees();
      fetchStats();
      setSnackbar({ open: true, message: 'Payment recorded successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error recording payment:', error);
      setSnackbar({ open: true, message: 'Error recording payment', severity: 'error' });
    }
  };

  const handleBulkCreateFees = async () => {
    if (!selectedClass) return;
    
    try {
      // First, let's check what students are in this class
      console.log('Checking students in class:', selectedClass);
      const studentsResponse = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/Sclass/Students/${selectedClass}`);
      console.log('Students in class:', studentsResponse.data);
      
      if (!studentsResponse.data || studentsResponse.data.length === 0) {
        setSnackbar({ open: true, message: 'No students found in this class. Please add students first.', severity: 'warning' });
        return;
      }
      
      // Get the selected class name
      const selectedClassName = (sclassesListFromRedux || []).find(c => c._id === selectedClass)?.sclassName;
      console.log('Selected class name:', selectedClassName);
      
      // Find the predefined fee structure for this class
      const classFeeStructure = predefinedFeeStructure.find(fee => fee.className === selectedClassName);
      
      console.log('Looking for class name:', selectedClassName);
      console.log('Available class names:', predefinedFeeStructure.map(f => f.className));
      console.log('Found fee structure:', classFeeStructure);
      
      if (classFeeStructure) {
        // Auto-fill the fee structure with predefined values
        setFeeStructure({
          monthlyFee: classFeeStructure.monthlyFee,
          admissionFee: classFeeStructure.admissionFee,
          examFee: classFeeStructure.examFee,
          otherFees: classFeeStructure.otherFees
        });
        console.log('Using predefined fee structure:', classFeeStructure);
      } else {
        console.log('No predefined fee structure found for class:', selectedClassName);
      }
      
      // Show fee structure dialog
      setFeeStructureDialog(true);
    } catch (error) {
      console.error('Error checking students:', error);
      setSnackbar({ open: true, message: 'Error checking students in class', severity: 'error' });
    }
  };

  const handleCreateFeesWithStructure = async () => {
    try {
      const totalFee = feeStructure.monthlyFee + feeStructure.admissionFee + feeStructure.examFee + feeStructure.otherFees;
      
      console.log('Creating fee records with structure:', feeStructure);
      console.log('Calculated total fee:', totalFee);
      
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/StudentFees/bulk`, {
        schoolId: currentUser.schoolName,
        classId: selectedClass,
        academicYear: new Date().getFullYear().toString(),
        feeStructure,
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
      });
      
      console.log('Bulk create response:', response.data);
      
      setFeeStructureDialog(false);
      fetchStudentFees();
      fetchStats();
      setSnackbar({ open: true, message: `Fee records created with total fee of ₹${totalFee.toLocaleString('en-IN')}!`, severity: 'success' });
    } catch (error) {
      console.error('Error creating fee records:', error);
      setSnackbar({ open: true, message: 'Error creating fee records', severity: 'error' });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid':
        return <CheckCircleIcon sx={{ color: '#10b981' }} />;
      case 'Partial':
        return <PaymentIcon sx={{ color: '#f59e0b' }} />;
      case 'Overdue':
        return <WarningIcon sx={{ color: '#ef4444' }} />;
      default:
        return <ScheduleIcon sx={{ color: '#6b7280' }} />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (!currentUser) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          Please log in to access student fee management.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <GradientCard sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ 
              background: 'rgba(255,255,255,0.2)', 
              mr: 2,
              width: 60,
              height: 60
            }}>
              <SchoolIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 700 }}>
                Student Fee Management
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Manage student fees by class with scholarship and payment tracking
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </GradientCard>

      {/* Class Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                         <FormControl sx={{ minWidth: 200 }}>
               <InputLabel>Select Class</InputLabel>
               <Select
                 value={selectedClass}
                 onChange={(e) => setSelectedClass(e.target.value)}
                 label="Select Class"
                 disabled={classesLoadingFromRedux}
               >
                 {classesLoadingFromRedux ? (
                   <MenuItem disabled>Loading classes...</MenuItem>
                 ) : (sclassesListFromRedux || []).length === 0 ? (
                   <MenuItem disabled>No classes found</MenuItem>
                 ) : (
                   (sclassesListFromRedux || []).map((cls) => (
                     <MenuItem key={cls._id} value={cls._id}>
                       {cls.sclassName}
                     </MenuItem>
                   ))
                                   )}
                </Select>
              </FormControl>
                             {selectedClass && (
                <>
                  <Button
                    variant="outlined"
                    onClick={async () => {
                      try {
                        const response = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/Sclass/Students/${selectedClass}`);
                        console.log('Students in class:', response.data);
                        setSnackbar({ 
                          open: true, 
                          message: `Found ${response.data.length} students in this class`, 
                          severity: 'info' 
                        });
                      } catch (error) {
                        console.error('Error checking students:', error);
                        setSnackbar({ 
                          open: true, 
                          message: 'Error checking students in class', 
                          severity: 'error' 
                        });
                      }
                    }}
                    sx={{ mr: 1 }}
                  >
                    Check Students
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleBulkCreateFees}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                      }
                    }}
                  >
                    Create Fee Records
                  </Button>

                </>
              )}
          </Box>
        </CardContent>
      </Card>

      {/* Overall Statistics - Always Visible */}
      {overallStats && (
        <Card sx={{ mb: 3, bgcolor: '#e8f4fd' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#1e293b', fontWeight: 700 }}>
              📊 Overall Fee Statistics (All Classes Combined)
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Typography color="textSecondary" gutterBottom>
                    Total Students
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#667eea', fontWeight: 700 }}>
                    {overallStats.totalStudents}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Typography color="textSecondary" gutterBottom>
                    Total Fee Amount
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700 }}>
                    {formatCurrency(overallStats.totalFeeAmount)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Typography color="textSecondary" gutterBottom>
                    Total Paid
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                    {formatCurrency(overallStats.totalPaidAmount)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Typography color="textSecondary" gutterBottom>
                    Pending Amount
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#ef4444', fontWeight: 700 }}>
                    {formatCurrency(overallStats.totalPendingAmount)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            {/* Payment Status Breakdown */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, color: '#475569', fontWeight: 600 }}>
                Payment Status Distribution:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Chip 
                    icon={<CheckCircleIcon />} 
                    label={`Paid: ${overallStats.paidCount}`} 
                    color="success" 
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Chip 
                    icon={<PaymentIcon />} 
                    label={`Partial: ${overallStats.partialCount}`} 
                    color="warning" 
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Chip 
                    icon={<ScheduleIcon />} 
                    label={`Pending: ${overallStats.pendingCount}`} 
                    color="info" 
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Chip 
                    icon={<WarningIcon />} 
                    label={`Overdue: ${overallStats.overdueCount}`} 
                    color="error" 
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Individual Class Statistics - Only when class is selected */}
      {selectedClass && stats && (
        <Card sx={{ mb: 3, border: '2px solid #667eea' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#667eea', fontWeight: 700 }}>
              📈 Individual Class Statistics - {(sclassesListFromRedux || []).find(c => c._id === selectedClass)?.sclassName || ''}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#eff6ff', borderRadius: 2 }}>
                  <Typography color="textSecondary" gutterBottom>
                    Class Students
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#667eea', fontWeight: 700 }}>
                    {stats.totalStudents}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f0fdf4', borderRadius: 2 }}>
                  <Typography color="textSecondary" gutterBottom>
                    Class Fee Amount
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700 }}>
                    {formatCurrency(stats.totalFeeAmount)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fffbeb', borderRadius: 2 }}>
                  <Typography color="textSecondary" gutterBottom>
                    Class Paid
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                    {formatCurrency(stats.totalPaidAmount)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fef2f2', borderRadius: 2 }}>
                  <Typography color="textSecondary" gutterBottom>
                    Class Pending
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#ef4444', fontWeight: 700 }}>
                    {formatCurrency(stats.totalPendingAmount)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Student Fees Table */}
      {selectedClass && (
        <Card>
          <CardContent>
                         <Typography variant="h6" sx={{ mb: 2 }}>
               Student Fees - {(sclassesListFromRedux || []).find(c => c._id === selectedClass)?.sclassName || ''}
             </Typography>
            
            {loading ? (
              <Typography>Loading...</Typography>
                         ) : studentFees.length === 0 ? (
               <Box sx={{ textAlign: 'center', py: 4 }}>
                 <Typography color="textSecondary" sx={{ mb: 2 }}>
                   No fee records found for this class.
                 </Typography>
                 <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                   Click "Check Students" to see if there are students in this class.
                 </Typography>
                 <Typography variant="body2" color="textSecondary">
                   If students exist, click "Create Fee Records" to generate fee records for all students.
                 </Typography>
               </Box>
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Student</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Roll No</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Total Fee</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Paid</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Pending</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Scholarship</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studentFees.map((studentFee) => (
                      <TableRow key={studentFee._id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                              {studentFee.student.name.charAt(0)}
                            </Avatar>
                            {studentFee.student.name}
                          </Box>
                        </TableCell>
                        <TableCell>{studentFee.student.rollNum}</TableCell>
                        <TableCell>{formatCurrency(studentFee.totalFee)}</TableCell>
                        <TableCell>{formatCurrency(studentFee.paidAmount || 0)}</TableCell>
                        <TableCell>{formatCurrency(studentFee.pendingAmount)}</TableCell>
                        <TableCell>
                          <StatusChip
                            label={studentFee.paymentStatus}
                            status={studentFee.paymentStatus}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {studentFee.scholarship.type !== 'None' ? (
                            <Chip
                              label={`${studentFee.scholarship.percentage}%`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              None
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Edit Fee">
                              <IconButton
                                size="small"
                                onClick={() => handleEditFee(studentFee)}
                                sx={{ color: '#667eea' }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Record Payment">
                              <IconButton
                                size="small"
                                onClick={() => handlePayment(studentFee)}
                                sx={{ color: '#10b981' }}
                              >
                                <PaymentIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Fee Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EditIcon sx={{ mr: 1, color: '#667eea' }} />
            Edit Student Fee
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {editingFee?.student?.name} - {editingFee?.sclassName?.sclassName}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Monthly Fee"
                type="number"
                value={editForm.feeStructure.monthlyFee}
                onChange={(e) => setEditForm({
                  ...editForm,
                  feeStructure: {
                    ...editForm.feeStructure,
                    monthlyFee: parseFloat(e.target.value) || 0
                  }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Admission Fee"
                type="number"
                value={editForm.feeStructure.admissionFee}
                onChange={(e) => setEditForm({
                  ...editForm,
                  feeStructure: {
                    ...editForm.feeStructure,
                    admissionFee: parseFloat(e.target.value) || 0
                  }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Exam Fee"
                type="number"
                value={editForm.feeStructure.examFee}
                onChange={(e) => setEditForm({
                  ...editForm,
                  feeStructure: {
                    ...editForm.feeStructure,
                    examFee: parseFloat(e.target.value) || 0
                  }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Other Fees"
                type="number"
                value={editForm.feeStructure.otherFees}
                onChange={(e) => setEditForm({
                  ...editForm,
                  feeStructure: {
                    ...editForm.feeStructure,
                    otherFees: parseFloat(e.target.value) || 0
                  }
                })}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                Scholarship & Discounts
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Scholarship Type</InputLabel>
                <Select
                  value={editForm.scholarship.type}
                  onChange={(e) => setEditForm({
                    ...editForm,
                    scholarship: {
                      ...editForm.scholarship,
                      type: e.target.value
                    }
                  })}
                  label="Scholarship Type"
                >
                  <MenuItem value="None">None</MenuItem>
                  <MenuItem value="Merit">Merit</MenuItem>
                  <MenuItem value="Need-based">Need-based</MenuItem>
                  <MenuItem value="Sports">Sports</MenuItem>
                  <MenuItem value="Academic">Academic</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Scholarship Percentage"
                type="number"
                value={editForm.scholarship.percentage}
                onChange={(e) => setEditForm({
                  ...editForm,
                  scholarship: {
                    ...editForm.scholarship,
                    percentage: parseFloat(e.target.value) || 0
                  }
                })}
                disabled={editForm.scholarship.type === 'None'}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Custom Discount"
                type="number"
                value={editForm.customDiscount}
                onChange={(e) => setEditForm({
                  ...editForm,
                  customDiscount: parseFloat(e.target.value) || 0
                })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Scholarship Reason"
                multiline
                rows={2}
                value={editForm.scholarship.reason}
                onChange={(e) => setEditForm({
                  ...editForm,
                  scholarship: {
                    ...editForm.scholarship,
                    reason: e.target.value
                  }
                })}
                disabled={editForm.scholarship.type === 'None'}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={editForm.notes}
                onChange={(e) => setEditForm({
                  ...editForm,
                  notes: e.target.value
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveFee}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PaymentIcon sx={{ mr: 1, color: '#10b981' }} />
            Record Payment
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {selectedStudent.student.name} - {selectedStudent.sclassName.sclassName}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="textSecondary">
                    Total Fee: {formatCurrency(selectedStudent.totalFee)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="textSecondary">
                    Already Paid: {formatCurrency(selectedStudent.paidAmount || 0)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="textSecondary">
                    Pending: {formatCurrency(selectedStudent.pendingAmount)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Payment Amount"
                    type="number"
                    value={paymentForm.paidAmount}
                    onChange={(e) => setPaymentForm({
                      paidAmount: parseFloat(e.target.value) || 0
                    })}
                    sx={{ mt: 2 }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSavePayment}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              }
            }}
          >
            Record Payment
          </Button>
        </DialogActions>
      </Dialog>

             {/* Fee Structure Dialog */}
       <Dialog open={feeStructureDialog} onClose={() => setFeeStructureDialog(false)} maxWidth="md" fullWidth>
         <DialogTitle>
           <Box sx={{ display: 'flex', alignItems: 'center' }}>
             <MoneyIcon sx={{ mr: 1, color: '#667eea' }} />
             Fee Structure for {(sclassesListFromRedux || []).find(c => c._id === selectedClass)?.sclassName || ''}
           </Box>
         </DialogTitle>
         <DialogContent>
           <Grid container spacing={2} sx={{ mt: 1 }}>
             <Grid item xs={12}>
               <Typography variant="h6" sx={{ mb: 2 }}>
                 Predefined Fee Structure (from Finance/Fees page)
               </Typography>
               <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                 Fee structure automatically loaded from the fee management page. You can modify if needed.
               </Typography>
             </Grid>
             
             <Grid item xs={12} md={6}>
               <TextField
                 fullWidth
                 label="Monthly Fee"
                 type="number"
                 value={feeStructure.monthlyFee}
                 onChange={(e) => setFeeStructure({
                   ...feeStructure,
                   monthlyFee: parseFloat(e.target.value) || 0
                 })}
                 InputProps={{
                   startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                 }}
               />
             </Grid>
             
             <Grid item xs={12} md={6}>
               <TextField
                 fullWidth
                 label="Admission Fee"
                 type="number"
                 value={feeStructure.admissionFee}
                 onChange={(e) => setFeeStructure({
                   ...feeStructure,
                   admissionFee: parseFloat(e.target.value) || 0
                 })}
                 InputProps={{
                   startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                 }}
               />
             </Grid>
             
             <Grid item xs={12} md={6}>
               <TextField
                 fullWidth
                 label="Exam Fee"
                 type="number"
                 value={feeStructure.examFee}
                 onChange={(e) => setFeeStructure({
                   ...feeStructure,
                   examFee: parseFloat(e.target.value) || 0
                 })}
                 InputProps={{
                   startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                 }}
               />
             </Grid>
             
             <Grid item xs={12} md={6}>
               <TextField
                 fullWidth
                 label="Other Fees"
                 type="number"
                 value={feeStructure.otherFees}
                 onChange={(e) => setFeeStructure({
                   ...feeStructure,
                   otherFees: parseFloat(e.target.value) || 0
                 })}
                 InputProps={{
                   startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                 }}
               />
             </Grid>
             
             <Grid item xs={12}>
               <Card sx={{ mt: 2, p: 2, background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
                 <Typography variant="h6" sx={{ mb: 1, color: '#0369a1' }}>
                   Total Fee: ₹{(feeStructure.monthlyFee + feeStructure.admissionFee + feeStructure.examFee + feeStructure.otherFees).toLocaleString('en-IN')}
                 </Typography>
                 <Typography variant="body2" color="textSecondary">
                   Monthly: ₹{feeStructure.monthlyFee.toLocaleString('en-IN')} | 
                   Admission: ₹{feeStructure.admissionFee.toLocaleString('en-IN')} | 
                   Exam: ₹{feeStructure.examFee.toLocaleString('en-IN')} | 
                   Other: ₹{feeStructure.otherFees.toLocaleString('en-IN')}
                 </Typography>
               </Card>
             </Grid>
           </Grid>
         </DialogContent>
         <DialogActions>
           <Button onClick={() => setFeeStructureDialog(false)}>Cancel</Button>
           <Button
             onClick={handleCreateFeesWithStructure}
             variant="contained"
             sx={{
               background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
               '&:hover': {
                 background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
               }
             }}
           >
             Create Fee Records
           </Button>
         </DialogActions>
       </Dialog>

       {/* Snackbar */}
       <Snackbar
         open={snackbar.open}
         autoHideDuration={6000}
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

export default StudentFees; 
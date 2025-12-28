import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
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
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Avatar
} from '@mui/material';
import {
  Payment as PaymentIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Receipt as ReceiptIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import axios from 'axios';

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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

const FeeCard = styled(Card)(({ theme, status }) => ({
  background: status === 'Paid' 
    ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)' 
    : status === 'Partial'
    ? 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)'
    : 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
  border: '1px solid rgba(255,255,255,0.2)',
  transition: 'all 0.3s ease-in-out',
  color: 'white',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
  },
}));

const PaymentMethodCard = styled(Card)(({ theme, selected }) => ({
  background: selected 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  borderRadius: '12px',
  border: selected ? '2px solid #667eea' : '1px solid rgba(0,0,0,0.1)',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
}));

const StatusChip = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Paid': return { bg: '#4caf50', color: '#ffffff' };
      case 'Pending': return { bg: '#f44336', color: '#ffffff' };
      case 'Partial': return { bg: '#ff9800', color: '#ffffff' };
      default: return { bg: '#757575', color: '#ffffff' };
    }
  };

  const colors = getStatusColor();
  
  return (
    <Chip
      label={status}
      sx={{
        backgroundColor: colors.bg,
        color: colors.color,
        fontWeight: 600,
        '& .MuiChip-label': {
          color: colors.color,
        },
      }}
    />
  );
};

const StudentFeePayment = () => {
  const { currentUser } = useSelector(state => state.user);
  const [feeDetails, setFeeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [processing, setProcessing] = useState(false);

  // Payment method options
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: <CreditCardIcon />, description: 'Visa, Mastercard, RuPay' },
    { id: 'upi', name: 'UPI Payment', icon: <PaymentIcon />, description: 'GooglePay, PhonePe, Paytm' },
    { id: 'netbanking', name: 'Net Banking', icon: <BankIcon />, description: 'All major banks' },
    { id: 'wallet', name: 'Digital Wallet', icon: <MoneyIcon />, description: 'Paytm, Mobikwik' }
  ];

  useEffect(() => {
    // Only fetch data if currentUser is properly loaded
    if (currentUser && currentUser._id) {
      fetchFeeDetails();
      fetchPaymentHistory();
    }
  }, [currentUser]);

  // Function to refresh payment history from database
  const refreshPaymentHistory = () => {
    fetchPaymentHistory();
    setSnackbar({ 
      open: true, 
      message: 'Payment history refreshed', 
      severity: 'info' 
    });
  };

  const createStudentFeeRecord = async () => {
    try {
      const schoolId = currentUser.school?.schoolName || 'KLPD';
      const currentYear = new Date().getFullYear().toString();
      
      const feeRecordData = {
        studentId: currentUser._id,
        sclassNameId: currentUser.sclassName._id,
        schoolId: schoolId,
        academicYear: currentYear,
        feeStructure: {
          monthlyFee: 3000,
          admissionFee: 5000,
          examFee: 1500,
          otherFees: 1000
        },
        scholarship: {
          type: 'None',
          percentage: 0,
          reason: ''
        },
        customDiscount: 0,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        notes: 'Auto-created fee record'
      };

      console.log('Creating fee record with data:', feeRecordData);
      
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/StudentFee`,
        feeRecordData
      );
      
      console.log('Fee record created successfully:', response.data);
      setSnackbar({ 
        open: true, 
        message: 'Fee record created successfully!', 
        severity: 'success' 
      });
      
      // Retry fetching fee details
      setTimeout(() => {
        fetchFeeDetails();
      }, 1000);
      
    } catch (error) {
      console.error('Error creating fee record:', error);
      setSnackbar({ 
        open: true, 
        message: 'Could not create fee record. Using demo data.', 
        severity: 'warning' 
      });
    }
  };

  const fetchFeeDetails = async () => {
    try {
      setLoading(true);
      
      // Debug logging
      console.log('Current User:', currentUser);
      console.log('School:', currentUser.school);
      console.log('Class:', currentUser.sclassName);
      
      // Try to get school identifier
      const schoolId = currentUser.school?._id || currentUser.school || 'KLPD';
      const classId = currentUser.sclassName?._id || currentUser.sclassName;
      
      console.log('Using School ID:', schoolId);
      console.log('Using Class ID:', classId);
      
      // Use the existing API endpoint for getting student fee by student ID
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/StudentFee/${currentUser._id}`
      );
      
      console.log('Fee details response:', response.data);
      
      // Handle both single object and array responses
      const feeData = Array.isArray(response.data) ? response.data[0] : response.data;
      
      if (feeData) {
        // Transform the API response to match our component's expected structure
        const transformedData = {
          _id: feeData._id,
          student: {
            name: feeData.student?.name || currentUser.name,
            rollNum: feeData.student?.rollNum || currentUser.rollNum,
            class: feeData.sclassName?.sclassName || currentUser.sclassName?.sclassName
          },
          feeStructure: feeData.feeStructure,
          totalFee: feeData.totalFee,
          paidAmount: feeData.paidAmount || 0,
          dueAmount: feeData.pendingAmount || (feeData.totalFee - (feeData.paidAmount || 0)),
          status: feeData.paymentStatus || 'Pending',
          dueDate: feeData.dueDate
        };
        
        setFeeDetails(transformedData);
      } else {
        // No fee record found, try to create one
        console.log('No fee record found, attempting to create one...');
        await createStudentFeeRecord();
        throw new Error('No fee data found, creating default record');
      }
    } catch (error) {
      console.error('Error fetching fee details:', error);
      setSnackbar({ 
        open: true, 
        message: 'Loading demo fee details for testing', 
        severity: 'info' 
      });
      
      // Set demo data if API fails
      setFeeDetails({
        student: {
          name: currentUser.name || 'John Doe',
          rollNum: currentUser.rollNum || '001',
          class: currentUser.sclassName?.sclassName || 'Class 10'
        },
        feeStructure: {
          monthlyFee: 3000,
          admissionFee: 5000,
          examFee: 1500,
          otherFees: 1000
        },
        totalFee: 10500,
        paidAmount: 3000,
        dueAmount: 7500,
        status: 'Partial',
        dueDate: '2024-02-15'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      console.log('Fetching payment history from database for student:', currentUser._id);
      
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/PaymentHistory/student/${currentUser._id}`
      );
      
      console.log('Payment history response:', response.data);
      
      // Transform the API response to match our component's expected structure
      const transformedPayments = response.data.payments?.map(payment => ({
        _id: payment._id,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        transactionId: payment.transactionId,
        date: new Date(payment.paymentDate).toLocaleDateString('en-IN'),
        time: new Date(payment.paymentDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        status: payment.paymentStatus || 'Success',
        receiptNumber: payment.receiptNumber,
        description: payment.description
      })) || [];
      
      setPaymentHistory(transformedPayments);
      console.log('Transformed payment history:', transformedPayments);
    } catch (error) {
      console.error('Error fetching payment history from database:', error);
      // Set empty array if API fails
      setPaymentHistory([]);
    }
  };

  const handlePayment = async () => {
    if (!paymentAmount || !paymentMethod) {
      setSnackbar({ 
        open: true, 
        message: 'Please enter payment amount and select payment method', 
        severity: 'warning' 
      });
      return;
    }

    if (parseFloat(paymentAmount) > feeDetails.dueAmount) {
      setSnackbar({ 
        open: true, 
        message: 'Payment amount cannot exceed due amount', 
        severity: 'warning' 
      });
      return;
    }

    setProcessing(true);
    
    try {
      // Load Razorpay script
      const isRazorpayLoaded = await loadRazorpayScript();
      
      if (!isRazorpayLoaded) {
        setSnackbar({ 
          open: true, 
          message: 'Failed to load payment gateway. Please try again.', 
          severity: 'error' 
        });
        setProcessing(false);
        return;
      }

      // Create Razorpay order
      const orderResponse = await axios.post(
        `${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/razorpay/create-order`,
        {
          studentId: currentUser._id,
          studentFeeId: feeDetails._id,
          amount: parseFloat(paymentAmount),
          paymentMethod: paymentMethods.find(pm => pm.id === paymentMethod)?.name || paymentMethod,
          description: `Fee payment for ${currentUser.name}`
        }
      );

      if (!orderResponse.data.success) {
        throw new Error('Failed to create payment order');
      }

      const { order, student } = orderResponse.data;

      // Configure Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_your_key_id', // Replace with your Razorpay key
        amount: order.amount, // Amount in paise
        currency: order.currency,
        name: 'School Fee Payment',
        description: `Fee payment for ${student.name} (Roll: ${student.rollNum})`,
        order_id: order.id,
        handler: async (response) => {
          // Payment successful - verify payment
          try {
            setProcessing(true);
            
            const verifyResponse = await axios.post(
              `${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/razorpay/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                studentId: currentUser._id,
                studentFeeId: feeDetails._id,
                amount: parseFloat(paymentAmount),
                paymentMethod: paymentMethods.find(pm => pm.id === paymentMethod)?.name || paymentMethod
              }
            );

            if (verifyResponse.data.success) {
              // Update fee details with actual data from backend
              const updatedFee = verifyResponse.data.updatedFee;
              const transformedData = {
                _id: updatedFee._id,
                student: {
                  name: updatedFee.student?.name || currentUser.name,
                  rollNum: updatedFee.student?.rollNum || currentUser.rollNum,
                  class: updatedFee.sclassName?.sclassName || currentUser.sclassName?.sclassName
                },
                feeStructure: updatedFee.feeStructure,
                totalFee: updatedFee.totalFee,
                paidAmount: updatedFee.paidAmount || 0,
                dueAmount: updatedFee.pendingAmount || (updatedFee.totalFee - (updatedFee.paidAmount || 0)),
                status: updatedFee.paymentStatus || 'Pending',
                dueDate: updatedFee.dueDate
              };
              
              setFeeDetails(transformedData);
              
              // Refresh payment history from database
              setTimeout(() => {
                fetchPaymentHistory();
              }, 1000);
              
              setSnackbar({ 
                open: true, 
                message: `Payment successful! Transaction ID: ${response.razorpay_payment_id}`, 
                severity: 'success' 
              });
              
              setPaymentDialog(false);
              setPaymentAmount('');
              setPaymentMethod('');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (verifyError) {
            console.error('Payment verification error:', verifyError);
            setSnackbar({ 
              open: true, 
              message: 'Payment verification failed. Please contact support.', 
              severity: 'error' 
            });
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            setSnackbar({ 
              open: true, 
              message: 'Payment cancelled', 
              severity: 'info' 
            });
          }
        },
        prefill: {
          name: student.name,
          email: student.email,
          contact: currentUser.phone || '9999999999'
        },
        theme: {
          color: '#667eea'
        }
      };

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', async (response) => {
        console.error('Payment failed:', response.error);
        
        // Log payment failure
        try {
          await axios.post(
            `${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/razorpay/payment-failure`,
            {
              razorpay_order_id: order.id,
              razorpay_payment_id: response.error.metadata?.payment_id,
              error_code: response.error.code,
              error_description: response.error.description,
              studentId: currentUser._id,
              studentFeeId: feeDetails._id
            }
          );
        } catch (logError) {
          console.error('Error logging payment failure:', logError);
        }
        
        setSnackbar({ 
          open: true, 
          message: `Payment failed: ${response.error.description}`, 
          severity: 'error' 
        });
        setProcessing(false);
      });
      
      rzp.open();

    } catch (error) {
      console.error('Error initiating payment:', error);
      setSnackbar({ 
        open: true, 
        message: 'Failed to initiate payment. Please try again.', 
        severity: 'error' 
      });
      setProcessing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPaymentProgress = () => {
    if (!feeDetails) return 0;
    return Math.round((feeDetails.paidAmount / feeDetails.totalFee) * 100);
  };

  // Show loading if currentUser is not loaded or component is loading
  if (loading || !currentUser || !currentUser._id) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <CircularProgress size={60} />
        <Typography sx={{ ml: 2 }}>
          {!currentUser ? 'Loading user data...' : 'Loading fee details...'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <GradientCard sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
              <PaymentIcon sx={{ fontSize: 30, color: 'white' }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                Fee Payment
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Manage your fee payments securely and conveniently
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </GradientCard>

      <Grid container spacing={3}>
        {/* Fee Overview */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
                Fee Overview
              </Typography>
              
              {feeDetails && (
                <>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        Payment Progress
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {getPaymentProgress()}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={getPaymentProgress()} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getPaymentProgress() === 100 ? '#4caf50' : '#667eea',
                          borderRadius: 4,
                        }
                      }} 
                    />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                        <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 700 }}>
                          {formatCurrency(feeDetails.totalFee)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Total Fee
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e8f5e8', borderRadius: 2 }}>
                        <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 700 }}>
                          {formatCurrency(feeDetails.paidAmount)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Paid Amount
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fff3e0', borderRadius: 2 }}>
                        <Typography variant="h5" sx={{ color: '#ff9800', fontWeight: 700 }}>
                          {formatCurrency(feeDetails.dueAmount)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Due Amount
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f3e5f5', borderRadius: 2 }}>
                        <StatusChip status={feeDetails.status} />
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          Payment Status
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </>
              )}
            </CardContent>
          </Card>

          {/* Fee Breakdown */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
                Fee Breakdown
              </Typography>
              
              {feeDetails && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Fee Type</strong></TableCell>
                        <TableCell align="right"><strong>Amount</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Monthly Fee</TableCell>
                        <TableCell align="right">{formatCurrency(feeDetails.feeStructure.monthlyFee)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Admission Fee</TableCell>
                        <TableCell align="right">{formatCurrency(feeDetails.feeStructure.admissionFee)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Exam Fee</TableCell>
                        <TableCell align="right">{formatCurrency(feeDetails.feeStructure.examFee)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Other Fees</TableCell>
                        <TableCell align="right">{formatCurrency(feeDetails.feeStructure.otherFees)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ borderTop: '2px solid #dee2e6', fontWeight: 600 }}>
                          <strong>Total</strong>
                        </TableCell>
                        <TableCell align="right" sx={{ borderTop: '2px solid #dee2e6', fontWeight: 600 }}>
                          <strong>{formatCurrency(feeDetails.totalFee)}</strong>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Payment Actions & History */}
        <Grid item xs={12} md={4}>
          {/* Quick Payment */}
          <FeeCard status={feeDetails?.status} sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MoneyIcon sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Quick Payment
                </Typography>
              </Box>
              
              {feeDetails?.dueAmount > 0 ? (
                <>
                  <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                    Outstanding Amount: {formatCurrency(feeDetails.dueAmount)}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => setPaymentDialog(true)}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 600,
                      py: 1.5,
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.3)',
                      }
                    }}
                    startIcon={<PaymentIcon />}
                  >
                    Pay Now
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                    All fees have been paid
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircleIcon sx={{ mr: 1 }} />
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Fully Paid
                    </Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </FeeCard>

          {/* Payment History */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                  Payment History
                </Typography>
                <Button
                  size="small"
                  onClick={refreshPaymentHistory}
                  sx={{ color: '#666', fontSize: '0.75rem' }}
                >
                  Refresh
                </Button>
              </Box>
              
              {paymentHistory.length > 0 ? (
                <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                  {paymentHistory.map((payment, index) => (
                    <Box
                      key={payment._id}
                      sx={{
                        p: 2,
                        mb: 2,
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        bgcolor: '#f8f9fa'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatCurrency(payment.amount)}
                        </Typography>
                        <Chip
                          label={payment.status}
                          size="small"
                          color={payment.status === 'Success' ? 'success' : 'error'}
                        />
                      </Box>
                      <Typography variant="caption" color="textSecondary">
                        {payment.paymentMethod} • {payment.date} {payment.time && `at ${payment.time}`}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                        TXN: {payment.transactionId}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <ReceiptIcon sx={{ fontSize: 48, color: '#bdbdbd', mb: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    No payment history available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Payment Dialog */}
      <Dialog 
        open={paymentDialog} 
        onClose={() => setPaymentDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PaymentIcon sx={{ color: '#667eea' }} />
            Make Payment
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Payment Amount"
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              sx={{ mb: 3 }}
              helperText={`Maximum: ${formatCurrency(feeDetails?.dueAmount || 0)}`}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
              }}
            />

            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Select Payment Method
            </Typography>
            
            <Grid container spacing={2}>
              {paymentMethods.map((method) => (
                <Grid item xs={6} key={method.id}>
                  <PaymentMethodCard
                    selected={paymentMethod === method.id}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <CardContent sx={{ p: 2, textAlign: 'center' }}>
                      <Box sx={{ color: paymentMethod === method.id ? 'white' : '#667eea', mb: 1 }}>
                        {method.icon}
                      </Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: paymentMethod === method.id ? 'white' : '#2c3e50' 
                        }}
                      >
                        {method.name}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: paymentMethod === method.id ? 'rgba(255,255,255,0.8)' : 'textSecondary' 
                        }}
                      >
                        {method.description}
                      </Typography>
                    </CardContent>
                  </PaymentMethodCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setPaymentDialog(false)}
            sx={{ color: '#7f8c8d' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            variant="contained"
            disabled={processing || !paymentAmount || !paymentMethod}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              minWidth: 120,
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              }
            }}
            startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <PaymentIcon />}
          >
            {processing ? 'Processing...' : 'Pay Now'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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

export default StudentFeePayment;
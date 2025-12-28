import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Assessment as ReportIcon,
  FileDownload as DownloadIcon,
  Visibility as ViewIcon,
  MonetizationOn as MoneyIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
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

const ReportCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  borderRadius: '16px',
  border: '1px solid rgba(0,0,0,0.08)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  },
}));

const StatusChip = ({ status }) => {
  const getStatusColor = () => {
    switch (status?.toLowerCase()) {
      case 'paid': return { bg: '#4caf50', color: '#ffffff' };
      case 'overdue': return { bg: '#f44336', color: '#ffffff' };
      case 'pending': return { bg: '#ff9800', color: '#ffffff' };
      case 'partial': return { bg: '#2196f3', color: '#ffffff' };
      default: return { bg: '#757575', color: '#ffffff' };
    }
  };

  const colors = getStatusColor();
  
  return (
    <Chip
      label={status}
      size="small"
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

const FinancialReports = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const { sclassesList, loading: classesLoading } = useSelector((state) => state.sclass);
  const [loading, setLoading] = useState(false);
  const [dueReports, setDueReports] = useState([]);
  const [filters, setFilters] = useState({
    reportType: 'due_fees',
    class: 'all',
    dateRange: '30',
    status: 'all'
  });
  const [reportStats, setReportStats] = useState({
    totalDue: 0,
    totalOverdue: 0,
    totalStudents: 0,
    totalAmount: 0
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const reportTypes = [
    { value: 'due_fees', label: 'Due Fees Report', icon: <MoneyIcon /> },
    { value: 'overdue_fees', label: 'Overdue Fees Report', icon: <WarningIcon /> },
    { value: 'payment_summary', label: 'Payment Summary', icon: <ReportIcon /> },
    { value: 'class_wise', label: 'Class-wise Report', icon: <SchoolIcon /> }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'partial', label: 'Partial Payment' }
  ];

  useEffect(() => {
    // Load classes using Redux (same as StudentFees page)
    if (currentUser?.schoolName) {
      dispatch(getAllSclasses(currentUser.schoolName, "Sclass"));
    }
    generateReport();
  }, [dispatch, currentUser]);

  useEffect(() => {
    generateReport();
  }, [filters]);

  const generateReport = async () => {
    setLoading(true);
    try {
      console.log('Generating report with filters:', filters);
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        reportType: filters.reportType,
        status: filters.status
      });
      
      if (filters.class !== 'all') {
        queryParams.append('classId', filters.class);
      }
      
      // Fetch real data from API
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/StudentFees/${currentUser.schoolName}/reports?${queryParams.toString()}`
      );
      
      console.log('Financial reports response:', response.data);
      
      setDueReports(response.data.reports || []);
      setReportStats(response.data.stats || {
        totalDue: 0,
        totalOverdue: 0,
        totalStudents: 0,
        totalAmount: 0
      });
      
      setSnackbar({
        open: true,
        message: 'Report generated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error generating report:', error);
      
      // Fallback to demo data if API fails
      const demoData = generateDemoReport();
      setDueReports(demoData.reports);
      setReportStats(demoData.stats);
      
      setSnackbar({
        open: true,
        message: 'Using demo data - API connection failed',
        severity: 'warning'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateDemoReport = () => {
    // Generate demo data based on selected filters
    const demoStudents = [
      { id: 1, name: 'Rahul Sharma', rollNum: '001', class: 'Class 9', totalFee: 15000, paidAmount: 10000, dueAmount: 5000, status: 'Partial', dueDate: '2024-02-15' },
      { id: 2, name: 'Priya Singh', rollNum: '002', class: 'Class 9', totalFee: 15000, paidAmount: 0, dueAmount: 15000, status: 'Overdue', dueDate: '2024-01-15' },
      { id: 3, name: 'Amit Kumar', rollNum: '003', class: 'Class 10', totalFee: 18000, paidAmount: 8000, dueAmount: 10000, status: 'Pending', dueDate: '2024-02-20' },
      { id: 4, name: 'Sneha Patel', rollNum: '004', class: 'Class 10', totalFee: 18000, paidAmount: 18000, dueAmount: 0, status: 'Paid', dueDate: '2024-02-10' },
      { id: 5, name: 'Vikram Joshi', rollNum: '005', class: 'Class 11', totalFee: 20000, paidAmount: 5000, dueAmount: 15000, status: 'Overdue', dueDate: '2024-01-10' },
      { id: 6, name: 'Anjali Gupta', rollNum: '006', class: 'Class 11', totalFee: 20000, paidAmount: 20000, dueAmount: 0, status: 'Paid', dueDate: '2024-02-05' },
      { id: 7, name: 'Rohit Verma', rollNum: '007', class: 'Class 12', totalFee: 22000, paidAmount: 12000, dueAmount: 10000, status: 'Partial', dueDate: '2024-02-25' },
      { id: 8, name: 'Kavya Reddy', rollNum: '008', class: 'Class 12', totalFee: 22000, paidAmount: 0, dueAmount: 22000, status: 'Overdue', dueDate: '2024-01-20' }
    ];

    // Filter based on selected criteria
    let filteredData = demoStudents;

    if (filters.class !== 'all') {
      filteredData = filteredData.filter(student => student.class === filters.class);
    }

    if (filters.status !== 'all') {
      filteredData = filteredData.filter(student => student.status.toLowerCase() === filters.status);
    }

    if (filters.reportType === 'overdue_fees') {
      filteredData = filteredData.filter(student => student.status === 'Overdue');
    }

    // Calculate statistics
    const stats = {
      totalDue: filteredData.filter(s => s.dueAmount > 0).length,
      totalOverdue: filteredData.filter(s => s.status === 'Overdue').length,
      totalStudents: filteredData.length,
      totalAmount: filteredData.reduce((sum, s) => sum + s.dueAmount, 0)
    };

    return { reports: filteredData, stats };
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const downloadReport = () => {
    // Create CSV content
    const headers = ['Roll No', 'Student Name', 'Class', 'Total Fee', 'Paid Amount', 'Due Amount', 'Status', 'Due Date'];
    const csvContent = [
      headers.join(','),
      ...dueReports.map(student => [
        student.student?.rollNum || student.rollNum,
        student.student?.name || student.name,
        student.class,
        student.totalFee,
        student.paidAmount,
        student.dueAmount,
        student.status,
        student.dueDate
      ].join(','))
    ].join('\n');

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filters.reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSnackbar({
      open: true,
      message: 'Report downloaded successfully',
      severity: 'success'
    });
  };

  const printReport = () => {
    window.print();
    setSnackbar({
      open: true,
      message: 'Print dialog opened',
      severity: 'info'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <GradientCard sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
              <ReportIcon sx={{ fontSize: 30, color: 'white' }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                Financial Reports
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Generate and view comprehensive financial reports including due fees and payment summaries
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </GradientCard>

      {/* Report Filters */}
      <ReportCard sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
            Report Filters
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={filters.reportType}
                  label="Report Type"
                  onChange={(e) => handleFilterChange('reportType', e.target.value)}
                >
                  {reportTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {type.icon}
                        {type.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Class</InputLabel>
                <Select
                  value={filters.class}
                  label="Class"
                  onChange={(e) => handleFilterChange('class', e.target.value)}
                  disabled={classesLoading}
                >
                  <MenuItem value="all">All Classes</MenuItem>
                  {classesLoading ? (
                    <MenuItem disabled>Loading classes...</MenuItem>
                  ) : (sclassesList || []).length === 0 ? (
                    <MenuItem disabled>No classes found</MenuItem>
                  ) : (
                    (sclassesList || []).map((cls) => (
                      <MenuItem key={cls._id} value={cls._id}>
                        {cls.sclassName}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', gap: 1, height: '100%', alignItems: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={generateReport}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    flex: 1
                  }}
                >
                  Generate
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </ReportCard>

      {/* Report Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
            <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 700 }}>
              {reportStats.totalStudents}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total Students
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2, bgcolor: '#fff3e0', borderRadius: 2 }}>
            <Typography variant="h4" sx={{ color: '#f57c00', fontWeight: 700 }}>
              {reportStats.totalDue}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Students with Due
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2, bgcolor: '#ffebee', borderRadius: 2 }}>
            <Typography variant="h4" sx={{ color: '#d32f2f', fontWeight: 700 }}>
              {reportStats.totalOverdue}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Overdue Students
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2, bgcolor: '#e8f5e8', borderRadius: 2 }}>
            <Typography variant="h4" sx={{ color: '#388e3c', fontWeight: 700 }}>
              {formatCurrency(reportStats.totalAmount)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total Due Amount
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Report Actions */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={printReport}
          sx={{ borderColor: '#667eea', color: '#667eea' }}
        >
          Print Report
        </Button>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={downloadReport}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          Download CSV
        </Button>
      </Box>

      {/* Report Table */}
      <ReportCard>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
              {reportTypes.find(t => t.value === filters.reportType)?.label || 'Report Results'}
            </Typography>
          </Box>
          
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <CircularProgress size={60} />
              <Typography sx={{ mt: 2 }}>Generating report...</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                  <TableRow>
                    <TableCell><strong>Roll No</strong></TableCell>
                    <TableCell><strong>Student Name</strong></TableCell>
                    <TableCell><strong>Class</strong></TableCell>
                    <TableCell align="right"><strong>Total Fee</strong></TableCell>
                    <TableCell align="right"><strong>Paid Amount</strong></TableCell>
                    <TableCell align="right"><strong>Due Amount</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Due Date</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dueReports.map((student) => (
                    <TableRow key={student._id || student.id} hover>
                      <TableCell>{student.student?.rollNum || student.rollNum}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: '#667eea' }}>
                            {(student.student?.name || student.name).charAt(0)}
                          </Avatar>
                          {student.student?.name || student.name}
                        </Box>
                      </TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell align="right">{formatCurrency(student.totalFee)}</TableCell>
                      <TableCell align="right">{formatCurrency(student.paidAmount)}</TableCell>
                      <TableCell align="right">
                        <Typography 
                          sx={{ 
                            color: student.dueAmount > 0 ? '#d32f2f' : '#388e3c',
                            fontWeight: 600
                          }}
                        >
                          {formatCurrency(student.dueAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={student.status} />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarIcon sx={{ fontSize: 16, color: 'textSecondary' }} />
                          {new Date(student.dueDate).toLocaleDateString('en-IN')}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton size="small" sx={{ color: '#667eea' }}>
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {dueReports.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <ReportIcon sx={{ fontSize: 64, color: '#bdbdbd', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary">
                    No data found for selected criteria
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Try adjusting your filters and generate the report again
                  </Typography>
                </Box>
              )}
            </TableContainer>
          )}
        </CardContent>
      </ReportCard>

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

export default FinancialReports;
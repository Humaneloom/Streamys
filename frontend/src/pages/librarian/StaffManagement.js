import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Avatar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Book as BookIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Work as WorkIcon,
  Build as BuildIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import axios from 'axios';

const StaffManagement = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const { teachersList, loading: teachersLoading } = useSelector((state) => state.teacher);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [issueForm, setIssueForm] = useState({
    bookId: '',
    dueDate: '',
    notes: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [bookLoans, setBookLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [confirmCleanupDialogOpen, setConfirmCleanupDialogOpen] = useState(false);
  const [confirmRestoreDialogOpen, setConfirmRestoreDialogOpen] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState(null);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);

  // Fetch teachers when component mounts
  useEffect(() => {
    if (currentUser?.schoolName) {
      dispatch(getAllTeachers(currentUser.schoolName));
      fetchAllBookLoans();
      fetchAvailableBooks();
    }
  }, [currentUser, dispatch]);

  // Reset form when issue form is opened
  useEffect(() => {
    if (showIssueForm) {
      setIssueForm({ bookId: '', dueDate: '', notes: '' });
    }
  }, [showIssueForm]);

  const fetchAvailableBooks = async () => {
    if (!currentUser?.schoolName) return;
    
    setBooksLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/Books/${currentUser.schoolName}`);
      
      let books = [];
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        books = response.data.data;
      } else if (Array.isArray(response.data)) {
        books = response.data;
      } else if (response.data && Array.isArray(response.data.books)) {
        books = response.data.books;
      }
      
      const available = books.filter(book => book.availableQuantity > 0);
      setAvailableBooks(available);
      
      // Fallback to Default School if no books found
      if (available.length === 0 && currentUser.schoolName !== 'Default School') {
        try {
          const fallbackResponse = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/Books/Default School`);
          let fallbackBooks = [];
          if (fallbackResponse.data && fallbackResponse.data.success && Array.isArray(fallbackResponse.data.data)) {
            fallbackBooks = fallbackResponse.data.data;
          } else if (Array.isArray(fallbackResponse.data)) {
            fallbackBooks = fallbackResponse.data;
          }
          
          const fallbackAvailable = fallbackBooks.filter(book => book.availableQuantity > 0);
          if (fallbackAvailable.length > 0) {
            setAvailableBooks(fallbackAvailable);
          }
        } catch (fallbackError) {
          console.log('Fallback also failed:', fallbackError);
        }
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setAvailableBooks([]);
    } finally {
      setBooksLoading(false);
    }
  };

  const fetchAllBookLoans = async () => {
    if (!currentUser?.schoolName) {
      console.log('No school name available, skipping fetch');
      return;
    }

    setLoading(true);
    try {
      // Use the new teacher-only endpoint
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/BookLoans/${currentUser.schoolName}/teachers`);
      console.log('Teacher book loans response:', response.data);
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setBookLoans(response.data.data);
        console.log('Set bookLoans to response.data.data:', response.data.data);
      } else if (Array.isArray(response.data)) {
        setBookLoans(response.data);
        console.log('Set bookLoans to response.data:', response.data);
      } else if (response.data && Array.isArray(response.data.bookLoans)) {
        setBookLoans(response.data.bookLoans);
        console.log('Set bookLoans to response.data.bookLoans:', response.data.bookLoans);
      } else {
        console.warn('Unexpected API response structure:', response.data);
        console.warn('Setting bookLoans to empty array');
        setBookLoans([]);
      }
      
    } catch (error) {
      console.error('Error fetching teacher book loans:', error);
      console.log('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      // If API doesn't exist yet or fails, use empty array
      setBookLoans([]);
      
      // Try alternative endpoint if the first one fails
      if (error.response?.status === 404) {
        console.log('Trying alternative endpoint...');
        try {
          const altResponse = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/api/BookLoans/${currentUser.schoolName}`);
          console.log('Alternative endpoint response:', altResponse.data);
          if (Array.isArray(altResponse.data)) {
            setBookLoans(altResponse.data);
          } else {
            setBookLoans([]);
          }
        } catch (altError) {
          console.error('Alternative endpoint also failed:', altError);
          setBookLoans([]);
        }
      }
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const handleIssueBook = async () => {
    if (!selectedTeacher) {
      setSnackbar({ 
        open: true, 
        message: 'Please select a teacher first', 
        severity: 'warning' 
      });
      return;
    }

    if (!issueForm.bookId || !issueForm.dueDate) {
      setSnackbar({ 
        open: true, 
        message: 'Please select a book and set a due date', 
        severity: 'warning' 
      });
      return;
    }

    const teacher = teachersList.find(t => t._id === selectedTeacher);
    const selectedBook = availableBooks.find(book => book._id === issueForm.bookId);
    
    if (!selectedBook) {
      setSnackbar({ 
        open: true, 
        message: 'Please select a valid book', 
        severity: 'warning' 
      });
      return;
    }
    
    try {
      // Ensure due date is in the correct format and not in the past
      const selectedDueDate = new Date(issueForm.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDueDate < today) {
        setSnackbar({ 
          open: true, 
          message: 'Due date cannot be in the past', 
          severity: 'warning' 
        });
        return;
      }
      
             const newBookLoan = {
         bookId: selectedBook._id,
         studentId: teacher._id, // Backend expects studentId for both students and teachers
         teacherId: teacher._id, // Also send as teacherId to help backend
         dueDate: issueForm.dueDate,
         notes: issueForm.notes,
         schoolName: currentUser.schoolName,
         librarianId: currentUser._id,
         borrowerType: 'teacher',
         isStaffMember: true // Add this flag to help backend identify teacher loans
       };

             console.log('Sending book loan request for TEACHER (using studentId field):', {
         ...newBookLoan,
         teacherName: teacher.name,
         bookTitle: selectedBook.title
       });

             const response = await axios.post(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/BookLoan/issue`, newBookLoan);
      
             console.log('Book loan response:', response.data);
       
               // Add the new loan to the list immediately
        const newLoan = response.data.bookLoan;
        console.log('Adding new loan to state:', newLoan);
        setBookLoans(prevLoans => {
          const updatedLoans = [newLoan, ...prevLoans];
          console.log('Updated bookLoans state:', updatedLoans.length, 'loans');
          return updatedLoans;
        });
        
        // Refresh available books (since one was borrowed)
        await fetchAvailableBooks();
        
        // Don't refresh all loans - we already added the new one above
        // await fetchAllBookLoans();
      
             setShowIssueForm(false);
       setIssueForm({ bookId: '', dueDate: '', notes: '' });
       setSelectedTeacher(''); // Reset teacher selection
      
      setSnackbar({ 
        open: true, 
        message: `Book "${selectedBook.title}" issued to ${teacher?.name} successfully!`, 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Error issuing book:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      setSnackbar({ 
        open: true, 
        message: `Error issuing book: ${errorMessage}`, 
        severity: 'error' 
      });
    }
  };

  const handleReturnBook = async (loanId) => {
    try {
             const response = await axios.put(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/BookLoan/${loanId}/return`, {
         returnDate: new Date().toISOString().split('T')[0]
       });
      
      setBookLoans(prevLoans => 
        prevLoans.map(loan => 
          loan._id === loanId ? { ...loan, status: 'returned', returnDate: response.data.returnDate } : loan
        )
      );
      
      setSnackbar({ 
        open: true, 
        message: 'Book returned successfully!', 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Error returning book:', error);
      setSnackbar({ 
        open: true, 
        message: 'Error returning book. Please try again.', 
        severity: 'error' 
      });
    }
  };

  const handleDeleteLoan = async (loanId) => {
    setLoanToDelete(loanId);
    setConfirmDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!loanToDelete) return;

    console.log('🔍 Attempting to delete book loan with ID:', loanToDelete);
    console.log('🔍 ID type:', typeof loanToDelete);
    console.log('🔍 ID length:', loanToDelete.length);
    
    // Let's also log the loan details from our state
    const loanToDeleteDetails = bookLoans.find(loan => loan._id === loanToDelete);
    console.log('🔍 Loan details from state:', loanToDeleteDetails);

    try {
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/BookLoan/${loanToDelete}`);
      
      console.log('✅ Delete response:', response.data);
      
      setBookLoans(prevLoans => prevLoans.filter(loan => loan._id !== loanToDelete));
      
      setSnackbar({ 
        open: true, 
        message: `Book loan record deleted successfully!`, 
        severity: 'success' 
      });
    } catch (error) {
      console.error('❌ Error deleting book loan:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      setSnackbar({ 
        open: true, 
        message: `Error deleting book loan: ${error.response?.data?.message || error.message}`, 
        severity: 'error' 
      });
    } finally {
      setConfirmDeleteDialogOpen(false);
      setLoanToDelete(null);
    }
  };

  const handleCleanupOrphanedLoans = async () => {
    if (!currentUser?.schoolName) {
      setSnackbar({
        open: true,
        message: 'School name not available. Cannot perform cleanup.',
        severity: 'warning'
      });
      return;
    }

    if (bookLoans.length === 0) {
      setSnackbar({
        open: true,
        message: 'No book loans to clean up.',
        severity: 'info'
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/BookLoans/${currentUser.schoolName}/cleanup`);
      console.log('Cleanup response:', response.data);
      
      if (response.data.cleanedCount > 0) {
        // Refresh the book loans after cleanup
        await fetchAllBookLoans();
        setSnackbar({
          open: true,
          message: `Cleanup completed! Removed ${response.data.cleanedCount} orphaned book loan records.`,
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'No orphaned book loans found. Your data is clean!',
          severity: 'info'
        });
      }
    } catch (error) {
      console.error('Error cleaning up orphaned loans:', error);
      setSnackbar({
        open: true,
        message: `Error during cleanup: ${error.response?.data?.message || error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setConfirmCleanupDialogOpen(false);
    }
  };

  const handleRestoreBookAvailability = async () => {
    if (!currentUser?.schoolName) {
      setSnackbar({
        open: true,
        message: 'School name not available. Cannot restore book availability.',
        severity: 'warning'
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/BookLoans/${currentUser.schoolName}/restore-availability`);
      console.log('Restore availability response:', response.data);
      
      if (response.data.restoredCount > 0) {
        // Refresh available books after restoration
        await fetchAvailableBooks();
        setSnackbar({
          open: true,
          message: `Book availability restored! Fixed ${response.data.restoredCount} books.`,
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'No book availability issues found. All books are properly configured!',
          severity: 'info'
        });
      }
    } catch (error) {
      console.error('Error restoring book availability:', error);
      setSnackbar({
        open: true,
        message: `Error restoring book availability: ${error.response?.data?.message || error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setConfirmRestoreDialogOpen(false);
    }
  };

  const handleConfirmCleanup = async () => {
    await handleCleanupOrphanedLoans();
  };

  const handleConfirmRestore = async () => {
    await handleRestoreBookAvailability();
  };

  const handleLibraryMaintenance = async () => {
    setMaintenanceLoading(true);
    try {
      await handleCleanupOrphanedLoans(); // Cleanup orphaned loans
      await handleRestoreBookAvailability(); // Restore book availability
      await fetchAllBookLoans(); // Refresh all loans to get the latest status
      await fetchAvailableBooks(); // Refresh available books
      setSnackbar({
        open: true,
        message: 'Library maintenance completed successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error during library maintenance:', error);
      setSnackbar({
        open: true,
        message: `Error during library maintenance: ${error.response?.data?.message || error.message}`,
        severity: 'error'
      });
    } finally {
      setMaintenanceLoading(false);
    }
  };

  const filteredLoans = (Array.isArray(bookLoans) ? bookLoans : []).filter(loan => {
    // SIMPLE: Only show loans that have a teacher field (no student data mixing)
    if (!loan.teacher) {
      return false; // Filter out any loan without teacher field
    }
    
    const matchesSearch = (loan.teacher?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (loan.book?.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || loan.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'borrowed': return 'primary';
      case 'overdue': return 'error';
      case 'returned': return 'success';
      default: return 'default';
    }
  };

  const getSelectedTeacherName = () => {
    return teachersList.find(t => t._id === selectedTeacher)?.name || '';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // SIMPLE: Only count loans with teacher field
  const teacherLoans = (Array.isArray(bookLoans) ? bookLoans : []).filter(loan => loan.teacher);
  const safeBookLoans = teacherLoans;
  
     // Simple logging
   console.log(`Total: ${bookLoans.length} | Teacher: ${teacherLoans.length} | Display: ${filteredLoans.length}`);

  if (!initialized) {
    return (
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'white' }}>
            Loading Staff Library Management System...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 3, 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            mb: 1
          }}
        >
          👥 Staff Library Management
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            textAlign: 'center', 
            color: 'text.secondary',
            mb: 3
          }}
        >
          Manage teacher book loans and library operations
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': { transform: 'translateY(-5px)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {safeBookLoans.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Loans
                  </Typography>
                </Box>
                <BookIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': { transform: 'translateY(-5px)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {safeBookLoans.filter(loan => loan.status === 'borrowed').length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Currently Borrowed
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            color: '#8B4513',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': { transform: 'translateY(-5px)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {safeBookLoans.filter(loan => loan.status === 'overdue').length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Overdue Books
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            color: '#2E7D32',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': { transform: 'translateY(-5px)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    ${safeBookLoans.reduce((sum, loan) => sum + (loan.fine || 0), 0).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Fines
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Combined Teacher Selection & Search & Filter */}
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Teacher Management & Search
        </Typography>
        
        {/* Teacher Selection Row */}
        <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Select Teacher</InputLabel>
              <Select
                value={selectedTeacher || ''}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                label="Select Teacher"
                disabled={teachersLoading}
                sx={{ borderRadius: 2 }}
              >
                {teachersLoading ? (
                  <MenuItem disabled>Loading teachers...</MenuItem>
                ) : (teachersList || []).length === 0 ? (
                  <MenuItem disabled>No teachers found</MenuItem>
                ) : (
                  (teachersList || []).map((teacher) => (
                    <MenuItem key={teacher._id} value={teacher._id}>
                      {teacher.name} ({teacher.teachSubject?.subName || teacher.teachSubject || 'No Subject'})
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowIssueForm(true)}
              disabled={!selectedTeacher}
              sx={{ 
                borderRadius: 2, 
                py: 1.5,
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)'
                }
              }}
            >
              Issue Book
            </Button>
          </Grid>
        </Grid>
        
        {/* Search & Filter Row */}
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search teachers or books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ borderRadius: 2 }}
            />
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              Only showing teacher book loans
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              SelectProps={{ native: true }}
              sx={{ borderRadius: 2 }}
            >
              <option value="all">All Status</option>
              <option value="borrowed">Borrowed</option>
              <option value="overdue">Overdue</option>
              <option value="returned">Returned</option>
            </TextField>
          </Grid>
          <Grid item xs={12} md={5}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<BuildIcon />}
              onClick={handleLibraryMaintenance}
              disabled={maintenanceLoading}
              sx={{ 
                borderRadius: 2, 
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                },
                '&:disabled': {
                  background: '#ccc'
                }
              }}
            >
              {maintenanceLoading ? 'Maintaining...' : 'Library Maintenance'}
            </Button>
          </Grid>
        </Grid>
        
        {/* Teacher Info */}
        {selectedTeacher && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(102, 126, 234, 0.1)', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                <WorkIcon />
              </Avatar>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Teacher: {getSelectedTeacherName()}
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Issue Book Form */}
      {showIssueForm && selectedTeacher && (
        <Paper sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            <BookIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Issue New Book to {getSelectedTeacherName()}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teacher Name"
                value={getSelectedTeacherName()}
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Select Book</InputLabel>
                <Select
                  value={issueForm.bookId}
                  onChange={(e) => setIssueForm({...issueForm, bookId: e.target.value})}
                  label="Select Book"
                  disabled={booksLoading || availableBooks.length === 0}
                  sx={{ borderRadius: 2 }}
                >
                  {booksLoading ? (
                    <MenuItem disabled>Loading books...</MenuItem>
                  ) : availableBooks.length === 0 ? (
                    <MenuItem disabled>No books available</MenuItem>
                  ) : (
                    availableBooks.map((book) => (
                      <MenuItem key={book._id} value={book._id}>
                        {book.title} by {book.author} (Available: {book.availableQuantity})
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
                         <Grid item xs={12} md={6}>
               <TextField
                 fullWidth
                 type="date"
                 label="Due Date"
                 value={issueForm.dueDate}
                 onChange={(e) => setIssueForm({...issueForm, dueDate: e.target.value})}
                 InputLabelProps={{ shrink: true }}
                 inputProps={{
                   min: new Date().toISOString().split('T')[0] // Prevent selecting past dates
                 }}
                 sx={{ borderRadius: 2 }}
               />
             </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Notes"
                value={issueForm.notes}
                onChange={(e) => setIssueForm({...issueForm, notes: e.target.value})}
                placeholder="Optional notes about the book..."
                sx={{ borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={handleIssueBook}
                  sx={{ 
                    borderRadius: 2, 
                    py: 1.5,
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)'
                    }
                  }}
                >
                  Issue Book
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => setShowIssueForm(false)}
                  sx={{ borderRadius: 2, py: 1.5 }}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Book Loans Table */}
      <Paper sx={{ 
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            <BookIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Staff Book Loans Management
          </Typography>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(102, 126, 234, 0.1)' }}>
                <TableCell sx={{ fontWeight: 600 }}>Teacher</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Book</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Issue Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Fine</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
                      <CircularProgress size={24} sx={{ mr: 2 }} />
                      Loading book loans...
                    </Box>
                  </TableCell>
                </TableRow>
              ) : filteredLoans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                      <BookIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="textSecondary" gutterBottom>
                        {safeBookLoans.length === 0 ? 'No book loans found' : 'No loans match your search criteria'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {safeBookLoans.length === 0 ? 'Issue some books to get started!' : 'Try adjusting your search or filter criteria.'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLoans.map((loan) => (
                  <TableRow 
                    key={loan._id}
                    sx={{ 
                      '&:nth-of-type(odd)': { bgcolor: 'rgba(102, 126, 234, 0.02)' },
                      '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.05)' },
                      transition: 'background-color 0.2s ease',
                      ...((!loan.teacher?.name || !loan.book?.title) && {
                        bgcolor: 'rgba(255, 152, 0, 0.1)',
                        borderLeft: '4px solid #ff9800'
                      })
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                          <WorkIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {loan.teacher?.name || 'Unknown Teacher'}
                          </Typography>
                          {!loan.teacher?.name && (
                            <Typography variant="caption" color="error" sx={{ fontStyle: 'italic' }}>
                              Teacher data missing
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                          <BookIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {loan.book?.title || 'Unknown Book'}
                          </Typography>
                          {!loan.book?.title && (
                            <Typography variant="caption" color="error" sx={{ fontStyle: 'italic' }}>
                              Book data missing
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={formatDate(loan.issueDate)} 
                        size="small" 
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={formatDate(loan.dueDate)} 
                        size="small" 
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={loan.status || 'unknown'} 
                        color={getStatusColor(loan.status)}
                        size="small"
                        sx={{ borderRadius: 1, fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      {loan.fine > 0 ? (
                        <Chip 
                          label={`$${loan.fine.toFixed(2)}`}
                          color="warning"
                          size="small"
                          sx={{ borderRadius: 1, fontWeight: 600 }}
                        />
                      ) : (
                        <Typography variant="body2" color="textSecondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {loan.status !== 'returned' && (
                          <Tooltip title="Return Book">
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={() => handleReturnBook(loan._id)}
                              sx={{ 
                                bgcolor: 'success.light',
                                color: 'white',
                                '&:hover': { bgcolor: 'success.main' }
                              }}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete Record">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteLoan(loan._id)}
                            sx={{ 
                              bgcolor: 'error.light',
                              color: 'white',
                              '&:hover': { bgcolor: 'error.main' }
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
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDeleteDialogOpen}
        onClose={() => setConfirmDeleteDialogOpen(false)}
        aria-labelledby="confirm-delete-dialog-title"
        aria-describedby="confirm-delete-dialog-description"
      >
        <DialogTitle id="confirm-delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-dialog-description">
            {loanToDelete && (() => {
              const loan = bookLoans.find(l => l._id === loanToDelete);
              const teacherName = loan?.teacher?.name || 'Unknown Teacher';
              const bookTitle = loan?.book?.title || 'Unknown Book';
              return (
                <>
                  Are you sure you want to delete this book loan record?
                  <br /><br />
                  <strong>Teacher:</strong> {teacherName}<br />
                  <strong>Book:</strong> {bookTitle}<br /><br />
                  This action cannot be undone.
                </>
              );
            })()}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

             {/* Confirm Cleanup Dialog */}
       <Dialog
         open={confirmCleanupDialogOpen}
         onClose={() => setConfirmCleanupDialogOpen(false)}
         aria-labelledby="confirm-cleanup-dialog-title"
         aria-describedby="confirm-cleanup-dialog-description"
       >
         <DialogTitle id="confirm-cleanup-dialog-title">Confirm Cleanup</DialogTitle>
         <DialogContent>
           <DialogContentText id="confirm-cleanup-dialog-description">
             This will remove any orphaned book loan records (loans without valid teacher or book references). This action cannot be undone.
           </DialogContentText>
         </DialogContent>
         <DialogActions>
           <Button onClick={() => setConfirmCleanupDialogOpen(false)} color="primary">
             Cancel
           </Button>
           <Button onClick={handleConfirmCleanup} color="warning" variant="contained">
             Cleanup
           </Button>
         </DialogActions>
       </Dialog>

       {/* Confirm Restore Dialog */}
       <Dialog
         open={confirmRestoreDialogOpen}
         onClose={() => setConfirmRestoreDialogOpen(false)}
         aria-labelledby="confirm-restore-dialog-title"
         aria-describedby="confirm-restore-dialog-description"
       >
         <DialogTitle id="confirm-restore-dialog-title">Confirm Book Availability Restoration</DialogTitle>
         <DialogContent>
           <DialogContentText id="confirm-restore-dialog-description">
             This will restore availability for books that are marked as "out of stock" but have no active loans. This can fix books that were incorrectly marked as unavailable due to orphaned loan records.
           </DialogContentText>
         </DialogContent>
         <DialogActions>
           <Button onClick={() => setConfirmRestoreDialogOpen(false)} color="primary">
             Cancel
           </Button>
           <Button onClick={handleConfirmRestore} color="info" variant="contained">
             Restore Books
           </Button>
         </DialogActions>
       </Dialog>
    </Box>
  );
};

export default StaffManagement;

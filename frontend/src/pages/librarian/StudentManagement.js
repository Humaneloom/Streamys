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
  Book as BookIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  Delete as DeleteIcon,
  Class as ClassIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import axios from 'axios';

const StudentManagement = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const { sclassesList: sclassesListFromRedux, loading: classesLoadingFromRedux } = useSelector((state) => state.sclass);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [studentsInClass, setStudentsInClass] = useState([]);
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
  const [loanToDelete, setLoanToDelete] = useState(null);

  // Fetch classes when component mounts
  useEffect(() => {
    if (currentUser?.schoolName) {
      dispatch(getAllSclasses(currentUser.schoolName, "Sclass"));
      fetchAllBookLoans(); // Fetch existing book loans
      fetchAvailableBooks(); // Fetch available books
    }
  }, [currentUser, dispatch]);

  // Fetch students when class is selected
  useEffect(() => {
    if (selectedClass) {
      fetchStudentsInClass();
    } else {
      setStudentsInClass([]);
      setSelectedStudent('');
    }
  }, [selectedClass]);

  // Reset selectedStudent when studentsInClass changes to ensure valid selection
  useEffect(() => {
    if (studentsInClass.length > 0) {
      // Check if current selectedStudent is still valid
      const isValidStudent = studentsInClass.some(student => student._id === selectedStudent);
      if (!isValidStudent) {
        setSelectedStudent('');
      }
    } else {
      setSelectedStudent('');
    }
  }, [studentsInClass, selectedStudent]);

  // Reset form when issue form is opened
  useEffect(() => {
    if (showIssueForm) {
      setIssueForm({ bookId: '', dueDate: '', notes: '' });
      console.log('Form opened, reset form state');
    }
  }, [showIssueForm]);

  const fetchAvailableBooks = async () => {
    if (!currentUser?.schoolName) return;
    
    setBooksLoading(true);
    try {
      console.log('Fetching books for school:', currentUser.schoolName);
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/Books/${currentUser.schoolName}`);
      
      console.log('Books API response:', response.data);
      
      // Handle the structured response from backend
      let books = [];
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        books = response.data.data;
      } else if (Array.isArray(response.data)) {
        books = response.data;
      } else if (response.data && Array.isArray(response.data.books)) {
        books = response.data.books;
      }
      
      console.log('Extracted books array:', books);
      console.log('Books array length:', books.length);
      
      // Filter only available books
      const available = books.filter(book => book.availableQuantity > 0);
      setAvailableBooks(available);
      console.log('Available books:', available);
      console.log('Books with availableQuantity > 0:', available.length);
      console.log('Sample book structure:', available[0]);
      
      // If no books found, try to fetch from Default School as fallback
      if (available.length === 0 && currentUser.schoolName !== 'Default School') {
        console.log('No books found for school', currentUser.schoolName, '- trying Default School as fallback');
        try {
          const fallbackResponse = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/Books/Default School`);
          console.log('Fallback response:', fallbackResponse.data);
          
          let fallbackBooks = [];
          if (fallbackResponse.data && fallbackResponse.data.success && Array.isArray(fallbackResponse.data.data)) {
            fallbackBooks = fallbackResponse.data.data;
          } else if (Array.isArray(fallbackResponse.data)) {
            fallbackBooks = fallbackResponse.data;
          }
          
          const fallbackAvailable = fallbackBooks.filter(book => book.availableQuantity > 0);
          if (fallbackAvailable.length > 0) {
            console.log('Using fallback books from Default School:', fallbackAvailable.length);
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
      // Use the new student-only endpoint
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/BookLoans/${currentUser.schoolName}/students`);
      console.log('Student book loans response:', response.data);
      
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
      console.error('Error fetching student book loans:', error);
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

  const fetchStudentsInClass = async () => {
    if (!selectedClass) return;
    
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/Sclass/Students/${selectedClass}`);
      setStudentsInClass(response.data);
      console.log('Students in class:', response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      setSnackbar({ 
        open: true, 
        message: 'Error fetching students in class', 
        severity: 'error' 
      });
    }
  };

  const handleIssueBook = async () => {
    console.log('handleIssueBook called with:', {
      selectedStudent,
      issueForm,
      availableBooks: availableBooks.length
    });
    
    if (!selectedStudent) {
      setSnackbar({ 
        open: true, 
        message: 'Please select a student first', 
        severity: 'warning' 
      });
      return;
    }

    if (!issueForm.bookId || !issueForm.dueDate) {
      console.log('Validation failed:', {
        bookId: issueForm.bookId,
        dueDate: issueForm.dueDate,
        bookIdEmpty: !issueForm.bookId,
        dueDateEmpty: !issueForm.dueDate
      });
      setSnackbar({ 
        open: true, 
        message: 'Please select a book and set a due date', 
        severity: 'warning' 
      });
      return;
    }

    // Get selected student details
    const student = studentsInClass.find(s => s._id === selectedStudent);
    
    // Find the selected book
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
      // Create new book loan via API - now using bookId as expected by backend
      const newBookLoan = {
        bookId: selectedBook._id,        // ✅ Backend expects bookId
        studentId: student._id,          // ✅ Backend expects studentId
        dueDate: issueForm.dueDate,     // ✅ Backend expects dueDate
        notes: issueForm.notes,         // ✅ Backend expects notes
        schoolName: currentUser.schoolName, // ✅ Backend expects schoolName
        librarianId: currentUser._id    // ✅ Backend expects librarianId (optional)
      };

      console.log('Attempting to issue book with data:', newBookLoan);
      console.log('API endpoint:', `${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/BookLoan/issue`);

      const response = await axios.post(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/BookLoan/issue`, newBookLoan);
      
      console.log('Book issued successfully:', response.data);
      
      // Add the new loan to the list
      setBookLoans(prevLoans => [response.data.bookLoan, ...prevLoans]);
      
      // Refresh available books (since one was borrowed)
      fetchAvailableBooks();
      
      // Reset form and close
      setShowIssueForm(false);
      setIssueForm({ bookId: '', dueDate: '', notes: '' });
      
      setSnackbar({ 
        open: true, 
        message: `Book "${selectedBook.title}" issued to ${student?.name} successfully!`, 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Error issuing book:', error);
      console.log('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      const missingFields = error.response?.data?.missingFields;
      
      let fullMessage = `Error issuing book: ${errorMessage}`;
      if (missingFields && missingFields.length > 0) {
        fullMessage += ` (Missing: ${missingFields.join(', ')})`;
      }
      
      setSnackbar({ 
        open: true, 
        message: fullMessage, 
        severity: 'error' 
      });
    }
  };

  const handleReturnBook = async (loanId) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/BookLoan/${loanId}/return`, {
        returnDate: new Date().toISOString().split('T')[0]
      });
      
      // Update the loan in the list
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
    const loan = bookLoans.find(l => l._id === loanId);
    if (!loan) return;
    
    const bookTitle = loan?.book?.title || 'Unknown Book';
    
    setLoanToDelete(loanId); // Store the loan ID for confirmation
    setConfirmDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!loanToDelete) return; // Ensure loanToDelete is set

    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/BookLoan/${loanToDelete}`);
      
      // Remove the loan from the list
      setBookLoans(prevLoans => prevLoans.filter(loan => loan._id !== loanToDelete));
      
      setSnackbar({ 
        open: true, 
        message: `Book loan record for "${bookLoans.find(l => l._id === loanToDelete)?.book?.title || 'Unknown Book'}" deleted successfully!`, 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Error deleting book loan:', error);
      setSnackbar({ 
        open: true, 
        message: `Error deleting book loan: ${error.response?.data?.message || error.message}`, 
        severity: 'error' 
      });
    } finally {
      setConfirmDeleteDialogOpen(false);
      setLoanToDelete(null); // Clear the loanToDelete state
    }
  };

  const filteredLoans = (Array.isArray(bookLoans) ? bookLoans : []).filter(loan => {
    const matchesSearch = (loan.student?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const getSelectedClassName = () => {
    return (sclassesListFromRedux || []).find(c => c._id === selectedClass)?.sclassName || '';
  };

  const getSelectedStudentName = () => {
    return studentsInClass.find(s => s._id === selectedStudent)?.name || '';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Ensure bookLoans is always an array for safety
  const safeBookLoans = Array.isArray(bookLoans) ? bookLoans : [];

  // Don't render the main content until we've initialized
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
            Loading Library Management System...
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
          📚 Library Management
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            textAlign: 'center', 
            color: 'text.secondary',
            mb: 3
          }}
        >
          Manage student book loans and library operations
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

      {/* Combined Student & Class Selection & Search & Filter */}
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Student Management & Search
        </Typography>
        
        {/* Student & Class Selection Row */}
        <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Select Class</InputLabel>
              <Select
                value={selectedClass || ''}
                onChange={(e) => setSelectedClass(e.target.value)}
                label="Select Class"
                disabled={classesLoadingFromRedux}
                sx={{ borderRadius: 2 }}
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
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Select Student</InputLabel>
              <Select
                value={selectedStudent || ''}
                onChange={(e) => setSelectedStudent(e.target.value)}
                label="Select Student"
                disabled={!selectedClass || loading}
                sx={{ borderRadius: 2 }}
              >
                {!selectedClass ? (
                  <MenuItem disabled>Please select a class first</MenuItem>
                ) : loading ? (
                  <MenuItem disabled>Loading students...</MenuItem>
                ) : (studentsInClass || []).length === 0 ? (
                  <MenuItem disabled>No students found in this class</MenuItem>
                ) : (
                  (studentsInClass || []).map((student) => (
                    <MenuItem key={student._id} value={student._id}>
                      {student.name} (Roll: {student.rollNum})
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowIssueForm(true)}
              disabled={!selectedStudent}
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
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search students or books..."
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
          </Grid>
          <Grid item xs={12} md={6}>
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
        </Grid>
        
        {/* Class and Student Info */}
        {selectedClass && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(102, 126, 234, 0.1)', borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                    <ClassIcon />
                  </Avatar>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Class: {getSelectedClassName()}
                  </Typography>
                </Box>
              </Grid>
              {selectedStudent && (
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Student: {getSelectedStudentName()}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Issue Book Form */}
      {showIssueForm && selectedStudent && (
        <Paper sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            <BookIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Issue New Book to {getSelectedStudentName()}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Student Name"
                value={getSelectedStudentName()}
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
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
                  onChange={(e) => {
                    console.log('Book selected:', e.target.value);
                    setIssueForm({...issueForm, bookId: e.target.value});
                  }}
                  label="Select Book"
                  disabled={booksLoading || availableBooks.length === 0}
                  sx={{ borderRadius: 2 }}
                >
                  {booksLoading ? (
                    <MenuItem disabled>Loading books...</MenuItem>
                  ) : availableBooks.length === 0 ? (
                    <MenuItem disabled>No books available</MenuItem>
                  ) : (
                    availableBooks.map((book) => {
                      console.log('Rendering book option:', book);
                      return (
                        <MenuItem key={book._id} value={book._id}>
                          {book.title} by {book.author} (Available: {book.availableQuantity})
                        </MenuItem>
                      );
                    })
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
                onChange={(e) => {
                  console.log('Due date selected:', e.target.value);
                  setIssueForm({...issueForm, dueDate: e.target.value});
                }}
                InputLabelProps={{ shrink: true }}
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
              <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
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
            Book Loans Management
          </Typography>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(102, 126, 234, 0.1)' }}>
                <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
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
                filteredLoans.map((loan, index) => (
                  <TableRow 
                    key={loan._id}
                    sx={{ 
                      '&:nth-of-type(odd)': { bgcolor: 'rgba(102, 126, 234, 0.02)' },
                      '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.05)' },
                      transition: 'background-color 0.2s ease',
                      // Highlight orphaned records
                      ...((!loan.student?.name || !loan.book?.title) && {
                        bgcolor: 'rgba(255, 152, 0, 0.1)',
                        borderLeft: '4px solid #ff9800'
                      })
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {loan.student?.name || 'Unknown Student'}
                          </Typography>
                          {!loan.student?.name && (
                            <Typography variant="caption" color="error" sx={{ fontStyle: 'italic' }}>
                              Student data missing
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
              const studentName = loan?.student?.name || 'Unknown Student';
              const bookTitle = loan?.book?.title || 'Unknown Book';
              return (
                <>
                  Are you sure you want to delete this book loan record?
                  <br /><br />
                  <strong>Student:</strong> {studentName}<br />
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
    </Box>
  );
};

export default StudentManagement;

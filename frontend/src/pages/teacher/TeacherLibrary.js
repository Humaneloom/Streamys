import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Avatar,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Book as BookIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Search as SearchIcon,
  LibraryBooks as LibraryBooksIcon,
  Assignment as AssignmentIcon,
  MonetizationOn as MonetizationOnIcon,
  History as HistoryIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { getTeacherBookLoans } from '../../redux/bookLoanRelated/bookLoanHandle';

const TeacherLibrary = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get current user from Redux store
  const currentUser = useSelector(state => state.user.currentUser);
  
  // Get book loans from Redux store
  const { 
    currentLoans, 
    returnedBooks, 
    overdueBooks, 
    loading, 
    error 
  } = useSelector(state => state.bookLoans);

  // Fetch teacher's book loans when component mounts
  useEffect(() => {
    if (currentUser && currentUser._id) {
      console.log('=== TEACHER LIBRARY DEBUG ===');
      console.log('Current user:', currentUser);
      console.log('Current user ID:', currentUser._id);
      console.log('Current user type:', typeof currentUser._id);
      console.log('Fetching book loans for teacher:', currentUser._id);
      dispatch(getTeacherBookLoans(currentUser._id));
    } else {
      console.log('No current user or user ID found:', currentUser);
    }
  }, [dispatch, currentUser]);

  // Debug logging
  useEffect(() => {
    console.log('=== TEACHER LIBRARY STATE DEBUG ===');
    console.log('Current user:', currentUser);
    console.log('Current user ID:', currentUser?._id);
    console.log('Current user school name:', currentUser?.schoolName);
    console.log('Current user type:', currentUser?.userType);
    console.log('Book loans state:', { currentLoans, returnedBooks, loading, error });
    console.log('Current loans length:', currentLoans.length);
    console.log('Returned books length:', returnedBooks.length);
    
    // Debug: Log the actual book loan data structure
    if (currentLoans.length > 0) {
      console.log('Sample current loan:', currentLoans[0]);
      console.log('All current loans:', currentLoans);
    }
    if (returnedBooks.length > 0) {
      console.log('Sample returned book:', returnedBooks[0]);
      console.log('All returned books:', returnedBooks);
    }
  }, [currentUser, currentLoans, returnedBooks, loading, error]);

  // Filter books based on search term
  const filteredCurrentLoans = currentLoans.filter(loan => {
    // Handle both populated and unpopulated book data
    const bookTitle = loan.book?.title || loan.bookTitle || 'Unknown Book';
    const bookAuthor = loan.book?.author || loan.bookAuthor || 'Unknown Author';
    
    return bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
           bookAuthor.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredReturnedBooks = returnedBooks.filter(book => {
    // Handle both populated and unpopulated book data
    const bookTitle = book.book?.title || book.bookTitle || 'Unknown Book';
    const bookAuthor = book.book?.author || book.bookAuthor || 'Unknown Author';
    
    return bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
           bookAuthor.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'borrowed': return 'primary';
      case 'overdue': return 'error';
      case 'returned': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'borrowed': return <ScheduleIcon />;
      case 'overdue': return <WarningIcon />;
      case 'returned': return <CheckCircleIcon />;
      default: return <BookIcon />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const totalFines = currentLoans.reduce((sum, loan) => sum + (loan.fine || 0), 0) +
                    returnedBooks.reduce((sum, book) => sum + (book.fine || 0), 0);

  if (loading && currentLoans.length === 0 && returnedBooks.length === 0) {
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
            Loading Your Library...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!currentUser || !currentUser._id) {
    return (
      <Box sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh'
      }}>
        <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            Please log in to view your library information.
          </Alert>
        </Paper>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh'
      }}>
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          Error loading library data: {error}
        </Alert>
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
          📚 My Library Dashboard
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            textAlign: 'center', 
            color: 'text.secondary',
            mb: 3
          }}
        >
          Welcome back, {currentUser?.name || 'Teacher'}! Here's your library overview.
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
                    {currentLoans.filter(loan => loan.status === 'borrowed').length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Currently Borrowed
                  </Typography>
                </Box>
                <AssignmentIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {currentLoans.filter(loan => loan.status === 'overdue').length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Overdue Books
                  </Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {returnedBooks.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Books Returned
                  </Typography>
                </Box>
                <HistoryIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    ${totalFines.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Fines
                  </Typography>
                </Box>
                <MonetizationOnIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          <SearchIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Search Your Books
        </Typography>
        <TextField
          fullWidth
          placeholder="Search books by title or author..."
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
      </Paper>

      {/* Overdue Alert */}
      {currentLoans.some(loan => loan.status === 'overdue') && (
        <Paper sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            <Typography variant="body1">
              ⚠️ You have {currentLoans.filter(loan => loan.status === 'overdue').length} overdue book(s). 
              Please return them as soon as possible to avoid additional fines.
            </Typography>
          </Alert>
        </Paper>
      )}

      {/* Current Borrowed Books */}
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2,
          mb: 3
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <BookIcon />
            Currently Borrowed Books
          </Typography>
        </Box>
        
        {filteredCurrentLoans.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <BookIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No books currently borrowed
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Visit the library to borrow some books!
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(102, 126, 234, 0.1)' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Book</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Issue Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Fine</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCurrentLoans.map((loan) => (
                  <TableRow 
                    key={loan._id}
                    sx={{ 
                      '&:nth-of-type(odd)': { bgcolor: 'rgba(102, 126, 234, 0.02)' },
                      '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.05)' },
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: 'secondary.main' }}>
                          <BookIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {loan.book?.title || loan.bookTitle || 'Unknown Book'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            by {loan.book?.author || loan.bookAuthor || 'Unknown Author'}
                          </Typography>
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
                        sx={{ 
                          borderRadius: 1,
                          borderColor: loan.status === 'overdue' ? 'error.main' : 'primary.main',
                          color: loan.status === 'overdue' ? 'error.main' : 'primary.main'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        icon={getStatusIcon(loan.status)}
                        label={loan.status} 
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
                      <Button 
                        variant="outlined" 
                        size="small"
                        disabled={loan.status === 'returned'}
                        sx={{ 
                          borderRadius: 2,
                          borderColor: 'success.main',
                          color: 'success.main',
                          '&:hover': {
                            borderColor: 'success.dark',
                            backgroundColor: 'rgba(76, 175, 80, 0.04)'
                          }
                        }}
                      >
                        Return Book
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Returned Books History */}
      <Paper sx={{ 
        p: 3, 
        borderRadius: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          color: '#2E7D32',
          borderRadius: 2,
          mb: 3
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon />
            Returned Books History
          </Typography>
        </Box>
        
        {filteredReturnedBooks.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <HistoryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No books returned yet
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Your returned books will appear here once you return them.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(168, 237, 234, 0.1)' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Book</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Issue Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Return Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Fine</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReturnedBooks.map((book) => (
                  <TableRow 
                    key={book._id}
                    sx={{ 
                      '&:nth-of-type(odd)': { bgcolor: 'rgba(168, 237, 234, 0.02)' },
                      '&:hover': { bgcolor: 'rgba(168, 237, 234, 0.05)' },
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: 'success.main' }}>
                          <CheckCircleIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {book.book?.title || book.bookTitle || 'Unknown Book'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            by {book.book?.author || book.bookAuthor || 'Unknown Author'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={formatDate(book.issueDate)} 
                        size="small" 
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={formatDate(book.dueDate)} 
                        size="small" 
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={formatDate(book.returnDate)} 
                        size="small" 
                        variant="outlined"
                        sx={{ borderRadius: 1, borderColor: 'success.main', color: 'success.main' }}
                      />
                    </TableCell>
                    <TableCell>
                      {book.fine > 0 ? (
                        <Chip 
                          label={`$${book.fine.toFixed(2)}`}
                          color="warning"
                          size="small"
                          sx={{ borderRadius: 1, fontWeight: 600 }}
                        />
                      ) : (
                        <Chip 
                          label="No Fine"
                          color="success"
                          size="small"
                          sx={{ borderRadius: 1, fontWeight: 600 }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default TeacherLibrary;

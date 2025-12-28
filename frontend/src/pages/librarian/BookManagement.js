import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Button,
    Chip,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Pagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Fab,
    Alert,
    CircularProgress,
    Paper,
    Divider,
    Avatar,
    Tooltip
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Book as BookIcon,
    LibraryBooks as LibraryBooksIcon,
    Category as CategoryIcon,
    Inventory as InventoryIcon,
    Build as BuildIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { 
    fetchBooks, 
    fetchBookStats, 
    fetchBookCategories, 
    createBook, 
    updateBookById, 
    deleteBookById,
    searchBooks 
} from '../../redux/bookRelated/bookHandle';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease-in-out',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
    },
}));

const StatsCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
    },
}));

const BookManagement = () => {
    const dispatch = useDispatch();
    const { 
        books, 
        loading, 
        error, 
        stats, 
        categories, 
        pagination, 
        filters 
    } = useSelector((state) => state.books);
    
    const { currentUser } = useSelector(state => state.user);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [addBookDialog, setAddBookDialog] = useState(false);
    const [editBookDialog, setEditBookDialog] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);
    const [fixingAvailability, setFixingAvailability] = useState(false);
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        isbn: '',
        category: '',
        description: '',
        imageUrl: '',
        quantity: 1,
        publicationYear: new Date().getFullYear(),
        publisher: '',
        language: 'English',
        pages: '',

        location: ''
    });

    // Get school name from current user or localStorage - same logic as dashboard
    const schoolName = currentUser?.schoolName || localStorage.getItem('schoolName') || 'Default School';

    useEffect(() => {
        // Fetch initial data
        dispatch(fetchBooks(schoolName, {}, 1, 12));
        dispatch(fetchBookStats(schoolName));
        dispatch(fetchBookCategories(schoolName));
    }, [dispatch, schoolName]);

    // Debug: Log categories when they change
    useEffect(() => {
        console.log('Categories loaded:', categories);
        console.log('Categories length:', categories?.length);
    }, [categories]);

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        
        if (value.trim()) {
            dispatch(searchBooks({ schoolName, searchTerm: value }));
        } else {
            dispatch(fetchBooks(schoolName, {}, 1, 12));
        }
    };

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        setSelectedCategory(value);
        
        if (value === 'all') {
            dispatch(fetchBooks(schoolName, {}, 1, 12));
        } else {
            dispatch(fetchBooks(schoolName, { category: value }, 1, 12));
        }
    };

    const handlePageChange = (event, value) => {
        dispatch(fetchBooks(schoolName, {}, value, 12));
    };

    const handleAddBook = async () => {
        try {
            const bookData = {
                ...newBook,
                schoolName,
                availableQuantity: newBook.quantity,
                status: 'available'
            };
            
            const result = await dispatch(createBook(bookData, schoolName));
            if (result.success) {
                setAddBookDialog(false);
                setNewBook({
                    title: '', author: '', isbn: '', category: '', description: '', 
                    imageUrl: '', quantity: 1, publicationYear: new Date().getFullYear(), 
                    publisher: '', language: 'English', pages: '', location: ''
                });
                
                // Refresh data
                dispatch(fetchBooks(schoolName, {}, 1, 12));
                dispatch(fetchBookStats(schoolName));
            }
        } catch (error) {
            console.error('Failed to add book:', error);
        }
    };

    const handleEditBook = (book) => {
        setEditingBook(book);
        setEditBookDialog(true);
    };

    const handleUpdateBook = async () => {
        try {
            const result = await dispatch(updateBookById(editingBook._id, editingBook));
            if (result.success) {
                setEditBookDialog(false);
                setEditingBook(null);
                
                // Refresh data
                dispatch(fetchBooks(schoolName, {}, pagination.currentPage, 12));
                dispatch(fetchBookStats(schoolName));
            }
        } catch (error) {
            console.error('Failed to update book:', error);
        }
    };

    const handleFixAvailability = async () => {
        setFixingAvailability(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/BookLoans/${encodeURIComponent(schoolName)}/fix-availability`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Show success message
                alert(`Book availability fixed successfully! ${result.details}`);
                
                // Refresh data
                dispatch(fetchBooks(schoolName, {}, pagination.currentPage, 12));
                dispatch(fetchBookStats(schoolName));
            } else {
                alert(`Error fixing availability: ${result.message}`);
            }
        } catch (error) {
            console.error('Failed to fix availability:', error);
            alert('Failed to fix book availability. Please try again.');
        } finally {
            setFixingAvailability(false);
        }
    };

    const handleCleanupOrphanedLoans = async () => {
        setFixingAvailability(true); // Reusing fixingAvailability state for loading
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/BookLoans/${encodeURIComponent(schoolName)}/cleanup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (response.ok) {
                alert(`Orphaned loans cleaned up successfully! ${result.details}`);
                dispatch(fetchBooks(schoolName, {}, pagination.currentPage, 12));
                dispatch(fetchBookStats(schoolName));
            } else {
                alert(`Error cleaning up orphaned loans: ${result.message}`);
            }
        } catch (error) {
            console.error('Failed to cleanup orphaned loans:', error);
            alert('Failed to cleanup orphaned loans. Please try again.');
        } finally {
            setFixingAvailability(false);
        }
    };

    const openDeleteDialog = (book) => {
        setBookToDelete(book);
        setDeleteDialog(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialog(false);
        setBookToDelete(null);
    };

    const confirmDelete = async () => {
        if (bookToDelete) {
            try {
                const result = await dispatch(deleteBookById(bookToDelete._id));
                if (result.success) {
                    // Refresh data
                    dispatch(fetchBooks(schoolName, {}, pagination.currentPage, 12));
                    dispatch(fetchBookStats(schoolName));
                    closeDeleteDialog();
                }
            } catch (error) {
                console.error('Failed to delete book:', error);
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'available': return 'success';
            case 'out_of_stock': return 'error';
            case 'discontinued': return 'default';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'available': return 'Available';
            case 'out_of_stock': return 'Out of Stock';
            case 'discontinued': return 'Discontinued';
            default: return 'Unknown';
        }
    };

    // Fallback image URL for books without images
    const getBookImage = (book) => {
        if (book.imageUrl && book.imageUrl.trim()) {
            return book.imageUrl;
        }
        // Use a simple SVG placeholder instead of external URLs
        return `data:image/svg+xml;base64,${btoa(`
            <svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
                <rect width="300" height="400" fill="#f3f4f6"/>
                <text x="150" y="200" font-family="Arial" font-size="16" text-anchor="middle" fill="#6b7280">
                    ${book.title || 'Book Cover'}
                </text>
            </svg>
        `)}`;
    };

    if (loading && books.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                    Book Management
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b' }}>
                    Manage your library collection, track inventory, and monitor book availability
                </Typography>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard>
                        <BookIcon sx={{ fontSize: 40, mb: 2 }} />
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                            {stats?.totalBooks || 0}
                        </Typography>
                        <Typography variant="body2">Total Books</Typography>
                    </StatsCard>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard>
                        <LibraryBooksIcon sx={{ fontSize: 40, mb: 2 }} />
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                            {stats?.totalTitles || 0}
                        </Typography>
                        <Typography variant="body2">Unique Titles</Typography>
                    </StatsCard>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard>
                        <InventoryIcon sx={{ fontSize: 40, mb: 2 }} />
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                            {stats?.totalAvailable || 0}
                        </Typography>
                        <Typography variant="body2">Available Books</Typography>
                    </StatsCard>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard>
                        <CategoryIcon sx={{ fontSize: 40, mb: 2 }} />
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                            {categories?.length || 0}
                        </Typography>
                        <Typography variant="body2">Categories</Typography>
                    </StatsCard>
                </Grid>
            </Grid>



            {/* Search and Filter Bar */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: '16px' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Search books by title, author, or ISBN..."
                            value={searchTerm}
                            onChange={handleSearch}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ mr: 1, color: '#64748b' }} />
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={selectedCategory}
                                label="Category"
                                onChange={handleCategoryChange}
                                sx={{ borderRadius: '12px' }}
                            >
                                <MenuItem value="all">All Categories</MenuItem>
                                {categories?.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setAddBookDialog(true)}
                            sx={{
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                }
                            }}
                        >
                            Add Book
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<BuildIcon />}
                            onClick={handleFixAvailability}
                            disabled={fixingAvailability}
                            sx={{
                                borderRadius: '12px',
                                borderColor: '#f59e0b',
                                color: '#f59e0b',
                                '&:hover': {
                                    borderColor: '#d97706',
                                    backgroundColor: 'rgba(245, 158, 11, 0.04)',
                                }
                            }}
                        >
                            {fixingAvailability ? 'Fixing...' : 'Fix Availability'}
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<ClearIcon />}
                            onClick={handleCleanupOrphanedLoans}
                            disabled={fixingAvailability}
                            sx={{
                                borderRadius: '12px',
                                borderColor: '#ef4444',
                                color: '#ef4444',
                                '&:hover': {
                                    borderColor: '#dc2626',
                                    backgroundColor: 'rgba(239, 68, 68, 0.04)',
                                }
                            }}
                        >
                            Cleanup Loans
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Books Grid */}
            {books.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <BookIcon sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                        No books found
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        {searchTerm || selectedCategory !== 'all' 
                            ? 'Try adjusting your search or filter criteria'
                            : 'Start by adding your first book to the library'
                        }
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {books.map((book) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={book._id}>
                            <StyledCard>
                                <CardMedia
                                    component="img"
                                    height="300"
                                    image={getBookImage(book)}
                                    alt={book.title}
                                    sx={{ objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.src = getBookImage(book);
                                    }}
                                />
                                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, lineHeight: 1.3 }}>
                                        {book.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                                        by {book.author}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 2 }}>
                                        ISBN: {book.isbn}
                                    </Typography>
                                    
                                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                        <Chip 
                                            label={book.category} 
                                            size="small" 
                                            sx={{ 
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                color: 'white',
                                                fontWeight: 500
                                            }}
                                        />
                                        <Chip 
                                            label={getStatusText(book.status)} 
                                            size="small" 
                                            color={getStatusColor(book.status)}
                                            variant="outlined"
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                                            Available: {book.availableQuantity}/{book.quantity}
                                        </Typography>

                                    </Box>

                                    {book.description && (
                                        <Typography variant="body2" sx={{ color: '#64748b', mb: 2, lineHeight: 1.5 }}>
                                            {book.description.length > 100 
                                                ? `${book.description.substring(0, 100)}...` 
                                                : book.description
                                            }
                                        </Typography>
                                    )}
                                </CardContent>
                                
                                <CardActions sx={{ p: 2, pt: 0 }}>
                                    <Button 
                                        size="small" 
                                        startIcon={<EditIcon />}
                                        onClick={() => handleEditBook(book)}
                                        sx={{ flex: 1, borderRadius: '8px' }}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        size="small" 
                                        startIcon={<DeleteIcon />}
                                        color="error"
                                        onClick={() => openDeleteDialog(book)}
                                        sx={{ flex: 1, borderRadius: '8px' }}
                                    >
                                        Delete
                                    </Button>
                                </CardActions>
                            </StyledCard>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={pagination.totalPages}
                        page={pagination.currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                borderRadius: '8px',
                            }
                        }}
                    />
                </Box>
            )}

            {/* Add Book Dialog */}
            <Dialog 
                open={addBookDialog} 
                onClose={() => setAddBookDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                }}>
                    Add New Book
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Book Title"
                                value={newBook.title}
                                onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                                sx={{ mb: 2 }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Author"
                                value={newBook.author}
                                onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                                sx={{ mb: 2 }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="ISBN"
                                value={newBook.isbn}
                                onChange={(e) => setNewBook({...newBook, isbn: e.target.value})}
                                sx={{ mb: 2 }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={newBook.category}
                                    label="Category"
                                    onChange={(e) => setNewBook({...newBook, category: e.target.value})}
                                    required
                                >
                                    {categories && categories.length > 0 ? (
                                        categories.map((category) => (
                                            <MenuItem key={category} value={category}>
                                                {category}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        // Fallback categories if none are loaded from API
                                        [
                                            'Fiction',
                                            'Non-Fiction',
                                            'Science',
                                            'Mathematics',
                                            'History',
                                            'Literature',
                                            'Technology',
                                            'Arts',
                                            'Philosophy',
                                            'Religion',
                                            'Social Sciences',
                                            'Biography',
                                            'Travel',
                                            'Cooking',
                                            'Health',
                                            'Self-Help',
                                            'Children',
                                            'Young Adult',
                                            'Reference',
                                            'Other'
                                        ].map((category) => (
                                            <MenuItem key={category} value={category}>
                                                {category}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={3}
                                value={newBook.description}
                                onChange={(e) => setNewBook({...newBook, description: e.target.value})}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Image URL (optional)"
                                value={newBook.imageUrl}
                                onChange={(e) => setNewBook({...newBook, imageUrl: e.target.value})}
                                sx={{ mb: 2 }}
                                helperText="Leave empty to use default book cover"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Quantity"
                                type="number"
                                value={newBook.quantity}
                                onChange={(e) => setNewBook({...newBook, quantity: parseInt(e.target.value) || 1})}
                                sx={{ mb: 2 }}
                                required
                                inputProps={{ min: 1 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Publication Year"
                                type="number"
                                value={newBook.publicationYear}
                                onChange={(e) => setNewBook({...newBook, publicationYear: parseInt(e.target.value) || new Date().getFullYear()})}
                                sx={{ mb: 2 }}
                                inputProps={{ min: 1900, max: new Date().getFullYear() }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Publisher"
                                value={newBook.publisher}
                                onChange={(e) => setNewBook({...newBook, publisher: e.target.value})}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Language"
                                value={newBook.language}
                                onChange={(e) => setNewBook({...newBook, language: e.target.value})}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Pages"
                                type="number"
                                value={newBook.pages}
                                onChange={(e) => setNewBook({...newBook, pages: parseInt(e.target.value) || ''})}
                                sx={{ mb: 2 }}
                                inputProps={{ min: 1 }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Location"
                                value={newBook.location}
                                onChange={(e) => setNewBook({...newBook, location: e.target.value})}
                                sx={{ mb: 2 }}
                                placeholder="e.g., Shelf A1, Row 2"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setAddBookDialog(false)}>Cancel</Button>
                    <Button 
                        variant="contained"
                        onClick={handleAddBook}
                        disabled={!newBook.title || !newBook.author || !newBook.isbn || !newBook.category}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                            }
                        }}
                    >
                        Add Book
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Book Dialog */}
            <Dialog 
                open={editBookDialog} 
                onClose={() => setEditBookDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                }}>
                    Edit Book
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    {editingBook && (
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Book Title"
                                    value={editingBook.title}
                                    onChange={(e) => setEditingBook({...editingBook, title: e.target.value})}
                                    sx={{ mb: 2 }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Author"
                                    value={editingBook.author}
                                    onChange={(e) => setEditingBook({...editingBook, author: e.target.value})}
                                    sx={{ mb: 2 }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="ISBN"
                                    value={editingBook.isbn}
                                    onChange={(e) => setEditingBook({...editingBook, isbn: e.target.value})}
                                    sx={{ mb: 2 }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={editingBook.category}
                                        label="Category"
                                        onChange={(e) => setEditingBook({...editingBook, category: e.target.value})}
                                        required
                                    >
                                        {categories && categories.length > 0 ? (
                                            categories.map((category) => (
                                                <MenuItem key={category} value={category}>
                                                    {category}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            // Fallback categories if none are loaded from API
                                            [
                                                'Fiction',
                                                'Non-Fiction',
                                                'Science',
                                                'Mathematics',
                                                'History',
                                                'Literature',
                                                'Technology',
                                                'Arts',
                                                'Philosophy',
                                                'Religion',
                                                'Social Sciences',
                                                'Biography',
                                                'Travel',
                                                'Cooking',
                                                'Health',
                                                'Self-Help',
                                                'Children',
                                                'Young Adult',
                                                'Reference',
                                                'Other'
                                            ].map((category) => (
                                                <MenuItem key={category} value={category}>
                                                    {category}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    multiline
                                    rows={3}
                                    value={editingBook.description}
                                    onChange={(e) => setEditingBook({...editingBook, description: e.target.value})}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Image URL"
                                    value={editingBook.imageUrl}
                                    onChange={(e) => setEditingBook({...editingBook, imageUrl: e.target.value})}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Quantity"
                                    type="number"
                                    value={editingBook.quantity}
                                    onChange={(e) => setEditingBook({...editingBook, quantity: parseInt(e.target.value) || 1})}
                                    sx={{ mb: 2 }}
                                    required
                                    inputProps={{ min: 1 }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Available Quantity"
                                    type="number"
                                    value={editingBook.availableQuantity}
                                    onChange={(e) => setEditingBook({...editingBook, availableQuantity: parseInt(e.target.value) || 0})}
                                    sx={{ mb: 2 }}
                                    required
                                    inputProps={{ min: 0, max: editingBook.quantity }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={editingBook.status}
                                        label="Status"
                                        onChange={(e) => setEditingBook({...editingBook, status: e.target.value})}
                                        required
                                    >
                                        <MenuItem value="available">Available</MenuItem>
                                        <MenuItem value="out_of_stock">Out of Stock</MenuItem>
                                        <MenuItem value="discontinued">Discontinued</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setEditBookDialog(false)}>Cancel</Button>
                    <Button 
                        variant="contained"
                        onClick={handleUpdateBook}
                        disabled={!editingBook?.title || !editingBook?.author || !editingBook?.isbn || !editingBook?.category}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                            }
                        }}
                    >
                        Update Book
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialog}
                onClose={closeDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle 
                    id="delete-dialog-title"
                    sx={{ 
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <DeleteIcon />
                    Confirm Deletion
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar 
                            sx={{ 
                                bgcolor: '#fef2f2', 
                                color: '#dc2626',
                                width: 56,
                                height: 56
                            }}
                        >
                            <DeleteIcon fontSize="large" />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                Delete Book
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                This action cannot be undone
                            </Typography>
                        </Box>
                    </Box>
                    <Typography id="delete-dialog-description" sx={{ color: '#475569' }}>
                        Are you sure you want to delete <strong>"{bookToDelete?.title}"</strong> by <strong>{bookToDelete?.author}</strong>?
                    </Typography>
                    <Alert severity="warning" sx={{ mt: 2 }}>
                        This will permanently remove the book from your library system.
                    </Alert>
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button 
                        onClick={closeDeleteDialog} 
                        color="primary"
                        variant="outlined"
                        sx={{ borderRadius: '8px' }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={confirmDelete} 
                        color="error" 
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        sx={{ 
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                            }
                        }}
                    >
                        Delete Book
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Floating Action Button */}
            <Fab
                color="primary"
                aria-label="add book"
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    }
                }}
                onClick={() => setAddBookDialog(true)}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
};

export default BookManagement;

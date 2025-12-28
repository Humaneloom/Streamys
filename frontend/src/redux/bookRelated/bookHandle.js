import { setLoading, setError, setBooks, addBook, updateBook, deleteBook, setStats, setCategories, setPagination } from './bookSlice';

const API_BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

// Get all books for a school
export const fetchBooks = (schoolName, filters = {}, page = 1, limit = 12) => async (dispatch) => {
    try {
        console.log('Fetching books for school:', schoolName, 'with filters:', filters, 'page:', page, 'limit:', limit);
        dispatch(setLoading(true));
        
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...filters
        });
        
        const url = `${API_BASE_URL}/Books/${schoolName}?${queryParams}`;
        console.log('Fetching from URL:', url);
        
        const response = await fetch(url);
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.success) {
            console.log('Books fetched successfully:', data.data);
            dispatch(setBooks(data.data));
            dispatch(setPagination({
                currentPage: data.pagination.currentPage,
                totalPages: data.pagination.totalPages,
                totalBooks: data.pagination.totalBooks,
                booksPerPage: data.pagination.booksPerPage
            }));
        } else {
            console.log('Failed to fetch books:', data.message);
            dispatch(setError(data.message || 'Failed to fetch books'));
        }
        dispatch(setLoading(false));
    } catch (error) {
        console.error('Error fetching books:', error);
        dispatch(setError('Network error. Please try again.'));
        dispatch(setLoading(false));
    }
};

// Get book by ID
export const fetchBookById = (bookId) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        
        const response = await fetch(`${API_BASE_URL}/Book/${bookId}`);
        const data = await response.json();
        
        if (data.success) {
            dispatch(setLoading(false));
            return data.data;
        } else {
            dispatch(setError(data.message || 'Failed to fetch book'));
            dispatch(setLoading(false));
            return null;
        }
    } catch (error) {
        console.error('Error fetching book:', error);
        dispatch(setError('Network error. Please try again.'));
        dispatch(setLoading(false));
        return null;
    }
};

// Create a new book
export const createBook = (bookData, schoolName) => async (dispatch) => {
    try {
        console.log('Creating book with data:', bookData, 'for school:', schoolName);
        dispatch(setLoading(true));
        
        const requestBody = {
            ...bookData,
            schoolName
        };
        console.log('Request body:', requestBody);
        
        const response = await fetch(`${API_BASE_URL}/Book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });
        
        console.log('Create book response status:', response.status);
        const data = await response.json();
        console.log('Create book response data:', data);
        
        if (data.success) {
            console.log('Book created successfully, dispatching addBook with:', data.data);
            dispatch(addBook(data.data));
            dispatch(setLoading(false));
            return { success: true, data: data.data };
        } else {
            console.log('Failed to create book:', data.message);
            dispatch(setError(data.message || 'Failed to create book'));
            dispatch(setLoading(false));
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Error creating book:', error);
        dispatch(setError('Network error. Please try again.'));
        dispatch(setLoading(false));
        return { success: false, message: 'Network error. Please try again.' };
    }
};

// Update a book
export const updateBookById = (bookId, bookData) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        
        const response = await fetch(`${API_BASE_URL}/Book/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData),
        });
        
        const data = await response.json();
        
        if (data.success) {
            dispatch(updateBook(data.data));
            dispatch(setLoading(false));
            return { success: true, data: data.data };
        } else {
            dispatch(setError(data.message || 'Failed to update book'));
            dispatch(setLoading(false));
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Error updating book:', error);
        dispatch(setError('Network error. Please try again.'));
        dispatch(setLoading(false));
        return { success: false, message: 'Network error. Please try again.' };
    }
};

// Delete a book
export const deleteBookById = (bookId) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        
        const response = await fetch(`${API_BASE_URL}/Book/${bookId}`, {
            method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (data.success) {
            dispatch(deleteBook(bookId));
            dispatch(setLoading(false));
            return { success: true };
        } else {
            dispatch(setError(data.message || 'Failed to delete book'));
            dispatch(setLoading(false));
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        dispatch(setError('Network error. Please try again.'));
        dispatch(setLoading(false));
        return { success: false, message: 'Network error. Please try again.' };
    }
};

// Get book statistics
export const fetchBookStats = (schoolName) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        
        const response = await fetch(`${API_BASE_URL}/BookStats/${schoolName}`);
        const data = await response.json();
        
        if (data.success) {
            dispatch(setStats(data.data));
            dispatch(setLoading(false));
        } else {
            dispatch(setError(data.message || 'Failed to fetch book statistics'));
        }
    } catch (error) {
        console.error('Error fetching book stats:', error);
        dispatch(setError('Network error. Please try again.'));
    }
};

// Get book categories
export const fetchBookCategories = (schoolName) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        
        const response = await fetch(`${API_BASE_URL}/BookCategories/${schoolName}`);
        const data = await response.json();
        
        if (data.success) {
            dispatch(setCategories(data.data));
            dispatch(setLoading(false));
        } else {
            dispatch(setError(data.message || 'Failed to fetch book categories'));
        }
    } catch (error) {
        console.error('Error fetching book categories:', error);
        dispatch(setError('Network error. Please try again.'));
    }
};

// Search books
export const searchBooks = ({ schoolName, searchTerm, category = 'all', page = 1 }) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        
        const filters = {};
        if (searchTerm) filters.search = searchTerm;
        if (category && category !== 'all') filters.category = category;
        
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: '12',
            ...filters
        });
        
        const response = await fetch(`${API_BASE_URL}/Books/${schoolName}?${queryParams}`);
        const data = await response.json();
        
        if (data.success) {
            dispatch(setBooks(data.data));
            dispatch(setPagination({
                currentPage: data.pagination.currentPage,
                totalPages: data.pagination.totalPages,
                totalBooks: data.pagination.totalBooks,
                booksPerPage: data.pagination.booksPerPage
            }));
        } else {
            dispatch(setError(data.message || 'Failed to search books'));
        }
    } catch (error) {
        console.error('Error searching books:', error);
        dispatch(setError('Network error. Please try again.'));
    }
};

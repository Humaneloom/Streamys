import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    books: [],
    loading: false,
    error: null,
    stats: {
        totalBooks: 0,
        totalTitles: 0,
        totalAvailable: 0,
        totalOutOfStock: 0,
        categoryStats: [],
        recentBooks: []
    },
    categories: [],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalBooks: 0,
        booksPerPage: 12
    },
    filters: {
        searchTerm: '',
        selectedCategory: 'all'
    }
};

const bookSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setBooks: (state, action) => {
            console.log('Setting books in state:', action.payload);
            console.log('Books array length:', action.payload?.length);
            state.books = action.payload;
            state.loading = false;
            state.error = null;
            console.log('State books after setting:', state.books);
        },
        addBook: (state, action) => {
            console.log('Adding book to state:', action.payload);
            console.log('Current books before adding:', state.books);
            state.books.unshift(action.payload);
            console.log('Current books after adding:', state.books);
            state.stats.totalTitles += 1;
            state.stats.totalBooks += action.payload.quantity;
            state.stats.totalAvailable += action.payload.availableQuantity;
            console.log('Updated stats:', state.stats);
        },
        updateBook: (state, action) => {
            const index = state.books.findIndex(book => book._id === action.payload._id);
            if (index !== -1) {
                const oldBook = state.books[index];
                const newBook = action.payload;
                
                // Update stats
                state.stats.totalBooks = state.stats.totalBooks - oldBook.quantity + newBook.quantity;
                state.stats.totalAvailable = state.stats.totalAvailable - oldBook.availableQuantity + newBook.availableQuantity;
                
                state.books[index] = action.payload;
            }
        },
        deleteBook: (state, action) => {
            const deletedBook = state.books.find(book => book._id === action.payload);
            if (deletedBook) {
                state.books = state.books.filter(book => book._id !== action.payload);
                state.stats.totalTitles -= 1;
                state.stats.totalBooks -= deletedBook.quantity;
                state.stats.totalAvailable -= deletedBook.availableQuantity;
            }
        },
        setStats: (state, action) => {
            state.stats = action.payload;
        },
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearError: (state) => {
            state.error = null;
        },
        resetBooks: (state) => {
            state.books = [];
            state.loading = false;
            state.error = null;
            state.stats = initialState.stats;
            state.categories = [];
            state.pagination = initialState.pagination;
            state.filters = initialState.filters;
        }
    }
});

export const {
    setLoading,
    setError,
    setBooks,
    addBook,
    updateBook,
    deleteBook,
    setStats,
    setCategories,
    setPagination,
    setFilters,
    clearError,
    resetBooks
} = bookSlice.actions;

export default bookSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    bookLoans: [],
    currentLoans: [],
    returnedBooks: [],
    overdueBooks: [],
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20
    },
    filters: {
        status: 'all',
        studentId: null,
        bookId: null
    }
};

const bookLoanSlice = createSlice({
    name: 'bookLoans',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
        setBookLoans: (state, action) => {
            state.bookLoans = action.payload.bookLoans || [];
            state.pagination = action.payload.pagination || state.pagination;
            state.loading = false;
        },
        setCurrentLoans: (state, action) => {
            state.currentLoans = action.payload;
            state.loading = false;
        },
        setReturnedBooks: (state, action) => {
            state.returnedBooks = action.payload;
            state.loading = false;
        },
        setOverdueBooks: (state, action) => {
            state.overdueBooks = action.payload;
            state.loading = false;
        },
        addBookLoan: (state, action) => {
            state.bookLoans.unshift(action.payload);
            state.currentLoans.unshift(action.payload);
            state.loading = false;
        },
        updateBookLoan: (state, action) => {
            const index = state.bookLoans.findIndex(loan => loan._id === action.payload._id);
            if (index !== -1) {
                state.bookLoans[index] = action.payload;
            }
            
            // Update in current loans if exists
            const currentIndex = state.currentLoans.findIndex(loan => loan._id === action.payload._id);
            if (currentIndex !== -1) {
                if (action.payload.status === 'returned') {
                    // Move to returned books
                    state.returnedBooks.unshift(action.payload);
                    state.currentLoans.splice(currentIndex, 1);
                } else {
                    state.currentLoans[currentIndex] = action.payload;
                }
            }
            
            state.loading = false;
        },
        removeBookLoan: (state, action) => {
            state.bookLoans = state.bookLoans.filter(loan => loan._id !== action.payload);
            state.currentLoans = state.currentLoans.filter(loan => loan._id !== action.payload);
            state.loading = false;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                status: 'all',
                studentId: null,
                bookId: null
            };
        },
        resetState: (state) => {
            return initialState;
        }
    }
});

export const {
    setLoading,
    setError,
    clearError,
    setBookLoans,
    setCurrentLoans,
    setReturnedBooks,
    setOverdueBooks,
    addBookLoan,
    updateBookLoan,
    removeBookLoan,
    setFilters,
    clearFilters,
    resetState
} = bookLoanSlice.actions;

export default bookLoanSlice.reducer;

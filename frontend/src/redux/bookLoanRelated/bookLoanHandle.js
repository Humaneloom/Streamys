import axios from 'axios';
import { 
    setLoading, 
    setError, 
    setBookLoans, 
    setCurrentLoans, 
    setReturnedBooks, 
    setOverdueBooks,
    addBookLoan,
    updateBookLoan
} from './bookLoanSlice';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Issue a book to a student
export const issueBook = (bookLoanData) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        
        const response = await axios.post(`${API_URL}/BookLoan/issue`, bookLoanData);
        
        if (response.data.success) {
            dispatch(addBookLoan(response.data.bookLoan));
            return { success: true, data: response.data.bookLoan };
        } else {
            dispatch(setError(response.data.message || 'Failed to issue book'));
            return { success: false, message: response.data.message };
        }
    } catch (error) {
        const message = error.response?.data?.message || 'Network error. Please try again.';
        dispatch(setError(message));
        return { success: false, message };
    }
};

// Return a book
export const returnBook = (loanId, notes) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        
        const response = await axios.put(`${API_URL}/BookLoan/${loanId}/return`, { notes });
        
        if (response.data.success) {
            dispatch(updateBookLoan(response.data.bookLoan));
            return { success: true, data: response.data.bookLoan };
        } else {
            dispatch(setError(response.data.message || 'Failed to return book'));
            return { success: false, message: response.data.message };
        }
    } catch (error) {
        const message = error.response?.data?.message || 'Network error. Please try again.';
        dispatch(setError(message));
        return { success: false, message };
    }
};

// Get all book loans for a school
export const getAllBookLoans = (schoolName, filters = {}, page = 1, limit = 20) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        
        const queryParams = new URLSearchParams({
            page,
            limit,
            ...filters
        });
        
        const response = await axios.get(`${API_URL}/BookLoans/${schoolName}?${queryParams}`);
        
        if (response.data) {
            dispatch(setBookLoans(response.data));
            return response.data;
        } else {
            dispatch(setError('Failed to fetch book loans'));
            return null;
        }
    } catch (error) {
        const message = error.response?.data?.message || 'Network error. Please try again.';
        dispatch(setError(message));
        return null;
    }
};

// Get book loans for a specific student
export const getStudentBookLoans = (studentId, status = null) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        
        const queryParams = status ? `?status=${status}` : '';
        const response = await axios.get(`${API_URL}/BookLoans/student/${studentId}${queryParams}`);
        
        if (response.data) {
            const { bookLoans } = response.data;
            
            // Separate current loans and returned books
            const currentLoans = bookLoans.filter(loan => loan.status !== 'returned');
            const returnedBooks = bookLoans.filter(loan => loan.status === 'returned');
            
            dispatch(setCurrentLoans(currentLoans));
            dispatch(setReturnedBooks(returnedBooks));
            
            return response.data;
        } else {
            dispatch(setError('Failed to fetch student book loans'));
            return null;
        }
    } catch (error) {
        const message = error.response?.data?.message || 'Network error. Please try again.';
        dispatch(setError(message));
        return null;
    }
};

// Get book loans for a specific teacher
export const getTeacherBookLoans = (teacherId, status = null) => async (dispatch, getState) => {
    try {
        dispatch(setLoading(true));
        
        console.log('Fetching teacher book loans for:', { teacherId });
        
        // Try the new teacher-specific endpoint first
        try {
            const queryParams = status ? `?status=${status}` : '';
            const response = await axios.get(`${API_URL}/BookLoans/teacher/${teacherId}${queryParams}`);
            
            if (response.data && response.data.success) {
                const teacherLoans = response.data.bookLoans || [];
                
                console.log('Teacher loans received from teacher endpoint:', teacherLoans);
                
                // Separate current loans and returned books
                const currentLoans = teacherLoans.filter(loan => loan.status !== 'returned');
                const returnedBooks = teacherLoans.filter(loan => loan.status === 'returned');
                
                dispatch(setCurrentLoans(currentLoans));
                dispatch(setReturnedBooks(returnedBooks));
                
                return { success: true, data: teacherLoans };
            }
        } catch (endpointError) {
            console.log('Teacher-specific endpoint failed, trying fallback approach:', endpointError.message);
        }
        
        // Fallback: Try to get all loans and filter for this teacher
        try {
            const state = getState();
            const currentUser = state.user.currentUser;
            const schoolName = currentUser?.schoolName || 'defaultSchool';
            
            console.log('Trying fallback approach with school:', schoolName);
            
            const response = await axios.get(`${API_URL}/BookLoans/${schoolName}`);
            
            if (response.data) {
                const allLoans = response.data || [];
                
                // Filter to only show loans for this specific teacher
                const teacherLoans = allLoans.filter(loan => {
                    return loan.teacher === teacherId || 
                           (loan.student === teacherId && loan.borrowerType === 'teacher') ||
                           (loan.student === teacherId && loan.isStaffMember);
                });
                
                console.log('Teacher loans found with fallback approach:', teacherLoans);
                
                // Separate current loans and returned books
                const currentLoans = teacherLoans.filter(loan => loan.status !== 'returned');
                const returnedBooks = teacherLoans.filter(loan => loan.status === 'returned');
                
                dispatch(setCurrentLoans(currentLoans));
                dispatch(setReturnedBooks(returnedBooks));
                
                return { success: true, data: teacherLoans };
            }
        } catch (fallbackError) {
            console.log('Fallback approach also failed:', fallbackError.message);
        }
        
        dispatch(setError('Failed to fetch teacher book loans'));
        return null;
        
    } catch (error) {
        console.error('Error fetching teacher book loans:', error);
        const message = error.response?.data?.message || 'Network error. Please try again.';
        dispatch(setError(message));
        return null;
    }
};

// Get overdue books
export const getOverdueBooks = (schoolName) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        
        const response = await axios.get(`${API_URL}/BookLoans/overdue/${schoolName}`);
        
        if (response.data) {
            dispatch(setOverdueBooks(response.data.overdueLoans));
            return response.data.overdueLoans;
        } else {
            dispatch(setError('Failed to fetch overdue books'));
            return null;
        }
    } catch (error) {
        const message = error.response?.data?.message || 'Network error. Please try again.';
        dispatch(setError(message));
        return null;
    }
};

// Update book loan (extend due date, add notes, etc.)
export const updateBookLoanDetails = (loanId, updateData) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        
        const response = await axios.put(`${API_URL}/BookLoan/${loanId}`, updateData);
        
        if (response.data.success) {
            dispatch(updateBookLoan(response.data.bookLoan));
            return { success: true, data: response.data.bookLoan };
        } else {
            dispatch(setError(response.data.message || 'Failed to update book loan'));
            return { success: false, message: response.data.message };
        }
    } catch (error) {
        const message = error.response?.data?.message || 'Network error. Please try again.';
        dispatch(setError(message));
        return { success: false, message };
    }
};

// Get library statistics
export const getLibraryStats = (schoolName) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        
        const response = await axios.get(`${API_URL}/LibraryStats/${schoolName}`);
        
        if (response.data) {
            return response.data;
        } else {
            dispatch(setError('Failed to fetch library statistics'));
            return null;
        }
    } catch (error) {
        const message = error.response?.data?.message || 'Network error. Please try again.';
        dispatch(setError(message));
        return null;
    }
};

const BookLoan = require('../models/bookLoanSchema');
const Book = require('../models/bookSchema');
const Student = require('../models/studentSchema');
const Librarian = require('../models/librarianSchema');
const Teacher = require('../models/teacherSchema');

// Issue a book to a student or staff member
const issueBook = async (req, res) => {
    try {
        console.log('Issue book request body:', req.body);
        console.log('Issue book request user:', req.user);
        
        const { bookId, studentId, dueDate, notes, librarianId, isStaffMember, borrowerType } = req.body;
        const schoolName = req.body.schoolName;
        
        console.log('Extracted values:', { bookId, studentId, dueDate, notes, librarianId, schoolName, isStaffMember, borrowerType });

        // Validate required fields
        console.log('Validating required fields...');
        console.log('bookId:', bookId, 'valid:', !!bookId);
        console.log('studentId:', studentId, 'valid:', !!studentId);
        console.log('dueDate:', dueDate, 'valid:', !!dueDate);
        console.log('schoolName:', schoolName, 'valid:', !!schoolName);
        
        if (!bookId || !studentId || !dueDate || !schoolName) {
            const missingFields = [];
            if (!bookId) missingFields.push('bookId');
            if (!studentId) missingFields.push('studentId');
            if (!dueDate) missingFields.push('dueDate');
            if (!schoolName) missingFields.push('schoolName');
            
            console.log('Validation failed. Missing fields:', missingFields);
            return res.status(400).json({ 
                message: 'Missing required fields',
                missingFields: missingFields
            });
        }
        
        console.log('All required fields are present');

        // Check if book exists and is available
        console.log('Checking if book exists...');
        const book = await Book.findById(bookId);
        if (!book) {
            console.log('Book not found for ID:', bookId);
            return res.status(404).json({ message: 'Book not found' });
        }
        console.log('Book found:', book.title, 'Available quantity:', book.availableQuantity);

        if (book.availableQuantity <= 0) {
            console.log('Book not available. Available quantity:', book.availableQuantity);
            return res.status(400).json({ message: 'Book is not available for borrowing' });
        }
        console.log('Book is available for borrowing');

        // Check if borrower exists (student or staff)
        let borrower = null;
        
        // Use borrowerType from request body, fallback to logic based on isStaffMember
        let finalBorrowerType = borrowerType || 'student';
        console.log('Using borrowerType:', borrowerType, 'Final borrowerType:', finalBorrowerType);
        
        if (finalBorrowerType === 'teacher') {
            // Check if teacher exists
            borrower = await Teacher.findById(studentId);
            if (!borrower) {
                console.log('Teacher not found for ID:', studentId);
                return res.status(404).json({ message: 'Teacher not found' });
            }
            console.log('Teacher found:', borrower.name);
        } else if (finalBorrowerType === 'librarian') {
            // Check if librarian exists
            borrower = await Librarian.findById(studentId);
            if (!borrower) {
                console.log('Librarian not found for ID:', studentId);
                return res.status(404).json({ message: 'Librarian not found' });
            }
            console.log('Librarian found:', borrower.name);
        } else if (isStaffMember) {
            // Fallback: Check if it's a teacher or librarian when isStaffMember is true
            borrower = await Teacher.findById(studentId);
            if (borrower) {
                finalBorrowerType = 'teacher';
                console.log('Teacher found:', borrower.name);
            } else {
                borrower = await Librarian.findById(studentId);
                if (borrower) {
                    finalBorrowerType = 'librarian';
                    console.log('Librarian found:', borrower.name);
                } else {
                    console.log('Staff member not found for ID:', studentId);
                    return res.status(404).json({ message: 'Staff member not found' });
                }
            }
        } else {
            // Default: Check if student exists
            borrower = await Student.findById(studentId);
            if (!borrower) {
                console.log('Student not found for ID:', studentId);
                return res.status(404).json({ message: 'Student not found' });
            }
            console.log('Student found:', borrower.name);
            finalBorrowerType = 'student';
        }

        // Check if librarian exists (optional for now)
        let librarian = null;
        if (librarianId) {
            librarian = await Librarian.findById(librarianId);
            if (!librarian) {
                console.log('Librarian not found for ID:', librarianId);
                // Don't fail, just continue without librarian
            }
        } else {
            console.log('No librarian ID provided, proceeding without librarian');
        }

        // Check if borrower already has this book borrowed
        console.log('Checking for existing loans...');
        const existingLoanQuery = {
            book: bookId,
            status: { $in: ['borrowed', 'overdue'] }
        };
        
        if (finalBorrowerType === 'teacher') {
            existingLoanQuery.teacher = studentId;
        } else {
            existingLoanQuery.student = studentId;
        }
        
        const existingLoan = await BookLoan.findOne(existingLoanQuery);

        if (existingLoan) {
            const borrowerLabel = isStaffMember ? 'Staff member' : 'Student';
            console.log(`${borrowerLabel} already has this book borrowed. Existing loan ID:`, existingLoan._id);
            return res.status(400).json({ message: `${borrowerLabel} already has this book borrowed` });
        }
        console.log('No existing loans found for this borrower and book');

        // Create new book loan
        const bookLoanData = {
            book: bookId,
            librarian: librarianId || null,
            dueDate: new Date(dueDate),
            notes,
            schoolName,
            borrowerType: finalBorrowerType, // Add borrower type for tracking
            isStaffMember: isStaffMember || false
        };
        
        // Set the appropriate borrower field based on type
        if (finalBorrowerType === 'teacher') {
            bookLoanData.teacher = studentId;
        } else {
            bookLoanData.student = studentId;
        }
        
        console.log('Creating book loan with data:', bookLoanData);
        
        const bookLoan = new BookLoan(bookLoanData);

        console.log('Saving book loan...');
        await bookLoan.save();
        console.log('Book loan saved successfully with ID:', bookLoan._id);

        // Update book availability
        console.log('Updating book availability. Current availableQuantity:', book.availableQuantity);
        book.availableQuantity -= 1;
        if (book.availableQuantity === 0) {
            book.status = 'out_of_stock';
        }
        console.log('New availableQuantity:', book.availableQuantity, 'New status:', book.status);
        await book.save();
        console.log('Book updated successfully');

        // Populate the response with book and borrower details
        console.log('Populating book loan response...');
        const populatedLoan = await BookLoan.findById(bookLoan._id)
            .populate('book', 'title author isbn')
            .populate('student', 'name rollNum')
            .populate('teacher', 'name email')
            .populate('librarian', 'name');
        console.log('Populated loan:', populatedLoan);

        const response = {
            message: 'Book issued successfully',
            bookLoan: populatedLoan
        };
        console.log('Sending response:', response);
        res.status(201).json(response);

    } catch (error) {
        console.error('Error issuing book:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Return a book
const returnBook = async (req, res) => {
    try {
        const { loanId } = req.params;
        const { notes } = req.body;

        // Find the book loan
        const bookLoan = await BookLoan.findById(loanId);
        if (!bookLoan) {
            return res.status(404).json({ message: 'Book loan not found' });
        }

        if (bookLoan.status === 'returned') {
            return res.status(400).json({ message: 'Book has already been returned' });
        }

        // Calculate fine if overdue
        bookLoan.calculateFine();
        bookLoan.status = 'returned';
        bookLoan.returnDate = new Date();
        if (notes) {
            bookLoan.notes = notes;
        }

        await bookLoan.save();

        // Update book availability
        const book = await Book.findById(bookLoan.book);
        if (book) {
            book.availableQuantity += 1;
            if (book.status === 'out_of_stock') {
                book.status = 'available';
            }
            await book.save();
        }

        // Populate the response with book and student details
        const populatedLoan = await BookLoan.findById(loanId)
            .populate('book', 'title author isbn')
            .populate('student', 'name rollNum')
            .populate('librarian', 'name');

        res.json({
            message: 'Book returned successfully',
            bookLoan: populatedLoan
        });

    } catch (error) {
        console.error('Error returning book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all book loans for a school
const getAllBookLoans = async (req, res) => {
    try {
        const { schoolName } = req.params;
        const { status, studentId, bookId, page = 1, limit = 20 } = req.query;

        const query = { schoolName };

        // Add filters
        if (status) query.status = status;
        if (studentId) query.student = studentId;
        if (bookId) query.book = bookId;
        
        // Handle migration of old loans that might have isStaffMember but no teacher field
        // This ensures backward compatibility
        try {
            // Find loans that have isStaffMember: true but no teacher field (old structure)
            const oldStaffLoans = await BookLoan.find({
                schoolName,
                isStaffMember: true,
                teacher: { $exists: false }
            });
            
            if (oldStaffLoans.length > 0) {
                console.log(`Found ${oldStaffLoans.length} old staff loans to migrate`);
                
                for (const loan of oldStaffLoans) {
                    // Try to find the teacher by looking at the librarian field or other clues
                    // For now, we'll set a default teacher ID (you may need to adjust this logic)
                    if (loan.librarian && loan.librarian.toString() !== loan.student?.toString()) {
                        // If librarian is different from student, it might be the actual borrower
                        loan.teacher = loan.librarian;
                        loan.student = null; // Clear the student field
                        await loan.save();
                        console.log(`Migrated loan ${loan._id} to use teacher field`);
                    }
                }
            }
        } catch (migrationError) {
            console.log('Migration error (non-critical):', migrationError);
        }

        const skip = (page - 1) * limit;

        // NOTE: Automatic cleanup is disabled during normal fetch operations to prevent data loss
        // Use the manual cleanup endpoint (/BookLoans/:schoolName/cleanup) instead
        // This prevents accidental deletion of valid loans during normal operations
        
        // If you want to enable automatic cleanup, uncomment the code below:
        /*
        // First, let's clean up any orphaned book loans (loans without valid borrower or book references)
        try {
            const orphanedLoans = await BookLoan.find({
                schoolName,
                $or: [
                    // Missing book field
                    { book: { $exists: false } },
                    { book: null },
                    // Missing both student AND teacher fields (this covers all borrower types)
                    {
                        $and: [
                            { student: { $exists: false } },
                            { teacher: { $exists: false } }
                        ]
                    },
                    {
                        $and: [
                            { student: null },
                            { teacher: null }
                        ]
                    }
                ]
            });
            
            if (orphanedLoans.length > 0) {
                console.log(`Found ${orphanedLoans.length} orphaned book loans, removing them...`);
                
                        // IMPORTANT: Restore book availability before deleting orphaned loans
        let restoredBooksCount = 0;
        for (const loan of orphanedLoans) {
            if (loan.book && (loan.status === 'borrowed' || loan.status === 'overdue')) {
                try {
                    const book = await Book.findById(loan.book);
                    if (book) {
                        // Only restore availability if the book was actually borrowed/overdue
                        if (loan.status === 'borrowed' || loan.status === 'overdue') {
                            book.availableQuantity += 1;
                            if (book.status === 'out_of_stock') {
                                book.status = 'available';
                            }
                            await book.save();
                            restoredBooksCount++;
                            console.log(`Restored availability for book: ${book.title} (ID: ${book._id}) - Status was: ${loan.status}`);
                        }
                    }
                } catch (bookUpdateError) {
                    console.log(`Error updating book availability for loan ${loan._id}:`, bookUpdateError);
                }
            }
        }
                
                await BookLoan.deleteMany({ _id: { $in: orphanedLoans.map(loan => loan._id) } });
                console.log(`Removed ${orphanedLoans.length} orphaned book loans and restored book availability`);
            }
        } catch (cleanupError) {
            console.log('Cleanup error (non-critical):', cleanupError);
        }
        */

        const bookLoans = await BookLoan.find(query)
            .populate('book', 'title author isbn category')
            .populate('student', 'name rollNum')
            .populate('teacher', 'name email')
            .populate('librarian', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Filter out any loans that still don't have proper references after population
        // A loan is valid if it has a book AND either a student OR teacher
        const validBookLoans = bookLoans.filter(loan => 
            loan.book && loan.book._id && 
            ((loan.student && loan.student._id) || (loan.teacher && loan.teacher._id))
        );

        const total = await BookLoan.countDocuments(query);

        res.json({
            bookLoans: validBookLoans,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Error fetching book loans:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get book loans for a specific student
const getStudentBookLoans = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { status } = req.query;

        const query = { student: studentId };
        if (status) query.status = status;

        const bookLoans = await BookLoan.find(query)
            .populate('book', 'title author isbn category')
            .populate('student', 'name rollNum')
            .populate('teacher', 'name email')
            .populate('librarian', 'name')
            .sort({ createdAt: -1 });

        res.json({ bookLoans });

    } catch (error) {
        console.error('Error fetching student book loans:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get overdue books
const getOverdueBooks = async (req, res) => {
    try {
        const { schoolName } = req.params;

        const overdueLoans = await BookLoan.find({
            schoolName,
            status: { $in: ['borrowed', 'overdue'] },
            dueDate: { $lt: new Date() }
        })
        .populate('book', 'title author isbn')
        .populate('student', 'name rollNum')
        .populate('teacher', 'name email')
        .populate('librarian', 'name')
        .sort({ dueDate: 1 });

        res.json({ overdueLoans });

    } catch (error) {
        console.error('Error fetching overdue books:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update book loan (extend due date, add notes, etc.)
const updateBookLoan = async (req, res) => {
    try {
        const { loanId } = req.params;
        const { dueDate, notes } = req.body;

        const bookLoan = await BookLoan.findById(loanId);
        if (!bookLoan) {
            return res.status(404).json({ message: 'Book loan not found' });
        }

        if (bookLoan.status === 'returned') {
            return res.status(400).json({ message: 'Cannot update returned book loan' });
        }

        // Update fields
        if (dueDate) bookLoan.dueDate = new Date(dueDate);
        if (notes !== undefined) bookLoan.notes = notes;

        // Check if overdue
        bookLoan.isOverdue();

        await bookLoan.save();

        const populatedLoan = await BookLoan.findById(loanId)
            .populate('book', 'title author isbn')
            .populate('student', 'name rollNum')
            .populate('librarian', 'name');

        res.json({
            message: 'Book loan updated successfully',
            bookLoan: populatedLoan
        });

    } catch (error) {
        console.error('Error updating book loan:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get library statistics
const getLibraryStats = async (req, res) => {
    try {
        const { schoolName } = req.params;

        const totalBooks = await Book.countDocuments({ schoolName });
        const availableBooks = await Book.countDocuments({ 
            schoolName, 
            availableQuantity: { $gt: 0 } 
        });
        const borrowedBooks = await BookLoan.countDocuments({ 
            schoolName, 
            status: { $in: ['borrowed', 'overdue'] } 
        });
        const overdueBooks = await BookLoan.countDocuments({ 
            schoolName, 
            status: 'overdue' 
        });
        const totalStudents = await Student.countDocuments({ school: schoolName });

        res.json({
            totalBooks,
            availableBooks,
            borrowedBooks,
            overdueBooks,
            totalStudents
        });

    } catch (error) {
        console.error('Error fetching library stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Migration function to fix old staff loans
const migrateOldStaffLoans = async (req, res) => {
    try {
        const { schoolName } = req.params;
        
        console.log(`Starting migration for school: ${schoolName}`);
        
        // Find all loans that have isStaffMember: true but no teacher field
        const oldStaffLoans = await BookLoan.find({
            schoolName,
            isStaffMember: true,
            teacher: { $exists: false }
        });
        
        console.log(`Found ${oldStaffLoans.length} old staff loans to migrate`);
        
        let migratedCount = 0;
        for (const loan of oldStaffLoans) {
            try {
                // For now, we'll assume the librarian is the teacher (you may need to adjust this)
                if (loan.librarian) {
                    loan.teacher = loan.librarian;
                    loan.student = null; // Clear the student field
                    await loan.save();
                    migratedCount++;
                    console.log(`Migrated loan ${loan._id} to use teacher field`);
                }
            } catch (saveError) {
                console.log(`Error migrating loan ${loan._id}:`, saveError);
            }
        }
        
        res.json({
            message: `Migration completed. ${migratedCount} loans migrated.`,
            totalFound: oldStaffLoans.length,
            migratedCount
        });
        
    } catch (error) {
        console.error('Error in migration:', error);
        res.status(500).json({ message: 'Migration failed', error: error.message });
    }
};

// Restore book availability for orphaned loans (fix for existing data)
const restoreBookAvailability = async (req, res) => {
    try {
        const { schoolName } = req.params;
        
        console.log(`Starting book availability restoration for school: ${schoolName}`);
        
        // Find all books that are marked as out_of_stock but have no active loans
        const books = await Book.find({ schoolName, status: 'out_of_stock' });
        let restoredCount = 0;
        
        for (const book of books) {
            try {
                // Check if there are any active loans for this book
                const activeLoans = await BookLoan.find({
                    book: book._id,
                    status: { $in: ['borrowed', 'overdue'] }
                });
                
                // If no active loans, restore availability
                if (activeLoans.length === 0) {
                    // Also check if availableQuantity is incorrect
                    if (book.availableQuantity === 0 && book.quantity > 0) {
                        book.availableQuantity = book.quantity;
                    }
                    book.status = 'available';
                    await book.save();
                    restoredCount++;
                    console.log(`Restored availability for book: ${book.title} (ID: ${book._id}) - Quantity: ${book.quantity}, Available: ${book.availableQuantity}`);
                } else {
                    // If there are active loans, check if availableQuantity is correct
                    const borrowedCount = activeLoans.length;
                    const correctAvailableQuantity = Math.max(0, book.quantity - borrowedCount);
                    
                    if (book.availableQuantity !== correctAvailableQuantity) {
                        book.availableQuantity = correctAvailableQuantity;
                        if (book.availableQuantity > 0) {
                            book.status = 'available';
                        }
                        await book.save();
                        restoredCount++;
                        console.log(`Fixed availableQuantity for book: ${book.title} (ID: ${book._id}) - Quantity: ${book.quantity}, Borrowed: ${borrowedCount}, Available: ${book.availableQuantity}`);
                    }
                }
            } catch (bookError) {
                console.log(`Error processing book ${book._id}:`, bookError);
            }
        }
        
        res.json({
            message: `Book availability restoration completed`,
            restoredCount: restoredCount,
            totalBooks: books.length,
            details: `Restored availability for ${restoredCount} books out of ${books.length} out-of-stock books`
        });
        
    } catch (error) {
        console.error('Error in book availability restoration:', error);
        res.status(500).json({ message: 'Restoration failed', error: error.message });
    }
};

// Cleanup orphaned book loans
const cleanupOrphanedLoans = async (req, res) => {
    try {
        const { schoolName } = req.params;
        
        console.log(`Starting cleanup for school: ${schoolName}`);
        
        // Find and remove orphaned book loans
        // A loan is orphaned if it's missing BOTH student AND teacher fields, or missing book field
        const orphanedLoans = await BookLoan.find({
            schoolName,
            $or: [
                // Missing book field
                { book: { $exists: false } },
                { book: null },
                // Missing both student AND teacher fields (this covers all borrower types)
                {
                    $and: [
                        { student: { $exists: false } },
                        { teacher: { $exists: false } }
                    ]
                },
                {
                    $and: [
                        { student: null },
                        { teacher: null }
                    ]
                }
            ]
        });
        
        if (orphanedLoans.length === 0) {
            return res.json({
                message: 'No orphaned book loans found',
                cleanedCount: 0
            });
        }
        
        console.log(`Found ${orphanedLoans.length} orphaned book loans, removing them...`);
        
        let restoredBooksCount = 0;
        
        // IMPORTANT: Restore book availability before deleting orphaned loans
        for (const loan of orphanedLoans) {
            if (loan.book && loan.status === 'borrowed') {
                try {
                    const book = await Book.findById(loan.book);
                    if (book) {
                        book.availableQuantity += 1;
                        if (book.status === 'out_of_stock') {
                            book.status = 'available';
                        }
                        await book.save();
                        restoredBooksCount++;
                        console.log(`Restored availability for book: ${book.title} (ID: ${book._id})`);
                    }
                } catch (bookUpdateError) {
                    console.log(`Error updating book availability for loan ${loan._id}:`, bookUpdateError);
                }
            }
        }
        
        // Remove orphaned loans
        await BookLoan.deleteMany({ _id: { $in: orphanedLoans.map(loan => loan._id) } });
        
        console.log(`Successfully removed ${orphanedLoans.length} orphaned book loans and restored availability for ${restoredBooksCount} books`);
        
        res.json({
            message: `Cleanup completed successfully`,
            cleanedCount: orphanedLoans.length,
            restoredBooksCount: restoredBooksCount,
            details: `Removed ${orphanedLoans.length} orphaned book loans and restored availability for ${restoredBooksCount} books`
        });
        
    } catch (error) {
        console.error('Error in cleanup:', error);
        res.status(500).json({ message: 'Cleanup failed', error: error.message });
    }
};

// Fix book availability by recalculating based on actual loan status
const fixBookAvailability = async (req, res) => {
    try {
        const { schoolName } = req.params;
        
        console.log(`Starting book availability fix for school: ${schoolName}`);
        
        // Get all books for the school
        const books = await Book.find({ schoolName });
        let fixedCount = 0;
        
        for (const book of books) {
            try {
                // Count actual borrowed books for this book
                const borrowedLoans = await BookLoan.countDocuments({
                    book: book._id,
                    status: { $in: ['borrowed', 'overdue'] }
                });
                
                // Calculate correct available quantity
                const correctAvailableQuantity = Math.max(0, book.quantity - borrowedLoans);
                
                // Check if anything needs to be fixed
                if (book.availableQuantity !== correctAvailableQuantity || 
                    (book.status === 'out_of_stock' && correctAvailableQuantity > 0) ||
                    (book.status === 'available' && correctAvailableQuantity === 0)) {
                    
                    // Update the book
                    book.availableQuantity = correctAvailableQuantity;
                    
                    // Update status based on availability
                    if (correctAvailableQuantity === 0) {
                        book.status = 'out_of_stock';
                    } else {
                        book.status = 'available';
                    }
                    
                    await book.save();
                    fixedCount++;
                    
                    console.log(`Fixed book: ${book.title} - Quantity: ${book.quantity}, Borrowed: ${borrowedLoans}, Available: ${correctAvailableQuantity}, Status: ${book.status}`);
                }
            } catch (bookError) {
                console.log(`Error processing book ${book._id}:`, bookError);
            }
        }
        
        res.json({
            message: `Book availability fix completed`,
            fixedCount: fixedCount,
            totalBooks: books.length,
            details: `Fixed availability for ${fixedCount} books out of ${books.length} total books`
        });
        
    } catch (error) {
        console.error('Error in book availability fix:', error);
        res.status(500).json({ message: 'Fix failed', error: error.message });
    }
};

// Get student book loans for a school (excludes teacher and librarian loans)
const getSchoolStudentBookLoans = async (req, res) => {
    try {
        const { schoolName } = req.params;
        const { status, page = 1, limit = 20 } = req.query;

        const query = { 
            schoolName,
            student: { $exists: true, $ne: null } // Only loans with student field
        };

        // Add status filter if provided
        if (status) query.status = status;

        const skip = (page - 1) * limit;

        // Get total count for pagination
        const totalLoans = await BookLoan.countDocuments(query);
        const totalPages = Math.ceil(totalLoans / limit);

        // Get student loans with pagination
        const studentLoans = await BookLoan.find(query)
            .populate('student', 'name rollNum')
            .populate('book', 'title author isbn category')
            .populate('librarian', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: studentLoans,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalLoans,
                loansPerPage: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Error fetching school student book loans:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get teacher book loans for a school (excludes student and librarian loans)
const getSchoolTeacherBookLoans = async (req, res) => {
    try {
        const { schoolName } = req.params;
        const { status, page = 1, limit = 20 } = req.query;

        const query = { 
            schoolName,
            teacher: { $exists: true, $ne: null } // Only loans with teacher field
        };

        // Add status filter if provided
        if (status) query.status = status;

        const skip = (page - 1) * limit;

        // Get total count for pagination
        const totalLoans = await BookLoan.countDocuments(query);
        const totalPages = Math.ceil(totalLoans / limit);

        // Get teacher loans with pagination
        const teacherLoans = await BookLoan.find(query)
            .populate('teacher', 'name email')
            .populate('book', 'title author isbn category')
            .populate('librarian', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: teacherLoans,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalLoans,
                loansPerPage: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Error fetching school teacher book loans:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get librarian book loans for a school (excludes student and teacher loans)
const getSchoolLibrarianBookLoans = async (req, res) => {
    try {
        const { schoolName } = req.params;
        const { status, page = 1, limit = 20 } = req.query;

        const query = { 
            schoolName,
            borrowerType: 'librarian' // Only loans with librarian borrower type
        };

        // Add status filter if provided
        if (status) query.status = status;

        const skip = (page - 1) * limit;

        // Get total count for pagination
        const totalLoans = await BookLoan.countDocuments(query);
        const totalPages = Math.ceil(totalLoans / limit);

        // Get librarian loans with pagination
        const librarianLoans = await BookLoan.find(query)
            .populate('librarian', 'name email')
            .populate('book', 'title author isbn category')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: librarianLoans,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalLoans,
                loansPerPage: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Error fetching school librarian book loans:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get book loans for a specific teacher
const getTeacherBookLoans = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { status } = req.query;

        console.log(`🔍 Fetching book loans for teacher: ${teacherId}`);
        console.log(`🔍 Teacher ID type: ${typeof teacherId}`);

        // Build query to find loans for this specific teacher
        const query = {
            $or: [
                { teacher: teacherId },
                { student: teacherId, borrowerType: 'teacher' },
                { student: teacherId, isStaffMember: true }
            ]
        };

        // Add status filter if provided
        if (status) {
            query.status = status;
        }

        console.log(`🔍 Query being used:`, JSON.stringify(query, null, 2));

        // First, let's check what loans exist in the database
        const allLoans = await BookLoan.find({}).limit(10);
        console.log(`🔍 Sample of all loans in database:`, allLoans.map(loan => ({
            id: loan._id,
            book: loan.book,
            teacher: loan.teacher,
            student: loan.student,
            borrowerType: loan.borrowerType,
            isStaffMember: loan.isStaffMember,
            status: loan.status
        })));

        // Find all loans for this teacher
        const teacherLoans = await BookLoan.find(query)
            .populate('book', 'title author isbn category')
            .populate('teacher', 'name email')
            .populate('librarian', 'name')
            .sort({ createdAt: -1 });

        console.log(`✅ Found ${teacherLoans.length} book loans for teacher ${teacherId}`);
        console.log(`✅ Teacher loans:`, teacherLoans.map(loan => ({
            id: loan._id,
            bookTitle: loan.book?.title || 'Unknown',
            teacher: loan.teacher,
            student: loan.student,
            borrowerType: loan.borrowerType,
            isStaffMember: loan.isStaffMember,
            status: loan.status
        })));

        res.json({
            success: true,
            bookLoans: teacherLoans,
            count: teacherLoans.length
        });

    } catch (error) {
        console.error('❌ Error fetching teacher book loans:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching teacher book loans',
            error: error.message 
        });
    }
};

// Delete a book loan record
const deleteBookLoan = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🔍 Attempting to delete book loan with ID: ${id}`);
    console.log(`🔍 ID type: ${typeof id}, Length: ${id.length}`);
    
    // Find the book loan first to get book details
    const bookLoan = await BookLoan.findById(id).populate('book');
    
    console.log(`🔍 BookLoan.findById result:`, bookLoan ? 'Found' : 'Not found');
    
    if (!bookLoan) {
      console.log(`❌ Book loan with ID ${id} not found in database`);
      
      // Let's check what book loans exist in the database
      const allLoans = await BookLoan.find({}).limit(5);
      console.log(`🔍 Sample of existing book loans:`, allLoans.map(loan => ({
        id: loan._id,
        idType: typeof loan._id,
        idLength: loan._id.toString().length,
        borrowerType: loan.borrowerType,
        status: loan.status
      })));
      
      return res.status(404).json({ 
        success: false, 
        message: 'Book loan record not found',
        debug: {
          requestedId: id,
          requestedIdType: typeof id,
          requestedIdLength: id.length
        }
      });
    }

    console.log(`✅ Found book loan:`, {
      id: bookLoan._id,
      borrowerType: bookLoan.borrowerType,
      status: bookLoan.status,
      bookTitle: bookLoan.book?.title || 'No book'
    });

    // If the book is currently borrowed, restore its availability
    if (bookLoan.status === 'borrowed' && bookLoan.book) {
      const book = await Book.findById(bookLoan.book._id);
      if (book) {
        book.availableQuantity += 1;
        if (book.status === 'out_of_stock' && book.availableQuantity > 0) {
          book.status = 'available';
        }
        await book.save();
        console.log(`✅ Restored availability for book: ${book.title} after loan deletion`);
      }
    }

    // Delete the book loan record
    await BookLoan.findByIdAndDelete(id);
    
    console.log(`✅ Successfully deleted book loan record: ${id}`);
    
    res.json({ 
      success: true, 
      message: 'Book loan record deleted successfully',
      deletedLoan: {
        id: bookLoan._id,
        bookTitle: bookLoan.book?.title || 'Unknown Book',
        borrowerType: bookLoan.borrowerType || 'unknown'
      }
    });
    
  } catch (error) {
    console.error('❌ Error deleting book loan:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting book loan record',
      error: error.message 
    });
  }
};

module.exports = {
    issueBook,
    returnBook,
    getAllBookLoans,
    getStudentBookLoans,
    getTeacherBookLoans,
    getSchoolStudentBookLoans,
    getSchoolTeacherBookLoans,
    getSchoolLibrarianBookLoans,
    getOverdueBooks,
    updateBookLoan,
    getLibraryStats,
    migrateOldStaffLoans,
    cleanupOrphanedLoans,
    restoreBookAvailability,
    fixBookAvailability,
    deleteBookLoan
};



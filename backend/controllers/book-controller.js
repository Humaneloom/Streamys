const { Book } = require('../models/index.js');

// Create a new book
const createBook = async (req, res) => {
    try {
        // For now, we'll use a default librarian ID or get it from the request
        // In a real app, this would come from authentication middleware
        const librarianId = req.user?.id || req.body.addedBy || '507f1f77bcf86cd799439011'; // Default ObjectId
        
        const book = new Book({
            ...req.body,
            addedBy: librarianId
        });

        const result = await book.save();
        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: result
        });
    } catch (err) {
        console.error('Book creation error:', err);
        if (err.code === 11000) {
            res.status(400).json({
                success: false,
                message: 'Book with this ISBN already exists'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error creating book',
                error: err.message
            });
        }
    }
};

// Get all books for a school
const getBooks = async (req, res) => {
    try {
        const { category, search, page = 1, limit = 10 } = req.query;
        const { schoolName } = req.params;
        
        let query = { schoolName };
        
        // Add category filter if provided
        if (category && category !== 'all') {
            query.category = category;
        }
        
        // Add search filter if provided
        if (search) {
            query.$text = { $search: search };
        }
        
        const skip = (page - 1) * limit;
        
        const books = await Book.find(query)
            // .populate('addedBy', 'name email') // Temporarily commented out
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        const total = await Book.countDocuments(query);
        
        res.json({
            success: true,
            data: books,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalBooks: total,
                booksPerPage: parseInt(limit)
            }
        });
    } catch (err) {
        console.error('Get books error:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching books',
            error: err.message
        });
    }
};

// Get book by ID
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            // .populate('addedBy', 'name email') // Temporarily commented out
            
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        
        res.json({
            success: true,
            data: book
        });
    } catch (err) {
        console.error('Get book by ID error:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching book',
            error: err.message
        });
    }
};

// Update book
const updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        )// .populate('addedBy', 'name email') // Temporarily commented out
        
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Book updated successfully',
            data: book
        });
    } catch (err) {
        console.error('Update book error:', err);
        res.status(500).json({
            success: false,
            message: 'Error updating book',
            error: err.message
        });
    }
};

// Delete book
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Book deleted successfully'
        });
    } catch (err) {
        console.error('Delete book error:', err);
        res.status(500).json({
            success: false,
            message: 'Error deleting book',
            error: err.message
        });
    }
};

// Get book statistics for dashboard
const getBookStats = async (req, res) => {
    try {
        const { schoolName } = req.params;
        
        const stats = await Book.aggregate([
            { $match: { schoolName } },
            {
                $group: {
                    _id: null,
                    totalBooks: { $sum: '$quantity' },
                    totalTitles: { $sum: 1 },
                    totalAvailable: { $sum: '$availableQuantity' },
                    totalOutOfStock: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'out_of_stock'] }, 1, 0]
                        }
                    }
                }
            }
        ]);
        
        const categoryStats = await Book.aggregate([
            { $match: { schoolName } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    totalQuantity: { $sum: '$quantity' }
                }
            },
            { $sort: { count: -1 } }
        ]);
        
        const recentBooks = await Book.find({ schoolName })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title author imageUrl createdAt');
        
        const result = {
            totalBooks: stats[0]?.totalBooks || 0,
            totalTitles: stats[0]?.totalTitles || 0,
            totalAvailable: stats[0]?.totalAvailable || 0,
            totalOutOfStock: stats[0]?.totalOutOfStock || 0,
            categoryStats,
            recentBooks
        };
        
        res.json({
            success: true,
            data: result
        });
    } catch (err) {
        console.error('Get book stats error:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching book statistics',
            error: err.message
        });
    }
};

// Get book categories
const getBookCategories = async (req, res) => {
    try {
        const { schoolName } = req.params;
        
        // Get categories from existing books
        const existingCategories = await Book.distinct('category', { schoolName });
        
        // Only include default categories if no existing categories found
        let allCategories = existingCategories;
        
        if (existingCategories.length === 0) {
            // Default categories only when none exist
            const defaultCategories = [
                'Fiction',
                'Non-Fiction',
                'Science',
                'Mathematics',
                'History',
                'Geography',
                'Literature',
                'Arts',
                'Music',
                'Sports',
                'Technology',
                'Biography',
                'Reference',
                'Children',
                'Young Adult',
                'Academic',
                'Textbook',
                'Novel',
                'Poetry',
                'Drama'
            ];
            allCategories = defaultCategories;
        }
        
        res.json({
            success: true,
            data: allCategories
        });
    } catch (err) {
        console.error('Get book categories error:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching book categories',
            error: err.message
        });
    }
};

module.exports = {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
    getBookStats,
    getBookCategories
};

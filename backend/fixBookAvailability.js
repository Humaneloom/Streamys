const mongoose = require('mongoose');
const Book = require('./models/bookSchema');
const BookLoan = require('./models/bookLoanSchema');

// MongoDB connection string - update this with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school_management';

async function fixBookAvailability() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get all books
        const books = await Book.find({});
        console.log(`Found ${books.length} books in the database`);

        let fixedCount = 0;
        let outOfStockCount = 0;
        let availableCount = 0;

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
                        outOfStockCount++;
                    } else {
                        book.status = 'available';
                        availableCount++;
                    }
                    
                    await book.save();
                    fixedCount++;
                    
                    console.log(`Fixed book: "${book.title}" - Quantity: ${book.quantity}, Borrowed: ${borrowedLoans}, Available: ${correctAvailableQuantity}, Status: ${book.status}`);
                } else {
                    if (book.status === 'out_of_stock') {
                        outOfStockCount++;
                    } else {
                        availableCount++;
                    }
                }
            } catch (bookError) {
                console.log(`Error processing book ${book._id}:`, bookError);
            }
        }

        console.log('\n=== SUMMARY ===');
        console.log(`Total books processed: ${books.length}`);
        console.log(`Books fixed: ${fixedCount}`);
        console.log(`Books available: ${availableCount}`);
        console.log(`Books out of stock: ${outOfStockCount}`);
        console.log('================\n');

        // Check for specific book "The Alchemist"
        const alchemistBook = await Book.findOne({ title: 'The Alchemist' });
        if (alchemistBook) {
            const alchemistLoans = await BookLoan.find({
                book: alchemistBook._id,
                status: { $in: ['borrowed', 'overdue'] }
            });
            
            console.log('=== THE ALCHEMIST STATUS ===');
            console.log(`Title: ${alchemistBook.title}`);
            console.log(`Total Quantity: ${alchemistBook.quantity}`);
            console.log(`Available Quantity: ${alchemistBook.availableQuantity}`);
            console.log(`Status: ${alchemistBook.status}`);
            console.log(`Active Loans: ${alchemistLoans.length}`);
            console.log(`Loan Details:`, alchemistLoans.map(loan => ({
                status: loan.status,
                issueDate: loan.issueDate,
                dueDate: loan.dueDate,
                borrower: loan.student || loan.teacher
            })));
            console.log('===========================\n');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
}

// Run the function
fixBookAvailability().catch(console.error);

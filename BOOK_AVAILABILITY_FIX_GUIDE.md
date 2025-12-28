# Book Availability Fix Guide

## Problem Description
The book "The Alchemist" (and potentially other books) is showing as "Out of Stock" with "Available: 0/8" even though all books should be returned. This indicates a bug in the book availability tracking system.

## Root Causes
1. **Missing variable initialization** in the cleanup function
2. **Book availability not being properly restored** when loans are cleaned up
3. **Orphaned book loans** that prevent books from being marked as available
4. **Incorrect `availableQuantity` values** in the database

## Solutions Implemented

### 1. Backend Fixes
- **Fixed missing variable**: Added proper initialization of `restoredBooksCount` in `cleanupOrphanedLoans`
- **Enhanced availability restoration**: Improved logic to fix incorrect `availableQuantity` values
- **New fix function**: Added `fixBookAvailability` endpoint to recalculate all book availability
- **Better error handling**: Improved error handling and logging

### 2. Frontend Fixes
- **Fix Availability Button**: Added button to trigger book availability fixes
- **Cleanup Loans Button**: Added button to clean up orphaned book loans
- **Real-time feedback**: Shows loading states and success/error messages

## How to Fix the Issue

### Option 1: Use the Frontend Buttons (Recommended)
1. Go to **Librarian Dashboard** → **Book Management**
2. Click the **"Fix Availability"** button (orange wrench icon)
3. Click the **"Cleanup Loans"** button (red clear icon)
4. Wait for the process to complete
5. Refresh the page to see updated book status

### Option 2: Use the Backend API Directly
```bash
# Fix book availability
POST /BookLoans/{schoolName}/fix-availability

# Clean up orphaned loans
POST /BookLoans/{schoolName}/cleanup

# Restore book availability
POST /BookLoans/{schoolName}/restore-availability
```

### Option 3: Run the Standalone Script
1. Navigate to the backend directory
2. Update the MongoDB connection string in `fixBookAvailability.js`
3. Run the script:
```bash
node fixBookAvailability.js
```

## What the Fix Does

### Fix Availability Function
- Counts actual borrowed books for each book
- Recalculates correct `availableQuantity` based on loan status
- Updates book status (available/out_of_stock) accordingly
- Fixes books that are incorrectly marked as out of stock

### Cleanup Orphaned Loans Function
- Finds and removes orphaned book loans (missing borrower or book references)
- Restores book availability before deleting orphaned loans
- Prevents data corruption

### Restore Availability Function
- Focuses on books marked as "out_of_stock"
- Checks if they actually have active loans
- Restores availability for books with no active loans

## Expected Results
After running the fix:
- "The Alchemist" should show as "Available" with correct quantity
- All books should have accurate `availableQuantity` values
- Book status should correctly reflect actual availability
- Orphaned loans should be cleaned up

## Prevention
To prevent this issue in the future:
1. **Regular maintenance**: Run the fix availability function monthly
2. **Monitor loan status**: Ensure all book returns are properly processed
3. **Data validation**: Check for orphaned loans periodically
4. **Backup before cleanup**: Always backup data before running cleanup operations

## Troubleshooting
If the fix doesn't work:
1. Check the browser console for error messages
2. Verify the backend server is running
3. Check MongoDB connection
4. Look for any validation errors in the backend logs
5. Ensure the school name is correctly set in localStorage

## API Endpoints Added
- `POST /BookLoans/{schoolName}/fix-availability` - Fix all book availability issues
- Enhanced `POST /BookLoans/{schoolName}/cleanup` - Clean up orphaned loans with better book restoration
- Enhanced `POST /BookLoans/{schoolName}/restore-availability` - Restore availability with quantity validation

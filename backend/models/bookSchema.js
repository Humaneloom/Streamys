const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    isbn: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String,
        default: 'https://via.placeholder.com/300x400/667eea/ffffff?text=Book+Cover'
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
        default: 1
    },
    availableQuantity: {
        type: Number,
        required: true,
        min: 0,
        default: 1
    },
    publicationYear: {
        type: Number,
        min: 1900,
        max: new Date().getFullYear()
    },
    publisher: {
        type: String,
        trim: true
    },
    language: {
        type: String,
        default: 'English'
    },
    pages: {
        type: Number,
        min: 1
    },

    location: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['available', 'out_of_stock', 'discontinued'],
        default: 'available'
    },
    schoolName: {
        type: String,
        required: true
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'librarian',
        required: true
    }
}, {
    timestamps: true
});

// Index for better search performance
bookSchema.index({ title: 'text', author: 'text', isbn: 'text', category: 'text' });

module.exports = mongoose.model('Book', bookSchema);

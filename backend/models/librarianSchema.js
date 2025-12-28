const mongoose = require("mongoose")

const librarianSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "Librarian"
    },
    schoolName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        default: "Library Department"
    }
});

module.exports = mongoose.model("librarian", librarianSchema)

const mongoose = require("mongoose")

const financeSchema = new mongoose.Schema({
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
        default: "Finance"
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
        default: "Finance Department"
    }
});

module.exports = mongoose.model("finance", financeSchema) 
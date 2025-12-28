const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: String, required: true }
});

const testPaperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sclass: { type: mongoose.Schema.Types.ObjectId, ref: 'sclass', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'subject', required: true },
  questions: [questionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'teacher', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestPaper', testPaperSchema); 
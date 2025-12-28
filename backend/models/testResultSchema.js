const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'student', required: true },
  testPaper: { type: mongoose.Schema.Types.ObjectId, ref: 'TestPaper', required: true },
  answers: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true }
    }
  ],
  marks: { type: Number }, // not required for student submission
  remarks: { type: String },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'teacher' }, // not required for student submission
  release: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestResult', testResultSchema); 
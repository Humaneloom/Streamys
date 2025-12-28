const mongoose = require('mongoose');

const marksheetSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    academicYear: {
        type: String,
        required: true
    },
    term: {
        type: String,
        enum: ['Term 1', 'Term 2', 'Final', 'Annual'],
        required: true
    },
    examType: {
        type: String,
        enum: ['Unit Test', 'Mid Term', 'Final', 'Annual'],
        required: true
    },
    subjects: [{
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subject',
            required: true
        },
        theory: {
            marksObtained: {
                type: Number,
                required: true,
                min: 0
            },
            totalMarks: {
                type: Number,
                required: true,
                min: 1
            },
            grade: {
                type: String,
                default: 'F',
                enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F']
            },
            gradePoints: {
                type: Number,
                default: 0,
                min: 0,
                max: 10
            }
        },
        practical: {
            marksObtained: {
                type: Number,
                default: 0,
                min: 0
            },
            totalMarks: {
                type: Number,
                default: 0,
                min: 0
            },
            grade: {
                type: String,
                default: 'F',
                enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F']
            },
            gradePoints: {
                type: Number,
                default: 0,
                min: 0,
                max: 10
            }
        },
        overall: {
            marksObtained: {
                type: Number,
                default: 0
            },
            totalMarks: {
                type: Number,
                default: 0
            },
            percentage: {
                type: Number,
                default: 0
            },
            grade: {
                type: String,
                default: 'F',
                enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F']
            },
            gradePoints: {
                type: Number,
                default: 0,
                min: 0,
                max: 10
            }
        },
        attendance: {
            present: {
                type: Number,
                default: 0
            },
            total: {
                type: Number,
                default: 0
            },
            percentage: {
                type: Number,
                default: 0
            }
        },
        remarks: {
            type: String,
            default: ''
        }
    }],
    overall: {
        totalMarksObtained: {
            type: Number,
            default: 0
        },
        totalMaxMarks: {
            type: Number,
            default: 0
        },
        percentage: {
            type: Number,
            default: 0
        },
        grade: {
            type: String,
            default: 'F',
            enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F']
        },
        cgpa: {
            type: Number,
            default: 0,
            min: 0,
            max: 10
        },
        rank: {
            type: Number,
            min: 1
        },
        totalStudents: {
            type: Number,
            min: 1
        }
    },
    attendance: {
        totalPresent: {
            type: Number,
            default: 0
        },
        totalDays: {
            type: Number,
            default: 0
        },
        percentage: {
            type: Number,
            default: 0
        }
    },
    conduct: {
        discipline: {
            type: String,
            enum: ['Excellent', 'Very Good', 'Good', 'Satisfactory', 'Needs Improvement'],
            default: 'Good'
        },
        remarks: {
            type: String,
            default: ''
        }
    },
    classTeacherRemarks: {
        type: String,
        default: ''
    },
    principalRemarks: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Draft', 'Published', 'Finalized'],
        default: 'Draft'
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    publishedAt: {
        type: Date
    },
    finalizedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes for better query performance
marksheetSchema.index({ student: 1, academicYear: 1, term: 1 });
marksheetSchema.index({ class: 1, academicYear: 1, term: 1 });
marksheetSchema.index({ school: 1, academicYear: 1 });

// Method to calculate grades based on marks
marksheetSchema.methods.calculateGrade = function(percentage) {
    if (percentage >= 90) return { grade: 'A+', points: 10 };
    if (percentage >= 80) return { grade: 'A', points: 9 };
    if (percentage >= 70) return { grade: 'B+', points: 8 };
    if (percentage >= 60) return { grade: 'B', points: 7 };
    if (percentage >= 50) return { grade: 'C+', points: 6 };
    if (percentage >= 40) return { grade: 'C', points: 5 };
    if (percentage >= 33) return { grade: 'D', points: 4 };
    return { grade: 'F', points: 0 };
};

// Pre-save middleware to calculate grades and percentages
marksheetSchema.pre('save', function(next) {
    try {
        // Initialize overall object if it doesn't exist
        if (!this.overall) {
            this.overall = {};
        }

        // Calculate subject-wise grades and overall marks
        let totalMarksObtained = 0;
        let totalMaxMarks = 0;
        let totalGradePoints = 0;
        let subjectCount = 0;

        if (this.subjects && this.subjects.length > 0) {
            this.subjects.forEach(subject => {
                // Initialize nested objects if they don't exist
                if (!subject.overall) subject.overall = {};
                if (!subject.theory) subject.theory = {};
                if (!subject.practical) subject.practical = {};

                // Calculate theory + practical marks
                const theoryMarks = Number(subject.theory.marksObtained) || 0;
                const practicalMarks = Number(subject.practical.marksObtained) || 0;
                const theoryTotal = Number(subject.theory.totalMarks) || 0;
                const practicalTotal = Number(subject.practical.totalMarks) || 0;

                subject.overall.marksObtained = theoryMarks + practicalMarks;
                subject.overall.totalMarks = theoryTotal + practicalTotal;
                subject.overall.percentage = subject.overall.totalMarks > 0 ? 
                    Number((subject.overall.marksObtained / subject.overall.totalMarks * 100).toFixed(2)) : 0;

                // Calculate grade for subject
                const gradeInfo = this.calculateGrade(subject.overall.percentage);
                subject.overall.grade = gradeInfo.grade;
                subject.overall.gradePoints = gradeInfo.points;

                // Calculate individual theory and practical grades
                if (theoryTotal > 0) {
                    const theoryPercentage = (theoryMarks / theoryTotal) * 100;
                    const theoryGrade = this.calculateGrade(theoryPercentage);
                    subject.theory.grade = theoryGrade.grade;
                    subject.theory.gradePoints = theoryGrade.points;
                }

                if (practicalTotal > 0) {
                    const practicalPercentage = (practicalMarks / practicalTotal) * 100;
                    const practicalGrade = this.calculateGrade(practicalPercentage);
                    subject.practical.grade = practicalGrade.grade;
                    subject.practical.gradePoints = practicalGrade.points;
                }

                totalMarksObtained += subject.overall.marksObtained;
                totalMaxMarks += subject.overall.totalMarks;
                totalGradePoints += subject.overall.gradePoints;
                subjectCount++;
            });
        }

        // Calculate overall performance
        this.overall.totalMarksObtained = totalMarksObtained;
        this.overall.totalMaxMarks = totalMaxMarks;
        this.overall.percentage = totalMaxMarks > 0 ? 
            Number((totalMarksObtained / totalMaxMarks * 100).toFixed(2)) : 0;

        const overallGrade = this.calculateGrade(this.overall.percentage);
        this.overall.grade = overallGrade.grade;
        this.overall.cgpa = subjectCount > 0 ? 
            Number((totalGradePoints / subjectCount).toFixed(2)) : 0;

        next();
    } catch (error) {
        console.error('Error in marksheet pre-save middleware:', error);
        next(error);
    }
});

module.exports = mongoose.model('Marksheet', marksheetSchema);
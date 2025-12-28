const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    // Basic Information
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
        // Removed unique: true to allow same email across different schools
    },
    rollNum: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        validate: {
            validator: function(v) {
                if (v === '' || v === null || v === undefined) return true;
                return ['Male', 'Female', 'Other'].includes(v);
            },
            message: 'Gender must be one of: Male, Female, Other'
        },
        default: 'Other'
    },
    
    // New Basic Information Fields
    admissionNumber: {
        type: String,
        required: true
        // Removed unique: true to allow same admission number across different schools
    },
    dateOfBirth: {
        type: Date
    },
    bloodGroup: {
        type: String,
        validate: {
            validator: function(v) {
                if (v === '' || v === null || v === undefined) return true;
                return ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(v);
            },
            message: 'Blood group must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-'
        }
    },
    nationality: {
        type: String,
        default: 'Indian'
    },
    religion: {
        type: String
    },
    caste: {
        type: String
    },
    subCaste: {
        type: String
    },
    
    // Admission Details
    academicYear: {
        type: String,
        required: true
    },
    dateOfAdmission: {
        type: Date,
        default: Date.now
    },
    section: {
        type: String
    },
    admissionType: {
        type: String,
        validate: {
            validator: function(v) {
                if (v === '' || v === null || v === undefined) return true;
                return ['Regular', 'Transfer', 'Re-admission'].includes(v);
            },
            message: 'Admission type must be one of: Regular, Transfer, Re-admission'
        },
        default: 'Regular'
    },
    studentStatus: {
        type: String,
        validate: {
            validator: function(v) {
                if (v === '' || v === null || v === undefined) return true;
                return ['Active', 'Inactive', 'Suspended', 'Graduated', 'Transferred'].includes(v);
            },
            message: 'Student status must be one of: Active, Inactive, Suspended, Graduated, Transferred'
        },
        default: 'Active'
    },
    
    // Contact Information
    permanentAddress: {
        type: String
    },
    currentAddress: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    pinCode: {
        type: String
    },
    phone: {
        type: String
    },
    
    // Parent/Guardian Details
    fatherName: {
        type: String
    },
    fatherMobile: {
        type: String
    },
    fatherEmail: {
        type: String
    },
    fatherOccupation: {
        type: String
    },
    fatherQualification: {
        type: String
    },
    motherName: {
        type: String
    },
    motherMobile: {
        type: String
    },
    motherEmail: {
        type: String
    },
    motherOccupation: {
        type: String
    },
    motherQualification: {
        type: String
    },
    guardianName: {
        type: String
    },
    guardianMobile: {
        type: String
    },
    guardianEmail: {
        type: String
    },
    guardianOccupation: {
        type: String
    },
    guardianQualification: {
        type: String
    },
    
    // Emergency Contact
    emergencyContactName: {
        type: String
    },
    emergencyContactRelation: {
        type: String
    },
    emergencyContactMobile: {
        type: String
    },
    
    // Identity & Compliance
    aadhaarNumber: {
        type: String
    },
    
    // Transport & Hostel
    modeOfTransport: {
        type: String,
        validate: {
            validator: function(v) {
                if (v === '' || v === null || v === undefined) return true;
                return ['School Bus', 'Private Vehicle', 'Public Transport', 'Walking', 'Other'].includes(v);
            },
            message: 'Mode of transport must be one of: School Bus, Private Vehicle, Public Transport, Walking, Other'
        }
    },
    busRoute: {
        type: String
    },
    busStop: {
        type: String
    },
    vehicleNumber: {
        type: String
    },
    hostelRequired: {
        type: Boolean,
        default: false
    },
    hostelRoomNumber: {
        type: String
    },
    
    // Academic Information
    sclassName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    role: {
        type: String,
        default: "Student"
    },
    
    // Existing Fields
    examResult: [
        {
            subName: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'subject',
            },
            marksObtained: {
                type: Number,
                default: 0
            }
        }
    ],
    attendance: [{
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Late', 'Half Day'],
            required: true
        },
        subName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subject',
            required: true
        }
    }],
    schedule: {
        type: Object,
        default: {}
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Compound index for unique constraints within a school
studentSchema.index({ email: 1, school: 1 }, { unique: true });
studentSchema.index({ admissionNumber: 1, school: 1 }, { unique: true });
studentSchema.index({ rollNum: 1, school: 1, sclassName: 1 }, { unique: true });

module.exports = mongoose.model("student", studentSchema);
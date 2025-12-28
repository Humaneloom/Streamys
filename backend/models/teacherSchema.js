const mongoose = require("mongoose")

const teacherSchema = new mongoose.Schema({
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
        default: "Teacher"
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    teachSubject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
    },
    teachSclass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true,
    },
    
    // Basic Information
    gender: {
        type: String,
        validate: {
            validator: function(v) {
                if (v === '' || v === null || v === undefined) return true;
                return ['Male', 'Female', 'Other'].includes(v);
            },
            message: 'Gender must be one of: Male, Female, Other'
        }
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
        type: String
    },
    religion: {
        type: String
    },
    
    // Contact Information
    phone: {
        type: String
    },
    alternatePhone: {
        type: String
    },
    residentialAddress: {
        type: String
    },
    emergencyContactName: {
        type: String
    },
    emergencyContactRelation: {
        type: String
    },
    emergencyContactPhone: {
        type: String
    },
    
    // Professional Information
    employeeID: {
        type: String,
        required: true
    },
    dateOfJoining: {
        type: Date
    },
    department: {
        type: String
    },
    designation: {
        type: String
    },
    employmentType: {
        type: String,
        validate: {
            validator: function(v) {
                if (v === '' || v === null || v === undefined) return true;
                return ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Intern'].includes(v);
            },
            message: 'Employment type must be one of: Full-time, Part-time, Contract, Temporary, Intern'
        }
    },
    experience: {
        type: String
    },
    reportingManager: {
        type: String
    },
    
    // Educational Qualifications
    highestQualification: {
        type: String
    },
    specialization: {
        type: String
    },
    yearOfPassing: {
        type: String
    },
    instituteName: {
        type: String
    },
    additionalCertifications: {
        type: String
    },
    
    // Identity & Compliance
    aadhaarNumber: {
        type: String
    },
    panNumber: {
        type: String
    },
    teachingLicense: {
        type: String
    },
    employeeCode: {
        type: String
    },
    
    // Payroll & HR
    bankAccountNumber: {
        type: String
    },
    bankName: {
        type: String
    },
    ifscCode: {
        type: String
    },
    uanNumber: {
        type: String
    },
    epfNumber: {
        type: String
    },
    esiNumber: {
        type: String
    },
    salaryStructure: {
        type: String
    },
    taxDetails: {
        type: String
    },
    
    // System Access
    username: {
        type: String
    },
    accessLevel: {
        type: String,
        validate: {
            validator: function(v) {
                if (v === '' || v === null || v === undefined) return true;
                return ['Basic', 'Intermediate', 'Advanced', 'Admin'].includes(v);
            },
            message: 'Access level must be one of: Basic, Intermediate, Advanced, Admin'
        }
    },
    
    // Legacy fields (keeping for backward compatibility)
    salary: {
        type: Number,
        default: 35000,
        min: 0
    },
    qualification: {
        type: String,
        default: "M.Sc."
    },
    attendance: [{
        date: {
            type: Date,
            required: true
        },
        presentCount: {
            type: String,
        },
        absentCount: {
            type: String,
        }
    }],
    schedule: {
        type: Object,
        default: {},
    },
}, { timestamps: true });

module.exports = mongoose.model("teacher", teacherSchema)
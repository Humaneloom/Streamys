const SuperAdmin = require('../models/superAdminSchema.js');
const Admin = require('../models/adminSchema.js');
const Student = require('../models/studentSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Finance = require('../models/financeSchema.js');
const Librarian = require('../models/librarianSchema.js');
const Sclass = require('../models/sclassSchema.js');
const Subject = require('../models/subjectSchema.js');
const Book = require('../models/bookSchema.js');
const Notice = require('../models/noticeSchema.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Super Admin Login
const superAdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const superAdmin = await SuperAdmin.findOne({ email });
        if (!superAdmin) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (!superAdmin.isActive) {
            return res.status(400).json({ message: "Account is deactivated" });
        }

        const isPasswordValid = await bcrypt.compare(password, superAdmin.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: superAdmin._id, role: superAdmin.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            superAdmin: {
                id: superAdmin._id,
                name: superAdmin.name,
                email: superAdmin.email,
                role: superAdmin.role
            }
        });

    } catch (error) {
        console.error('Super Admin Login Error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Super Admin Details
const getSuperAdminDetail = async (req, res) => {
    try {
        const superAdmin = await SuperAdmin.findById(req.params.id).select('-password');
        if (!superAdmin) {
            return res.status(404).json({ message: "Super Admin not found" });
        }
        res.status(200).json(superAdmin);
    } catch (error) {
        console.error('Get Super Admin Detail Error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get All Schools Overview
const getAllSchoolsOverview = async (req, res) => {
    try {
        const schools = await Admin.find({}).select('schoolName name email createdAt');
        
        console.log('Raw schools data:', JSON.stringify(schools, null, 2));
        
        const schoolsWithStats = await Promise.all(schools.map(async (school) => {
            const schoolName = school.schoolName;
            
            console.log(`Processing school: ${schoolName}`);
            
            // Get counts for each school
            // Students and teachers use ObjectId reference to admin, not schoolName string
            const studentCount = await Student.countDocuments({ school: school._id });
            const teacherCount = await Teacher.countDocuments({ school: school._id });
            const financeCount = await Finance.countDocuments({ schoolName });
            const librarianCount = await Librarian.countDocuments({ schoolName });
            const classCount = await Sclass.countDocuments({ school: school._id });
            const subjectCount = await Subject.countDocuments({ school: school._id });
            const bookCount = await Book.countDocuments({ schoolName });
            const noticeCount = await Notice.countDocuments({ schoolName });

            console.log(`Counts for ${schoolName}:`, {
                students: studentCount,
                teachers: teacherCount,
                finance: financeCount,
                librarians: librarianCount,
                classes: classCount,
                subjects: subjectCount,
                books: bookCount,
                notices: noticeCount
            });

            return {
                _id: school._id,
                schoolName: school.schoolName,
                adminName: school.name,
                adminEmail: school.email,
                createdAt: school.createdAt || school._id.getTimestamp() || new Date(),
                stats: {
                    students: studentCount,
                    teachers: teacherCount,
                    financeStaff: financeCount,
                    librarians: librarianCount,
                    classes: classCount,
                    subjects: subjectCount,
                    books: bookCount,
                    notices: noticeCount
                }
            };
        }));

        console.log('Final processed data:', JSON.stringify(schoolsWithStats, null, 2));
        res.status(200).json(schoolsWithStats);
    } catch (error) {
        console.error('Get All Schools Overview Error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get School Details
const getSchoolDetails = async (req, res) => {
    try {
        const { schoolName } = req.params;
        
        const school = await Admin.findOne({ schoolName });
        if (!school) {
            return res.status(404).json({ message: "School not found" });
        }

        // Get detailed statistics
        // Students and teachers use ObjectId reference to admin, not schoolName string
        const students = await Student.find({ school: school._id })
            .populate('sclassName', 'sclassName')
            .select('name email sclassName rollNum gender');
        const teachers = await Teacher.find({ school: school._id })
            .populate('teachSubject', 'subName')
            .populate('teachSclass', 'sclassName')
            .select('name email teachSubject teachSclass');
        const classes = await Sclass.find({ school: school._id }).select('sclassName');
        const subjects = await Subject.find({ school: school._id })
            .populate('sclassName', 'sclassName')
            .select('subName subCode sclassName');
        const books = await Book.find({ schoolName }).select('title author category availability');
        const notices = await Notice.find({ schoolName }).select('title content date');

        const schoolDetails = {
            _id: school._id,
            schoolName: school.schoolName,
            adminName: school.name,
            adminEmail: school.email,
            createdAt: school.createdAt || school._id.getTimestamp() || new Date(),
            details: {
                students,
                teachers,
                classes,
                subjects,
                books,
                notices
            }
        };

        res.status(200).json(schoolDetails);
    } catch (error) {
        console.error('Get School Details Error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Create Super Admin (for initial setup)
const createSuperAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // Check if super admin already exists
        const existingSuperAdmin = await SuperAdmin.findOne({ email });
        if (existingSuperAdmin) {
            return res.status(400).json({ message: "Super Admin with this email already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const superAdmin = new SuperAdmin({
            name,
            email,
            password: hashedPassword
        });

        await superAdmin.save();

        res.status(201).json({
            message: "Super Admin created successfully",
            superAdmin: {
                id: superAdmin._id,
                name: superAdmin.name,
                email: superAdmin.email,
                role: superAdmin.role
            }
        });

    } catch (error) {
        console.error('Create Super Admin Error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update Super Admin
const updateSuperAdmin = async (req, res) => {
    try {
        const { name, email } = req.body;
        const updates = {};

        if (name) updates.name = name;
        if (email) updates.email = email;

        const superAdmin = await SuperAdmin.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        ).select('-password');

        if (!superAdmin) {
            return res.status(404).json({ message: "Super Admin not found" });
        }

        res.status(200).json({
            message: "Super Admin updated successfully",
            superAdmin
        });

    } catch (error) {
        console.error('Update Super Admin Error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Individual Student Details
const getStudentDetails = async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const student = await Student.findById(studentId)
            .populate('sclassName', 'sclassName')
            .populate('school', 'schoolName')
            .select('-password');
            
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        
        res.status(200).json(student);
    } catch (error) {
        console.error('Get Student Details Error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Individual Teacher Details
const getTeacherDetails = async (req, res) => {
    try {
        const { teacherId } = req.params;
        
        const teacher = await Teacher.findById(teacherId)
            .populate('teachSubject', 'subName')
            .populate('teachSclass', 'sclassName')
            .populate('school', 'schoolName')
            .select('-password');
            
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        
        res.status(200).json(teacher);
    } catch (error) {
        console.error('Get Teacher Details Error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update Student Password
const updateStudentPassword = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { newPassword } = req.body;
        
        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }
        
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        const student = await Student.findByIdAndUpdate(
            studentId,
            { password: hashedPassword },
            { new: true }
        ).select('-password');
        
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        
        res.status(200).json({
            message: "Student password updated successfully",
            student
        });
    } catch (error) {
        console.error('Update Student Password Error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update Teacher Password
const updateTeacherPassword = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { newPassword } = req.body;
        
        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }
        
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        const teacher = await Teacher.findByIdAndUpdate(
            teacherId,
            { password: hashedPassword },
            { new: true }
        ).select('-password');
        
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        
        res.status(200).json({
            message: "Teacher password updated successfully",
            teacher
        });
    } catch (error) {
        console.error('Update Teacher Password Error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Debug endpoint to inspect database contents
const debugDatabase = async (req, res) => {
    try {
        console.log('=== DEBUG DATABASE CONTENTS ===');
        
        // Check Admin collection
        const admins = await Admin.find({});
        console.log('Admins:', admins.length);
        admins.forEach(admin => {
            console.log(`- ${admin.schoolName} (${admin.name}) - Created: ${admin.createdAt}`);
        });
        
        // Check Student collection
        const students = await Student.find({});
        console.log('Students:', students.length);
        if (students.length > 0) {
            console.log('Sample student:', students[0]);
        }
        
        // Check Teacher collection
        const teachers = await Teacher.find({});
        console.log('Teachers:', teachers.length);
        if (teachers.length > 0) {
            console.log('Sample teacher:', teachers[0]);
        }
        
        // Check Book collection
        const books = await Book.find({});
        console.log('Books:', books.length);
        if (books.length > 0) {
            console.log('Sample book:', books[0]);
        }
        
        // Check Sclass collection
        const classes = await Sclass.find({});
        console.log('Classes:', classes.length);
        if (classes.length > 0) {
            console.log('Sample class:', classes[0]);
        }
        
        console.log('=== END DEBUG ===');
        
        res.status(200).json({
            message: "Database debug completed. Check server console.",
            summary: {
                admins: admins.length,
                students: students.length,
                teachers: teachers.length,
                books: books.length,
                classes: classes.length
            }
        });
        
    } catch (error) {
        console.error('Debug Database Error:', error);
        res.status(500).json({ message: "Debug failed", error: error.message });
    }
};

module.exports = {
    superAdminLogin,
    getSuperAdminDetail,
    getAllSchoolsOverview,
    getSchoolDetails,
    getStudentDetails,
    getTeacherDetails,
    updateStudentPassword,
    updateTeacherPassword,
    createSuperAdmin,
    updateSuperAdmin,
    debugDatabase
};

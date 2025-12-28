const mongoose = require('mongoose');
const Admin = require('./models/adminSchema');
const StudentFee = require('./models/studentFeeSchema');
const OtherExpense = require('./models/otherExpenseSchema');
const Teacher = require('./models/teacherSchema');
const Student = require('./models/studentSchema');
const Sclass = require('./models/sclassSchema');

// Sample data for testing the finance dashboard
const populateSampleData = async () => {
    try {
        console.log('Starting to populate sample data...');

        // Create admin if not exists
        let admin = await Admin.findOne({ schoolName: 'KLPD' });
        if (!admin) {
            admin = new Admin({
                name: 'Admin User',
                email: 'admin@klpd.com',
                password: 'admin123',
                schoolName: 'KLPD',
                role: 'Admin'
            });
            await admin.save();
            console.log('Created admin user');
        }

        // Create sample classes
        const classes = ['Class 10A', 'Class 10B', 'Class 9A', 'Class 9B', 'Class 8A', 'Class 8B'];
        const classObjects = [];
        
        for (const className of classes) {
            let sclass = await Sclass.findOne({ sclassName: className, school: admin._id });
            if (!sclass) {
                sclass = new Sclass({
                    sclassName: className,
                    school: admin._id
                });
                await sclass.save();
                classObjects.push(sclass);
            } else {
                classObjects.push(sclass);
            }
        }
        console.log('Created/verified classes');

        // Create sample students
        const students = [];
        for (let i = 1; i <= 30; i++) {
            const student = new Student({
                name: `Student ${i}`,
                email: `student${i}@klpd.com`,
                password: 'student123',
                school: admin._id,
                sclassName: classObjects[i % classObjects.length]._id,
                rollNum: i,
                gender: i % 2 === 0 ? 'Male' : 'Female'
            });
            await student.save();
            students.push(student);
        }
        console.log('Created sample students');

        // Create sample teachers
        const teachers = [];
        for (let i = 1; i <= 8; i++) {
            const teacher = new Teacher({
                name: `Teacher ${i}`,
                email: `teacher${i}@klpd.com`,
                password: 'teacher123',
                school: admin._id,
                teachSclass: classObjects[i % classObjects.length]._id,
                salary: 35000 + (i * 2000), // Varying salaries
                experience: `${5 + i} years`,
                qualification: 'M.Sc.'
            });
            await teacher.save();
            teachers.push(teacher);
        }
        console.log('Created sample teachers');

        // Create sample student fees
        const feeStructures = [
            { monthlyFee: 5000, admissionFee: 10000, examFee: 3000, otherFees: 2000 },
            { monthlyFee: 4500, admissionFee: 9000, examFee: 2500, otherFees: 1800 },
            { monthlyFee: 4000, admissionFee: 8000, examFee: 2000, otherFees: 1500 }
        ];

        for (let i = 0; i < students.length; i++) {
            const feeStructure = feeStructures[i % feeStructures.length];
            const totalFee = feeStructure.monthlyFee + feeStructure.admissionFee + 
                           feeStructure.examFee + feeStructure.otherFees;
            
            const studentFee = new StudentFee({
                student: students[i]._id,
                sclassName: students[i].sclassName,
                school: admin._id,
                academicYear: '2024',
                feeStructure,
                totalFee,
                paidAmount: Math.random() > 0.3 ? totalFee : totalFee * 0.7, // 70% paid on average
                paymentStatus: Math.random() > 0.3 ? 'Paid' : 'Partial',
                dueDate: new Date(2024, 11, 31),
                isActive: true
            });
            await studentFee.save();
        }
        console.log('Created sample student fees');

        // Create sample expenses
        const expenseCategories = ['maintenance', 'utilities', 'function', 'coffee', 'temple', 'other'];
        const expenseTitles = [
            'School Maintenance',
            'Electricity Bill',
            'Annual Function',
            'Staff Coffee',
            'Temple Visit',
            'Office Supplies',
            'Cleaning Services',
            'Internet Bill',
            'Sports Equipment',
            'Library Books'
        ];

        for (let i = 0; i < 20; i++) {
            const expense = new OtherExpense({
                title: expenseTitles[i % expenseTitles.length],
                description: `Sample expense ${i + 1}`,
                amount: 1000 + (Math.random() * 5000),
                category: expenseCategories[i % expenseCategories.length],
                date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
                school: admin._id,
                isActive: true
            });
            await expense.save();
        }
        console.log('Created sample expenses');

        console.log('Sample data population completed successfully!');
        console.log('You can now test the finance dashboard at http://localhost:3000/Finance/dashboard');

    } catch (error) {
        console.error('Error populating sample data:', error);
    }
};

// Run the script if called directly
if (require.main === module) {
    // Connect to MongoDB
    mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/school_management', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to MongoDB');
        return populateSampleData();
    })
    .then(() => {
        console.log('Sample data population finished');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Error:', err);
        process.exit(1);
    });
}

module.exports = { populateSampleData }; 
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import the SuperAdmin model
const SuperAdmin = require('./models/superAdminSchema.js');

const setupSuperAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Check if super admin already exists
        const existingSuperAdmin = await SuperAdmin.findOne({});
        if (existingSuperAdmin) {
            console.log('Super Admin already exists:', existingSuperAdmin.email);
            process.exit(0);
        }

        // Create super admin credentials
        const superAdminData = {
            name: 'Super Administrator',
            email: 'superadmin@schoolsystem.com',
            password: 'superadmin123',
            role: 'SuperAdmin'
        };

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(superAdminData.password, salt);

        // Create super admin
        const superAdmin = new SuperAdmin({
            ...superAdminData,
            password: hashedPassword
        });

        await superAdmin.save();
        console.log('Super Admin created successfully!');
        console.log('Email:', superAdminData.email);
        console.log('Password:', superAdminData.password);
        console.log('\nPlease change these credentials after first login for security.');

        process.exit(0);
    } catch (error) {
        console.error('Error setting up Super Admin:', error);
        process.exit(1);
    }
};

// Run the setup
setupSuperAdmin();

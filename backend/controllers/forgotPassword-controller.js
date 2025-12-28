const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const Student = require('../models/studentSchema');
const Teacher = require('../models/teacherSchema');
const Admin = require('../models/adminSchema');
const Finance = require('../models/financeSchema');
const Librarian = require('../models/librarianSchema');
const OTP = require('../models/otpSchema');

// Email transporter configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, role) => {
    const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: email,
        subject: `Password Reset OTP - School Management System`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #8a2be2; text-align: center;">Password Reset Request</h2>
                <p>Hello,</p>
                <p>You have requested to reset your password for your <strong>${role}</strong> account in the School Management System.</p>
                <p>Your OTP (One-Time Password) is:</p>
                <div style="background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
                    <h1 style="color: #8a2be2; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
                </div>
                <p><strong>Important:</strong></p>
                <ul>
                    <li>This OTP is valid for 10 minutes only</li>
                    <li>Do not share this OTP with anyone</li>
                    <li>If you didn't request this, please ignore this email</li>
                </ul>
                <p>Best regards,<br>School Management System Team</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email sending error:', error);
        return false;
    }
};

// Request OTP for password reset
const requestOTP = async (req, res) => {
    try {
        const { email, role } = req.body;

        if (!email || !role) {
            return res.status(400).json({ message: 'Email and role are required' });
        }

        // Check if user exists based on role
        let user;
        switch (role) {
            case 'Student':
                user = await Student.findOne({ email });
                break;
            case 'Teacher':
                user = await Teacher.findOne({ email });
                break;
            case 'Admin':
                user = await Admin.findOne({ email });
                break;
            case 'Finance':
                user = await Finance.findOne({ email });
                break;
            case 'Librarian':
                user = await Librarian.findOne({ email });
                break;
            default:
                return res.status(400).json({ message: 'Invalid role' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found with this email' });
        }

        // Get school ID from user
        const schoolId = user.school || user.schoolId;

        if (!schoolId) {
            return res.status(400).json({ message: 'User is not associated with any school' });
        }

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save OTP to database
        await OTP.create({
            email,
            otp,
            role,
            school: schoolId,
            expiresAt
        });

        // Send OTP email
        const emailSent = await sendOTPEmail(email, otp, role);
        if (!emailSent) {
            return res.status(500).json({ message: 'Failed to send OTP email' });
        }

        res.status(200).json({ 
            message: 'OTP sent successfully to your email',
            email: email // Return email for frontend use
        });

    } catch (error) {
        console.error('Request OTP error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Verify OTP and reset password
const verifyOTPAndResetPassword = async (req, res) => {
    try {
        const { email, otp, role, newPassword } = req.body;

        if (!email || !otp || !role || !newPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Get user to find school ID
        let user;
        switch (role) {
            case 'Student':
                user = await Student.findOne({ email });
                break;
            case 'Teacher':
                user = await Teacher.findOne({ email });
                break;
            case 'Admin':
                user = await Admin.findOne({ email });
                break;
            case 'Finance':
                user = await Finance.findOne({ email });
                break;
            case 'Librarian':
                user = await Librarian.findOne({ email });
                break;
            default:
                return res.status(400).json({ message: 'Invalid role' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const schoolId = user.school || user.schoolId;

        // Find and validate OTP
        const otpRecord = await OTP.findOne({
            email,
            otp,
            role,
            school: schoolId,
            isUsed: false,
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update user password based on role
        let updatedUser;
        switch (role) {
            case 'Student':
                updatedUser = await Student.findOneAndUpdate(
                    { email },
                    { password: hashedPassword },
                    { new: true }
                );
                break;
            case 'Teacher':
                updatedUser = await Teacher.findOneAndUpdate(
                    { email },
                    { password: hashedPassword },
                    { new: true }
                );
                break;
            case 'Admin':
                updatedUser = await Admin.findOneAndUpdate(
                    { email },
                    { password: hashedPassword },
                    { new: true }
                );
                break;
            case 'Finance':
                updatedUser = await Finance.findOneAndUpdate(
                    { email },
                    { password: hashedPassword },
                    { new: true }
                );
                break;
            case 'Librarian':
                updatedUser = await Librarian.findOneAndUpdate(
                    { email },
                    { password: hashedPassword },
                    { new: true }
                );
                break;
            default:
                return res.status(400).json({ message: 'Invalid role' });
        }

        if (!updatedUser) {
            return res.status(404).json({ message: 'Failed to update password' });
        }

        // Mark OTP as used
        await OTP.findByIdAndUpdate(otpRecord._id, { isUsed: true });

        res.status(200).json({ message: 'Password reset successfully' });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    requestOTP,
    verifyOTPAndResetPassword
};

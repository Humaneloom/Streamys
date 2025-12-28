# Forgot Password Setup Guide

## Overview
This guide explains how to set up the forgot password functionality with OTP verification using Nodemailer.

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install nodemailer
```

### 2. Email Configuration
Create a `.env` file in the backend directory with your email credentials:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 3. Gmail Setup (Recommended)
For Gmail, you need to:

1. **Enable 2-Factor Authentication**:
   - Go to your Google Account settings
   - Navigate to Security
   - Enable 2-Step Verification

2. **Generate App Password**:
   - Go to Security > 2-Step Verification
   - Scroll down to "App passwords"
   - Generate a new app password for "Mail"
   - Use this generated password in your .env file

### 4. Alternative Email Services
You can also use other email services by modifying the transporter configuration in `backend/controllers/forgotPassword-controller.js`:

```javascript
// For Outlook/Hotmail
const transporter = nodemailer.createTransporter({
    service: 'outlook',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// For custom SMTP
const transporter = nodemailer.createTransporter({
    host: 'smtp.your-provider.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
```

## Frontend Setup

The forgot password functionality is already integrated into the login pages. Users can:

1. Click "Forgot password?" on any login page
2. Enter their email address
3. Receive an OTP via email
4. Enter the OTP and set a new password

## Features

- **OTP Generation**: 6-digit numeric OTP
- **Email Templates**: Professional HTML email templates
- **Security**: OTP expires after 10 minutes
- **One-time Use**: Each OTP can only be used once
- **Role-based**: Works for all user types (Student, Teacher, Admin, Finance, Librarian)
- **Password Validation**: Ensures password meets minimum requirements

## API Endpoints

- `POST /api/forgot-password/request-otp` - Request OTP
- `POST /api/forgot-password/reset-password` - Reset password with OTP

## Testing

1. Start your backend server
2. Navigate to any login page
3. Click "Forgot password?"
4. Enter a valid email address
5. Check your email for the OTP
6. Complete the password reset process

## Troubleshooting

### Email Not Sending
- Check your email credentials in .env file
- Ensure 2FA is enabled for Gmail
- Verify app password is correct
- Check server logs for error messages

### OTP Not Working
- Ensure OTP hasn't expired (10 minutes)
- Check if OTP was already used
- Verify email and role match

### Frontend Issues
- Check browser console for errors
- Ensure backend is running
- Verify API endpoints are accessible

# Super Admin Setup Guide

This guide explains how to set up and use the Super Admin functionality for the School Management System.

## Overview

The Super Admin is a system-level administrator that can:
- View all registered schools in the system
- Access detailed information about each school
- Monitor system-wide statistics
- Manage the overall application

## Prerequisites

### Required Software
1. **Docker & Docker Compose** - For running the application services
   - MongoDB is included as a Docker container
   - No separate MongoDB installation needed!

### Environment
- All services run in Docker containers
- MongoDB runs without authentication (development setup)
- Database: `school`
- Connection: `mongodb://mongodb:27017/school`

### Verify Services are Running
```bash
# Check if all containers are running
docker-compose ps

# All services should show "Up" or "Up (healthy)"
```

## Setup Instructions

### 1. Start All Services

Start the application using Docker Compose:

```bash
# From project root
docker-compose up -d
```

This will start:
- ✅ Backend API (connects to your local MongoDB)
- ✅ Frontend App
- ✅ Landing Page
- ✅ Nginx (reverse proxy)

### 2. Create Super Admin Account

Run the setup script inside the backend container:

```bash
docker-compose exec backend node setupSuperAdmin.js
```

This will create a super admin with these default credentials:
- **Email**: superadmin@schoolsystem.com
- **Password**: superadmin123

**⚠️ Important**: Change these credentials after first login for security!

### 3. Verify Services are Running

Check all services are healthy:

```bash
docker-compose ps
```

All services should show status `Up` or `Up (healthy)`.

## Accessing Super Admin

### Option 1: Direct URL
Navigate to: `http://localhost/app/superadmin/login`

### Option 2: From Frontend Homepage
1. Go to `http://localhost/app`
2. Navigate to Super Admin login

### Logout
- Click the **logout icon** (⏏️) in the top-right corner of the dashboard
- You'll be redirected to the role selection page (`/choose`)

## Features

### 1. Dashboard Overview
- **Total Schools**: Shows the number of registered schools
- **Total Students**: Combined student count across all schools
- **Total Teachers**: Combined teacher count across all schools
- **Total Books**: Combined book count across all schools

### 2. School Management
- **View All Schools**: See a list of all registered schools with basic stats
- **School Details**: Click "View Details" to see comprehensive information about each school

### 3. School Information Displayed
For each school, you can view:
- **Basic Info**: School name, admin details, creation date
- **Statistics**: Student count, teacher count, class count, etc.
- **Detailed Lists**: 
  - Students (name, email, class, roll number)
  - Teachers (name, email, subject, class)
  - Classes
  - Subjects
  - Books
  - Notices

## API Endpoints

The following endpoints are available for super admin operations:

- `POST /SuperAdminLogin` - Super admin login
- `POST /SuperAdminReg` - Create super admin account
- `GET /SuperAdmin/:id` - Get super admin details
- `PUT /SuperAdmin/:id` - Update super admin details
- `GET /SchoolsOverview` - Get overview of all schools
- `GET /SchoolDetails/:schoolName` - Get detailed information about a specific school

## Security Considerations

1. **Change Default Password**: Always change the default super admin password after first login
2. **Access Control**: Super admin access should be restricted to authorized personnel only
3. **Audit Logging**: Consider implementing audit logs for super admin actions
4. **Session Management**: Implement proper session timeout and logout functionality

## Troubleshooting

### Common Issues

1. **"Super Admin not found" error**
   - Ensure the setup script has been run successfully
   - Check if the super admin account exists in the database

2. **"Invalid credentials" error**
   - Verify the email and password are correct
   - Check if the account is active

3. **"Network error"**
   - Ensure the backend server is running on port 5000
   - Check CORS configuration

4. **"Failed to fetch schools data"**
   - Verify the database connection
   - Check if there are schools registered in the system

### Database Verification

To verify the super admin account exists:

```javascript
// In MongoDB shell or Compass
use your_database_name
db.superadmins.find({})
```

## Customization

### Adding New Features

To extend the super admin functionality:

1. **Backend**: Add new routes and controllers in the appropriate files
2. **Frontend**: Create new components and add them to the dashboard
3. **Database**: Add new fields to schemas if needed

### Styling

The super admin interface uses Material-UI with custom styling. To modify the appearance:

1. Edit the styled components in each page
2. Update the color scheme in the theme
3. Modify the gradient backgrounds and shadows

## Support

If you encounter issues:

1. Check the browser console for frontend errors
2. Check the backend server logs for API errors
3. Verify database connectivity
4. Ensure all dependencies are properly installed

## Future Enhancements

Potential features to consider adding:

- School approval/rejection system
- System-wide announcements
- Performance analytics across schools
- Bulk operations for multiple schools
- Advanced reporting and exports
- User management across schools
- System configuration management

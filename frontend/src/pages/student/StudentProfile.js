import React from 'react'
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box, 
  Avatar, 
  Container, 
  Paper,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  LinearProgress
} from '@mui/material';
import { useSelector } from 'react-redux';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Wc as GenderIcon,
  ContactEmergency as EmergencyIcon,
  Edit as EditIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Bloodtype as BloodIcon,
  Flag as FlagIcon,
  Home as HomeIcon,
  DirectionsBus as BusIcon,
  Hotel as HotelIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StudentProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);

  if (response) { console.log(response) }
  else if (error) { console.log(error) }

  const sclassName = currentUser.sclassName
  const studentSchool = currentUser.school

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Helper function to display value or "Not specified"
  const displayValue = (value) => {
    return value && value !== '' ? value : 'Not specified';
  };

  // Mock data for demonstration (these should come from actual API calls)
  const studentStats = {
    attendanceRate: 85,
    averageScore: 78,
    subjectsEnrolled: 6,
    completedAssignments: 24
  }

  const getGradeColor = (score) => {
    if (score >= 90) return '#4caf50';
    if (score >= 80) return '#8bc34a';
    if (score >= 70) return '#ffc107';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  }

  const getGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: 6,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          borderRadius: '25px',
          padding: '40px 20px',
          boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3), 0 8px 32px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Avatar 
            alt="Student Avatar" 
            sx={{ 
              width: 130, 
              height: 130, 
              mx: 'auto',
              mb: 3,
              fontSize: '3.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
              border: '5px solid rgba(255,255,255,0.4)',
              boxShadow: '0 15px 45px rgba(0,0,0,0.3), 0 0 30px rgba(255,255,255,0.2)'
            }}
          >
            {String(currentUser.name).charAt(0)}
          </Avatar>
          
          <Typography variant="h3" sx={{ 
            fontWeight: 800, 
            color: 'white',
            mb: 1,
            textShadow: '0 4px 8px rgba(0,0,0,0.4), 0 0 20px rgba(255,255,255,0.3)'
          }}>
            {currentUser.name}
          </Typography>
          
          <Typography variant="h6" sx={{ 
            color: 'rgba(255,255,255,0.95)',
            mb: 3,
            fontSize: '1.2rem',
            fontWeight: 500,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            Student • Roll No: {currentUser.rollNum} • Admission No: {displayValue(currentUser.admissionNumber)}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap', mb: 4 }}>
            <Chip 
              icon={<SchoolIcon />} 
              label={`Class ${sclassName?.sclassName || 'Not Assigned'}`}
              sx={{ 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '1rem',
                padding: '12px 16px',
                borderRadius: '25px',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(10px)'
              }}
            />
            <Chip 
              icon={<SchoolIcon />} 
              label={studentSchool?.schoolName || 'School Not Found'}
              sx={{ 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '1rem',
                padding: '12px 16px',
                borderRadius: '25px',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(10px)'
              }}
            />
          </Box>
        </Box>

        {/* Personal Information */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              height: '100%'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <PersonIcon sx={{ fontSize: 32, color: '#667eea', mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Personal Information
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarIcon sx={{ color: '#667eea', mr: 2 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                          Date of Birth
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {formatDate(currentUser.dateOfBirth)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <GenderIcon sx={{ color: '#667eea', mr: 2 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                          Gender
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {displayValue(currentUser.gender)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <BloodIcon sx={{ color: '#667eea', mr: 2 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                          Blood Group
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {displayValue(currentUser.bloodGroup)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FlagIcon sx={{ color: '#667eea', mr: 2 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                          Nationality
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {displayValue(currentUser.nationality)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <EmailIcon sx={{ color: '#667eea', mr: 2 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                          Email Address
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {displayValue(currentUser.email)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PhoneIcon sx={{ color: '#667eea', mr: 2 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                          Phone Number
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {displayValue(currentUser.phone)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <EmergencyIcon sx={{ color: '#667eea', mr: 2 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                          Emergency Contact
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {displayValue(currentUser.emergencyContactMobile)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <LocationIcon sx={{ color: '#667eea', mr: 2, mt: 0.5 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                          Permanent Address
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {displayValue(currentUser.permanentAddress)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <HomeIcon sx={{ color: '#667eea', mr: 2, mt: 0.5 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                          Current Address
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {displayValue(currentUser.currentAddress) || 'Same as Permanent Address'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      City
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {displayValue(currentUser.city)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      State
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {displayValue(currentUser.state)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      PIN Code
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {displayValue(currentUser.pinCode)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ 
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              height: '100%',
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <SchoolIcon sx={{ fontSize: 32, color: '#667eea', mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Academic Information
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Academic Year
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {displayValue(currentUser.academicYear)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Date of Admission
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formatDate(currentUser.dateOfAdmission)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Section
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {displayValue(currentUser.section)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Admission Type
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {displayValue(currentUser.admissionType)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Student Status
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {displayValue(currentUser.studentStatus)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Aadhaar Number
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {displayValue(currentUser.aadhaarNumber)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Parent/Guardian Information */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              height: '100%'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <PersonIcon sx={{ fontSize: 32, color: '#667eea', mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Father's Information
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Name
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {displayValue(currentUser.fatherName)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Mobile
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {displayValue(currentUser.fatherMobile)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {displayValue(currentUser.fatherEmail)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Occupation
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {displayValue(currentUser.fatherOccupation)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Qualification
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {displayValue(currentUser.fatherQualification)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ 
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              height: '100%'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <PersonIcon sx={{ fontSize: 32, color: '#667eea', mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Mother's Information
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Name
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {displayValue(currentUser.motherName)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Mobile
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {displayValue(currentUser.motherMobile)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {displayValue(currentUser.motherEmail)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Occupation
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {displayValue(currentUser.motherOccupation)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Qualification
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {displayValue(currentUser.motherQualification)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Transport & Additional Information */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              height: '100%'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <BusIcon sx={{ fontSize: 32, color: '#667eea', mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Transport Information
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Mode of Transport
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {displayValue(currentUser.modeOfTransport)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Bus Route
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {displayValue(currentUser.busRoute)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Bus Stop
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {displayValue(currentUser.busStop)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Vehicle Number
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {displayValue(currentUser.vehicleNumber)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ 
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              height: '100%'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <HotelIcon sx={{ fontSize: 32, color: '#667eea', mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Hostel Information
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Hostel Required
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {currentUser.hostelRequired ? 'Yes' : 'No'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Room Number
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {displayValue(currentUser.hostelRoomNumber)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default StudentProfile
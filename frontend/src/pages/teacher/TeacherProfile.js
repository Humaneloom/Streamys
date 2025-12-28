import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Grid,
  Divider,
  Container,
  Paper,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Class as ClassIcon,
  School as SchoolIcon,
  MenuBook as SubjectIcon,
  AccessTime as AccessTimeIcon,
  EmojiObjects as EmojiObjectsIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon,
  ImportContacts as ImportContactsIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as EducationIcon,
  Badge as BadgeIcon,
  AccountBalance as BankIcon,
  Security as SecurityIcon,
  CalendarToday as CalendarIcon,
  Wc as GenderIcon,
  Bloodtype as BloodIcon,
  Flag as FlagIcon,
  ContactEmergency as EmergencyIcon,
  DirectionsBus as BusIcon,
  Hotel as HotelIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { getClassStudents, getSubjectDetails } from '../../redux/sclassRelated/sclassHandle';
import './TeacherProfile.css';

const ProfileCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  borderRadius: '24px',
  boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
  border: '1px solid rgba(255,255,255,0.8)',
  transition: 'all 0.3s ease-in-out',
  maxWidth: 500,
  margin: '0 auto',
}));

const SideCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  borderRadius: '20px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid rgba(255,255,255,0.8)',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '10px 24px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
  },
}));

const TeacherProfile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { sclassStudents, subjectDetails } = useSelector((state) => state.sclass);
  const [activeTab, setActiveTab] = useState(0);
  
  const teachSclass = currentUser.teachSclass;
  const teachSubject = currentUser.teachSubject;
  const teachSchool = currentUser.school;
  const classID = teachSclass?._id;
  const subjectID = teachSubject?._id;

  useEffect(() => {
    if (subjectID) dispatch(getSubjectDetails(subjectID, 'Subject'));
    if (classID) dispatch(getClassStudents(classID));
  }, [dispatch, subjectID, classID]);

  // Stats
  const numberOfStudents = sclassStudents && sclassStudents.length;
  const numberOfSessions = subjectDetails && subjectDetails.sessions;
  
  // Helper functions
  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map((n) => n[0]).join('').toUpperCase();
  };

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

  const displayValue = (value) => {
    return value && value !== '' ? value : 'Not specified';
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Recent Activity
  const createdAt = currentUser?.createdAt;
  const formattedCreatedAt = createdAt ? new Date(createdAt).toLocaleDateString() : null;
  const motivationalQuote =
    'Education is the most powerful weapon which you can use to change the world. – Nelson Mandela';

  const renderBasicInfo = () => (
    <div className="profileSection">
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#1e293b', display: 'flex', alignItems: 'center' }}>
        <PersonIcon sx={{ mr: 2, color: '#667eea' }} />
        Basic Information
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <div className="fieldContainer">
            <PersonIcon className="fieldIcon" />
            <div>
              <Typography className="fieldLabel">
                Full Name
              </Typography>
              <Typography className="fieldValue">
                {currentUser?.name}
              </Typography>
            </div>
          </div>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <div className="fieldContainer">
            <GenderIcon className="fieldIcon" />
            <div>
              <Typography className="fieldLabel">
                Gender
              </Typography>
              <Typography className="fieldValue">
                {displayValue(currentUser?.gender)}
              </Typography>
            </div>
          </div>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <div className="fieldContainer">
            <CalendarIcon className="fieldIcon" />
            <div>
              <Typography className="fieldLabel">
                Date of Birth
              </Typography>
              <Typography className="fieldValue">
                {formatDate(currentUser?.dateOfBirth)}
              </Typography>
            </div>
          </div>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <div className="fieldContainer">
            <BloodIcon className="fieldIcon" />
            <div>
              <Typography className="fieldLabel">
                Blood Group
              </Typography>
              <Typography className="fieldValue">
                {displayValue(currentUser?.bloodGroup)}
              </Typography>
            </div>
          </div>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <div className="fieldContainer">
            <FlagIcon className="fieldIcon" />
            <div>
              <Typography className="fieldLabel">
                Nationality
              </Typography>
              <Typography className="fieldValue">
                {displayValue(currentUser?.nationality)}
              </Typography>
            </div>
          </div>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <div className="fieldContainer">
            <EmojiObjectsIcon className="fieldIcon" />
            <div>
              <Typography className="fieldLabel">
                Religion
              </Typography>
              <Typography className="fieldValue">
                {displayValue(currentUser?.religion)}
              </Typography>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );

  const renderContactInfo = () => (
    <div className="profileSection">
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#1e293b', display: 'flex', alignItems: 'center' }}>
        <PhoneIcon sx={{ mr: 2, color: '#667eea' }} />
        Contact Information
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EmailIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Email Address
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {currentUser?.email}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PhoneIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Mobile Number
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.phone)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PhoneIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Alternate Mobile
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.alternatePhone)}
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <LocationIcon sx={{ mr: 2, color: '#667eea', mt: 0.5 }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Residential Address
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.residentialAddress)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EmergencyIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Emergency Contact Name
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.emergencyContactName)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PersonIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Emergency Contact Relation
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.emergencyContactRelation)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PhoneIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Emergency Contact Phone
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.emergencyContactPhone)}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );

  const renderProfessionalInfo = () => (
    <div className="profileSection">
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#1e293b', display: 'flex', alignItems: 'center' }}>
        <WorkIcon sx={{ mr: 2, color: '#667eea' }} />
        Professional Information
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BadgeIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Employee ID
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.employeeID)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Date of Joining
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {formatDate(currentUser?.dateOfJoining)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WorkIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Department
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.department)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BadgeIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Designation
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.designation)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WorkIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Employment Type
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.employmentType)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AccessTimeIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Experience
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.experience)}
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PersonIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Reporting Manager/Supervisor
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.reportingManager)}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );

  const renderEducationalInfo = () => (
    <div className="profileSection">
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#1e293b', display: 'flex', alignItems: 'center' }}>
        <EducationIcon sx={{ mr: 2, color: '#667eea' }} />
        Educational Qualifications
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EducationIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Highest Qualification
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.highestQualification)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SubjectIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Specialization/Skills
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.specialization)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Year of Passing
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.yearOfPassing)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SchoolIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Institute Name
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.instituteName)}
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <BadgeIcon sx={{ mr: 2, color: '#667eea', mt: 0.5 }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Additional Certifications
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.additionalCertifications)}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );

  const renderIdentityInfo = () => (
    <div className="profileSection">
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#1e293b', display: 'flex', alignItems: 'center' }}>
        <BadgeIcon sx={{ mr: 2, color: '#667eea' }} />
        Identity & Compliance
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BadgeIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Aadhaar Number
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.aadhaarNumber)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BadgeIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              PAN Number
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.panNumber)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SecurityIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Teaching License
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.teachingLicense)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BadgeIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Employee Code
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.employeeCode)}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );

  const renderPayrollInfo = () => (
    <div className="profileSection">
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#1e293b', display: 'flex', alignItems: 'center' }}>
        <BankIcon sx={{ mr: 2, color: '#667eea' }} />
        Payroll & HR
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BankIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Bank Account Number
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.bankAccountNumber)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BankIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Bank Name
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.bankName)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BankIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              IFSC Code
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.ifscCode)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BadgeIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              UAN Number
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.uanNumber)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BadgeIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              EPF Number
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.epfNumber)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BadgeIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              ESI Number
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.esiNumber)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BankIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Salary Structure
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.salaryStructure)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BankIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Tax Details
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.taxDetails)}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );

  const renderSystemAccess = () => (
    <div className="profileSection">
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#1e293b', display: 'flex', alignItems: 'center' }}>
        <SecurityIcon sx={{ mr: 2, color: '#667eea' }} />
        System Access & Current Assignment
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PersonIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Username
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.username)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SecurityIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Access Level
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {displayValue(currentUser?.accessLevel)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ClassIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Assigned Class
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {teachSclass?.sclassName || 'Not Assigned'}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SubjectIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Assigned Subject
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {teachSubject?.subName || 'Not Assigned'}
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SchoolIcon sx={{ mr: 2, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              School Name
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {teachSchool?.schoolName || 'School Not Found'}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              fontSize: '3rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 15px 35px rgba(102, 126, 234, 0.3)',
              mx: 'auto',
              mb: 2,
            }}
          >
            {getInitials(currentUser?.name)}
          </Avatar>
          
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
            {currentUser?.name}
          </Typography>
          
          <Typography variant="h6" sx={{ color: '#64748b', mb: 2 }}>
            Teacher • Employee ID: {displayValue(currentUser?.employeeID)}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              icon={<ClassIcon />} 
              label={`Class: ${teachSclass?.sclassName || 'Not Assigned'}`}
              sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}
            />
            <Chip 
              icon={<SubjectIcon />} 
              label={`Subject: ${teachSubject?.subName || 'Not Assigned'}`}
              sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}
            />
            <Chip 
              icon={<SchoolIcon />} 
              label={teachSchool?.schoolName || 'School Not Found'}
              sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}
            />
          </Box>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <div className="statsCard">
              <GroupIcon className="statsIcon" sx={{ color: '#667eea' }} />
              <Typography className="statsNumber">
                {numberOfStudents || 0}
              </Typography>
              <Typography className="statsLabel">
                Students
              </Typography>
            </div>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <div className="statsCard">
              <ImportContactsIcon className="statsIcon" sx={{ color: '#764ba2' }} />
              <Typography className="statsNumber">
                {numberOfSessions || 0}
              </Typography>
              <Typography className="statsLabel">
                Lessons
              </Typography>
            </div>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <div className="statsCard">
              <AssignmentIcon className="statsIcon" sx={{ color: '#4facfe' }} />
              <Typography className="statsNumber">
                24
              </Typography>
              <Typography className="statsLabel">
                Tests Created
              </Typography>
            </div>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <div className="statsCard">
              <AccessTimeIcon className="statsIcon" sx={{ color: '#43e97b' }} />
              <Typography className="statsNumber">
                {formattedCreatedAt || 'N/A'}
              </Typography>
              <Typography className="statsLabel">
                Joined Date
              </Typography>
            </div>
          </Grid>
        </Grid>

        {/* Detailed Profile Tabs */}
        <div className="mainProfileCard">
          <Paper elevation={1} sx={{ borderRadius: '16px 16px 0 0' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant="scrollable"
              scrollButtons="auto"
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                '& .MuiTab-root': {
                  minWidth: 120,
                  fontWeight: 600
                }
              }}
            >
              <Tab label="Basic Info" />
              <Tab label="Contact" />
              <Tab label="Professional" />
              <Tab label="Education" />
              <Tab label="Identity" />
              <Tab label="Payroll" />
              <Tab label="System Access" />
            </Tabs>
          </Paper>
          
          <CardContent sx={{ p: 4 }}>
            {activeTab === 0 && renderBasicInfo()}
            {activeTab === 1 && renderContactInfo()}
            {activeTab === 2 && renderProfessionalInfo()}
            {activeTab === 3 && renderEducationalInfo()}
            {activeTab === 4 && renderIdentityInfo()}
            {activeTab === 5 && renderPayrollInfo()}
            {activeTab === 6 && renderSystemAccess()}
          </CardContent>
        </div>
      </Container>
    </Box>
  );
};

export default TeacherProfile;
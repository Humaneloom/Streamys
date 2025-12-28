import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  Button, 
  Grid, 
  Chip,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled Components
const GradientCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  border: '1px solid rgba(255,255,255,0.1)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease-in-out',
  overflow: 'visible',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
  },
}));

const InfoCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #e8ecf1 100%)',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
  border: '1px solid rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease-in-out',
  overflow: 'visible',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  },
}));

const ActionButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '10px 24px',
  boxShadow: variant === 'contained' ? '0 4px 15px rgba(0,0,0,0.1)' : 'none',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: variant === 'contained' ? '0 8px 25px rgba(0,0,0,0.15)' : '0 4px 15px rgba(0,0,0,0.1)',
  },
}));

const LibrarianDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [librarian, setLibrarian] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch librarian details
    const fetchLibrarianDetails = async () => {
      try {
        const response = await fetch(`/api/Librarian/${id}`);
        if (response.ok) {
          const data = await response.json();
          setLibrarian(data);
        } else {
          console.error('Failed to fetch librarian details');
        }
      } catch (error) {
        console.error('Error fetching librarian details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLibrarianDetails();
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/Admin/editlibrarian/${id}`);
  };

  const handleDelete = () => {
    // Implement delete functionality
    if (window.confirm('Are you sure you want to delete this librarian?')) {
      // Delete logic here
      navigate('/Admin/librarian');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!librarian) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography>Librarian not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/Admin/librarian')}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            mb: 2
          }}
        >
          Back to Librarian List
        </Button>
      </Box>

      {/* Main Librarian Info */}
      <GradientCard sx={{ mb: 4, p: 4 }}>
        <Box display="flex" alignItems="center" flexWrap="wrap" gap={3}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              background: 'rgba(255,255,255,0.2)',
              fontSize: '3rem',
              fontWeight: 'bold',
              border: '3px solid rgba(255,255,255,0.3)'
            }}
          >
            {librarian.name.charAt(0).toUpperCase()}
          </Avatar>
          
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 1 }}>
              {librarian.name}
            </Typography>
            <Chip
              label={librarian.role}
              size="large"
              sx={{
                background: 'rgba(255,255,255,0.2)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '1rem',
                mb: 2
              }}
            />
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              {librarian.department}
            </Typography>
          </Box>

          <Box display="flex" gap={2} flexWrap="wrap">
            <ActionButton
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{
                background: 'rgba(255,255,255,0.2)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.3)',
                }
              }}
            >
              Edit
            </ActionButton>
            <ActionButton
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              sx={{
                color: '#ffffff',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: '#ffffff',
                  background: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              Delete
            </ActionButton>
          </Box>
        </Box>
      </GradientCard>

      {/* Contact Information */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <InfoCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#667eea' }}>
                Contact Information
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <EmailIcon sx={{ mr: 2, color: '#667eea' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email Address
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {librarian.email}
                    </Typography>
                  </Box>
                </Box>
                
                <Box display="flex" alignItems="center" mb={2}>
                  <PhoneIcon sx={{ mr: 2, color: '#667eea' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Phone Number
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {librarian.phone}
                    </Typography>
                  </Box>
                </Box>
                
                <Box display="flex" alignItems="center">
                  <BusinessIcon sx={{ mr: 2, color: '#667eea' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Department
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {librarian.department}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </InfoCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <InfoCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#667eea' }}>
                Account Information
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <PersonIcon sx={{ mr: 2, color: '#667eea' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Role
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {librarian.role}
                    </Typography>
                  </Box>
                </Box>
                
                <Box display="flex" alignItems="center" mb={2}>
                  <BusinessIcon sx={{ mr: 2, color: '#667eea' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      School
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {librarian.schoolName}
                    </Typography>
                  </Box>
                </Box>
                
                <Box display="flex" alignItems="center">
                  <PersonIcon sx={{ mr: 2, color: '#667eea' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      User ID
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                      {librarian._id}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </InfoCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LibrarianDetails;

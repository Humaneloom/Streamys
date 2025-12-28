import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/api';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
    Alert,
    CircularProgress,
    Stepper,
    Step,
    StepLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(8),
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgba(255,255,255,0.3)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(255,255,255,0.5)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white',
        },
        '& input': {
            color: 'white',
        },
        '& label': {
            color: 'rgba(255,255,255,0.7)',
        },
    },
}));

const steps = ['Account Details', 'Confirmation'];

const SuperAdminRegister = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleNext = () => {
        if (activeStep === 0) {
            // Validate form data
            if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
                setError('Please fill in all fields');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters long');
                return;
            }
            setError('');
            setActiveStep(1);
        }
    };

    const handleBack = () => {
        setActiveStep(0);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/SuperAdminReg`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Super Admin account created successfully! You can now login.');
                setTimeout(() => {
                    navigate('/superadmin/login');
                }, 2000);
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ width: '100%' }}>
                        <StyledTextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Full Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={formData.name}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                        />
                        <StyledTextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                        />
                        <StyledTextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                        />
                        <StyledTextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            sx={{ mb: 3 }}
                        />
                    </Box>
                );
            case 1:
                return (
                    <Box sx={{ width: '100%', textAlign: 'center' }}>
                        <CheckCircleIcon sx={{ fontSize: 60, mb: 2, color: 'rgba(255,255,255,0.8)' }} />
                        <Typography variant="h6" gutterBottom>
                            Confirm Your Details
                        </Typography>
                        <Box sx={{ textAlign: 'left', mt: 3 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Name:</strong> {formData.name}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Email:</strong> {formData.email}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 3 }}>
                                <strong>Password:</strong> ••••••••
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Please review your information before creating the account.
                        </Typography>
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <StyledPaper elevation={6}>
                <Typography component="h1" variant="h4" gutterBottom>
                    Super Admin Setup
                </Typography>
                <Typography variant="body2" gutterBottom sx={{ mb: 3, opacity: 0.9 }}>
                    Create the initial super administrator account
                </Typography>

                <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel sx={{ color: 'white' }}>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                        {success}
                    </Alert>
                )}

                {renderStepContent(activeStep)}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 3 }}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.3)',
                            '&:hover': {
                                border: '1px solid rgba(255,255,255,0.5)',
                            },
                        }}
                    >
                        Back
                    </Button>
                    <Box>
                        {activeStep === steps.length - 1 ? (
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={loading}
                                sx={{
                                    background: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    '&:hover': {
                                        background: 'rgba(255,255,255,0.3)',
                                        border: '1px solid rgba(255,255,255,0.5)',
                                    },
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{
                                    background: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    '&:hover': {
                                        background: 'rgba(255,255,255,0.3)',
                                        border: '1px solid rgba(255,255,255,0.5)',
                                    },
                                }}
                            >
                                Next
                            </Button>
                        )}
                    </Box>
                </Box>
            </StyledPaper>
        </Container>
    );
};

export default SuperAdminRegister;

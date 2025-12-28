import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Box,
    Stepper,
    Step,
    StepLabel,
    Alert,
    CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { LightPurpleButton } from './buttonStyles';

const ForgotPassword = ({ open, onClose, role }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const steps = ['Enter Email', 'Verify OTP', 'Set New Password'];

    const handleRequestOTP = async () => {
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/forgot-password/request-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, role }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('OTP sent successfully to your email!');
                setActiveStep(1);
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp) {
            setError('Please enter the OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/forgot-password/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp, role, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Password reset successfully!');
                setActiveStep(2);
                setTimeout(() => {
                    onClose();
                    setActiveStep(0);
                    setEmail('');
                    setOtp('');
                    setNewPassword('');
                    setConfirmPassword('');
                }, 2000);
            } else {
                setError(data.message || 'Failed to verify OTP');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (activeStep === 0) {
            handleRequestOTP();
        } else if (activeStep === 1) {
            if (newPassword !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            if (newPassword.length < 6) {
                setError('Password must be at least 6 characters long');
                return;
            }
            handleVerifyOTP();
        }
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
        setError('');
        setSuccess('');
    };

    const handleClose = () => {
        onClose();
        setActiveStep(0);
        setEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setSuccess('');
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                            Enter your registered email address to receive an OTP for password reset.
                        </Typography>
                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            required
                        />
                    </Box>
                );
            case 1:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                            Enter the 6-digit OTP sent to your email address.
                        </Typography>
                        <TextField
                            fullWidth
                            label="OTP"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            margin="normal"
                            required
                            inputProps={{ maxLength: 6 }}
                        />
                        <TextField
                            fullWidth
                            label="New Password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Confirm New Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            margin="normal"
                            required
                        />
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: '#4caf50', mb: 2 }}>
                            ✅ Password Reset Successful!
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                            You can now login with your new password.
                        </Typography>
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ textAlign: 'center', color: '#2c2c6c' }}>
                Forgot Password
            </DialogTitle>
            <DialogContent>
                <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                {renderStepContent(activeStep)}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 3 }}>
                <Button
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    sx={{ color: '#8a2be2' }}
                >
                    Back
                </Button>
                <Box>
                    <Button onClick={handleClose} sx={{ mr: 1, color: '#666' }}>
                        Cancel
                    </Button>
                    {activeStep < 2 && (
                        <LightPurpleButton
                            onClick={handleNext}
                            disabled={loading}
                            variant="contained"
                        >
                            {loading ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : activeStep === 0 ? (
                                'Send OTP'
                            ) : (
                                'Reset Password'
                            )}
                        </LightPurpleButton>
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default ForgotPassword;

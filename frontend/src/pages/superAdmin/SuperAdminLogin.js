import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuperAdmin } from '../../redux/userRelated/userSlice';
import API_BASE_URL from '../../config/api';
import {
    Box,
    Button,
    TextField,
    Typography,
    Grid,
    Paper,
    Alert,
    CircularProgress,
    CssBaseline,
    IconButton,
    InputAdornment,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LightPurpleButton } from '../../components/buttonStyles';
import styled from 'styled-components';

const defaultTheme = createTheme();

const SuperAdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [toggle, setToggle] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/SuperAdminLogin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                dispatch(loginSuperAdmin({
                    user: data.superAdmin,
                    token: data.token,
                    role: 'SuperAdmin'
                }));
                navigate('/superadmin/dashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <StyledContainer>
                <Grid container component="main" sx={{
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <CssBaseline />
                    <Grid item xs={12} sm={8} md={6} lg={4} component={Paper} elevation={6}
                        sx={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 8px 32px rgba(138, 43, 226, 0.15)',
                            transition: 'all 0.3s ease-in-out',
                            borderRadius: '20px',
                            padding: '20px',
                            '&:hover': {
                                boxShadow: '0 12px 40px rgba(138, 43, 226, 0.2)',
                            }
                        }}
                    >
                        <Box
                            sx={{
                                my: 4,
                                mx: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="h4" sx={{ mb: 2, color: "#2c2c6c", fontWeight: "bold", textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                Super Admin Login
                            </Typography>
                            <Typography variant="h7" sx={{ mb: 4, color: "#4b4b80" }}>
                                Welcome back! Please enter your details
                            </Typography>

                            {error && (
                                <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Enter your email"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type={toggle ? 'text' : 'password'}
                                    id="password"
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setToggle(!toggle)}>
                                                    {toggle ? (
                                                        <Visibility />
                                                    ) : (
                                                        <VisibilityOff />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Grid container sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                                    <FormControlLabel
                                        control={<Checkbox value="remember" color="primary" />}
                                        label="Remember me"
                                    />
                                    <StyledLink to="#">
                                        Forgot password?
                                    </StyledLink>
                                </Grid>
                                <LightPurpleButton
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={loading}
                                    sx={{ mt: 3, mb: 2, padding: "12px" }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
                                </LightPurpleButton>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </StyledContainer>
        </ThemeProvider>
    );
};

export default SuperAdminLogin;

const StyledContainer = styled.div`
    min-height: 100vh;
    background: linear-gradient(135deg, #ffffff 0%, #e6e6fa 50%, #8a2be2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
`;

const StyledLink = styled.a`
    text-decoration: none;
    color: #8a2be2;
    font-weight: 500;
    transition: color 0.3s ease;
    cursor: pointer;
    
    &:hover {
        color: #6a1b9a;
        text-decoration: underline;
    }
`;

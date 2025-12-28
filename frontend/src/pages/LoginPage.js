import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, Box, Typography, Paper, Checkbox, FormControlLabel, TextField, CssBaseline, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LightPurpleButton } from '../components/buttonStyles';
import styled from 'styled-components';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';
import ForgotPassword from '../components/ForgotPassword';

const defaultTheme = createTheme();

const LoginPage = ({ role }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);;

    const [toggle, setToggle] = useState(false)
    const [loader, setLoader] = useState(false)
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [rollNumberError, setRollNumberError] = useState(false);
    const [studentNameError, setStudentNameError] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (role === "Student") {
            const rollNum = event.target.rollNumber.value;
            const studentName = event.target.studentName.value;
            const password = event.target.password.value;

            if (!rollNum || !studentName || !password) {
                if (!rollNum) setRollNumberError(true);
                if (!studentName) setStudentNameError(true);
                if (!password) setPasswordError(true);
                return;
            }
            const fields = { rollNum, studentName, password }
            setLoader(true)
            dispatch(loginUser(fields, role))
        }

        else {
            const email = event.target.email.value;
            const password = event.target.password.value;

            if (!email || !password) {
                if (!email) setEmailError(true);
                if (!password) setPasswordError(true);
                return;
            }

            const fields = { email, password }
            setLoader(true)
            dispatch(loginUser(fields, role))
        }
    };

    const handleInputChange = (event) => {
        const { name } = event.target;
        if (name === 'email') setEmailError(false);
        if (name === 'password') setPasswordError(false);
        if (name === 'rollNumber') setRollNumberError(false);
        if (name === 'studentName') setStudentNameError(false);
    };

    useEffect(() => {
        if (status === 'success' || currentUser !== null) {
                    if (currentRole === 'Admin') {
            navigate('/Admin/dashboard');
        }
        else if (currentRole === 'Student') {
            navigate('/Student/dashboard');
        } else if (currentRole === 'Teacher') {
            navigate('/Teacher/dashboard');
        } else if (currentRole === 'Finance') {
            navigate('/Finance/dashboard');
        }
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            setMessage("Network Error")
            setShowPopup(true)
            setLoader(false)
        }
    }, [status, currentRole, navigate, error, response, currentUser]);

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
                                {role} Login
                            </Typography>
                            <Typography variant="h7" sx={{ mb: 4, color: "#4b4b80" }}>
                                Welcome back! Please enter your details
                            </Typography>
                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
                                {role === "Student" ? (
                                    <>
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="rollNumber"
                                            label="Enter your Roll Number"
                                            name="rollNumber"
                                            autoComplete="off"
                                            type="number"
                                            autoFocus
                                            error={rollNumberError}
                                            helperText={rollNumberError && 'Roll Number is required'}
                                            onChange={handleInputChange}
                                        />
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="studentName"
                                            label="Enter your name"
                                            name="studentName"
                                            autoComplete="name"
                                            autoFocus
                                            error={studentNameError}
                                            helperText={studentNameError && 'Name is required'}
                                            onChange={handleInputChange}
                                        />
                                    </>
                                ) : (
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Enter your email"
                                        name="email"
                                        autoComplete="email"
                                        autoFocus
                                        error={emailError}
                                        helperText={emailError && 'Email is required'}
                                        onChange={handleInputChange}
                                    />
                                )}
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type={toggle ? 'text' : 'password'}
                                    id="password"
                                    autoComplete="current-password"
                                    error={passwordError}
                                    helperText={passwordError && 'Password is required'}
                                    onChange={handleInputChange}
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
                                    <StyledLink 
                                        onClick={() => setShowForgotPassword(true)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Forgot password?
                                    </StyledLink>
                                </Grid>
                                <LightPurpleButton
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, padding: "12px" }}
                                >
                                    {loader ?
                                        <CircularProgress size={24} color="inherit" />
                                        : "Login"}
                                </LightPurpleButton>
                                {role === "Admin" &&
                                    <Grid container>
                                        <Grid>
                                            Don't have an account?
                                        </Grid>
                                        <Grid item sx={{ ml: 2 }}>
                                            <StyledLink to="/Adminregister">
                                                Sign up
                                            </StyledLink>
                                        </Grid>
                                    </Grid>
                                }
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
                
                <ForgotPassword 
                    open={showForgotPassword}
                    onClose={() => setShowForgotPassword(false)}
                    role={role}
                />
            </StyledContainer>
        </ThemeProvider>
    );
}

export default LoginPage;

const StyledContainer = styled.div`
    min-height: 100vh;
    background: linear-gradient(135deg, #ffffff 0%, #e6e6fa 50%, #8a2be2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: #8a2be2;
    font-weight: 500;
    transition: color 0.3s ease;
    
    &:hover {
        color: #6a1b9a;
        text-decoration: underline;
    }
`;

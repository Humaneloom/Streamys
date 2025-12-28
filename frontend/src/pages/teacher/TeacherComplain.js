import { useEffect, useState } from 'react';
import { 
  Box, CircularProgress, Stack, TextField, Typography, Paper, 
  Alert, Chip, Avatar, Divider, IconButton, Tooltip, Button
} from '@mui/material';
import {
  Report as ReportIcon,
  Send as SendIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import Popup from '../../components/Popup';
import { addStuff } from '../../redux/userRelated/userHandle';
import { useDispatch, useSelector } from 'react-redux';

// Styled components for modern design
const PageHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  borderRadius: '20px',
  padding: '32px',
  color: 'white',
  marginBottom: '24px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.3,
  }
}));

const ComplainCard = styled(Paper)(({ theme }) => ({
  borderRadius: '20px',
  padding: '32px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-2px)',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: '2px',
      }
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: '2px',
      }
    }
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    }
  }
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  borderRadius: '12px',
  padding: '12px 32px',
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
    transform: 'translateY(-2px)',
  },
  '&:disabled': {
    background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
    boxShadow: 'none',
    transform: 'none',
  }
}));

const TeacherComplain = () => {
    const [complaint, setComplaint] = useState("");
    const [date, setDate] = useState("");

    const dispatch = useDispatch();
    const { status, currentUser, error } = useSelector(state => state.user);

    const user = currentUser._id;
    const school = currentUser.school._id;
    const address = "Complain";

    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const fields = {
        user,
        date,
        complaint,
        school,
    };

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        dispatch(addStuff(fields, address));
    };

    useEffect(() => {
        if (status === "added") {
            setLoader(false);
            setShowPopup(true);
            setMessage("Complaint submitted successfully!");
        }
        else if (error) {
            setLoader(false);
            setShowPopup(true);
            setMessage("Network Error");
        }
    }, [status, error]);

    return (
        <>
            <Box sx={{ p: 3 }}>
                {/* Page Header */}
                <PageHeader>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <SchoolIcon sx={{ fontSize: 40 }} />
                            <Box>
                                <Typography variant="h4" sx={{ 
                                    fontWeight: 700, 
                                    mb: 1,
                                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    Submit Complaint
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                    Report issues or concerns to help improve the school environment
                                </Typography>
                            </Box>
                        </Box>
                    </motion.div>
                </PageHeader>

                {/* Main Content */}
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        style={{ width: '100%', maxWidth: 600 }}
                    >
                        <ComplainCard>
                            {/* Info Alert */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <Alert 
                                    severity="info" 
                                    icon={<InfoIcon />}
                                    sx={{ 
                                        mb: 3, 
                                        borderRadius: '12px',
                                        '& .MuiAlert-message': { fontWeight: 500 }
                                    }}
                                >
                                    Please provide detailed information to help us address your concern effectively.
                                </Alert>
                            </motion.div>

                            <form onSubmit={submitHandler}>
                                <Stack spacing={3}>
                                    {/* Date Field */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.4 }}
                                    >
                                        <StyledTextField
                                            fullWidth
                                            label="Date of Incident"
                                            type="date"
                                            value={date}
                                            onChange={(event) => setDate(event.target.value)}
                                            required
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                ),
                                            }}
                                        />
                                    </motion.div>

                                    {/* Complaint Field */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.5 }}
                                    >
                                        <StyledTextField
                                            fullWidth
                                            label="Describe your complaint"
                                            variant="outlined"
                                            value={complaint}
                                            onChange={(event) => {
                                                setComplaint(event.target.value);
                                            }}
                                            required
                                            multiline
                                            rows={6}
                                            placeholder="Please provide a detailed description of your complaint, including relevant context and any steps you've already taken..."
                                            InputProps={{
                                                startAdornment: (
                                                    <EditIcon sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 2 }} />
                                                ),
                                            }}
                                        />
                                    </motion.div>

                                    {/* Guidelines */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.6 }}
                                    >
                                        <Box sx={{ 
                                            p: 2, 
                                            bgcolor: 'grey.50', 
                                            borderRadius: '12px',
                                            border: '1px solid',
                                            borderColor: 'grey.200'
                                        }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                                                📝 Guidelines for effective complaints:
                                            </Typography>
                                            <Box component="ul" sx={{ m: 0, pl: 2, color: 'text.secondary' }}>
                                                <li>Be specific about the issue and when it occurred</li>
                                                <li>Include relevant details and context</li>
                                                <li>Remain respectful and constructive</li>
                                                <li>Suggest possible solutions if applicable</li>
                                            </Box>
                                        </Box>
                                    </motion.div>

                                    {/* Submit Button */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.7 }}
                                    >
                                        <SubmitButton
                                            fullWidth
                                            size="large"
                                            variant="contained"
                                            type="submit"
                                            disabled={loader || !date || !complaint.trim()}
                                            startIcon={loader ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                                        >
                                            {loader ? "Submitting..." : "Submit Complaint"}
                                        </SubmitButton>
                                    </motion.div>
                                </Stack>
                            </form>
                        </ComplainCard>
                    </motion.div>
                </Box>
            </Box>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default TeacherComplain;
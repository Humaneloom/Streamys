import React, { useEffect } from 'react';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Button, 
    Container, 
    Typography, 
    Paper, 
    Box, 
    IconButton, 
    Breadcrumbs,
    Grid,
    Card,
    CardContent,
    Avatar
} from '@mui/material';
import { 
    ArrowBack as ArrowBackIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    Book as BookIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import styled, { keyframes } from 'styled-components';

const TeacherDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { loading, teacherDetails, error } = useSelector((state) => state.teacher);

    const teacherID = params.id;

    useEffect(() => {
        dispatch(getTeacherDetails(teacherID));
    }, [dispatch, teacherID]);

    if (error) {
        console.log(error);
    }

    const isSubjectNamePresent = teacherDetails?.teachSubject?.subName;

    const handleAddSubject = () => {
        navigate(`/Admin/teachers/choosesubject/${teacherDetails?.teachSclass?._id}/${teacherDetails?._id}`);
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <StyledContainer>
            <HeaderContainer>
                <BreadcrumbsContainer>
                    <IconButton onClick={handleBack} sx={{ 
                        mr: 2,
                        '&:hover': {
                            transform: 'scale(1.1)',
                            color: '#2c2c6c'
                        }
                    }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <StyledBreadcrumbs>
                        <Typography sx={{ fontSize: '1.1rem', cursor: 'pointer' }} onClick={handleBack}>
                            Back
                        </Typography>
                        <Typography sx={{ fontSize: '1.1rem' }} color="text.primary">
                            {teacherDetails?.name || 'Teacher Details'}
                        </Typography>
                    </StyledBreadcrumbs>
                </BreadcrumbsContainer>
            </HeaderContainer>

            {loading ? (
                <LoadingContainer>
                    <div className="loading-spinner"></div>
                    <Typography variant="h6" sx={{ color: '#4b4b80', mt: 2 }}>
                        Loading Teacher Details...
                    </Typography>
                </LoadingContainer>
            ) : (
                <StyledPaper elevation={3}>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" sx={{ color: '#2c2c6c', fontWeight: 'bold', mb: 2 }}>
                            Teacher Profile
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: '#4b4b80' }}>
                            Detailed information about the teacher
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {/* Teacher Basic Info */}
                        <Grid item xs={12} md={6}>
                            <DetailCard elevation={3}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Avatar sx={{ 
                                            width: 80, 
                                            height: 80, 
                                            bgcolor: '#2c2c6c',
                                            mr: 2
                                        }}>
                                            <PersonIcon sx={{ fontSize: 40 }} />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h5" sx={{ color: '#2c2c6c', fontWeight: 'bold' }}>
                                                {teacherDetails?.name || 'N/A'}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: '#4b4b80' }}>
                                                Teacher ID: {teacherID}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </DetailCard>
                        </Grid>

                        {/* Class Information */}
                        <Grid item xs={12} md={6}>
                            <DetailCard elevation={3}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <SchoolIcon sx={{ fontSize: 30, color: '#2c2c6c', mr: 2 }} />
                                        <Typography variant="h6" sx={{ color: '#2c2c6c', fontWeight: 'bold' }}>
                                            Assigned Class
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" sx={{ color: '#4b4b80', mb: 1 }}>
                                        Class: {teacherDetails?.teachSclass?.sclassName || 'Not Assigned'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#666' }}>
                                        Class ID: {teacherDetails?.teachSclass?._id || 'N/A'}
                                    </Typography>
                                </CardContent>
                            </DetailCard>
                        </Grid>

                        {/* Subject Information */}
                        <Grid item xs={12}>
                            <DetailCard elevation={3}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <BookIcon sx={{ fontSize: 30, color: '#2c2c6c', mr: 2 }} />
                                        <Typography variant="h6" sx={{ color: '#2c2c6c', fontWeight: 'bold' }}>
                                            Subject Information
                                        </Typography>
                                    </Box>
                                    
                                    {isSubjectNamePresent ? (
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <BookIcon sx={{ fontSize: 20, color: '#4b4b80', mr: 1 }} />
                                                    <Typography variant="body1" sx={{ color: '#4b4b80' }}>
                                                        Subject: {teacherDetails?.teachSubject?.subName}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{ color: '#666', ml: 3 }}>
                                                    Code: {teacherDetails?.teachSubject?.subCode || 'N/A'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <ScheduleIcon sx={{ fontSize: 20, color: '#4b4b80', mr: 1 }} />
                                                    <Typography variant="body1" sx={{ color: '#4b4b80' }}>
                                                        Sessions: {teacherDetails?.teachSubject?.sessions || 0}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{ color: '#666', ml: 3 }}>
                                                    Subject ID: {teacherDetails?.teachSubject?._id || 'N/A'}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    ) : (
                                        <Box sx={{ textAlign: 'center', py: 3 }}>
                                            <BookIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                                            <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                                                No Subject Assigned
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#999', mb: 3 }}>
                                                This teacher hasn't been assigned to any subject yet.
                                            </Typography>
                                            <Button 
                                                variant="contained" 
                                                onClick={handleAddSubject}
                                                sx={{
                                                    backgroundColor: '#2c2c6c',
                                                    '&:hover': {
                                                        backgroundColor: '#1a1a4a'
                                                    },
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 4px 20px rgba(44, 44, 108, 0.3)'
                                                    }
                                                }}
                                            >
                                                Assign Subject
                                            </Button>
                                        </Box>
                                    )}
                                </CardContent>
                            </DetailCard>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                        <Button 
                            variant="outlined" 
                            onClick={handleBack}
                            sx={{
                                borderColor: '#2c2c6c',
                                color: '#2c2c6c',
                                '&:hover': {
                                    borderColor: '#1a1a4a',
                                    backgroundColor: 'rgba(44, 44, 108, 0.04)'
                                }
                            }}
                        >
                            Back to Teachers
                        </Button>
                        {isSubjectNamePresent && (
                            <Button 
                                variant="contained"
                                onClick={handleAddSubject}
                                sx={{
                                    backgroundColor: '#2c2c6c',
                                    '&:hover': {
                                        backgroundColor: '#1a1a4a'
                                    }
                                }}
                            >
                                Change Subject
                            </Button>
                        )}
                    </Box>
                </StyledPaper>
            )}
        </StyledContainer>
    );
};

export default TeacherDetails;

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const StyledContainer = styled(Container)`
    padding: 20px;
    animation: ${fadeIn} 0.5s ease-out;
`;

const HeaderContainer = styled.div`
    margin-bottom: 20px;
`;

const BreadcrumbsContainer = styled.div`
    display: flex;
    align-items: center;
`;

const StyledBreadcrumbs = styled(Breadcrumbs)`
    .MuiBreadcrumbs-separator {
        margin: 0 8px;
    }
`;

const StyledPaper = styled(Paper)`
    padding: 30px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(138, 43, 226, 0.1);
    transition: all 0.3s ease;
    animation: ${fadeIn} 0.5s ease-out;

    &:hover {
        box-shadow: 0 8px 25px rgba(138, 43, 226, 0.15);
    }
`;

const DetailCard = styled(Card)`
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: default;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }
`;

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    
    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #2c2c6c;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Box,
  Container,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import { AccountCircle, School, Group, AccountBalance, LocalLibrary } from '@mui/icons-material';
import styled, { keyframes } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ChooseUser = ({ visitor }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const password = "zxc"

  const { status, currentUser, currentRole } = useSelector(state => state.user);;

  const [loader, setLoader] = useState(false)
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const navigateHandler = (user) => {
    if (user === "Admin") {
      if (visitor === "guest") {
        const email = "yogendra@12"
        const fields = { email, password }
        setLoader(true)
        dispatch(loginUser(fields, user))
      }
      else {
        navigate('/Adminlogin');
      }
    }

    else if (user === "Student") {
      if (visitor === "guest") {
        const rollNum = "1"
        const studentName = "Dipesh Awasthi"
        const fields = { rollNum, studentName, password }
        setLoader(true)
        dispatch(loginUser(fields, user))
      }
      else {
        navigate('/Studentlogin');
      }
    }

    else if (user === "Teacher") {
      if (visitor === "guest") {
        const email = "tony@12"
        const fields = { email, password }
        setLoader(true)
        dispatch(loginUser(fields, user))
      }
      else {
        navigate('/Teacherlogin');
      }
    }
    else if (user === "Finance") {
      if (visitor === "guest") {
        const email = "finance@12"
        const fields = { email, password }
        setLoader(true)
        dispatch(loginUser(fields, user))
      }
      else {
        navigate('/Financelogin');
      }
    }
    else if (user === "Librarian") {
      if (visitor === "guest") {
        const email = "librarian@12"
        const fields = { email, password }
        setLoader(true)
        dispatch(loginUser(fields, user))
      }
      else {
        navigate('/Librarianlogin');
      }
    }
  }

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
    } else if (currentRole === 'Librarian') {
      navigate('/Librarian/dashboard');
    }
    }
    else if (status === 'error') {
      setLoader(false)
      setMessage("Network Error")
      setShowPopup(true)
    }
  }, [status, currentRole, navigate, currentUser]);

  return (
    <StyledContainer>
      <Title>
        Welcome to School Management System
        <span>Choose your role to get started</span>
      </Title>
      <ContentContainer maxWidth="lg">
        <GridContainer container justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={6} md={3.5} sx={{ p: 1 }}>
            <BoxWrapper>
              <StyledPaper elevation={3} onClick={() => navigateHandler("Admin")}>
                <div className="icon-container">
                  <AccountCircle />
                </div>
                <StyledTypography>
                  Admin
                </StyledTypography>
              </StyledPaper>
            </BoxWrapper>
          </Grid>
          <Grid item xs={12} sm={6} md={3.5} sx={{ p: 1 }}>
            <BoxWrapper>
              <StyledPaper elevation={3} onClick={() => navigateHandler("Student")}>
                <div className="icon-container">
                  <School />
                </div>
                <StyledTypography>
                  Student
                </StyledTypography>
              </StyledPaper>
            </BoxWrapper>
          </Grid>
          <Grid item xs={12} sm={6} md={3.5} sx={{ p: 1 }}>
            <BoxWrapper>
              <StyledPaper elevation={3} onClick={() => navigateHandler("Teacher")}>
                <div className="icon-container">
                  <Group />
                </div>
                <StyledTypography>
                  Teacher
                </StyledTypography>
              </StyledPaper>
            </BoxWrapper>
          </Grid>
          <Grid item xs={12} sm={6} md={3.5} sx={{ p: 1 }}>
            <BoxWrapper>
              <StyledPaper elevation={3} onClick={() => navigateHandler("Finance")}>
                <div className="icon-container">
                  <AccountBalance />
                </div>
                <StyledTypography>
                  Finance
                </StyledTypography>
              </StyledPaper>
            </BoxWrapper>
          </Grid>
          <Grid item xs={12} sm={6} md={3.5} sx={{ p: 1 }}>
            <BoxWrapper>
              <StyledPaper elevation={3} onClick={() => navigateHandler("Librarian")}>
                <div className="icon-container">
                  <LocalLibrary />
                </div>
                <StyledTypography>
                  Librarian
                </StyledTypography>
              </StyledPaper>
            </BoxWrapper>
          </Grid>
        </GridContainer>
      </ContentContainer>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
      >
        <CircularProgress color="inherit" />
        Please Wait
      </Backdrop>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #e6e6fa 50%, #8a2be2 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
`;

const Title = styled.h1`
  color: #2c2c6c;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  animation: ${fadeIn} 1s ease-out;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;

  span {
    display: block;
    font-size: 1.3rem;
    color: #4b4b80;
    margin-top: 0.8rem;
  }
`;

const ContentContainer = styled(Container)`
  position: relative;
  z-index: 1;
  margin-top: 1rem;
  padding: 0;
  width: 100%;
  
  @media (min-width: 960px) {
    max-width: 1200px;
  }
`;

const GridContainer = styled(Grid)`
  margin: 0;
  width: 100%;
  gap: 0.8rem;
`;

const BoxWrapper = styled.div`
  padding: 0.3rem;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const StyledPaper = styled(Paper)`
  padding: 1.2rem;
  text-align: center;
  background: linear-gradient(135deg, rgba(44, 44, 108, 0.95) 0%, rgba(71, 71, 135, 0.95) 100%);
  color: white;
  cursor: pointer;
  height: 200px;
  width: 100%;
  border-radius: 25px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  max-width: 280px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
    transition: left 0.6s;
  }

  &:hover {
    background: linear-gradient(135deg, rgba(71, 71, 135, 0.95) 0%, rgba(94, 94, 158, 0.95) 100%);
    transform: translateY(-15px) scale(1.05);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  &:hover::before {
    left: 100%;
  }

  .icon-container {
    margin-bottom: 1rem;
    transform: scale(1);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    background: rgba(255, 255, 255, 0.2);
    padding: 1rem;
    border-radius: 50%;
    
    svg {
      font-size: 2.2rem;
      color: white;
    }
  }

  &:hover .icon-container {
    transform: scale(1.15) rotate(5deg);
    background: rgba(255, 255, 255, 0.3);
  }
`;

const StyledTypography = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin: 1rem 0;
  color: white;
`;

export default ChooseUser;
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Box } from '@mui/material';
import styled from 'styled-components';
import Students from "../assets/students.svg";
import { LightPurpleButton } from '../components/buttonStyles';

const Homepage = () => {
  return (
    <MainContainer>
      <StyledContainer>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6} sx={{ pl: { md: 8 } }}>
            <img src={Students} alt="students" style={{ width: '100%', maxWidth: '600px', display: 'block', marginLeft: '0' }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <StyledTitle>
                Welcome to
                <br />
                School Management
                <br />
                System
              </StyledTitle>
              <StyledText>
                Streamline school management, class organization, and add students and faculty.
                Seamlessly track attendance, assess performance, and provide feedback.
                Access records, view marks, and communicate effortlessly.
              </StyledText>
              <StyledBox>
                <a
                  href="/"
                  style={{
                    fontSize: '0.95rem',
                    color: '#8a2be2',
                    textDecoration: 'none',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    display: 'block'
                  }}
                >
                  ← Back to Landing Page
                </a>
                <StyledLink to="/choose">
                  <LightPurpleButton variant="contained"
                    sx={{
                      width: '300px',
                      fontSize: '1.2rem',
                      padding: '12px 0',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        transition: 'transform 0.3s ease'
                      }
                    }}>
                    Login
                  </LightPurpleButton>
                </StyledLink>
                {/* <StyledText style={{ marginTop: '0' }}>
                                    Don't have an account?{' '}
                                    <Link to="/Adminregister" style={{
                                        color: "#550080",
                                        textDecoration: 'none',
                                        fontWeight: '500',
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}>
                                        Sign up
                                    </Link>
                                </StyledText> */}

              </StyledBox>
            </StyledPaper>
          </Grid>
        </Grid>
      </StyledContainer>
    </MainContainer>
  );
};

export default Homepage;

const MainContainer = styled.div`
    min-height: 100vh;
    background: linear-gradient(135deg, #ffffff 0%, #e6e6fa 50%, #8a2be2 100%);
    display: flex;
    align-items: center;
`;

const StyledContainer = styled(Container)`
  display: flex;
  align-items: center;
  padding: 2rem;
  max-width: 1600px !important;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(138, 43, 226, 0.15);
  transition: all 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 12px 40px rgba(138, 43, 226, 0.2);
  }
`;

const StyledPaper = styled.div`
  padding: 2rem 4rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  max-width: 800px;

  @media (max-width: 768px) {
    padding: 1rem;
    text-align: center;
  }
`;

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  margin-top: 2rem;
  width: 100%;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const StyledTitle = styled.h1`
  font-size: 3.2rem;
  color: #2c2c6c;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const StyledText = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: #4b4b80;
  margin: 0;
  max-width: 600px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  display: block;
  
  a {
    color: #8a2be2;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
    
    &:hover {
      color: #6a1b9a;
      text-decoration: underline;
    }
  }
`;

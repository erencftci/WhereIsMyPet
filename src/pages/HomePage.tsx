import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import LoginModal from '../components/LoginModal';
import './HomePage.css';

const HeroSection = styled(Box)({
  height: '100vh',
  width: '100%',
  background: `url('/animal-lost-pet.jpg') no-repeat center center fixed`,
  backgroundSize: 'cover',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1
  }
});

const ContentBox = styled(Box)({
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  width: '100%',
  maxWidth: '1200px',
  padding: '0 20px'
});

const OptionBubble = styled(Button)({
  width: '200px',
  height: '200px',
  borderRadius: '50%',
  backgroundColor: 'rgba(139, 69, 19, 0.8)',
  color: '#F5DEB3',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  margin: '20px',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    backgroundColor: 'rgba(139, 69, 19, 0.95)',
    transform: 'scale(1.05)',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)'
  }
});

const OptionsContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  marginTop: '50px'
});

const AboutSection = styled(Box)({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '15px',
  color: '#F5DEB3',
  textAlign: 'center',
  zIndex: 2,
  opacity: 1,
  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
});

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowAbout(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleOptionClick = (path: string) => {
    if (path === '/create-post' && !currentUser) {
      setIsLoginModalOpen(true);
    } else {
      navigate(path);
    }
  };

  return (
    <Box className="homepage-container">
      <HeroSection>
        <ContentBox>
          <Typography 
            variant="h1" 
            className="hero-title"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              fontWeight: 700,
              color: '#F5DEB3',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
              marginBottom: '2rem',
              fontFamily: 'Playfair Display, serif',
              letterSpacing: '3px'
            }}
          >
            KAYIP HAYVAN
            <br />
            PLATFORMUNA
            <br />
            HOŞ GELDİNİZ
          </Typography>

          <OptionsContainer>
            <OptionBubble onClick={() => handleOptionClick('/create-post')}>
              İLAN VER
            </OptionBubble>
            <OptionBubble onClick={() => handleOptionClick('/view-posts')}>
              İLANLARA GÖZ AT
            </OptionBubble>
          </OptionsContainer>
        </ContentBox>
      </HeroSection>

      <AboutSection>
        <Typography variant="body1" sx={{ 
          marginBottom: '5px', 
          fontSize: '0.9rem',
          fontWeight: 400
        }}>
          WhereIsMyPet, kayıp hayvanların sahiplerine kavuşmasını sağlamak için kurulmuş bir platformdur. 
          Amacımız, hayvanseverler arasında dayanışmayı artırmak ve her kayıp hayvanın güvenli bir şekilde evine dönmesine yardımcı olmaktır.
        </Typography>
        <Typography variant="body2" sx={{ 
          fontStyle: 'italic', 
          fontSize: '0.8rem',
          fontWeight: 400
        }}>
          WhereIsMyPet © 2024 - Tüm hakları saklıdır
        </Typography>
      </AboutSection>

      <LoginModal 
        open={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </Box>
  );
};

export default HomePage; 
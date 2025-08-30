import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import './AboutPage.css';

const HeroSection = styled(Box)({
  height: '50vh',
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

const AboutPage: React.FC = () => {
  return (
    <Box className="about-page">
      <HeroSection>
        <ContentBox>
          <Typography 
            variant="h1" 
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
            HAKKIMIZDA
          </Typography>
        </ContentBox>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#8B4513', fontFamily: 'Playfair Display, serif' }}>
            Biz Kimiz?
          </Typography>
          <Typography variant="body1" paragraph>
            WhereIsMyPet, kayıp hayvanların sahiplerine kavuşmasını sağlamak için kurulmuş bir platformdur. 
            Amacımız, hayvanseverler arasında dayanışmayı artırmak ve her kayıp hayvanın güvenli bir şekilde evine dönmesine yardımcı olmaktır.
          </Typography>

          <Typography variant="h4" gutterBottom sx={{ color: '#8B4513', fontFamily: 'Playfair Display, serif', mt: 4 }}>
            Misyonumuz
          </Typography>
          <Typography variant="body1" paragraph>
            Kayıp hayvanların bulunması ve sahiplerine kavuşması için güvenilir, hızlı ve etkili bir platform sunmak. 
            Toplumu bilinçlendirmek ve hayvan hakları konusunda farkındalık yaratmak.
          </Typography>

          <Typography variant="h4" gutterBottom sx={{ color: '#8B4513', fontFamily: 'Playfair Display, serif', mt: 4 }}>
            Vizyonumuz
          </Typography>
          <Typography variant="body1" paragraph>
            Türkiye'nin en güvenilir ve kapsamlı kayıp hayvan platformu olmak. 
            Her kayıp hayvanın güvenli bir şekilde evine dönmesini sağlamak ve hayvanseverler arasında güçlü bir topluluk oluşturmak.
          </Typography>

          <Typography variant="h4" gutterBottom sx={{ color: '#8B4513', fontFamily: 'Playfair Display, serif', mt: 4 }}>
            Değerlerimiz
          </Typography>
          <Typography variant="body1" paragraph>
            • Hayvan sevgisi ve saygısı<br />
            • Toplumsal sorumluluk<br />
            • Şeffaflık ve güvenilirlik<br />
            • Sürekli gelişim ve yenilik<br />
            • Topluluk dayanışması
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default AboutPage; 
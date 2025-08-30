import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const About = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            align="center" 
            sx={{ 
              mb: 4,
              fontWeight: 700,
              letterSpacing: '0.5px'
            }}
          >
            Hakkımızda
          </Typography>
          
          <Typography 
            variant="body1" 
            paragraph
            sx={{
              fontWeight: 400,
              lineHeight: 1.6
            }}
          >
            WhereIsMyPet, kayıp evcil hayvanların bulunması ve sahiplerine kavuşturulması için tasarlanmış bir platformdur. 
            Amacımız, evcil hayvanların güvenli bir şekilde evlerine dönmelerini sağlamak ve hayvan sahiplerinin endişelerini azaltmaktır.
          </Typography>

          <Typography 
            variant="body1" 
            paragraph
            sx={{
              fontWeight: 400,
              lineHeight: 1.6
            }}
          >
            Platformumuz, kayıp evcil hayvanların fotoğraflarını ve bilgilerini paylaşmanıza olanak tanır. 
            Ayrıca, bulunan evcil hayvanların bilgilerini de sisteme ekleyerek sahiplerinin onları bulmasını kolaylaştırırız.
          </Typography>

          <Typography 
            variant="body1" 
            paragraph
            sx={{
              fontWeight: 400,
              lineHeight: 1.6
            }}
          >
            WhereIsMyPet olarak, hayvanların refahı ve mutluluğu için çalışıyoruz. 
            Her gün daha fazla evcil hayvanın ailesine kavuşması için çabalıyoruz.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default About; 
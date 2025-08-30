import React, { useState } from 'react';
import { Box, Typography, Container, Paper, TextField, Button, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import './HelpPage.css';

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

const StyledTextField = styled(TextField)({
  marginBottom: '20px',
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: '#8B4513',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8B4513',
    },
  },
});

const HelpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Burada form verilerini işleyebilir veya bir API'ye gönderebilirsiniz
    setSnackbar({
      open: true,
      message: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.',
      severity: 'success'
    });
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box className="help-page">
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
            YARDIM
          </Typography>
        </ContentBox>
      </HeroSection>

      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#8B4513', fontFamily: 'Playfair Display, serif', mb: 4 }}>
            Bize Ulaşın
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            Platformumuzla ilgili herhangi bir sorunuz veya yardıma ihtiyacınız varsa, aşağıdaki formu doldurarak bize ulaşabilirsiniz. 
            En kısa sürede size yardımcı olmaya çalışacağız.
          </Typography>

          <form onSubmit={handleSubmit}>
            <StyledTextField
              fullWidth
              label="Adınız"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              variant="outlined"
            />
            
            <StyledTextField
              fullWidth
              label="E-posta Adresiniz"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              variant="outlined"
            />
            
            <StyledTextField
              fullWidth
              label="Konu"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              variant="outlined"
            />
            
            <StyledTextField
              fullWidth
              label="Mesajınız"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              multiline
              rows={4}
              variant="outlined"
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#8B4513',
                color: '#F5DEB3',
                '&:hover': {
                  backgroundColor: '#A0522D',
                },
                padding: '12px 32px',
                fontSize: '1.1rem',
                mt: 2
              }}
            >
              Gönder
            </Button>
          </form>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HelpPage; 
import React, { useState } from 'react';
import { Box, Typography, Container, Paper, Button, TextField, Snackbar, Alert, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import './DonationPage.css';

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

const DonationCard = styled(Paper)({
  padding: '24px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  transition: 'transform 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
});

const DonationPage: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount('');
  };

  const handleDonate = () => {
    const amount = customAmount || selectedAmount;
    if (!amount) {
      setSnackbar({
        open: true,
        message: 'Lütfen bir bağış miktarı seçin',
        severity: 'error'
      });
      return;
    }

    // Burada bağış işlemini gerçekleştirebilirsiniz
    setSnackbar({
      open: true,
      message: 'Bağışınız için teşekkür ederiz!',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const donationAmounts = [
    { amount: '50', label: '50 TL' },
    { amount: '100', label: '100 TL' },
    { amount: '250', label: '250 TL' },
    { amount: '500', label: '500 TL' }
  ];

  return (
    <Box className="donation-page">
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
            BAĞIŞ YAP
          </Typography>
        </ContentBox>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#8B4513', fontFamily: 'Playfair Display, serif', mb: 4, textAlign: 'center' }}>
            Kayıp Hayvanlar İçin Destek Olun
          </Typography>

          <Typography variant="body1" paragraph sx={{ mb: 4, textAlign: 'center' }}>
            WhereIsMyPet platformu, kayıp hayvanların sahiplerine kavuşması için çalışan bir topluluk projesidir. 
            Bağışlarınız, platformumuzun geliştirilmesi ve daha fazla hayvana ulaşmamız için kullanılacaktır.
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {donationAmounts.map((item) => (
              <Grid item xs={6} sm={3} key={item.amount}>
                <DonationCard
                  elevation={selectedAmount === item.amount ? 8 : 2}
                  onClick={() => handleAmountSelect(item.amount)}
                  sx={{
                    backgroundColor: selectedAmount === item.amount ? '#8B4513' : 'white',
                    color: selectedAmount === item.amount ? '#F5DEB3' : '#8B4513',
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {item.label}
                  </Typography>
                </DonationCard>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#8B4513', textAlign: 'center' }}>
              Veya Özel Miktar Girin
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder="Bağış miktarını girin"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#8B4513',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8B4513',
                  },
                },
              }}
            />
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={handleDonate}
              sx={{
                backgroundColor: '#8B4513',
                color: '#F5DEB3',
                '&:hover': {
                  backgroundColor: '#A0522D',
                },
                padding: '12px 32px',
                fontSize: '1.1rem',
              }}
            >
              Bağış Yap
            </Button>
          </Box>
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

export default DonationPage; 
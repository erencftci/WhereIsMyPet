import React from 'react';
import { Container, Typography, Box, Paper, Grid, Card, CardContent, CardMedia } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import VerifiedIcon from '@mui/icons-material/Verified';

const Donation = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
        py: 8,
        pt: { xs: '120px', sm: '140px' },
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
            Bağış Yap
          </Typography>

          <Typography 
            variant="body1" 
            paragraph 
            align="center" 
            sx={{ 
              mb: 4,
              fontWeight: 400,
              lineHeight: 1.6
            }}
          >
            WhereIsMyPet platformunu desteklemek ve daha fazla evcil hayvanın ailesine kavuşmasına yardımcı olmak için bağışta bulunabilirsiniz.
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <VerifiedIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      letterSpacing: '0.3px'
                    }}
                  >
                    Valilik Onaylı
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      fontWeight: 400,
                      lineHeight: 1.6
                    }}
                  >
                    Platformumuz İstanbul Valiliği tarafından onaylanmıştır. Bağışlarınız güvenle işleme alınmaktadır.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <AccountBalanceIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      letterSpacing: '0.3px'
                    }}
                  >
                    Banka Hesabı
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      fontWeight: 400,
                      lineHeight: 1.6
                    }}
                  >
                    <strong>Banka:</strong> Ziraat Bankası<br />
                    <strong>Hesap Sahibi:</strong> WhereIsMyPet Derneği<br />
                    <strong>IBAN:</strong> TR00 0000 0000 0000 0000 0000 00
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <CardGiftcardIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      letterSpacing: '0.3px'
                    }}
                  >
                    Bağış Sertifikası
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      fontWeight: 400,
                      lineHeight: 1.6
                    }}
                  >
                    Bağışınızı yaptıktan sonra, 2 iş günü içerisinde e-posta adresinize özel tasarlanmış bağış sertifikanız gönderilecektir.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                fontWeight: 400,
                lineHeight: 1.6
              }}
            >
              * Bağış yaptıktan sonra, dekontunuzu info@whereismypet.com adresine göndermenizi rica ederiz.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Donation; 
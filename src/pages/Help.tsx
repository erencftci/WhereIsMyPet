import React from 'react';
import { Container, Typography, Box, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Help = () => {
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
            Yardım
          </Typography>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography 
                variant="h6"
                sx={{
                  fontWeight: 600,
                  letterSpacing: '0.3px'
                }}
              >
                Evcil Hayvanımı Nasıl Kaydedebilirim?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                sx={{
                  fontWeight: 400,
                  lineHeight: 1.6
                }}
              >
                1. Ana sayfada "Evcil Hayvanımı Kaydet" butonuna tıklayın.<br />
                2. Evcil hayvanınızın fotoğrafını yükleyin.<br />
                3. Evcil hayvanınızın bilgilerini (isim, tür, ırk, yaş vb.) girin.<br />
                4. Kayıt işlemini tamamlayın.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography 
                variant="h6"
                sx={{
                  fontWeight: 600,
                  letterSpacing: '0.3px'
                }}
              >
                Kayıp Evcil Hayvanımı Nasıl İlan Edebilirim?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                sx={{
                  fontWeight: 400,
                  lineHeight: 1.6
                }}
              >
                1. Ana sayfada "Kayıp İlanı Ver" butonuna tıklayın.<br />
                2. Evcil hayvanınızın en son görüldüğü yer ve tarihi belirtin.<br />
                3. İletişim bilgilerinizi girin.<br />
                4. İlanı yayınlayın.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography 
                variant="h6"
                sx={{
                  fontWeight: 600,
                  letterSpacing: '0.3px'
                }}
              >
                Bulunan Bir Evcil Hayvanı Nasıl Bildirebilirim?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                sx={{
                  fontWeight: 400,
                  lineHeight: 1.6
                }}
              >
                1. Ana sayfada "Evcil Hayvan Buldum" butonuna tıklayın.<br />
                2. Bulduğunuz evcil hayvanın fotoğrafını yükleyin.<br />
                3. Bulunduğu konum ve tarihi belirtin.<br />
                4. Bildirimi gönderin.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography 
                variant="h6"
                sx={{
                  fontWeight: 600,
                  letterSpacing: '0.3px'
                }}
              >
                İletişim
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                sx={{
                  fontWeight: 400,
                  lineHeight: 1.6
                }}
              >
                E-posta: info@whereismypet.com<br />
                Telefon: +90 (212) XXX XX XX<br />
                Adres: İstanbul, Türkiye
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Paper>
      </Container>
    </Box>
  );
};

export default Help; 
import React from 'react';
import { Container, Typography, Box, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQ = () => {
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
            Sıkça Sorulan Sorular
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
                WhereIsMyPet nedir?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                sx={{
                  fontWeight: 400,
                  lineHeight: 1.6
                }}
              >
                WhereIsMyPet, kayıp evcil hayvanların bulunması ve sahiplerine kavuşturulması için tasarlanmış bir platformdur. 
                Evcil hayvan sahipleri ve bulunan evcil hayvanları bildiren kişiler arasında köprü görevi görür.
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
                Hizmet ücretli mi?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                sx={{
                  fontWeight: 400,
                  lineHeight: 1.6
                }}
              >
                Hayır, WhereIsMyPet platformu tamamen ücretsizdir. Evcil hayvanınızı kaydetmek, kayıp ilanı vermek veya 
                bulunan bir evcil hayvanı bildirmek için herhangi bir ücret ödemeniz gerekmez.
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
                Hangi tür evcil hayvanlar için kullanılabilir?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                sx={{
                  fontWeight: 400,
                  lineHeight: 1.6
                }}
              >
                Platformumuz kedi, köpek, kuş, hamster, tavşan gibi tüm evcil hayvanlar için kullanılabilir. 
                Her türlü evcil hayvanın kaydını yapabilir ve kayıp ilanı verebilirsiniz.
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
                İlanlar ne kadar süreyle aktif kalır?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                sx={{
                  fontWeight: 400,
                  lineHeight: 1.6
                }}
              >
                Kayıp evcil hayvan ilanları 30 gün süreyle aktif kalır. Bu süre sonunda ilan otomatik olarak arşivlenir. 
                Ancak evcil hayvanınızı bulamadıysanız, ilanı yenileyebilirsiniz.
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
                Verilerim güvende mi?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                sx={{
                  fontWeight: 400,
                  lineHeight: 1.6
                }}
              >
                Evet, tüm verileriniz KVKK kapsamında güvenle saklanmaktadır. Kişisel bilgileriniz üçüncü taraflarla 
                paylaşılmaz ve sadece evcil hayvanınızı bulmak için gerekli olan kişilerle iletişim kurulur.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Paper>
      </Container>
    </Box>
  );
};

export default FAQ; 
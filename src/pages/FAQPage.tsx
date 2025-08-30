import React, { useState } from 'react';
import { Box, Typography, Container, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './FAQPage.css';

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

const StyledAccordion = styled(Accordion)({
  marginBottom: '16px',
  borderRadius: '8px !important',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: '0 0 16px 0',
  },
});

const FAQPage: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqs = [
    {
      question: "WhereIsMyPet nedir?",
      answer: "WhereIsMyPet, kayıp hayvanların sahiplerine kavuşmasını sağlamak için kurulmuş bir platformdur. Kayıp hayvan ilanı verebilir, bulunan hayvanları görüntüleyebilir ve hayvanseverler arasında iletişim kurabilirsiniz."
    },
    {
      question: "Nasıl ilan verebilirim?",
      answer: "İlan vermek için öncelikle üye olmanız gerekmektedir. Üye olduktan sonra 'İlan Ver' butonuna tıklayarak kayıp hayvanınızın fotoğrafını, konumunu ve diğer detaylarını içeren bir ilan oluşturabilirsiniz."
    },
    {
      question: "İlanımı nasıl düzenleyebilir veya silebilirim?",
      answer: "Profil sayfanızdan 'İlanlarım' bölümüne giderek ilanlarınızı görüntüleyebilir, düzenleyebilir veya silebilirsiniz. İlanınızı düzenlemek için ilgili ilanın yanındaki düzenle butonuna tıklamanız yeterlidir."
    },
    {
      question: "Kayıp hayvanımı buldum, ne yapmalıyım?",
      answer: "Kayıp hayvanınızı bulduğunuzda, ilanınızı 'Bulundu' olarak işaretleyebilirsiniz. Ayrıca, bulunan hayvanın sahibiyle iletişime geçmek için ilan üzerindeki iletişim bilgilerini kullanabilirsiniz."
    },
    {
      question: "Üyelik ücretli mi?",
      answer: "WhereIsMyPet platformu tamamen ücretsizdir. İlan vermek, ilanları görüntülemek ve diğer tüm özellikleri kullanmak için herhangi bir ücret ödemeniz gerekmez."
    },
    {
      question: "Gizlilik politikası nedir?",
      answer: "Kişisel bilgileriniz ve iletişim detaylarınız güvende tutulur. Sadece ilan verdiğinizde ve iletişim kurmak istediğinizde gerekli bilgiler paylaşılır. Detaylı bilgi için Gizlilik Politikamızı inceleyebilirsiniz."
    },
    {
      question: "Teknik destek alabilir miyim?",
      answer: "Evet, platformla ilgili herhangi bir sorun yaşadığınızda veya yardıma ihtiyacınız olduğunda 'Yardım' sayfasından bize ulaşabilirsiniz. En kısa sürede size yardımcı olmaya çalışacağız."
    }
  ];

  return (
    <Box className="faq-page">
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
            SIKÇA SORULAN SORULAR
          </Typography>
        </ContentBox>
      </HeroSection>

      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          {faqs.map((faq, index) => (
            <StyledAccordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: expanded === `panel${index}` ? '#f5f5f5' : 'white',
                  borderRadius: '8px',
                }}
              >
                <Typography variant="h6" sx={{ color: '#8B4513', fontFamily: 'Playfair Display, serif' }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.8 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </StyledAccordion>
          ))}
        </Paper>
      </Container>
    </Box>
  );
};

export default FAQPage; 
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { auth, db } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import VerifiedIcon from '@mui/icons-material/Verified';
import { sendEmailVerification } from 'firebase/auth';

interface VerificationModalProps {
  open: boolean;
  onClose: () => void;
  currentUser: any;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ open, onClose, currentUser }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
//Kullanıcı e posta adresini doğruladı mı
  useEffect(() => {
    if (currentUser) {
      setIsVerified(currentUser.emailVerified);
    }
  }, [currentUser]);
//Kullanıcı 60 saniye içinde doğruladı mı
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);
//firebase auth kullanarak mail yollama--e posta doğrulama işlemleri
  const handleSendVerification = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      //kullanıcı giriş yapmış mı
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Kullanıcı bulunamadı');
      }
      //kullanıcıya doğrulama maili yollar 
      await sendEmailVerification(user);
      
      setCountdown(60);
      setSuccess(true);
    } catch (err) {
      console.error('E-posta gönderme hatası:', err);
      //hatayı ekrana yazdırır
      setError('Doğrulama e-postası gönderilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'white',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#8B4513',
        color: 'white',
        textAlign: 'center',
        py: 2,
        fontSize: '1.5rem',
        fontWeight: 600
      }}>
        {isVerified ? 'Hesap Doğrulandı' : 'Hesap Doğrulama'}
      </DialogTitle>
      <DialogContent sx={{ p: 4, pt: 6 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 3
        }}>
          <VerifiedIcon sx={{ 
            fontSize: 60, 
            color: isVerified ? '#4CAF50' : '#8B4513',
            opacity: 0.8
          }} />

          {isVerified ? (
            <>
              <Typography sx={{ 
                color: '#666',
                textAlign: 'center',
                fontSize: '1.1rem'
              }}>
                Hesabınız başarıyla doğrulanmıştır.
              </Typography>
              <Alert severity="success" sx={{ width: '100%' }}>
                Hesabınız doğrulanmış durumda.
              </Alert>
            </>
          ) : (
            <>
              <Typography sx={{ 
                color: '#666',
                textAlign: 'center',
                fontSize: '1.1rem'
              }}>
                Hesabınızı doğrulamak için e-posta adresinize gönderilen bağlantıya tıklayınız.
              </Typography>

              {success && (
                <Alert severity="success" sx={{ width: '100%' }}>
                  Doğrulama e-postası gönderildi. Lütfen e-posta kutunuzu kontrol edin.
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ width: '100%' }}>
                  {error}
                </Alert>
              )}

              {countdown > 0 ? (
                <Typography sx={{ color: '#666' }}>
                  Yeni e-posta için {countdown} saniye bekleyin
                </Typography>
              ) : (
                <Button
                  onClick={handleSendVerification}
                  disabled={loading}
                  sx={{
                    color: '#8B4513',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'rgba(139, 69, 19, 0.05)'
                    }
                  }}
                >
                  Yeni E-posta Gönder
                </Button>
              )}
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        p: 3,
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        gap: 2
      }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            color: '#666',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.05)'
            }
          }}
        >
          Kapat
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerificationModal; 
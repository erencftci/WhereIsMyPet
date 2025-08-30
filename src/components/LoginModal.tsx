// React ve gerekli hook'ları import et
import React, { useState, useEffect } from 'react';
// Material-UI bileşenlerini import et
import { 
  Modal, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Tabs, 
  Tab,
  Paper,
  Link,
  CircularProgress
} from '@mui/material';
// Firebase authentication fonksiyonlarını import et
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
// Firebase yapılandırmasını ve Firestore'u import et
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
// Stil dosyasını import et
import './LoginModal.css';

// Tab panel bileşeni için prop tiplerini tanımla
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Tab panel bileşeni - seçili tab'a göre içeriği gösterir
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Ana LoginModal bileşeni
const LoginModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  // State tanımlamaları
  const [tabValue, setTabValue] = useState(0); // 0: Giriş, 1: Kayıt
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Kullanıcı oturum durumunu izle
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('Kullanıcı oturumu:', user);
      }
    });

    return () => unsubscribe();
  }, []);

  // Tab değişikliğini yönet
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError(null);
  };

  // Giriş işlemini yönet
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Önce mevcut oturumu kapat
      await signOut(auth);
      
      console.log('Giriş denemesi:', { email });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Giriş başarılı:', userCredential.user);
      
      // Token'ı yenile
      await userCredential.user.getIdToken(true);
      
      onClose();
    } catch (err: any) {
      console.error('Giriş hatası:', err);
      
      // Hata kodlarına göre kullanıcı dostu mesajlar göster
      switch (err.code) {
        case 'auth/invalid-login-credentials':
          setError('E-posta adresi veya şifre hatalı. Lütfen bilgilerinizi kontrol edin.');
          break;
        case 'auth/user-not-found':
          setError('Bu e-posta adresi ile kayıtlı bir hesap bulunamadı.');
          break;
        case 'auth/wrong-password':
          setError('Şifre hatalı. Lütfen şifrenizi kontrol edin.');
          break;
        case 'auth/too-many-requests':
          setError('Çok fazla başarısız giriş denemesi yaptınız. Lütfen bir süre bekleyin.');
          break;
        case 'auth/user-disabled':
          setError('Bu hesap devre dışı bırakılmış.');
          break;
        case 'auth/network-request-failed':
          setError('İnternet bağlantınızı kontrol edin ve tekrar deneyin.');
          break;
        default:
          setError(`Giriş yapılırken bir hata oluştu: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Kayıt işlemini yönet
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      //şifre sıfırlama 
      // Kullanıcı bilgilerini Firestore'a kaydet
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        createdAt: new Date()
      });

      onClose();
    } catch (error: any) {
      setError('Kayıt olurken bir hata oluştu: ' + error.message);
    }
  };

  // Şifre sıfırlama işlemini yönet
  const handleForgotPassword = async () => {
    if (!email) {
      setError('Lütfen e-posta adresinizi girin');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi');
      setError('');
    } catch (error: any) {
      setError('Şifre sıfırlama işlemi başarısız: ' + error.message);
      setSuccessMessage('');
    }
  };

  // Modal içeriğini render et
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="auth-modal-title"
      className="auth-modal"
    >
      <Box className="modal-container">
        <Paper elevation={3} className="modal-paper">
          {/* Logo container */}
          <Box className="logo-container">
            <img 
              src="/whereismypet.jpg" 
              alt="WhereIsMyPet Logo" 
              className="modal-logo"
            />
          </Box>

          {/* Tab'lar */}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            className="auth-tabs"
          >
            <Tab label="Giriş Yap" />
            <Tab label="Kayıt Ol" />
          </Tabs>

          {/* Hata mesajı */}
          {error && (
            <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}

          {/* Başarı mesajı */}
          {successMessage && (
            <Typography color="success" sx={{ mt: 2, textAlign: 'center', color: '#4CAF50' }}>
              {successMessage}
            </Typography>
          )}

          {/* Giriş formu */}
          <TabPanel value={tabValue} index={0}>
            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="E-posta"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                className="auth-input"
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Şifre"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                className="auth-input"
                disabled={loading}
              />
              <Box sx={{ textAlign: 'right', mt: 1 }}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={handleForgotPassword}
                  sx={{ color: '#8B4513', textDecoration: 'none' }}
                  disabled={loading}
                >
                  Şifremi Unuttum
                </Link>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="auth-button"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Giriş Yap'}
              </Button>
            </form>
          </TabPanel>

          {/* Kayıt formu */}
          <TabPanel value={tabValue} index={1}>
            <form onSubmit={handleRegister}>
              <TextField
                fullWidth
                label="Ad"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                margin="normal"
                required
                className="auth-input"
              />
              <TextField
                fullWidth
                label="Soyad"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                margin="normal"
                required
                className="auth-input"
              />
              <TextField
                fullWidth
                label="E-posta"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                className="auth-input"
              />
              <TextField
                fullWidth
                label="Şifre"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                className="auth-input"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="auth-button"
              >
                Kayıt Ol
              </Button>
            </form>
          </TabPanel>
        </Paper>
      </Box>
    </Modal>
  );
};

export default LoginModal;
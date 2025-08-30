import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Divider,
  Grid,
  Button,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CheckCircle, LocationOn, CalendarToday, ArrowBack, Report } from '@mui/icons-material';
import './ViewDetails.css';

interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  passportImageUrl?: string;
  location: {
    city: string;
    district: string;
    neighborhood: string;
    street: string;
  };
  createdAt: any;
  status: 'active' | 'found';
  userId: string;
  userName?: string;
  userPhotoURL?: string;
  userIsVerified?: boolean;
}

interface User {
  photoURL: string;
  displayName: string;
  isVerified: boolean;
}

const ViewDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    const fetchPostAndUser = async () => {
      try {
        if (!id) return;

        const postRef = doc(db, 'posts', id);
        const postDoc = await getDoc(postRef);

        if (!postDoc.exists()) {
          setError('İlan bulunamadı');
          setLoading(false);
          return;
        }

        const postData = { id: postDoc.id, ...postDoc.data() } as Post;
        setPost(postData);

        // Kullanıcı bilgilerini getir
        if (postData.userId) {
          const userRef = doc(db, 'users', postData.userId);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              photoURL: userData.photoURL || userData.photoUrl || '/default-avatar.png',
              displayName: userData.firstName && userData.lastName 
                ? `${userData.firstName} ${userData.lastName}`
                : userData.displayName || 'Anonim',
              isVerified: Boolean(userData.isVerified || userData.emailVerified || userData.email?.includes('@'))
            });
          }
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('İlan yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndUser();
  }, [id]);

  const handleReportSubmit = async () => {
    if (!post || !reportReason) return;

    try {
      // Burada şikayet işlemleri yapılacak
      console.log('Şikayet edilen ilan:', post.id);
      console.log('Şikayet nedeni:', reportReason);
      
      setReportDialogOpen(false);
      setReportReason('');
    } catch (err) {
      console.error('Şikayet gönderilirken hata:', err);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Tarih bilgisi yok';
    const date = timestamp.toDate();
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLocationString = (location: any) => {
    if (!location) return 'Konum bilgisi yok';
    const parts = [];
    if (location.street) parts.push(location.street);
    if (location.neighborhood) parts.push(location.neighborhood);
    if (location.district) parts.push(location.district);
    if (location.city) parts.push(location.city);
    return parts.join(', ');
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <Typography color="error">{error || 'İlan bulunamadı'}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box className="page-with-background">
      <img src="/catcut.png" alt="Peeking Cat" className="peeking-cat" />
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: 4, 
          mt: 8,
          minHeight: 'calc(100vh - 64px)', // Navbar yüksekliğini çıkarıyoruz
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <Box mb={2}>
          <IconButton 
            onClick={() => navigate(-1)} 
            sx={{ 
              color: '#8B4513',
              '&:hover': {
                bgcolor: 'rgba(139, 69, 19, 0.1)',
              }
            }}
          >
            <ArrowBack />
          </IconButton>
        </Box>

        <Paper elevation={3} sx={{ overflow: 'hidden' }}>
          <Grid container>
            {/* Sol taraf - Resim */}
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={post.imageUrl}
                alt={post.title}
                sx={{
                  width: '100%',
                  height: '500px',
                  objectFit: 'cover',
                  borderRadius: 1
                }}
              />
            </Grid>

            {/* Sağ taraf - Detaylar */}
            <Grid item xs={12} md={6}>
              <Box p={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Kullanıcı Bilgileri */}
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar
                    src={user?.photoURL}
                    alt={user?.displayName}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="h6" component="span" sx={{ mr: 1 }}>
                          {user?.displayName}
                        </Typography>
                        {user?.isVerified && (
                          <CheckCircle 
                            sx={{ 
                              fontSize: 20,
                              color: '#1976d2',
                              verticalAlign: 'middle'
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(post.createdAt)}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* İlan Detayları */}
                <Typography variant="h5" gutterBottom>
                  {post.title}
                </Typography>

                <Typography variant="body1" paragraph>
                  {post.description}
                </Typography>

                <Box mt={3}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <LocationOn color="primary" />
                    <Typography variant="body1" fontWeight="bold">
                      {getLocationString(post.location)}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarToday color="primary" />
                    <Typography variant="body1">
                      {formatDate(post.createdAt)}
                    </Typography>
                  </Box>
                </Box>

                {/* Pasaport Fotoğrafı */}
                {post.passportImageUrl && (
                  <Box mt={3}>
                    <Typography variant="h6" gutterBottom>
                      Hayvan Pasaportu
                    </Typography>
                    <Box
                      component="img"
                      src={post.passportImageUrl}
                      alt="Hayvan Pasaportu"
                      sx={{
                        width: '100%',
                        height: '300px',
                        objectFit: 'cover',
                        borderRadius: 1
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Şikayet Dialog */}
        <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)}>
          <DialogTitle>İlanı Şikayet Et</DialogTitle>
          <DialogContent>
            <FormControl component="fieldset">
              <RadioGroup
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              >
                <FormControlLabel
                  value="commercial"
                  control={<Radio />}
                  label="Ticari Amaç"
                />
                <FormControlLabel
                  value="inappropriate"
                  control={<Radio />}
                  label="Uygunsuz İçerik"
                />
                <FormControlLabel
                  value="spam"
                  control={<Radio />}
                  label="Spam"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="Diğer"
                />
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReportDialogOpen(false)}>İptal</Button>
            <Button onClick={handleReportSubmit} color="primary">
              Gönder
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ViewDetails; 
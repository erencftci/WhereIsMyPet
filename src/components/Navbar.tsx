import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  TextField
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { collection, getDocs, doc, getDoc, updateDoc, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import MenuIcon from '@mui/icons-material/Menu';
import LoginModal from './LoginModal';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PetsIcon from '@mui/icons-material/Pets';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import VerifiedIcon from '@mui/icons-material/Verified';
import DeleteIcon from '@mui/icons-material/Delete';
import VerificationModal from './VerificationModal';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const [isProfilePhotoModalOpen, setIsProfilePhotoModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsSnapshot = await getDocs(collection(db, 'posts'));
        setTotalPosts(postsSnapshot.size);
      } catch (error) {
        console.error('İlanlar yüklenirken hata oluştu:', error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setCurrentUser({ ...user, ...userDoc.data() });
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsDrawerOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const menuItems = [
    { text: 'Hakkımızda', path: '/about', icon: <InfoIcon /> },
    { text: 'Sıkça Sorulan Sorular', path: '/faq', icon: <QuestionAnswerIcon /> },
    { text: 'Yardım', path: '/help', icon: <HelpIcon /> },
    { text: 'Bağış', path: '/donation', icon: <FavoriteIcon /> }
  ];

  const handleMyPostsClick = () => {
    setIsDrawerOpen(false);
    navigate('/my-posts');
  };

  const handleProfilePhotoChange = async () => {
    if (!selectedFile || !currentUser) return;

    setUploading(true);
    setError(null);
    //cloudinary kodları
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', 'whereismypet_profiles');
      formData.append('api_key', 'YOUR_API_KEY');
      formData.append('api_secret', 'YOUR_API_SECRET');
      formData.append('cloud_name', 'YOUR_CLOUD_NAME');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Fotoğraf yüklenirken bir hata oluştu');
      }

      const data = await response.json();
      
      // Kullanıcı dokümanını kontrol et ve güncelle
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Kullanıcı dokümanı yoksa oluştur
        await setDoc(userDocRef, {
          firstName: currentUser.firstName || '',
          lastName: currentUser.lastName || '',
          email: currentUser.email,
          photoURL: data.secure_url,
          createdAt: new Date()
        });
      } else {
        // Kullanıcı dokümanı varsa güncelle
        await updateDoc(userDocRef, {
          photoURL: data.secure_url
        });
      }

      // Kullanıcı state'ini güncelle
      setCurrentUser({
        ...currentUser,
        photoURL: data.secure_url
      });

      setIsProfilePhotoModalOpen(false);
      setSelectedFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    
    setIsDeleting(true);
    setDeleteError(null);

    try {
      // Kullanıcının tüm ilanlarını sil
      const postsQuery = query(collection(db, 'posts'), where('userId', '==', currentUser.uid));
      const postsSnapshot = await getDocs(postsQuery);
      const deletePostPromises = postsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePostPromises);

      // Kullanıcının yorumlarını sil
      const commentsQuery = query(collection(db, 'comments'), where('userId', '==', currentUser.uid));
      const commentsSnapshot = await getDocs(commentsQuery);
      const deleteCommentPromises = commentsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteCommentPromises);

      // Kullanıcının bildirimlerini sil
      const notificationsQuery = query(collection(db, 'notifications'), where('userId', '==', currentUser.uid));
      const notificationsSnapshot = await getDocs(notificationsQuery);
      const deleteNotificationPromises = notificationsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteNotificationPromises);

      // Kullanıcı dokümanını sil
      await deleteDoc(doc(db, 'users', currentUser.uid));

      // Firebase Auth'dan kullanıcıyı sil
      const user = auth.currentUser;
      if (user) {
        await deleteUser(user);
      }

      // Tüm state'leri sıfırla
      setCurrentUser(null);
      setProfileMenuAnchor(null);
      setIsDeleteModalOpen(false);
      setIsDrawerOpen(false);

      // Ana sayfaya yönlendir
      navigate('/');
    } catch (error: any) {
      console.error('Hesap silme hatası:', error);
      setDeleteError('Hesap silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AppBar position="fixed" className="navbar">
      <Toolbar sx={{ height: '100px', padding: '0 24px' }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          position: 'absolute',
          left: '24px'
        }}>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#F5DEB3',
              fontSize: '1.2rem',
              fontWeight: 500
            }}
          >
            TOPLAM İLAN: {totalPosts}
          </Typography>
        </Box>

        <Box sx={{ 
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)'
        }}>
          <Link to="/" className="logo-link">
            <img 
              src="/whereismypet.jpg" 
              alt="WhereIsMyPet Logo" 
              className="navbar-logo"
            />
          </Link>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1, sm: 2 },
          position: 'absolute',
          right: '24px'
        }}>
          {!currentUser && (
            <Button 
              className="nav-button login-button"
              onClick={() => setIsLoginModalOpen(true)}
            >
              GİRİŞ YAP
            </Button>
          )}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={() => setIsDrawerOpen(true)}
            className="menu-button"
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        className="drawer"
      >
        <List>
          {currentUser && (
            <>
              <ListItem 
                button 
                onClick={handleProfileClick}
                className="drawer-item"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  padding: '16px 24px'
                }}
              >
                <Avatar 
                  src={currentUser?.photoURL}
                  sx={{ 
                    bgcolor: currentUser?.photoURL ? 'transparent' : '#8B4513',
                    width: 40,
                    height: 40,
                    fontSize: '1.2rem',
                    fontWeight: 600
                  }}
                >
                  {!currentUser?.photoURL && currentUser?.firstName?.[0]?.toUpperCase()}
                </Avatar>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#F5DEB3', opacity: 0.8, fontWeight: 600 }}>
                      Hoş geldiniz,
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#F5DEB3', fontWeight: 700 }}>
                      {currentUser?.firstName} {currentUser?.lastName}
                    </Typography>
                  </Box>
                  {currentUser?.emailVerified && (
                    <VerifiedIcon sx={{ 
                      color: '#2196F3',
                      fontSize: '1.2rem'
                    }} />
                  )}
                </Box>
              </ListItem>
              <Divider sx={{ bgcolor: 'rgba(245, 222, 179, 0.1)' }} />
            </>
          )}
          
          {currentUser && (
            <ListItem 
              button 
              onClick={handleMyPostsClick}
              className="drawer-item"
            >
              <ListItemIcon>
                <PetsIcon sx={{ color: '#F5DEB3' }} />
              </ListItemIcon>
              <ListItemText 
                primary="İlanlarım"
                primaryTypographyProps={{
                  style: { color: '#F5DEB3', fontWeight: 600 }
                }}
              />
            </ListItem>
          )}

          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text}
              component={Link}
              to={item.path}
              onClick={() => setIsDrawerOpen(false)}
              className="drawer-item"
            >
              <ListItemIcon>
                {React.cloneElement(item.icon, { sx: { color: '#F5DEB3' } })}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  style: { color: '#F5DEB3', fontWeight: 600 }
                }}
              />
            </ListItem>
          ))}
        </List>

        {currentUser && (
          <Box sx={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0,
            borderTop: '1px solid rgba(245, 222, 179, 0.1)'
          }}>
            <ListItem 
              button 
              onClick={handleLogout}
              className="drawer-item logout-item"
            >
              <ListItemIcon>
                <LogoutIcon sx={{ color: '#F5DEB3' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Çıkış Yap"
                primaryTypographyProps={{
                  style: { color: '#F5DEB3', fontWeight: 600 }
                }}
              />
            </ListItem>
          </Box>
        )}
      </Drawer>

      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        className="profile-menu"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(139, 69, 19, 0.35)',
            backdropFilter: 'blur(5px)',
            color: '#F5DEB3',
            '& .MuiMenuItem-root': {
              padding: '12px 24px',
              '&:hover': {
                bgcolor: 'rgba(245, 222, 179, 0.1)',
              },
            },
          },
        }}
      >
        <MenuItem onClick={() => {
          handleProfileMenuClose();
          setIsProfilePhotoModalOpen(true);
        }}>
          <ListItemIcon>
            <PhotoCameraIcon sx={{ color: '#F5DEB3' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Profil Fotoğrafı Değiştir"
            primaryTypographyProps={{
              style: { color: '#F5DEB3', fontWeight: 600 }
            }}
          />
        </MenuItem>
        <MenuItem onClick={() => {
          handleProfileMenuClose();
          setIsVerificationModalOpen(true);
        }}>
          <ListItemIcon>
            <VerifiedIcon sx={{ color: '#F5DEB3' }} />
          </ListItemIcon>
          <ListItemText 
            primary={currentUser?.isVerified ? "Hesabım Doğrulandı" : "Hesabımı Doğrula"}
            primaryTypographyProps={{
              style: { color: '#F5DEB3', fontWeight: 600 }
            }}
          />
        </MenuItem>
        <Divider sx={{ bgcolor: 'rgba(245, 222, 179, 0.1)' }} />
        <MenuItem 
          onClick={() => {
            handleProfileMenuClose();
            setIsDeleteModalOpen(true);
          }} 
          sx={{ color: '#ff6b6b' }}
        >
          <ListItemIcon>
            <DeleteIcon sx={{ color: '#ff6b6b' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Hesabımı Sil"
            primaryTypographyProps={{
              style: { color: '#ff6b6b', fontWeight: 600 }
            }}
          />
        </MenuItem>
      </Menu>

      <Dialog
        open={isProfilePhotoModalOpen}
        onClose={() => !uploading && setIsProfilePhotoModalOpen(false)}
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
          Profil Fotoğrafı Değiştir
        </DialogTitle>
        <DialogContent sx={{ 
          p: 4,
          pt: 8
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 3,
            mt: 4
          }}>
            <Box sx={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              border: '3px dashed #8B4513',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(139, 69, 19, 0.05)',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {selectedFile ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <PhotoCameraIcon sx={{ 
                  fontSize: 60, 
                  color: '#8B4513',
                  opacity: 0.5
                }} />
              )}
            </Box>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="profile-photo-input"
            />
            <label htmlFor="profile-photo-input">
              <Button
                variant="contained"
                component="span"
                sx={{
                  bgcolor: '#8B4513',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#654321',
                  },
                }}
              >
                Fotoğraf Seç
              </Button>
            </label>

            {selectedFile && (
              <Typography sx={{ 
                color: '#666',
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                Seçilen dosya: {selectedFile.name}
              </Typography>
            )}

            {error && (
              <Typography sx={{ 
                color: '#d32f2f',
                bgcolor: 'rgba(211, 47, 47, 0.1)',
                p: 1.5,
                borderRadius: '8px',
                textAlign: 'center',
                width: '100%'
              }}>
                {error}
              </Typography>
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
            onClick={() => setIsProfilePhotoModalOpen(false)}
            disabled={uploading}
            sx={{
              color: '#666',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.05)'
              }
            }}
          >
            İptal
          </Button>
          <Button
            onClick={handleProfilePhotoChange}
            disabled={!selectedFile || uploading}
            variant="contained"
            sx={{
              bgcolor: '#8B4513',
              color: 'white',
              px: 4,
              py: 1,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#654321',
              },
              '&:disabled': {
                bgcolor: 'rgba(139, 69, 19, 0.5)',
                color: 'white'
              }
            }}
          >
            {uploading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Yükle'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <VerificationModal
        open={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        currentUser={currentUser}
      />

      <LoginModal 
        open={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />

      <Dialog
        open={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
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
          bgcolor: '#ff6b6b',
          color: 'white',
          textAlign: 'center',
          py: 2,
          fontSize: '1.5rem',
          fontWeight: 600
        }}>
          Hesap Silme Onayı
        </DialogTitle>
        <DialogContent sx={{ p: 4, pt: 6 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 3
          }}>
            <DeleteIcon sx={{ 
              fontSize: 60, 
              color: '#ff6b6b',
              opacity: 0.8
            }} />

            <Typography sx={{ 
              color: '#666',
              textAlign: 'center',
              fontSize: '1.1rem'
            }}>
              Hesabınızı silmek üzeresiniz. Bu işlem geri alınamaz!
            </Typography>

            <Typography sx={{ 
              color: '#ff6b6b',
              textAlign: 'center',
              fontSize: '1rem',
              fontWeight: 600
            }}>
              Tüm ilanlarınız ve verileriniz kalıcı olarak silinecektir.
            </Typography>

            {deleteError && (
              <Alert severity="error" sx={{ width: '100%' }}>
                {deleteError}
              </Alert>
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
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={isDeleting}
            sx={{
              color: '#666',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.05)'
              }
            }}
          >
            İptal
          </Button>
          <Button
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            variant="contained"
            sx={{
              bgcolor: '#ff6b6b',
              color: 'white',
              px: 4,
              py: 1,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#ff5252',
              },
              '&:disabled': {
                bgcolor: 'rgba(255, 107, 107, 0.5)',
                color: 'white'
              }
            }}
          >
            {isDeleting ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Hesabımı Sil'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Navbar; 
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material';
import { db } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, orderBy, getDoc } from 'firebase/firestore';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { locationService } from '../services/locationService';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import './MyPosts.css';

interface Location {
  id: number;
  name: string;
}

interface City extends Location {
  districts: District[];
}

interface District extends Location {
  neighborhoods: Neighborhood[];
}

interface Neighborhood extends Location {}

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
}

interface EditFormData {
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
}

const MyPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    title: '',
    description: '',
    imageUrl: '',
    passportImageUrl: '',
    location: {
      city: '',
      district: '',
      neighborhood: '',
      street: '',
    },
  });
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const navigate = useNavigate();
  const [imageLoading, setImageLoading] = useState(false);
  const [passportLoading, setPassportLoading] = useState(false);
  const [tempImagePreview, setTempImagePreview] = useState<string | null>(null);
  const [tempPassportPreview, setTempPassportPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/login');
          return;
        }

        const postsQuery = query(
          collection(db, 'posts'),
          where('userId', '==', user.uid)
        );

        const querySnapshot = await getDocs(postsQuery);
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[];

        // Sıralamayı client tarafında yapıyoruz
        postsData.sort((a, b) => {
          const dateA = a.createdAt?.toDate() || new Date(0);
          const dateB = b.createdAt?.toDate() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });

        setPosts(postsData);
      } catch (err) {
        setError('İlanlar yüklenirken bir hata oluştu');
        console.error('İlanlar yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [navigate]);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const citiesData = await locationService.getCities();
        setCities(citiesData || []);
      } catch (error) {
        console.error('Şehirler yüklenirken hata:', error);
      }
    };

    loadCities();
  }, []);

  const loadDistricts = async (cityId: number) => {
    try {
      const districtsData = await locationService.getDistricts(cityId);
      setDistricts(districtsData || []);
      setNeighborhoods([]);
    } catch (error) {
      console.error('İlçeler yüklenirken hata:', error);
    }
  };

  const loadNeighborhoods = async (districtId: number) => {
    try {
      const neighborhoodsData = await locationService.getNeighborhoods(districtId);
      setNeighborhoods(neighborhoodsData || []);
    } catch (error) {
      console.error('Mahalleler yüklenirken hata:', error);
    }
  };

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    try {
      await deleteDoc(doc(db, 'posts', postToDelete));
      setPosts(posts.filter(post => post.id !== postToDelete));
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    } catch (err) {
      setError('İlan silinirken bir hata oluştu');
      console.error('İlan silme hatası:', err);
    }
  };

  const handleEditClick = (post: Post) => {
    setEditingPostId(post.id);
    setEditFormData({
      title: post.title,
      description: post.description,
      imageUrl: post.imageUrl,
      passportImageUrl: post.passportImageUrl,
      location: { ...post.location },
    });

    // İl ve ilçe seçimlerini yükle
    const selectedCity = cities.find(c => c.name === post.location.city);
    if (selectedCity) {
      loadDistricts(selectedCity.id);
      const selectedDistrict = districts.find(d => d.name === post.location.district);
      if (selectedDistrict) {
        loadNeighborhoods(selectedDistrict.id);
      }
    }
  };

  const handleEditSubmit = async (postId: string) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        title: editFormData.title,
        description: editFormData.description,
        imageUrl: editFormData.imageUrl,
        passportImageUrl: editFormData.passportImageUrl,
        location: editFormData.location,
      });

      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, ...editFormData }
          : post
      ));

      setEditingPostId(null);
    } catch (err) {
      setError('İlan güncellenirken bir hata oluştu');
      console.error('İlan güncelleme hatası:', err);
    }
  };

  const handleEditCancel = () => {
    setEditingPostId(null);
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

  const getLocationString = (location: Post['location']) => {
    if (!location) return 'Konum bilgisi yok';
    return `${location.street}, ${location.neighborhood}, ${location.district}, ${location.city}`;
  };

  const handleStatusUpdate = async (postId: string, newStatus: 'active' | 'found') => {
    try {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      
      if (!postDoc.exists()) {
        setError('İlan bulunamadı');
        return;
      }

      const postData = postDoc.data();
      if (postData.userId !== user.uid) {
        setError('Bu işlem için yetkiniz yok');
        return;
      }

      await updateDoc(postRef, {
        status: newStatus
      });

      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, status: newStatus }
          : post
      ));
    } catch (err) {
      setError('İlan durumu güncellenirken bir hata oluştu');
      console.error('İlan durumu güncelleme hatası:', err);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'passport') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const loading = type === 'main' ? setImageLoading : setPassportLoading;
    const preview = type === 'main' ? setTempImagePreview : setTempPassportPreview;
    loading(true);

    // Önizleme oluştur
    const reader = new FileReader();
    reader.onloadend = () => {
      preview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('REACT_APP_CLOUDINARY_PRESET', 'whereismypet');

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
      setEditFormData(prev => ({
        ...prev,
        [type === 'main' ? 'imageUrl' : 'passportImageUrl']: data.secure_url
      }));
    } catch (error) {
      console.error('Fotoğraf yükleme hatası:', error);
      setError('Fotoğraf yüklenirken bir hata oluştu');
    } finally {
      loading(false);
    }
  };

  if (loading) {
    return (
      <Box className="my-posts-container">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="my-posts-container">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box className="page-with-background">
      <img src="/catcut.png" alt="Peeking Cat" className="peeking-cat" />
      <Container maxWidth="lg" sx={{ py: 4, paddingTop: '150px' }}>
        <Typography 
          variant="h4" 
          sx={{
            color: '#8B4513',
            textAlign: 'center',
            marginBottom: '30px',
            fontWeight: 600
          }}
        >
          İlanlarım
        </Typography>

        <Box className="posts-grid">
          {posts.map((post) => (
            <Card key={post.id} className="post-card">
              <CardMedia
                component="img"
                className="card-media"
                image={post.imageUrl}
                alt={post.title}
              />
              <CardContent className="card-content">
                {editingPostId === post.id ? (
                  <Box className="edit-form">
                    <TextField
                      fullWidth
                      label="Başlık"
                      value={editFormData.title}
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Açıklama"
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                      multiline
                      rows={4}
                      margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Şehir</InputLabel>
                      <Select
                        value={editFormData.location.city}
                        onChange={(e) => {
                          const city = cities.find(c => c.name === e.target.value);
                          if (city) {
                            loadDistricts(city.id);
                            setEditFormData({
                              ...editFormData,
                              location: {
                                ...editFormData.location,
                                city: city.name,
                                district: '',
                                neighborhood: '',
                              },
                            });
                          }
                        }}
                      >
                        {cities.map((city) => (
                          <MenuItem key={city.id} value={city.name}>
                            {city.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>İlçe</InputLabel>
                      <Select
                        value={editFormData.location.district}
                        onChange={(e) => {
                          const district = districts.find(d => d.name === e.target.value);
                          if (district) {
                            loadNeighborhoods(district.id);
                            setEditFormData({
                              ...editFormData,
                              location: {
                                ...editFormData.location,
                                district: district.name,
                                neighborhood: '',
                              },
                            });
                          }
                        }}
                      >
                        {districts.map((district) => (
                          <MenuItem key={district.id} value={district.name}>
                            {district.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Mahalle</InputLabel>
                      <Select
                        value={editFormData.location.neighborhood}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          location: { ...editFormData.location, neighborhood: e.target.value },
                        })}
                      >
                        {neighborhoods.map((neighborhood) => (
                          <MenuItem key={neighborhood.id} value={neighborhood.name}>
                            {neighborhood.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      label="Sokak"
                      value={editFormData.location.street}
                      onChange={(e) => setEditFormData({
                        ...editFormData,
                        location: { ...editFormData.location, street: e.target.value },
                      })}
                      margin="normal"
                    />
                    <Box className="edit-form-actions">
                      <Button onClick={handleEditCancel} variant="outlined">
                        İptal
                      </Button>
                      <Button 
                        onClick={() => handleEditSubmit(post.id)}
                        variant="contained"
                        color="primary"
                      >
                        Kaydet
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Typography gutterBottom variant="h5" component="div">
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {post.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      <strong>Konum:</strong> {getLocationString(post.location)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Oluşturulma Tarihi:</strong> {formatDate(post.createdAt)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Durum:</strong> {post.status === 'active' ? 'Aktif' : 'Bulundu'}
                    </Typography>
                  </>
                )}
              </CardContent>
              {editingPostId !== post.id && (
                <Box className="card-actions">
                  {post.status === 'active' && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleStatusUpdate(post.id, 'found')}
                    >
                      Bulundu
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditClick(post)}
                  >
                    Düzenle
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteClick(post.id)}
                  >
                    Sil
                  </Button>
                </Box>
              )}
            </Card>
          ))}
        </Box>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>İlanı Sil</DialogTitle>
          <DialogContent>
            <Typography>
              Bu ilanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
            <Button onClick={handleDeleteConfirm} color="error">
              Sil
            </Button>
          </DialogActions>
        </Dialog>

        {/* Düzenleme Dialog */}
        <Dialog 
          open={editingPostId !== null} 
          onClose={handleEditCancel}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#FFF8DC',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(139, 69, 19, 0.15)'
            }
          }}
        >
          <DialogTitle sx={{ 
            bgcolor: '#8B4513', 
            color: '#F5DEB3',
            fontSize: '1.5rem',
            fontWeight: 600,
            py: 2,
            borderBottom: '1px solid rgba(245, 222, 179, 0.2)'
          }}>
            İlanı Düzenle
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Box component="form" sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography 
                      variant="subtitle1" 
                      gutterBottom
                      sx={{
                        color: '#8B4513',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        mb: 1
                      }}
                    >
                      Hayvan Fotoğrafı
                    </Typography>
                    <Box sx={{ position: 'relative', width: '100%', mb: 2 }}>
                      <Box
                        component="img"
                        src={tempImagePreview || editFormData.imageUrl}
                        alt="Hayvan"
                        sx={{
                          width: '100%',
                          height: '300px',
                          objectFit: 'contain',
                          borderRadius: '8px',
                          border: '1px solid rgba(139, 69, 19, 0.2)',
                          bgcolor: '#FFF8DC'
                        }}
                      />
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="main-photo-upload"
                        type="file"
                        onChange={(e) => handleImageUpload(e, 'main')}
                      />
                      <label htmlFor="main-photo-upload">
                        <IconButton
                          color="primary"
                          aria-label="upload picture"
                          component="span"
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            bgcolor: '#8B4513',
                            color: '#F5DEB3',
                            '&:hover': { 
                              bgcolor: '#654321',
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <PhotoCamera />
                        </IconButton>
                      </label>
                      {imageLoading && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'rgba(255, 255, 255, 0.7)',
                            borderRadius: '8px'
                          }}
                        >
                          <CircularProgress sx={{ color: '#8B4513' }} />
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography 
                      variant="subtitle1" 
                      gutterBottom
                      sx={{
                        color: '#8B4513',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        mb: 1
                      }}
                    >
                      Pasaport Fotoğrafı
                    </Typography>
                    <Box sx={{ position: 'relative', width: '100%', mb: 2 }}>
                      {(tempPassportPreview || editFormData.passportImageUrl) ? (
                        <Box
                          component="img"
                          src={tempPassportPreview || editFormData.passportImageUrl}
                          alt="Pasaport"
                          sx={{
                            width: '100%',
                            height: '300px',
                            objectFit: 'contain',
                            borderRadius: '8px',
                            border: '1px solid rgba(139, 69, 19, 0.2)',
                            bgcolor: '#FFF8DC'
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: '100%',
                            height: '300px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'rgba(245, 222, 179, 0.1)',
                            borderRadius: '8px',
                            border: '2px dashed rgba(139, 69, 19, 0.3)'
                          }}
                        >
                          <Typography sx={{ color: '#8B4513' }}>
                            Pasaport fotoğrafı yüklemek için tıklayın
                          </Typography>
                        </Box>
                      )}
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="passport-photo-upload"
                        type="file"
                        onChange={(e) => handleImageUpload(e, 'passport')}
                      />
                      <label htmlFor="passport-photo-upload">
                        <IconButton
                          color="primary"
                          aria-label="upload passport"
                          component="span"
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            bgcolor: '#8B4513',
                            color: '#F5DEB3',
                            '&:hover': { 
                              bgcolor: '#654321',
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <PhotoCamera />
                        </IconButton>
                      </label>
                      {passportLoading && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'rgba(255, 255, 255, 0.7)',
                            borderRadius: '8px'
                          }}
                        >
                          <CircularProgress sx={{ color: '#8B4513' }} />
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Başlık"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({
                      ...editFormData,
                      title: e.target.value
                    })}
                    fullWidth
                    required
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(139, 69, 19, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(139, 69, 19, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#8B4513',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(139, 69, 19, 0.7)',
                        '&.Mui-focused': {
                          color: '#8B4513',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Açıklama"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({
                      ...editFormData,
                      description: e.target.value
                    })}
                    fullWidth
                    required
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(139, 69, 19, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(139, 69, 19, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#8B4513',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(139, 69, 19, 0.7)',
                        '&.Mui-focused': {
                          color: '#8B4513',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel sx={{ 
                      color: 'rgba(139, 69, 19, 0.7)',
                      '&.Mui-focused': {
                        color: '#8B4513',
                      },
                    }}>İl</InputLabel>
                    <Select
                      value={editFormData.location.city}
                      onChange={(e) => {
                        const selectedCity = cities.find(c => c.name === e.target.value);
                        if (selectedCity) {
                          loadDistricts(selectedCity.id);
                        }
                        setEditFormData({
                          ...editFormData,
                          location: {
                            ...editFormData.location,
                            city: e.target.value,
                            district: '',
                            neighborhood: ''
                          }
                        });
                      }}
                      label="İl"
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(139, 69, 19, 0.3)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(139, 69, 19, 0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#8B4513',
                        },
                      }}
                    >
                      {cities.map(city => (
                        <MenuItem key={city.id} value={city.name}>
                          {city.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel sx={{ 
                      color: 'rgba(139, 69, 19, 0.7)',
                      '&.Mui-focused': {
                        color: '#8B4513',
                      },
                    }}>İlçe</InputLabel>
                    <Select
                      value={editFormData.location.district}
                      onChange={(e) => {
                        const selectedDistrict = districts.find(d => d.name === e.target.value);
                        if (selectedDistrict) {
                          loadNeighborhoods(selectedDistrict.id);
                        }
                        setEditFormData({
                          ...editFormData,
                          location: {
                            ...editFormData.location,
                            district: e.target.value,
                            neighborhood: ''
                          }
                        });
                      }}
                      label="İlçe"
                      disabled={!editFormData.location.city}
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(139, 69, 19, 0.3)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(139, 69, 19, 0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#8B4513',
                        },
                      }}
                    >
                      {districts.map(district => (
                        <MenuItem key={district.id} value={district.name}>
                          {district.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel sx={{ 
                      color: 'rgba(139, 69, 19, 0.7)',
                      '&.Mui-focused': {
                        color: '#8B4513',
                      },
                    }}>Mahalle</InputLabel>
                    <Select
                      value={editFormData.location.neighborhood}
                      onChange={(e) => setEditFormData({
                        ...editFormData,
                        location: {
                          ...editFormData.location,
                          neighborhood: e.target.value
                        }
                      })}
                      label="Mahalle"
                      disabled={!editFormData.location.district}
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(139, 69, 19, 0.3)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(139, 69, 19, 0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#8B4513',
                        },
                      }}
                    >
                      {neighborhoods.map(neighborhood => (
                        <MenuItem key={neighborhood.id} value={neighborhood.name}>
                          {neighborhood.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Sokak/Cadde"
                    value={editFormData.location.street}
                    onChange={(e) => setEditFormData({
                      ...editFormData,
                      location: {
                        ...editFormData.location,
                        street: e.target.value
                      }
                    })}
                    fullWidth
                    required
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(139, 69, 19, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(139, 69, 19, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#8B4513',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(139, 69, 19, 0.7)',
                        '&.Mui-focused': {
                          color: '#8B4513',
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: 'rgba(245, 222, 179, 0.2)' }}>
            <Button 
              onClick={handleEditCancel}
              variant="outlined"
              sx={{
                color: '#8B4513',
                borderColor: '#8B4513',
                '&:hover': {
                  borderColor: '#654321',
                  bgcolor: 'rgba(139, 69, 19, 0.1)',
                },
              }}
            >
              İptal
            </Button>
            <Button
              onClick={() => editingPostId && handleEditSubmit(editingPostId)}
              variant="contained"
              sx={{
                bgcolor: '#8B4513',
                color: '#F5DEB3',
                '&:hover': {
                  bgcolor: '#654321',
                },
              }}
            >
              Kaydet
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MyPosts; 
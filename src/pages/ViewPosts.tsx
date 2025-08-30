import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Box,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  FormControl as MuiFormControl,
  InputLabel,
  Avatar
} from '@mui/material';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit, where, getDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { DocumentData } from 'firebase/firestore';
import SearchIcon from '@mui/icons-material/Search';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import { CheckCircle, LocationOn, CalendarToday, Visibility } from '@mui/icons-material';
import './ViewPosts.css';
import { locationService } from '../services/locationService';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
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
  viewCount?: number;
}

interface City {
  id: number;
  name: string;
}

interface District {
  id: number;
  name: string;
}

interface Neighborhood {
  id: number;
  name: string;
}

interface User {
  photoURL: string;
  displayName: string;
  isVerified: boolean;
}

// Utility functions
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

const ViewPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsQuery = query(
          collection(db, 'posts'),
          orderBy('createdAt', 'desc'),
          limit(10)
        );

        const querySnapshot = await getDocs(postsQuery);
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[];

        setPosts(postsData);
      } catch (err) {
        setError('İlanlar yüklenirken bir hata oluştu');
        console.error('İlanlar yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const citiesData = await locationService.getCities();
        console.log('Loaded cities:', citiesData);
        setCities(citiesData);
      } catch (err) {
        console.error('Şehirler yüklenirken hata:', err);
        setCities([]);
      }
    };
    loadCities();
  }, []);

  useEffect(() => {
    const loadDistricts = async () => {
      if (selectedCity) {
        console.log('Selected city:', selectedCity);
        const city = cities.find(c => c.name === selectedCity);
        console.log('Found city:', city);
        if (city) {
          try {
            const districtsData = await locationService.getDistricts(city.id);
            console.log('Loaded districts:', districtsData);
            setDistricts(districtsData);
          } catch (err) {
            console.error('İlçeler yüklenirken hata:', err);
            setDistricts([]);
          }
        }
      } else {
        setDistricts([]);
      }
    };
    loadDistricts();
  }, [selectedCity, cities]);

  useEffect(() => {
    const loadNeighborhoods = async () => {
      if (selectedDistrict) {
        console.log('Selected district:', selectedDistrict);
        const district = districts.find(d => d.name === selectedDistrict);
        console.log('Found district:', district);
        if (district) {
          try {
            const neighborhoodsData = await locationService.getNeighborhoods(district.id);
            console.log('Loaded neighborhoods:', neighborhoodsData);
            setNeighborhoods(neighborhoodsData);
          } catch (err) {
            console.error('Mahalleler yüklenirken hata:', err);
            setNeighborhoods([]);
          }
        }
      } else {
        setNeighborhoods([]);
      }
    };
    loadNeighborhoods();
  }, [selectedDistrict, districts]);

  const handleReportClick = (postId: string) => {
    setSelectedPostId(postId);
    setReportDialogOpen(true);
  };

  const handleReportSubmit = async () => {
    if (!selectedPostId || !reportReason) return;

    try {
      // Burada şikayet verilerini Firestore'a kaydedebilirsiniz
      console.log('Şikayet edilen ilan:', selectedPostId);
      console.log('Şikayet nedeni:', reportReason);
      
      setReportDialogOpen(false);
      setSelectedPostId(null);
      setReportReason('');
    } catch (err) {
      console.error('Şikayet gönderilirken hata:', err);
    }
  };

  const handleFilterChange = (type: 'city' | 'district' | 'neighborhood', value: string) => {
    console.log(`Filter change: ${type} = ${value}`);
    switch (type) {
      case 'city':
        setSelectedCity(value);
        setSelectedDistrict('');
        setSelectedNeighborhood('');
        break;
      case 'district':
        setSelectedDistrict(value);
        setSelectedNeighborhood('');
        break;
      case 'neighborhood':
        setSelectedNeighborhood(value);
        break;
    }
  };

  const getFilteredAndSortedPosts = () => {
    let filtered = [...posts];

    // Arama terimine göre filtreleme
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.description.toLowerCase().includes(searchLower)
      );
    }

    // Filtreleme
    if (selectedCity) {
      filtered = filtered.filter(post => post.location.city === selectedCity);
    }
    if (selectedDistrict) {
      filtered = filtered.filter(post => post.location.district === selectedDistrict);
    }
    if (selectedNeighborhood) {
      filtered = filtered.filter(post => post.location.neighborhood === selectedNeighborhood);
    }

    // Sıralama
    filtered.sort((a, b) => {
      const dateA = a.createdAt?.toDate() || new Date(0);
      const dateB = b.createdAt?.toDate() || new Date(0);
      return sortOrder === 'newest' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });

    return filtered;
  };

  const filteredAndSortedPosts = getFilteredAndSortedPosts();

  if (loading) {
    return (
      <Box className="posts-container">
        <Typography variant="h5">Yükleniyor...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="posts-container">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box className="page-with-background">
      <img src="/catcut.png" alt="Peeking Cat" className="peeking-cat" />
      <Container maxWidth="lg" sx={{ py: 4, paddingTop: '170px' }}>
        <Box className="page-header">
          <Typography 
            variant="h4" 
            sx={{
              color: '#8B4513',
              textAlign: 'center',
              marginBottom: '30px',
              fontWeight: 600
            }}
          >
            İlanlar
          </Typography>
          
          <Box className="search-section">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="İlanlarda ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box className="filter-section">
            <Box className="filter-group">
              <FilterListIcon className="filter-icon" />
              <MuiFormControl className="filter-control">
                <InputLabel>İl</InputLabel>
                <Select
                  value={selectedCity}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  label="İl"
                >
                  <MenuItem value="">Tümü</MenuItem>
                  {cities.map(city => (
                    <MenuItem key={city.id} value={city.name}>{city.name}</MenuItem>
                  ))}
                </Select>
              </MuiFormControl>

              <MuiFormControl className="filter-control">
                <InputLabel>İlçe</InputLabel>
                <Select
                  value={selectedDistrict}
                  onChange={(e) => handleFilterChange('district', e.target.value)}
                  label="İlçe"
                  disabled={!selectedCity}
                >
                  <MenuItem value="">Tümü</MenuItem>
                  {districts.map(district => (
                    <MenuItem key={district.id} value={district.name}>{district.name}</MenuItem>
                  ))}
                </Select>
              </MuiFormControl>

              <MuiFormControl className="filter-control">
                <InputLabel>Mahalle</InputLabel>
                <Select
                  value={selectedNeighborhood}
                  onChange={(e) => handleFilterChange('neighborhood', e.target.value)}
                  label="Mahalle"
                  disabled={!selectedDistrict}
                >
                  <MenuItem value="">Tümü</MenuItem>
                  {neighborhoods.map(neighborhood => (
                    <MenuItem key={neighborhood.id} value={neighborhood.name}>{neighborhood.name}</MenuItem>
                  ))}
                </Select>
              </MuiFormControl>
            </Box>

            <Box className="sort-group">
              <SortIcon className="sort-icon" />
              <MuiFormControl className="sort-control">
                <InputLabel>Sırala</InputLabel>
                <Select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  label="Sırala"
                >
                  <MenuItem value="newest">En Yeni</MenuItem>
                  <MenuItem value="oldest">En Eski</MenuItem>
                </Select>
              </MuiFormControl>
            </Box>
          </Box>
        </Box>

        {filteredAndSortedPosts.length === 0 ? (
          <Typography variant="h6">Aramanızla eşleşen ilan bulunamadı.</Typography>
        ) : (
          <Box className="posts-grid">
            {filteredAndSortedPosts.map((post) => (
              <PostCard key={post.id} post={post} onReport={handleReportClick} />
            ))}
          </Box>
        )}

        <Dialog 
          open={reportDialogOpen} 
          onClose={() => setReportDialogOpen(false)}
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
            fontSize: '1.25rem',
            fontWeight: 600,
            py: 2,
            borderBottom: '1px solid rgba(245, 222, 179, 0.2)'
          }}>
            İlanı Şikayet Et
          </DialogTitle>
          <DialogContent sx={{ p: 3, mt: 1 }}>
            <FormControl component="fieldset">
              <RadioGroup
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                sx={{
                  '& .MuiRadio-root': {
                    color: 'rgba(139, 69, 19, 0.6)',
                    '&.Mui-checked': {
                      color: '#8B4513',
                    }
                  },
                  '& .MuiFormControlLabel-label': {
                    color: '#8B4513',
                    fontSize: '1rem'
                  }
                }}
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
          <DialogActions sx={{ p: 3, bgcolor: 'rgba(245, 222, 179, 0.2)' }}>
            <Button 
              onClick={() => setReportDialogOpen(false)}
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
              onClick={handleReportSubmit}
              variant="contained"
              sx={{
                bgcolor: '#8B4513',
                color: '#F5DEB3',
                '&:hover': {
                  bgcolor: '#654321',
                },
              }}
            >
              Tamam
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

const PostCard = ({ post, onReport }: { post: Post; onReport: (postId: string) => void }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (post.userId) {
        try {
          console.log('Fetching user data for ID:', post.userId);
          const userRef = doc(db, 'users', post.userId);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('Raw user data:', userData);
            
            // Firestore'daki users koleksiyonundan kullanıcı verilerini al
            const userInfo = {
              photoURL: userData.photoURL || userData.photoUrl || '/default-avatar.png',
              displayName: userData.firstName && userData.lastName 
                ? `${userData.firstName} ${userData.lastName}`
                : userData.displayName || 'Anonim',
              isVerified: true // Test için true yapıyoruz
            };
            
            console.log('Processed user info:', userInfo);
            setUser(userInfo);
          } else {
            console.log('User document not found for ID:', post.userId);
            setUser({
              photoURL: post.userPhotoURL || '/default-avatar.png',
              displayName: post.userName || 'Anonim',
              isVerified: true // Test için true yapıyoruz
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser({
            photoURL: post.userPhotoURL || '/default-avatar.png',
            displayName: post.userName || 'Anonim',
            isVerified: true // Test için true yapıyoruz
          });
        }
      }
    };
    fetchUser();
  }, [post.userId, post.userName, post.userPhotoURL, post.userIsVerified]);

  const handlePostClick = async () => {
    try {
      // İlan görüntülenme sayısını artır
      const postRef = doc(db, 'posts', post.id);
      await updateDoc(postRef, {
        viewCount: increment(1)
      });
      
      // İlan detayına yönlendir
      navigate(`/post/${post.id}`);
    } catch (error) {
      console.error('Error updating view count:', error);
      // Hata olsa bile kullanıcıyı ilana yönlendir
      navigate(`/post/${post.id}`);
    }
  };

  return (
    <Card className="post-card">
      <CardMedia
        component="img"
        image={post.imageUrl}
        alt={post.title}
        onClick={handlePostClick}
        style={{ cursor: 'pointer' }}
      />
      <CardContent sx={{ position: 'relative', pt: 3 }}>
        <Box sx={{ width: '100%' }}>
          {post.status === 'found' && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 16,
                backgroundColor: '#4caf50',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '4px',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                zIndex: 1,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Bulundu
            </Box>
          )}
          <div className="user-info" style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <Avatar
              src={user?.photoURL}
              alt={user?.displayName}
              className="user-avatar"
              sx={{ width: 40, height: 40, marginRight: '8px' }}
            />
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {user?.displayName}
              </Typography>
              {user?.isVerified && (
                <CheckCircle 
                  sx={{ 
                    fontSize: 16,
                    color: '#1976d2'
                  }}
                />
              )}
            </Box>
          </div>
          <div className="post-content">
            <h3 className="post-title">{post.title}</h3>
            <p className="post-description">{post.description}</p>
            <div className="post-details" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="post-detail" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <LocationOn fontSize="small" />
                <Typography sx={{ fontWeight: 'bold' }}>
                  {getLocationString(post.location)}
                </Typography>
              </div>
              <div className="post-detail" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CalendarToday fontSize="small" />
                <Typography>
                  {formatDate(post.createdAt)}
                </Typography>
              </div>
            </div>
          </div>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            alignItems: 'center', 
            gap: '9px',
            mt: -2,
            mb: -1
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: 'text.secondary',
              fontSize: '0.875rem'
            }}>
              <Visibility sx={{ fontSize: 20 }} />
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {post.viewCount || 0}
              </Typography>
            </Box>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onReport(post.id);
              }}
              sx={{
                padding: '4px',
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'rgba(211, 47, 47, 0.04)'
                }
              }}
              size="small"
            >
              <ErrorOutlineIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ViewPosts; 
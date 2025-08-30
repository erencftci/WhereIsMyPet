import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl as MuiFormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { locationService } from '../services/locationService';
import './PostForm.css';

interface Location {
  city: string;
  district: string;
  neighborhood: string;
  street: string;
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

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [passportImage, setPassportImage] = useState<File | null>(null);
  const [passportImagePreview, setPassportImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState<Location>({
    city: '',
    district: '',
    neighborhood: '',
    street: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
//Kullanıcı oturumunu kontrol eder:
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        //Giriş yapılmamışsa /login sayfasına yönlendirir.
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);
// Şehirleri yükler:
  useEffect(() => {
    const loadCities = async () => {
      const citiesData = await locationService.getCities();
      setCities(citiesData);
    };
    loadCities();
  }, []);
// Şehre göre ilçeleri yükler:
  useEffect(() => {
    const loadDistricts = async () => {
      if (location.city) {
        const city = cities.find(c => c.name === location.city);
        if (city) {
          const districtsData = await locationService.getDistricts(city.id);
          setDistricts(districtsData);
        }
      } else {
        setDistricts([]);
      }
    };
    loadDistricts();
  }, [location.city, cities]);
// İlçeye göre mahalleleri yükler:
  useEffect(() => {
    const loadNeighborhoods = async () => {
      if (location.district) {
        const district = districts.find(d => d.name === location.district);
        if (district) {
          const neighborhoodsData = await locationService.getNeighborhoods(district.id);
          setNeighborhoods(neighborhoodsData);
        }
      } else {
        setNeighborhoods([]);
      }
    };
    loadNeighborhoods();
  }, [location.district, districts]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Preview oluştur
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePassportImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPassportImage(file);
      
      // Preview oluştur
      const reader = new FileReader();
      reader.onloadend = () => {
        setPassportImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
//Form gönderildiğinde çalışan ana fonksiyon:
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!user) {
      setError('Lütfen giriş yapın');
      setLoading(false);
      return;
    }

    if (!image) {
      setError('Lütfen hayvanın fotoğrafını yükleyin');
      setLoading(false);
      return;
    }

    if (!passportImage) {
      setError('Lütfen hayvan pasaportu fotoğrafını yükleyin');
      setLoading(false);
      return;
    }

    try {
      let imageUrl = '';
      let passportImageUrl = '';

      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 'whereismypet');
        //Cloudinary API’sine görsel yüklemek için kullanılır
        console.log('Uploading pet image to Cloudinary...');
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Cloudinary Error:', errorData);
          throw new Error(`Görsel yüklenirken bir hata oluştu: ${errorData.error?.message || 'Bilinmeyen hata'}`);
        }

        const data = await response.json();
        console.log('Pet image uploaded successfully:', data);
        imageUrl = data.secure_url;
      }

      if (passportImage) {
        const formData = new FormData();
        formData.append('file', passportImage);
        formData.append('upload_preset', 'whereismypet');

        console.log('Uploading passport image to Cloudinary...');
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Cloudinary Error:', errorData);
          throw new Error(`Pasaport fotoğrafı yüklenirken bir hata oluştu: ${errorData.error?.message || 'Bilinmeyen hata'}`);
        }

        const data = await response.json();
        console.log('Passport image uploaded successfully:', data);
        passportImageUrl = data.secure_url;
      }

      const postData = {
        title,
        description,
        imageUrl,
        passportImageUrl,
        location,
        userId: user.uid,
        createdAt: serverTimestamp(),
        status: 'active',
      };

      await addDoc(collection(db, 'posts'), postData);
      navigate('/my-posts');
    } catch (err) {
      console.error('Post creation error:', err);
      setError(err instanceof Error ? err.message : 'İlan oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="page-with-background">
      <Box className="post-form-container">
        <Typography variant="h4" className="form-title">
          Yeni İlan Oluştur
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit} className="post-form">
          <TextField
            label="Başlık"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            className="form-control"
          />

          <TextField
            label="Açıklama"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            fullWidth
            multiline
            rows={4}
            className="form-control"
          />

          <MuiFormControl className="form-control">
            <InputLabel>İl</InputLabel>
            <Select
              value={location.city}
              onChange={(e) => setLocation({ ...location, city: e.target.value, district: '', neighborhood: '' })}
              label="İl"
              required
            >
              {cities.map(city => (
                <MenuItem key={city.id} value={city.name}>{city.name}</MenuItem>
              ))}
            </Select>
          </MuiFormControl>

          <MuiFormControl className="form-control">
            <InputLabel>İlçe</InputLabel>
            <Select
              value={location.district}
              onChange={(e) => setLocation({ ...location, district: e.target.value, neighborhood: '' })}
              label="İlçe"
              required
              disabled={!location.city}
            >
              {districts.map(district => (
                <MenuItem key={district.id} value={district.name}>{district.name}</MenuItem>
              ))}
            </Select>
          </MuiFormControl>

          <MuiFormControl className="form-control">
            <InputLabel>Mahalle</InputLabel>
            <Select
              value={location.neighborhood}
              onChange={(e) => setLocation({ ...location, neighborhood: e.target.value })}
              label="Mahalle"
              required
              disabled={!location.district}
            >
              {neighborhoods.map(neighborhood => (
                <MenuItem key={neighborhood.id} value={neighborhood.name}>{neighborhood.name}</MenuItem>
              ))}
            </Select>
          </MuiFormControl>

          <TextField
            label="Sokak/Cadde"
            value={location.street}
            onChange={(e) => setLocation({ ...location, street: e.target.value })}
            required
            fullWidth
            className="form-control"
          />

          <Box className="form-control">
            <Typography 
              variant="subtitle1" 
              gutterBottom
              sx={{
                color: '#8B4513',
                fontWeight: 600,
                fontSize: '1.1rem'
              }}
            >
              Hayvanın Fotoğrafı
            </Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="pet-image-upload"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="pet-image-upload">
              <Button 
                variant="contained" 
                component="span"
                sx={{
                  bgcolor: '#8B4513',
                  color: '#F5DEB3',
                  '&:hover': {
                    bgcolor: '#654321'
                  }
                }}
              >
                Fotoğraf Yükle
              </Button>
            </label>
            {imagePreview && (
              <Box mt={2}>
                <img
                  src={imagePreview}
                  alt="Hayvan fotoğrafı önizleme"
                  style={{ maxWidth: '100%', maxHeight: '200px' }}
                />
              </Box>
            )}
          </Box>

          <Box className="form-control">
            <Typography 
              variant="subtitle1" 
              gutterBottom
              sx={{
                color: '#8B4513',
                fontWeight: 600,
                fontSize: '1.1rem'
              }}
            >
              Hayvan Pasaportu Fotoğrafı
            </Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="passport-image-upload"
              type="file"
              onChange={handlePassportImageChange}
            />
            <label htmlFor="passport-image-upload">
              <Button 
                variant="contained" 
                component="span"
                sx={{
                  bgcolor: '#8B4513',
                  color: '#F5DEB3',
                  '&:hover': {
                    bgcolor: '#654321'
                  }
                }}
              >
                Pasaport Fotoğrafı Yükle
              </Button>
            </label>
            {passportImagePreview && (
              <Box mt={2}>
                <img
                  src={passportImagePreview}
                  alt="Pasaport fotoğrafı önizleme"
                  style={{ maxWidth: '100%', maxHeight: '200px' }}
                />
              </Box>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            className="submit-button"
          >
            {loading ? <CircularProgress size={24} /> : 'İlanı Oluştur'}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default PostForm; 
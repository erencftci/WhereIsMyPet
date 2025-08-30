import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Box,
  SelectChangeEvent,
} from '@mui/material';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

interface FormData {
  petName: string;
  petType: string;
  description: string;
  location: string;
  contactInfo: string;
}

const petTypes = [
  'Köpek',
  'Kedi',
  'Kuş',
  'Tavşan',
  'Hamster',
  'Diğer'
];

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    petName: '',
    petType: '',
    description: '',
    location: '',
    contactInfo: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [passportImage, setPassportImage] = useState<File | null>(null);
  const [passportImagePreview, setPassportImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

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

  const validateForm = () => {
    if (!formData.petName.trim()) {
      setError('Hayvanın adını giriniz');
      return false;
    }
    if (!formData.petType) {
      setError('Hayvan türünü seçiniz');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Açıklama giriniz');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Konum bilgisi giriniz');
      return false;
    }
    if (!formData.contactInfo.trim()) {
      setError('İletişim bilgisi giriniz');
      return false;
    }
    if (!image) {
      setError('Lütfen hayvanın fotoğrafını yükleyin');
      return false;
    }
    if (!passportImage) {
      setError('Lütfen hayvan pasaportu fotoğrafını yükleyin');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log('Form data:', formData);
      console.log('Image:', image);
      console.log('Passport Image:', passportImage);
      console.log('Current user:', currentUser);

      let imageUrl = '';
      let passportImageUrl = '';
      //cloudinary kodları
      if (image) {
        console.log('Uploading pet image to Cloudinary...');
        const formData = new FormData();
        formData.append('file', image);
        formData.append('REACT_APP_CLOUDINARY_PRESET', 'whereismypet');

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error.message || 'Fotoğraf yüklenirken bir hata oluştu');
        }
        imageUrl = data.secure_url;
        console.log('Pet image uploaded to Cloudinary, URL:', imageUrl);
      }

      if (passportImage) {
        console.log('Uploading passport image to Cloudinary...');
        const formData = new FormData();
        formData.append('file', passportImage);
        formData.append('REACT_APP_CLOUDINARY_PRESET', 'whereismypet');

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`,
          {
            method: 'POST',   
            body: formData,
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error.message || 'Pasaport fotoğrafı yüklenirken bir hata oluştu');
        }
        passportImageUrl = data.secure_url;
        console.log('Passport image uploaded to Cloudinary, URL:', passportImageUrl);
      }

      const postData = {
        ...formData,
        imageUrl,
        passportImageUrl,
        createdAt: new Date(),
        userId: currentUser.uid,
        userEmail: currentUser.email,
      };

      console.log('Creating post with data:', postData);
      await addDoc(collection(db, 'posts'), postData);
      console.log('Post created successfully');
      
      setSuccess('İlan başarıyla oluşturuldu!');
      setTimeout(() => {
        navigate('/view-posts');
      }, 2000);
    } catch (error: any) {
      console.error('Error details:', error);
      setError('İlan oluşturulurken bir hata oluştu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Yükleniyor...
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Yeni İlan Oluştur
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Hayvanın Adı"
                name="petName"
                value={formData.petName}
                onChange={handleTextChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Hayvan Türü</InputLabel>
                <Select
                  name="petType"
                  value={formData.petType}
                  onChange={handleSelectChange}
                  label="Hayvan Türü"
                >
                  {petTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Açıklama"
                name="description"
                value={formData.description}
                onChange={handleTextChange}
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Kaybolduğu Konum"
                name="location"
                value={formData.location}
                onChange={handleTextChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="İletişim Bilgileri"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleTextChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
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
                <Button variant="contained" component="span">
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
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
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
                <Button variant="contained" component="span">
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
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'İlanı Oluştur'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreatePost; 
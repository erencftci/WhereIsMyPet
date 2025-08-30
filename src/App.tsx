import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CreatePost from './pages/CreatePost';
import ViewPosts from './pages/ViewPosts';
import MyPosts from './pages/MyPosts';
import CreatePostPage from './pages/CreatePostPage';
import ViewDetails from './pages/ViewDetails';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import HelpPage from './pages/HelpPage';
import Donation from './pages/Donation';
import AdminPanel from './pages/AdminPanel';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#8B4513',
    },
    secondary: {
      main: '#F5DEB3',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Roboto", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Roboto", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Roboto", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Roboto", sans-serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Roboto", sans-serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily: '"Roboto", sans-serif',
      fontWeight: 700,
    },
    body1: {
      fontFamily: '"Roboto", sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"Roboto", sans-serif',
      fontWeight: 400,
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-post" element={<CreatePostPage />} />
            <Route path="/view-posts" element={<ViewPosts />} />
            <Route path="/my-posts" element={<MyPosts />} />
            <Route path="/post/:id" element={<ViewDetails />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/donation" element={<Donation />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;

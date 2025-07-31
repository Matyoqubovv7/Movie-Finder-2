import './App.css'
import './i18n';
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import NavBar from './components/NavBar'
import HomePage from './components/HomePage'  
import MovieDetails from './components/MovieDetails'
import FilmsPage from './components/FilmsPage'
import SeriesPage from './components/SeriesPage'
import CartoonsPage from './components/CartoonsPage'
import AnimePage from './components/AnimePage'
import TopMoviesPage from './components/TopMoviesPage'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import SearchPage from './components/SearchPage'
import ProfilePage from './components/ProfilePage'
import SettingsPage from './pages/SettingsPage';

const API_KEY = 'e7304c7131b96981ff986ec6bf72abdd'
const OMDB_API_KEY = 'YOUR_OMDB_API_KEY'

function App() {
  useEffect(() => {
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'dark');
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.setAttribute('data-theme', localStorage.getItem('theme')!);
    }
  }, []);

  return (
    <AuthProvider>
    <Router>
      <div className="app-container">
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage apiKey={API_KEY} />} />
            <Route path="/details/:type/:id" element={<MovieDetails apiKey={API_KEY} omdbApiKey={OMDB_API_KEY} />} />
              <Route path="/films" element={<FilmsPage apiKey={API_KEY} />} />
              <Route path="/series" element={<SeriesPage apiKey={API_KEY} />} />
              <Route path="/cartoons" element={<CartoonsPage apiKey={API_KEY} />} />
              <Route path="/anime" element={<AnimePage apiKey={API_KEY} />} />
              <Route path="/top-movies" element={<TopMoviesPage apiKey={API_KEY} />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/search" element={<SearchPage apiKey={API_KEY} />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
    </AuthProvider>
  )
}

export default App

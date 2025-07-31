import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './NavBar.css';
import { useTranslation } from 'react-i18next';

const NavBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
    setShowSettings(false);
  };

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
    localStorage.setItem('lang', e.target.value);
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" className="logo-link">
            <div className="logo-wrapper">
              <img 
                src="/logo.png" 
                alt="Movie Finder" 
                className="logo-image"
              />
            </div>
          </Link>
        </div>
        
        <div className="navbar-categories">
          <Link to="/films" className="category-link">{t('movies')}</Link>
          <Link to="/series" className="category-link">{t('tv_shows')}</Link>
          <Link to="/cartoons" className="category-link">{t('cartoons')}</Link>
          <Link to="/anime" className="category-link">{t('anime')}</Link>
        </div>

        <form onSubmit={handleSearch} className="navbar-search">
          <input 
            type="text" 
            placeholder={t('search')} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>

        <div className="navbar-actions">
          {isLoggedIn ? (
            <div className="user-menu-container">
              <button 
                className="user-menu-button"
                onClick={handleUserMenuToggle}
              >
                <div className="user-avatar">
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="user-name">{user?.fullName}</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <div className="user-avatar-large">
                      {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="user-details">
                      <p className="user-full-name">{user?.fullName}</p>
                      <p className="user-email">{user?.email}</p>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/profile" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <span className="dropdown-icon">👤</span>
                    {t('profile')}
                  </Link>
                  <Link to="/favorites" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <span className="dropdown-icon">❤️</span>
                    {t('favorites')}
                  </Link>
                  <Link to="/settings" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <span className="dropdown-icon">⚙️</span>
                    {t('settings')}
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-button" onClick={handleLogout}>
                    <span className="dropdown-icon">🚪</span>
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="navbar-btn">{t('login')}</Link>
              <Link to="/register" className="navbar-btn navbar-btn-signup">{t('register')}</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar; 
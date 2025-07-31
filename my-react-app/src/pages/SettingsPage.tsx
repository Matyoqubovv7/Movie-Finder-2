import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../components/ProfilePage.css';

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

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
    <div className="profile-page">
      <div className="profile-card" style={{ minWidth: 400, maxWidth: 500, margin: '0 auto' }}>
        <h2 className="profile-name" style={{ textAlign: 'center', marginBottom: 24 }}>{t('settings')}</h2>
        <div className="profile-settings">
          <div style={{ margin: '18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ marginRight: 8, fontWeight: 500 }}>{t('language')}:</label>
            <select className="language-select" onChange={handleLangChange} value={i18n.language}>
              <option value="en">English</option>
              <option value="uz">O‘zbekcha</option>
              <option value="ru">Русский</option>
            </select>
          </div>
          <div style={{ margin: '18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ marginRight: 8, fontWeight: 500 }}>{t('theme')}:</label>
            <label className="switch">
              <input
                id="input"
                type="checkbox"
                checked={theme === 'dark'}
                onChange={handleThemeToggle}
                aria-label="Toggle dark mode"
              />
              <span className="slider round">
                <span className="sun-moon">
                  <span className="moon-dot" id="moon-dot-1"></span>
                  <span className="moon-dot" id="moon-dot-2"></span>
                  <span className="moon-dot" id="moon-dot-3"></span>
                </span>
                <span className="stars">
                  <span className="star" id="star-1"></span>
                  <span className="star" id="star-2"></span>
                  <span className="star" id="star-3"></span>
                  <span className="star" id="star-4"></span>
                </span>
              </span>
            </label>
          </div>
          <div style={{ margin: '18px 0', textAlign: 'center', color: '#b8b8b8' }}>
            <em>More settings coming soon...</em>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 
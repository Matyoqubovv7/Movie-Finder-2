import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './ProfilePage.css';
import { useTranslation } from 'react-i18next';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) {
    return (
      <div className="profile-page">
        <h2>{t('not_found')}</h2>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          {user.fullName.charAt(0).toUpperCase()}
        </div>
        <h2 className="profile-name">{user.fullName}</h2>
        <p className="profile-email">{user.email}</p>
        <div className="profile-info">
          <div>
            <span className="profile-label">{t('date_joined')}</span>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 
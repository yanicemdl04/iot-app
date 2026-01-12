import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../services/api';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .getProfile()
      .then((res) => {
        if (active) setProfile(res.data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <Layout>
      <div className="motion-card">
        <h3>Profil utilisateur</h3>
        {loading ? (
          <p style={{ color: 'rgba(148, 163, 184, 0.9)' }}>Chargement du profil...</p>
        ) : !profile ? (
          <p style={{ color: 'rgba(248, 113, 113, 0.9)' }}>Impossible de charger le profil.</p>
        ) : (
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>
              <span style={{ color: 'rgba(148, 163, 184, 0.9)', fontSize: '0.85rem' }}>Nom complet</span>
              <div style={{ color: '#f9fafb', fontWeight: 500 }}>
                {profile.firstName} {profile.lastName}
              </div>
            </div>
            <div>
              <span style={{ color: 'rgba(148, 163, 184, 0.9)', fontSize: '0.85rem' }}>Adresse e-mail</span>
              <div style={{ color: '#f9fafb' }}>{profile.email}</div>
            </div>
            <div>
              <span style={{ color: 'rgba(148, 163, 184, 0.9)', fontSize: '0.85rem' }}>Rôle</span>
              <div style={{ color: '#f9fafb' }}>{profile.role}</div>
            </div>
            {profile.coach && (
              <div>
                <span style={{ color: 'rgba(148, 163, 184, 0.9)', fontSize: '0.85rem' }}>Coach référent</span>
                <div style={{ color: '#f9fafb' }}>
                  {profile.coach.firstName} {profile.coach.lastName} ({profile.coach.email})
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;


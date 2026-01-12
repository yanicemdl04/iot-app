import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../services/api';

const ActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .getActivities({ limit: 20 })
      .then((res) => {
        if (active) setActivities(res.data || []);
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
      <div className="motion-card" style={{ marginBottom: '1.5rem' }}>
        <h3>Historique des activités</h3>
        <p style={{ color: 'rgba(148, 163, 184, 0.9)', fontSize: '0.9rem' }}>
          Liste de vos dernières séances enregistrées par le brassard.
        </p>
      </div>

      <div className="motion-card">
        {loading ? (
          <p style={{ color: 'rgba(148, 163, 184, 0.9)' }}>Chargement des activités...</p>
        ) : activities.length === 0 ? (
          <p style={{ color: 'rgba(148, 163, 184, 0.9)' }}>Aucune activité enregistrée pour le moment.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'rgba(148, 163, 184, 0.9)' }}>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Date</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Type</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Nom</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Durée</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Distance</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Calories</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((act) => (
                  <tr key={act.id} style={{ borderTop: '1px solid rgba(30, 64, 175, 0.5)' }}>
                    <td style={{ padding: '0.5rem 0.75rem', color: '#e5e7eb' }}>
                      {new Date(act.startTime).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem', color: 'rgba(148, 163, 184, 0.9)' }}>
                      {act.activityType}
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem', color: '#f9fafb' }}>{act.name}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: '#e5e7eb' }}>
                      {act.duration ? Math.round(act.duration / 60) + ' min' : '-'}
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem', color: '#e5e7eb' }}>
                      {act.distance ? (act.distance / 1000).toFixed(2) + ' km' : '-'}
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem', color: '#e5e7eb' }}>
                      {act.calories ? Math.round(act.calories) + ' kcal' : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ActivitiesPage;


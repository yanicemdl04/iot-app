import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../services/api';

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .getGoals()
      .then((res) => {
        if (active) setGoals(res.data || []);
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
        <h3>Objectifs d’entraînement</h3>
        <p style={{ color: 'rgba(148, 163, 184, 0.9)', fontSize: '0.9rem' }}>
          Suivez vos objectifs de distance, de temps ou de calories.
        </p>
      </div>

      <div className="motion-card">
        {loading ? (
          <p style={{ color: 'rgba(148, 163, 184, 0.9)' }}>Chargement des objectifs...</p>
        ) : goals.length === 0 ? (
          <p style={{ color: 'rgba(148, 163, 184, 0.9)' }}>
            Aucun objectif défini pour le moment. Vous pouvez en créer via l’interface backend ou plus tard via cette
            page.
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {goals.map((goal) => {
              const progress = Math.min(
                100,
                goal.targetValue > 0 ? (goal.currentValue / goal.targetValue) * 100 : 0,
              );
              return (
                <li
                  key={goal.id}
                  style={{
                    padding: '0.75rem 0.5rem',
                    borderBottom: '1px solid rgba(30, 64, 175, 0.5)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: '#e5e7eb', fontWeight: 500 }}>{goal.title}</span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(148, 163, 184, 0.9)' }}>
                      {goal.status === 'COMPLETED'
                        ? 'Atteint'
                        : goal.status === 'IN_PROGRESS'
                          ? 'En cours'
                          : 'En attente'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(148, 163, 184, 0.9)', marginBottom: '0.4rem' }}>
                    {goal.description || 'Aucune description fournie.'}
                  </p>
                  <div
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '999px',
                      background: 'rgba(15, 23, 42, 0.9)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #22c55e, #3b82f6)',
                      }}
                    />
                  </div>
                  <div style={{ marginTop: '0.25rem', fontSize: '0.8rem', color: 'rgba(148, 163, 184, 0.9)' }}>
                    {Math.round(goal.currentValue)} / {Math.round(goal.targetValue)} {goal.unit}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default GoalsPage;


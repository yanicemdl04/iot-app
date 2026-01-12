import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/tableau-de-bord');
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(15, 23, 42, 0.9)',
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid rgba(148, 163, 184, 0.4)',
          boxShadow: '0 18px 45px rgba(15, 23, 42, 0.9)',
        }}
      >
        <h1
          style={{
            fontSize: '1.6rem',
            marginBottom: '0.5rem',
            color: '#ffffff',
          }}
        >
          Connexion
        </h1>
        <p style={{ marginBottom: '1.5rem', color: 'rgba(148, 163, 184, 0.9)', fontSize: '0.95rem' }}>
          Accédez au tableau de bord de votre brassard sportif.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label htmlFor="email" style={{ fontSize: '0.9rem', color: 'rgba(209, 213, 219, 0.9)' }}>
              Adresse e-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(148, 163, 184, 0.6)',
                background: 'rgba(15, 23, 42, 0.8)',
                color: '#f9fafb',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label htmlFor="password" style={{ fontSize: '0.9rem', color: 'rgba(209, 213, 219, 0.9)' }}>
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(148, 163, 184, 0.6)',
                background: 'rgba(15, 23, 42, 0.8)',
                color: '#f9fafb',
              }}
            />
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(248, 113, 113, 0.1)',
                border: '1px solid rgba(248, 113, 113, 0.4)',
                color: '#fecaca',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                fontSize: '0.85rem',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              padding: '0.7rem 1rem',
              borderRadius: '999px',
              border: 'none',
              background: loading
                ? 'rgba(59, 130, 246, 0.5)'
                : 'linear-gradient(135deg, #3b82f6, #22c55e)',
              color: '#f9fafb',
              fontWeight: 600,
              cursor: loading ? 'default' : 'pointer',
            }}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'rgba(148, 163, 184, 0.9)' }}>
          Pas encore de compte ?{' '}
          <Link to="/inscription" style={{ color: '#60a5fa' }}>
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;


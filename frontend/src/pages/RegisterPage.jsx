import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/tableau-de-bord');
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
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
          Création de compte
        </h1>
        <p style={{ marginBottom: '1.5rem', color: 'rgba(148, 163, 184, 0.9)', fontSize: '0.95rem' }}>
          Créez un compte pour suivre vos performances sportives avec le brassard.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label htmlFor="firstName" style={{ fontSize: '0.9rem', color: 'rgba(209, 213, 219, 0.9)' }}>
                Prénom
              </label>
              <input
                id="firstName"
                name="firstName"
                required
                value={form.firstName}
                onChange={handleChange}
                style={{
                  padding: '0.6rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(148, 163, 184, 0.6)',
                  background: 'rgba(15, 23, 42, 0.8)',
                  color: '#f9fafb',
                }}
              />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label htmlFor="lastName" style={{ fontSize: '0.9rem', color: 'rgba(209, 213, 219, 0.9)' }}>
                Nom
              </label>
              <input
                id="lastName"
                name="lastName"
                required
                value={form.lastName}
                onChange={handleChange}
                style={{
                  padding: '0.6rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(148, 163, 184, 0.6)',
                  background: 'rgba(15, 23, 42, 0.8)',
                  color: '#f9fafb',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label htmlFor="email" style={{ fontSize: '0.9rem', color: 'rgba(209, 213, 219, 0.9)' }}>
              Adresse e-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
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
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
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
                : 'linear-gradient(135deg, #22c55e, #3b82f6)',
              color: '#f9fafb',
              fontWeight: 600,
              cursor: loading ? 'default' : 'pointer',
            }}
          >
            {loading ? 'Création du compte...' : 'Créer un compte'}
          </button>
        </form>

        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'rgba(148, 163, 184, 0.9)' }}>
          Vous avez déjà un compte ?{' '}
          <Link to="/connexion" style={{ color: '#60a5fa' }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;


import { NavLink, useNavigate } from 'react-router-dom';
import { FaBatteryThreeQuarters, FaHeartbeat, FaRunning, FaBullseye, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-background">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-content">
            <div>
              <h1 className="dashboard-title">Brassard Sportif Intelligent</h1>
              {user && (
                <p style={{ marginTop: '0.25rem', color: 'rgba(148, 163, 184, 0.9)', fontSize: '0.9rem' }}>
                  Connecté en tant que {user.firstName} {user.lastName} ({user.role})
                </p>
              )}
            </div>
            <div className="header-status">
              <div className="status-item battery">
                <FaBatteryThreeQuarters className="status-icon" />
                <span>Brassard connecté</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  borderRadius: '999px',
                  border: '1px solid rgba(248, 113, 113, 0.4)',
                  background: 'rgba(248, 113, 113, 0.1)',
                  color: '#fecaca',
                  padding: '0.4rem 0.9rem',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Déconnexion
              </button>
            </div>
          </div>
        </header>

        <nav
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <NavLink
            to="/tableau-de-bord"
            className={({ isActive }) =>
              `status-item ${isActive ? 'nav-active' : ''}`
            }
          >
            <FaHeartbeat className="status-icon" />
            <span>Tableau de bord</span>
          </NavLink>
          <NavLink
            to="/activites"
            className={({ isActive }) =>
              `status-item ${isActive ? 'nav-active' : ''}`
            }
          >
            <FaRunning className="status-icon" />
            <span>Activités</span>
          </NavLink>
          <NavLink
            to="/objectifs"
            className={({ isActive }) =>
              `status-item ${isActive ? 'nav-active' : ''}`
            }
          >
            <FaBullseye className="status-icon" />
            <span>Objectifs</span>
          </NavLink>
          <NavLink
            to="/profil"
            className={({ isActive }) =>
              `status-item ${isActive ? 'nav-active' : ''}`
            }
          >
            <FaUser className="status-icon" />
            <span>Profil</span>
          </NavLink>
        </nav>

        {children}
      </div>
    </div>
  );
};

export default Layout;


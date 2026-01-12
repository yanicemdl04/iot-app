const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('auth_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message = data?.message || 'Erreur lors de l\'appel à l\'API';
      const error = new Error(message);
      error.status = response.status;
      error.payload = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.');
    }
    throw error;
  }
}

export const api = {
  // Authentification
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (payload) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getProfile: () => request('/auth/profile'),

  // Sessions & données capteurs
  getSessions: (params = {}) => {
    const search = new URLSearchParams(params).toString();
    return request(`/sessions${search ? `?${search}` : ''}`);
  },

  getSessionById: (id) => request(`/sessions/${id}`),

  getLatestSensorData: (sessionId) =>
    request(`/sensor-data/${sessionId}/latest`),

  // Activités
  getActivities: (params = {}) => {
    const search = new URLSearchParams(params).toString();
    return request(`/activities${search ? `?${search}` : ''}`);
  },

  // Objectifs
  getGoals: (params = {}) => {
    const search = new URLSearchParams(params).toString();
    return request(`/goals${search ? `?${search}` : ''}`);
  },

  // Statistiques
  getStatistics: (params = {}) => {
    const search = new URLSearchParams(params).toString();
    return request(`/statistics${search ? `?${search}` : ''}`);
  },

  getProgressChart: (params = {}) => {
    const search = new URLSearchParams(params).toString();
    return request(`/statistics/chart${search ? `?${search}` : ''}`);
  },
};

export { API_BASE_URL };
import axios from 'axios';

const api = axios.create({ baseURL: '/api', timeout: 45000 });

// Attach the JWT stored by the AuthContext to every request.
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('devpulse_auth');
    if (raw) {
      const { token } = JSON.parse(raw);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    /* ignore corrupt storage */
  }
  return config;
});

// A 401 means the token is missing/expired - clear the session and
// send the user back to the login page.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !window.location.pathname.startsWith('/login')) {
      localStorage.removeItem('devpulse_auth');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Convert any axios/network failure into a friendly message.
export function apiError(err, fallback = 'Something went wrong. Please try again.') {
  if (err.response?.data?.error) return err.response.data.error;
  if (err.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
  if (err.message === 'Network Error') return 'Network error - is the DevPulse server running?';
  return fallback;
}

export default api;

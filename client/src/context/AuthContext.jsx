import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);
const STORAGE_KEY = 'devpulse_auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const saveSession = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setToken(data.token);
    setUser(data.user);
  };

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // Restore + validate any saved session on first load.
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setInitializing(false);
      return;
    }
    try {
      const { token: saved } = JSON.parse(raw);
      if (!saved) throw new Error('no token');
      setToken(saved);
      api
        .get('/auth/me')
        .then((res) => setUser(res.data.user))
        .catch(() => logout())
        .finally(() => setInitializing(false));
    } catch {
      logout();
      setInitializing(false);
    }
  }, [logout]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    saveSession(res.data);
    return res.data.user;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    saveSession(res.data);
    return res.data.user;
  };

  return (
    <AuthContext.Provider value={{ user, token, initializing, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

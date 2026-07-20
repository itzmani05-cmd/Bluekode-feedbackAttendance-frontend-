import { createContext, useEffect, useState } from 'react';
import { adminLogin as apiAdminLogin, trainerLogin as apiTrainerLogin } from '../api/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const persistSession = ({ token, user: userData }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const loginAsAdmin = async (email, password) => {
    const data = await apiAdminLogin(email, password);
    persistSession(data);
    return data.user;
  };

  const loginAsTrainer = async (email, password) => {
    const data = await apiTrainerLogin(email, password);
    persistSession(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginAsAdmin, loginAsTrainer, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

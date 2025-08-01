import { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '../api/userAPI';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const userData = await userAPI.login(email, password);
    setUser(userData);
  };

  const logout = async () => {
    await userAPI.logout();
    setUser(null);
  };

  const getMe = async () => {
    try {
      const me = await userAPI.getMe();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

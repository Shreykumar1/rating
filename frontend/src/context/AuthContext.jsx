import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setUser(user);
    setLoading(false);
  }, []);

  // New useEffect to fetch user info if user exists
  useEffect(() => {
    if (user) {
      const fetchUserInfo = async () => {
        const userInfo = await authService.getUserInfo(user.user.id);
        console.log(userInfo);
      };
      fetchUserInfo();
    }
  }, [user]); // Dependency on user

  const login = async (credentials) => {
    const user = await authService.login(credentials);
    setUser(user);
    return user;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 
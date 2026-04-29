import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isStudent = () => {
    return user?.role === 'student';
  };

  const isCoordinator = () => {
    return user?.role === 'coordinator';
  };

  const isSuperAdmin = () => {
    return user?.id === 1 && user?.role === 'admin';
  };

  const canManageEvents = () => {
    return user?.role === 'admin' || user?.role === 'coordinator';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin, isStudent, isCoordinator, isSuperAdmin, canManageEvents }}>
      {children}
    </AuthContext.Provider>
  );
};

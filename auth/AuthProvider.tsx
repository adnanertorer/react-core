import React, { useState, useEffect } from 'react';
import { getAccessToken, setToken, clearToken } from './TokenService';
import { AuthContext } from './AuthContext';


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getAccessToken());

  const login = (accessToken: string, refreshToken: string) => {
    setToken(accessToken, refreshToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearToken();
    setIsAuthenticated(false);
  };

  useEffect(() => {
    setIsAuthenticated(!!getAccessToken());
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};



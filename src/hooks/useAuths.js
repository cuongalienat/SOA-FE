import { useState, useEffect } from 'react';

export const useAuths = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulating a check for stored user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email) => {
    const mockUser = { name: "John Doe", email, isAuthenticated: true };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const signup = (name, email) => {
    const mockUser = { name, email, isAuthenticated: true };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return { user, login, signup, logout, isAuthenticated: !!user };
};
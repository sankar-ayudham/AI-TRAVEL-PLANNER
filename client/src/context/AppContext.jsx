import { createContext, useState, useEffect } from 'react';
import API from '../api';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage or system preference on initial load
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Apply Dark Mode class to HTML document tag automatically
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Check if a user is already logged in when the app starts up
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.get('/auth/profile');
        setUser(res.data);
      } catch (err) {
        console.error('Session authentication failed:', err);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Register action
  const register = async (name, email, password) => {
    const res = await API.post('/auth/register', { name, email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  // Login action
  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  // Logout action
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Toggle Dark Mode function
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        darkMode,
        register,
        login,
        logout,
        toggleDarkMode,
        setUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
import axios from 'axios';

// Create a configured instance of Axios
// It uses an environment variable for production deployment, or falls back to localhost for local testing
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// This interceptor automatically intercepts every outgoing request to our server
// and injects the user's secure token from localStorage if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
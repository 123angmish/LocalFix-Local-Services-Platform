import axios from 'axios';

// Default fallback to live Render backend URL if VITE_API_BASE_URL is not set on Netlify
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localfix-backend-gfu0.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

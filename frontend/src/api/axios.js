import axios from 'axios';

// Detect local environment dynamically or fallback to live Render backend
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // If running backend on port 8081 or 8080 locally
    return localStorage.getItem('local_api_port')
      ? `http://localhost:${localStorage.getItem('local_api_port')}/api`
      : 'http://localhost:8081/api';
  }
  return 'https://localfix-backend-gfu0.onrender.com/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
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

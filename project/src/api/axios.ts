import axios from 'axios';

const baseURL = 'http://localhost:5000/api';

const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete instance.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Add request interceptor to handle errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server. Please try again.');
    } else {
      // Request setup error
      throw new Error('Error setting up request');
    }
  }
);

// Add request interceptor to add token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
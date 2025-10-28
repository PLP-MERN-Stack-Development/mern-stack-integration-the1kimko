import apiClient from './api';

export const authApi = {
  // Register user
  register: async (userData) => {
    const data = await apiClient.post('/auth/register', userData);
    apiClient.setToken(data.data.token);
    return data;
  },

  // Login user
  login: async (credentials) => {
    const data = await apiClient.post('/auth/login', credentials);
    apiClient.setToken(data.data.token);
    return data;
  },

  // Get current user
  getMe: async () => {
    return apiClient.get('/auth/me');
  },

  // Update profile
  updateProfile: async (profileData) => {
    return apiClient.put('/auth/profile', profileData);
  },

  // Logout
  logout: () => {
    apiClient.setToken(null);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!apiClient.token;
  },
};
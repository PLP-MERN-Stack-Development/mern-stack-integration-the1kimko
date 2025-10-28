import { create } from 'zustand';
import { authApi } from '../api/auth';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  // Login
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      set({
        user: response.data.user,
        token: response.data.token,
        isLoading: false,
        error: null,
      });
      return response;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },

  // Register
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register(userData);
      set({
        user: response.data.user,
        token: response.data.token,
        isLoading: false,
        error: null,
      });
      return response;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },

  // Logout
  logout: () => {
    authApi.logout();
    set({
      user: null,
      token: null,
      error: null,
    });
  },

  // Get current user
  getMe: async () => {
    if (!get().token) return;

    set({ isLoading: true, error: null });
    try {
      const response = await authApi.getMe();
      set({
        user: response.data,
        isLoading: false,
        error: null,
      });
      return response;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      // If token is invalid, logout
      if (error.message.includes('token')) {
        get().logout();
      }
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.updateProfile(profileData);
      set({
        user: response.data,
        isLoading: false,
        error: null,
      });
      return response;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Check if authenticated
  isAuthenticated: () => {
    return !!get().token;
  },
}));

export default useAuthStore;
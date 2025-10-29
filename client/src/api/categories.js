import apiClient from './api';

export const categoriesApi = {
  // Get all categories
  getCategories: async () => {
    return apiClient.get('/categories');
  },

  // Get single category
  getCategory: async (id) => {
    return apiClient.get(`/categories/${id}`);
  },

  // Create new category
  createCategory: async (categoryData) => {
    return apiClient.post('/categories', categoryData);
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    return apiClient.put(`/categories/${id}`, categoryData);
  },

  // Delete category
  deleteCategory: async (id) => {
    return apiClient.delete(`/categories/${id}`);
  },
};

export default categoriesApi;

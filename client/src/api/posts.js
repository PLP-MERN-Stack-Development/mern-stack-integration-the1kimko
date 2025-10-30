// client/src/api/posts.js
import apiClient from './api';

export const postsApi = {
  getPosts: async (params = {}) => {
    return apiClient.get('/posts', { params });
  },
  getPost: async (id) => {
    return apiClient.get(`/posts/${id}`);
  },
  getPostBySlug: async (slug) => {
    return apiClient.get(`/posts/slug/${slug}`);
  },
  getMyPosts: async () => {
    return apiClient.get('/posts/my');
  },
  createPost: async (postData) => {
    return apiClient.post('/posts', postData);
  },
  updatePost: async (id, postData) => {
    return apiClient.put(`/posts/${id}`, postData);
  },
  deletePost: async (id) => {
    return apiClient.delete(`/posts/${id}`);
  },
  addComment: async (postId, content) => {
    return apiClient.post(`/posts/${postId}/comments`, { content });
  },
  uploadImage: async (formData) => {
    return apiClient.upload('/posts/upload', formData);
  },
};

export default postsApi;

import apiClient from './api';

export const postsApi = {
  // Get all posts
  getPosts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/posts?${queryString}`);
  },

  // Get single post by ID
  getPost: async (id) => {
    return apiClient.get(`/posts/${id}`);
  },

  // Get my posts(individual profile)
  getMyPosts: () => apiClient.get('/posts/my'),

  // Get post by slug
  getPostBySlug: async (slug) => {
    return apiClient.get(`/posts/slug/${slug}`);
  },

  // Create new post
  createPost: async (postData) => {
    return apiClient.post('/posts', postData);
  },

  // Update post
  updatePost: async (id, postData) => {
    return apiClient.put(`/posts/${id}`, postData);
  },

  // Delete post
  deletePost: async (id) => {
    return apiClient.delete(`/posts/${id}`);
  },

  // Add comment to post
  addComment: async (postId, content) => {
    return apiClient.post(`/posts/${postId}/comments`, { content });
  },
};
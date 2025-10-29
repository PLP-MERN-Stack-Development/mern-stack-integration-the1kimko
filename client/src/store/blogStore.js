// client/src/store/blogStore.js
import { create } from 'zustand';
import postsApi from '../api/posts';
import categoriesApi from '../api/categories';

const useBlogStore = create((set, get) => ({
  posts: [],
  currentPost: null,
  postsLoading: false,
  postsError: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  filters: {
    category: '',
    search: '',
    published: true,
  },

  fetchPosts: async (params = {}) => {
    set({ postsLoading: true, postsError: null });
    try {
      const response = await postsApi.getPosts({ published: true, ...get().filters, ...params });
      set({
        posts: response.data,
        pagination: response.pagination,
        postsLoading: false,
      });
      return response;
    } catch (error) {
      set({
        postsLoading: false,
        postsError: error.message,
      });
      throw error;
    }
  },

  fetchMyPosts: async () => {
    set({ postsLoading: true, postsError: null });
    try {
      const response = await postsApi.getMyPosts();
      set({
        posts: response.data,
        postsLoading: false,
      });
      return response;
    } catch (error) {
      set({
        postsLoading: false,
        postsError: error.message,
      });
      throw error;
    }
  },

  fetchPost: async (id) => {
    set({ postsLoading: true, postsError: null });
    try {
      const response = await postsApi.getPost(id);
      set({
        currentPost: response.data,
        postsLoading: false,
      });
      return response;
    } catch (error) {
      set({
        postsLoading: false,
        postsError: error.message,
      });
      throw error;
    }
  },

  fetchPostBySlug: async (slug) => {
    set({ postsLoading: true, postsError: null });
    try {
      const response = await postsApi.getPostBySlug(slug);
      set({
        currentPost: response.data,
        postsLoading: false,
      });
      return response;
    } catch (error) {
      set({
        postsLoading: false,
        postsError: error.message,
      });
      throw error;
    }
  },

  createPost: async (postData) => {
    try {
      const response = await postsApi.createPost(postData);
      set(state => ({
        posts: [response.data, ...state.posts],
      }));
      return response;
    } catch (error) {
      set({ postsError: error.message });
      throw error;
    }
  },

  updatePost: async (id, postData) => {
    try {
      const response = await postsApi.updatePost(id, postData);
      set(state => ({
        posts: state.posts.map(post =>
          post._id === id ? response.data : post
        ),
        currentPost: state.currentPost?._id === id ? response.data : state.currentPost,
      }));
      return response;
    } catch (error) {
      set({ postsError: error.message });
      throw error;
    }
  },

  deletePost: async (id) => {
    try {
      await postsApi.deletePost(id);
      set(state => ({
        posts: state.posts.filter(post => post._id !== id),
        currentPost: state.currentPost?._id === id ? null : state.currentPost,
      }));
    } catch (error) {
      set({ postsError: error.message });
      throw error;
    }
  },

  addComment: async (postId, content) => {
    try {
      const response = await postsApi.addComment(postId, content);
      set(state => ({
        currentPost: state.currentPost?._id === postId ? response.data : state.currentPost,
        posts: state.posts.map(post =>
          post._id === postId ? response.data : post
        ),
      }));
      return response;
    } catch (error) {
      set({ postsError: error.message });
      throw error;
    }
  },

  fetchCategories: async () => {
    set({ categoriesLoading: true, categoriesError: null });
    try {
      const response = await categoriesApi.getCategories();
      set({
        categories: response.data,
        categoriesLoading: false,
      });
      return response;
    } catch (error) {
      set({
        categoriesLoading: false,
        categoriesError: error.message,
      });
      throw error;
    }
  },

  setFilters: (newFilters) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  clearFilters: () => {
    set({
      filters: {
        category: '',
        search: '',
        published: true,
      },
    });
  },

  clearPostsError: () => set({ postsError: null }),
  clearCategoriesError: () => set({ categoriesError: null }),
}));

export default useBlogStore;
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function createApiClient() {
  let token = localStorage.getItem('token') || null;

  // Set auth token
  const setToken = (newToken) => {
    token = newToken;
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  // Get auth headers
  const getAuthHeaders = () => {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  };

  // Make API request
  const request = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  // HTTP methods
  const get = (endpoint) => request(endpoint, { method: 'GET' });

  const post = (endpoint, data) =>
    request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });

  const put = (endpoint, data) =>
    request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

  const del = (endpoint) => request(endpoint, { method: 'DELETE' });

  // File upload
  const upload = async (endpoint, formData) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  };

  return {
    setToken,
    get,
    post,
    put,
    delete: del,
    upload,
  };
}

// Create and export API client instance
const apiClient = createApiClient();

export default apiClient;

// API service for Todo application
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create a base API client with common headers and error handling
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  // Helper method to get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Helper method to create headers with auth token
  getAuthHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    // Include body if provided and ensure it's properly stringified
    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);

      // Handle different response status codes
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Handle response based on content type
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error(`API request error for ${url}:`, error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: credentials
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // Task methods
  async getTasks(filters = {}) {
    // Build query string from filters
    const queryParams = new URLSearchParams(filters);
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';

    return this.request(endpoint);
  }

  async createTask(taskData) {
    return this.request('/tasks', {
      method: 'POST',
      body: taskData
    });
  }

  async getTask(taskId) {
    return this.request(`/tasks/${taskId}`);
  }

  async updateTask(taskId, taskData) {
    return this.request(`/tasks/${taskId}`, {
      method: 'PUT',
      body: taskData
    });
  }

  async deleteTask(taskId) {
    return this.request(`/tasks/${taskId}`, {
      method: 'DELETE'
    });
  }

  async updateTaskStatus(taskId, completed) {
    return this.request(`/tasks/${taskId}/complete`, {
      method: 'PATCH',
      body: { completed }
    });
  }
}

// Create and export a single instance of the API client
const apiClient = new ApiClient(API_BASE_URL);

export default apiClient;
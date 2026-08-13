import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add trailing slash to all requests
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        searchParams.append(key, params[key]);
      }
    });
    return searchParams.toString();
  }
});

// Add interceptor to add trailing slash
apiClient.interceptors.request.use((config) => {
  // Ensure URL ends with / unless it has a query string or is already a full URL
  if (config.url && !config.url.includes('?') && !config.url.endsWith('/')) {
    config.url = config.url + '/';
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

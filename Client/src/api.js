import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: apiUrl,
});

export const setupErrorInterceptor = (showError) => {
  apiClient.interceptors.response.use(
    (response) => response, // On success, just return the response
    (error) => {
      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data?.message || errorMessage;
        
        // Handle specific status codes if needed
        if (error.response.status === 401) {
          // For example, redirect to login or refresh token
          // For now, we just show the error
          localStorage.removeItem('logym_token');
          // Maybe force a reload to redirect to login via Layout's logic
          window.location.reload();
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'Cannot connect to the server. Please check your network connection.';
      }

      showError(errorMessage);

      return Promise.reject(error);
    }
  );
};

// Add a request interceptor to include the token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('logym_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;

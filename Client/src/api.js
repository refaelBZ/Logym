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
        errorMessage = error.response.data?.message || errorMessage;

        if (error.response.status === 401) {
          const hadSession = !!localStorage.getItem('logym_token');
          localStorage.removeItem('logym_token');
          if (hadSession) {
            // Expired / invalidated session — reload so Layout re-reads localStorage
            // and redirects cleanly to /login without showing a stale error.
            window.location.reload();
            return Promise.reject(error);
          }
          // No active session (e.g. wrong password on login) — fall through and
          // let the error message display normally.
        }
      } else if (error.request) {
        errorMessage = 'Cannot connect to the server. Please check your network connection.';
      }

      showError(errorMessage, { persistent: !error.response });

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

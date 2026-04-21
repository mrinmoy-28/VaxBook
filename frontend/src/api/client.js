import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS || 10000),
});
 
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (error) => {
    // No response => network error / server down / request timed out.
    if (!error.response) {
      const msg =
        error.code === 'ECONNABORTED'
          ? 'Request timed out. Please try again.'
          : 'Cannot reach the server. Please try again in a moment.';
      return Promise.reject(new Error(msg));
    }

    // Backend can use 503 when database/server is unavailable.
    if (error.response.status === 503) {
      const msg =
        error.response.data?.message ||
        'Server unavailable (database disconnected). Please try again.';
      error.message = msg;
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default client;

import axios from "axios";

// Create an Axios instance with the backend's base URL
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FLASK_API_URL, // Use your Flask backend URL
  withCredentials: true, // If you need to send cookies along with requests
  headers:{
    'Content-Type': 'application/json',
  }
});

// Attach token to every request if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or unauthorized, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

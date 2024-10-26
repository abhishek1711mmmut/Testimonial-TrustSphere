import axios from "axios";

// Create an Axios instance with the backend's base URL
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FLASK_API_URL, // Use your Flask backend URL
  withCredentials: true, // If you need to send cookies along with requests
  headers:{
    'Content-Type': 'application/json',
  }
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or unauthorized, redirect to login
      localStorage.removeItem('userId');
      window.location.href = '/auth/signin';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

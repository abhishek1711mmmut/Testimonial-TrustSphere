import axios from "axios";
import { startLoading, stopLoading } from "./loadingStore";

const apiClient = axios.create({
  // Next.js forwards /api requests to Flask on the server.
  baseURL: "/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  startLoading();
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    stopLoading();
    return response;
  },
  (error) => {
    stopLoading();
    if (error.response?.status === 401 && error.config?.url !== "/api/auth/login") {
      localStorage.removeItem("userId");
      window.location.href = "/auth/signin";
    }
    return Promise.reject(error);
  },
);

export default apiClient;

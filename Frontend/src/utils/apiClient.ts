import axios from "axios";
import { startLoading, stopLoading } from "./loadingStore";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FLASK_API_URL,
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
    if (error.response?.status === 401) {
      localStorage.removeItem("userId");
      document.cookie = "ts_auth=; path=/; max-age=0";
      window.location.href = "/auth/signin";
    }
    return Promise.reject(error);
  },
);

export default apiClient;

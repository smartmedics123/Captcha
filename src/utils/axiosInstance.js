// utils/axiosInstance.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Response Interceptor for Retry on 429
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers["retry-after"] || 3; // server ka header ya default 3s
      await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
      return axiosInstance(error.config); // retry
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

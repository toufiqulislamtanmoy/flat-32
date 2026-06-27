import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request Interceptor
axiosClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log("Unauthorized");
          break;

        case 403:
          console.log("Forbidden");
          break;

        case 500:
          console.log("Server Error");
          break;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://122.186.126.218:3502",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error),
);

export default axiosInstance;

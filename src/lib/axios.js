// src/lib/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      err.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

api.interceptors.response.use(
  response => response,
  error => {

    if (error.response?.status === 401) {

      localStorage.clear();

      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      document.cookie =
        "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 DEBUG REQUEST
api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("➡️ REQUEST:", config.baseURL + config.url, config.data || "");
  return config;
});

// 🔥 DEBUG RESPONSE
api.interceptors.response.use(
  (response) => {
    console.log("✅ RESPONSE:", response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error("❌ ERROR:", error.response?.data || error.message);
    return Promise.reject(error);
  }


);

export default api;
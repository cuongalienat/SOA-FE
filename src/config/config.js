import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? "https://your-backend-url.com/api/v1" // URL BE khi deploy
      : "http://localhost:3000/v1", // URL BE khi dev
  headers: {
    "Content-Type": "application/json",
  },
});

// Tự động thêm token nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

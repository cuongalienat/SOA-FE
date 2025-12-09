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

// Xử lý lỗi 401 (Unauthorized) - Token hết hạn hoặc không hợp lệ
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Optional: Redirect to login or dispatch an event
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  }
);

export default api;

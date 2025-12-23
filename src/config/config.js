import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? "https://your-backend-url.com/api/v1" // URL BE khi deploy
      : "http://localhost:3000/v1", // URL BE khi dev
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// Tự động thêm token nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Xử lý lỗi 401 (Unauthorized) - Token hết hạn hoặc không hợp lệ
(error) => {
  if (error.response && error.response.status === 401) {
    // Don't redirect if it's a login attempt failure
    const isLoginRequest = error.config && error.config.url && (error.config.url.includes("signin") || error.config.url.includes("login"));

    if (!isLoginRequest) {
      console.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      console.log("hello");

      // Optional: Redirect to login or dispatch an event
      if (window.location.pathname !== "/sign-in") {
        window.location.href = "/sign-in";
      }
    }
  }
  return Promise.reject(error);
}

export default api;

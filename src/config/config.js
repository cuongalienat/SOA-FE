import axios from "axios";

const api = axios.create({
<<<<<<< HEAD
  baseURL:
    import.meta.env.MODE === "production"
      ? "https://your-backend-url.com/api/v1" // URL BE khi deploy
      : "http://localhost:3000/v1", // URL BE khi dev
  headers: {
    "Content-Type": "application/json",
  },
=======
    baseURL:
        import.meta.env.MODE === "production"
            ? "https://your-backend-url.com/api/v1" // URL BE khi deploy
            : "http://localhost:3000/v1", // URL BE khi dev
    headers: {
        "Content-Type": "application/json",
    },
>>>>>>> 5f0339b404f1292619b3460a7f429de6683a4a1a
});

// Tự động thêm token nếu có
api.interceptors.request.use((config) => {
<<<<<<< HEAD
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
=======
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;
>>>>>>> 5f0339b404f1292619b3460a7f429de6683a4a1a

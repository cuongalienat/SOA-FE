import path from "path";
import { fileURLToPath } from "url"; // 1. Import thêm cái này
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// 2. Tạo lại biến __dirname thủ công (Đây là cách fix lỗi chuẩn nhất)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  // Load các biến môi trường từ file .env
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    plugins: [react()],

    // Cấu hình để code frontend gọi được process.env.API_KEY
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"), // Lưu ý: thường là trỏ vào './src' chứ không phải '.'
      },
    },
  };
});

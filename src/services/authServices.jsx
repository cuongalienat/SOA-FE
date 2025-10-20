import api from "../config/config.js";
import ENDPOINTS from "../config/endpoints";

// Gọi API đăng nhập
export const signInUser = async (credentials) => {
  try {
    const response = await api.post(ENDPOINTS.AUTH.SIGNIN, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Lỗi không xác định" };
  }
};

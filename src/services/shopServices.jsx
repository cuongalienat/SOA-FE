import api from "../config/config";
import ENDPOINTS from "../config/endpoints";
// Lấy thông tin shop của người dùng hiện tại
// 1. Lấy danh sách tất cả quán (Public)
export const getAllShopsService = async (params) => {
  try {
    const response = await api.get(ENDPOINTS.SHOP.GET_ALL, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Lỗi lấy danh sách quán" };
  }
};

// 1b. Lấy thông tin chi tiết một quán (Public)
export const getShopByIdService = async (shopId) => {
  try {
    const response = await api.get(ENDPOINTS.SHOP.GET_BY_ID.replace(':id', shopId));
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Lỗi lấy thông tin quán" };
  }
};

// 2. Tạo quán mới (Cần login)
export const createShopService = async (shopData) => {
  try {
    // shopData là FormData nếu có upload ảnh
    const response = await api.post(ENDPOINTS.SHOP.CREATE, shopData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Lỗi tạo quán" };
  }
};

// 3. Lấy thông tin quán CỦA TÔI (Owner)
export const getMyShopService = async () => {
  try {
    const response = await api.get(ENDPOINTS.SHOP.GET_MY_SHOP);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Lỗi lấy thông tin quán của bạn" };
  }
};

// 4. Cập nhật quán (Owner)
export const updateShopService = async (shopData) => {
  try {
    const response = await api.put(
      ENDPOINTS.SHOP.UPDATE_SHOP_INFO,
      shopData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Lỗi cập nhật quán" };
  }
};


// 5. Cập nhật trạng thái quán (Đóng/Mở)
export const updateShopStatusService = async (isOpen) => {
  try {
    const response = await api.patch(
      ENDPOINTS.SHOP.TOGGLE_SHOP_STATUS,
      { isOpen }   // 🔥 SỬA Ở ĐÂY
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Lỗi cập nhật trạng thái quán" };
  }
};


// 6. Lấy dashboard shop (Owner)
export const getMyShopDashboardService = async () => {
  try {
    const response = await api.get(ENDPOINTS.SHOP.GET_MY_SHOP_DASHBOARD);
    return response.data;
    // { success, message, data }
  } catch (error) {
    throw error.response?.data || { message: "Lỗi lấy dashboard" };
  }
};

// 7. Lấy dashboard shop (user)
export const getShopDashboardService = async (shopId) => {
  try {
    const response = await api.get(ENDPOINTS.SHOP.GET_SHOP_DASHBOARD.replace(':id', shopId));
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Lỗi lấy dashboard" };
  }
};
import api from "../config/config";
import ENDPOINTS from "../config/endpoints";
// Lấy thông tin shop của người dùng hiện tại
export const getMyShopService = async () => {
    try {
        const response = await api.get(ENDPOINTS.SHOP.GET_MY_SHOP);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Lỗi không xác định" };
    }
};

// Cập nhật thông tin shop
export const updateShopInfoService = async (shopData) => {
    try {
        const response = await api.put(ENDPOINTS.SHOP.UPDATE_SHOP_INFO, shopData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Lỗi không xác định" };
    }
};

// Bật/Tắt trạng thái mở cửa của shop
export const toggleShopStatusService = async () => {
    try {
        const response = await api.patch(ENDPOINTS.SHOP.TOGGLE_SHOP_STATUS);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Lỗi không xác định" };
    }
};
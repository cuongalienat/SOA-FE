import api from "../config/config";
import ENDPOINTS from "../config/endpoints";

// Gọi API lấy tất cả mặt hàng
export const fetchAllItemsServices = async () => {
    try {
        const response = await api.get(ENDPOINTS.ITEM.GET_ALL_ITEMS);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Lỗi không xác định" };
    }
};

export const fetchItemsByShopService = async (shopId) => {
    try {
        const response = await api.get(ENDPOINTS.ITEM.GET_ITEMS_BY_SHOP, { shopId });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Lỗi không xác định" };
    }
};
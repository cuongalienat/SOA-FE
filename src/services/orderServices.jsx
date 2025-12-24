import ENDPOINTS from "../config/endpoints.jsx"
import api from "../config/config.js"

// Tạo đơn hàng mới
export const createOrderService = async (orderData) => {
    try {
        const response = await api.post(ENDPOINTS.ORDER.CREATE_ORDER, orderData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Lỗi tạo đơn hàng" };
    }
};

// Lấy danh sách đơn hàng của người dùng
export const getUserOrdersService = async (params = {}) => {
    try {
        const response = await api.get(ENDPOINTS.ORDER.GET_USER_ORDERS, {
            params
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Lỗi lấy danh sách đơn hàng" };
    }
};

// Hủy đơn hàng
export const cancelOrderService = async (orderId) => {
    try {
        const endpoint = ENDPOINTS.ORDER.CANCEL_ORDER.replace(":id", orderId);
        const response = await api.patch(endpoint);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Lỗi hủy đơn hàng" };
    }
};

// Lấy danh sách đơn hàng của cửa hàng
export const getShopOrdersService = async (shopId, params = {}) => {
    try {
        const response = await api.get(ENDPOINTS.ORDER.GET_SHOP_ORDERS, {
            // 👇 PHẢI BỌC TRONG 'params'
            params: {
                // Backend của bạn đang mong đợi key là 'restaurantId' (req.query.restaurantId)
                restaurantId: shopId,
                ...params
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Lỗi lấy danh sách đơn hàng cửa hàng" };
    }
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatusService = async (orderId, status) => {
    try {
        const endpoint = ENDPOINTS.ORDER.UPDATE_STATUS.replace(":id", orderId);
        const response = await api.patch(endpoint, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Lỗi cập nhật trạng thái đơn hàng" };
    }
};

// Lấy chi tiết đơn hàng
export const getOrderDetailsService = async (orderId) => {
    try {
        const endpoint = ENDPOINTS.ORDER.GET_ORDER_DETAILS.replace(":id", orderId);
        const response = await api.get(endpoint);
        return response.data;
    }
    catch (error) {
        throw error.response?.data || { message: "Lỗi lấy chi tiết đơn hàng" };
    }
};
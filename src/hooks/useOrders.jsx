import { useState, useCallback } from "react";
import {
    createOrderService,
    getUserOrdersService,
    cancelOrderService,
    getOrderDetailsService,
    getShopOrdersService, // Đảm bảo tên này khớp với export trong file services
    updateOrderStatusService
} from "../services/orderServices";
import { useToast } from "../context/ToastContext";

// --- HELPERS: Chuẩn hóa dữ liệu ---
const normalizeOrdersList = (response) => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.orders)) return response.orders;
    if (Array.isArray(response.data?.orders)) return response.data.orders;
    return [];
};

const normalizePagination = (response) => {
    const pagination = response?.pagination || response?.data?.pagination;
    return {
        page: pagination?.page || response?.page || response?.data?.page || 1,
        limit: pagination?.limit || response?.limit || response?.data?.limit || 10,
        total: pagination?.total || response?.total || response?.data?.total || 0,
        totalPages: pagination?.totalPages || response?.totalPages || response?.data?.totalPages || 0
    };
};

// --- HOOK CHÍNH ---
export const useOrders = () => {
    // State
    const [orders, setOrders] = useState([]);
    const [orderDetail, setOrderDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1, limit: 10, total: 0, totalPages: 0
    });

    const { showToast } = useToast();

    // 1. Lấy lịch sử đơn hàng (User)
    const loadMyOrders = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getUserOrdersService(params);
            setOrders(normalizeOrdersList(response));
            setPagination(normalizePagination(response));
        } catch (err) {
            const msg = err.response?.data?.message || "Không thể tải lịch sử đơn hàng";
            setError(msg);
            // showToast(msg, 'error'); // Uncomment nếu muốn hiện lỗi
        } finally {
            setLoading(false);
        }
    }, []);

    // 2. Lấy đơn hàng của Quán (Restaurant Dashboard)
    const loadShopOrders = useCallback(async (restaurantId, params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getShopOrdersService(restaurantId, params);
            setOrders(normalizeOrdersList(response));
            setPagination(normalizePagination(response));
        } catch (err) {
            const msg = err.response?.data?.message || "Lỗi tải danh sách đơn hàng";
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    // 3. Lấy chi tiết đơn
    const loadOrderDetails = useCallback(async (orderId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getOrderDetailsService(orderId);
            const data = response.data || response;
            setOrderDetail(data);
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || "Không tìm thấy đơn hàng";
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    // 4. Tạo đơn hàng (Checkout)
    const createOrder = async (orderData) => {
        setLoading(true);
        setError(null);
        try {
            const newOrder = await createOrderService(orderData);
            return { success: true, data: newOrder };
        } catch (err) {
            const msg = err.response?.data?.message || "Đặt hàng thất bại";
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    // 5. Hủy đơn hàng
    const cancelOrder = async (orderId) => {
        setLoading(true);
        try {
            await cancelOrderService(orderId);
            showToast("Đã hủy đơn hàng thành công", "success");

            // Cập nhật State Local (Optimistic Update)
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'Canceled' } : o));
            if (orderDetail?._id === orderId) {
                setOrderDetail(prev => ({ ...prev, status: 'Canceled' }));
            }
            return true;
        } catch (err) {
            const msg = err.response?.data?.message || "Không thể hủy đơn hàng";
            showToast(msg, 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // 6. Cập nhật trạng thái (Confirmed/Preparing/Shipping...)
    const updateOrderStatus = async (orderId, status) => {
        // Lưu ý: Không set loading toàn trang để tránh giật UI khi bấm nút nhỏ
        try {
            await updateOrderStatusService(orderId, status);
            // showToast(`Đã cập nhật: ${status}`, "success"); // Có thể bật nếu muốn báo từng bước

            // Cập nhật State Local ngay lập tức
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: status } : o));
            if (orderDetail?._id === orderId) {
                setOrderDetail(prev => ({ ...prev, status: status }));
            }
            return true;
        } catch (err) {
            const msg = err.response?.data?.message || "Cập nhật thất bại";
            showToast(msg, 'error');
            return false;
        }
    };

    return {
        // State
        orders,
        orderDetail,
        loading,
        error,
        pagination,
        
        // Setter (QUAN TRỌNG CHO SOCKET)
        setOrders, 

        // Actions
        loadMyOrders,
        loadShopOrders,
        loadOrderDetails,
        createOrder,
        cancelOrder,
        updateOrderStatus
    };
};
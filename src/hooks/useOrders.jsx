import {
    createOrderService
    , getUserOrdersService
    , cancelOrderService
    , getOrderDetailsService
    , getShopOrdersService
    , updateOrderStatusService
} from "../services/orderServices";
import { useState, useCallback } from "react";
import { useToast } from "../context/ToastContext";

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

export const useOrders = () => {
    const [orders, setOrders] = useState([]);        // Danh sách đơn hàng
    const [orderDetail, setOrderDetail] = useState(null); // Chi tiết 1 đơn
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    const { showToast } = useToast(); // Giả sử bạn đã có ToastContext

    // 1. Lấy danh sách đơn hàng của User (Lịch sử mua hàng)
    const loadMyOrders = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            // params có thể là { status: 'Pending', page: 1, limit: 10 }
            const response = await getUserOrdersService(params);
            const normalizedOrders = normalizeOrdersList(response);
            setOrders(normalizedOrders);
            setPagination(normalizePagination(response));
        } catch (err) {
            const msg = err.response?.data?.message || "Không thể tải lịch sử đơn hàng";
            setError(msg);

            // showToast(msg, 'error'); // Tùy chọn: hiện popup lỗi luôn
        } finally {
            setLoading(false);
        }
    }, []);

    // 2. Lấy danh sách đơn hàng của Nhà hàng (Trang quản lý)
    const loadShopOrders = useCallback(async (restaurantId, params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getShopOrdersService(restaurantId, params);
            const normalizedOrders = normalizeOrdersList(response);
            setOrders(normalizedOrders);
            setPagination(normalizePagination(response));
        } catch (err) {
            const msg = err.response?.data?.message || "Không thể tải danh sách đơn hàng của quán";
            setError(msg);

            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    // 3. Lấy chi tiết một đơn hàng
    const loadOrderDetails = useCallback(async (orderId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getOrderDetailsService(orderId);
            setOrderDetail(data.data);
            console.log(data.data);
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || "Không tìm thấy đơn hàng";
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    // 4. Tạo đơn hàng mới (Checkout)
    const createOrder = async (orderData) => {
        setLoading(true);
        setError(null);
        try {
            const newOrder = await createOrderService(orderData);
            // Có thể update lại list orders nếu cần
            // setOrders(prev => [newOrder, ...prev]); 
            return { success: true, data: newOrder };
        } catch (err) {
            const msg = err.response?.data?.message || "Đặt hàng thất bại";
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    // 5. Hủy đơn hàng (User hủy)
    const cancelOrder = async (orderId) => {
        setLoading(true);
        try {
            await cancelOrderService(orderId);
            showToast("Đã hủy đơn hàng thành công", "success");

            // Cập nhật lại state local để UI tự đổi mà ko cần F5
            setOrders(prevOrders =>
                prevOrders.map(o => o._id === orderId ? { ...o, status: 'Canceled' } : o)
            );

            if (orderDetail && orderDetail._id === orderId) {
                setOrderDetail({ ...orderDetail, status: 'Canceled' });
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

    // 6. Cập nhật trạng thái (Dành cho Chủ quán/Shipper)
    const updateOrderStatus = async (orderId, status) => {
        setLoading(true);
        try {
            await updateOrderStatusService(orderId, status);
            showToast(`Đã cập nhật trạng thái: ${status}`, "success");

            // Cập nhật state local
            setOrders(prevOrders =>
                prevOrders.map(o => o._id === orderId ? { ...o, status: status } : o)
            );

            if (orderDetail && orderDetail._id === orderId) {
                setOrderDetail({ ...orderDetail, status: status });
            }
            return true;
        } catch (err) {
            showToast(err.response?.data?.message || "Cập nhật thất bại", 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        orders,           // List đơn hàng
        orderDetail,      // Chi tiết 1 đơn
        loading,          // Trạng thái tải
        error,            // Lỗi nếu có
        pagination,       // Thông tin phân trang { page, total... }

        loadMyOrders,     // Hàm gọi: Lấy đơn của user
        loadShopOrders,   // Hàm gọi: Lấy đơn của shop
        loadOrderDetails, // Hàm gọi: Lấy chi tiết
        createOrder,      // Hàm gọi: Tạo đơn
        cancelOrder,      // Hàm gọi: Hủy đơn
        updateOrderStatus // Hàm gọi: Update trạng thái
    };
};
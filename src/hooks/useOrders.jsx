import {
    createOrderService
    , getUserOrdersService
    , cancelOrderService
    , getOrderDetailsService
    , getShopOrdersService
    , updateOrderStatusService
} from "../services/orderServices";
import { useState } from "react";

export const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadUserOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUserOrdersService();
            setOrders(data);
        } catch (err) {
            setError(err.message || "Lỗi khi tải đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    const createOrder = async (orderData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await createOrderService(orderData);
            return { success: true, data };
        }
        catch (err) {
            setError(err.message || "Lỗi khi tạo đơn hàng");
            return { success: false, error: err.message };
        }
        finally {
            setLoading(false);
        }
    };

    return {
        orders,
        loading,
        error,
        loadUserOrders,
        createOrder,
    };
}
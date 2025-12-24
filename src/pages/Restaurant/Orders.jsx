// src/pages/Restaurant/Orders.jsx
import React, { useEffect, useRef, useState } from "react"; // Thêm useRef để quản lý Audio tốt hơn
import { CheckCircle, Truck, ChefHat, Bell } from "lucide-react";
import { useOrders } from "../../hooks/useOrders";
import { updateOrderStatusService } from "../../services/orderServices";
import { useSocket } from "../../context/SocketContext"; 
import { useToast } from "../../context/ToastContext"; 
import { useShop } from "../../hooks/useShop"; 

const NOTIFICATION_SOUND = new Audio("/sounds/ding.mp3");

const orderTag = (orderId) => {
  if (!orderId || typeof orderId !== 'string') return '#??????';
  return `#${orderId.slice(-6).toUpperCase()}`;
};

const Orders = () => {
  const { shop, loading: shopLoading, loadMyShop, toggleAutoAccept } = useShop(); 
  const { orders, setOrders, loadShopOrders, pagination } = useOrders();
  
  // 👇 1. SỬA QUAN TRỌNG: Lấy đúng tên hàm showToast
  const { showToast } = useToast(); 
  
  const socket = useSocket();
  const audioRef = useRef(NOTIFICATION_SOUND);

  // Filters + pagination
  const [statusFilter, setStatusFilter] = useState(""); // empty = all
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Helper lấy Shop ID
  const currentShopId = shop?.shops?.[0]?._id || shop?._id;

  // ----------------------------------------------------------------
  // 1. Tải thông tin Shop (Nếu F5 chưa có)
  // ----------------------------------------------------------------
  useEffect(() => {
    if (!shop) {
      loadMyShop();
    }
  }, [shop, loadMyShop]);

  // ----------------------------------------------------------------
  // 2. Load Đơn hàng (chỉ khi đổi shop)
  // ----------------------------------------------------------------
  useEffect(() => {
    if (!currentShopId) return;
    console.log("🚀 Load orders cho Shop:", currentShopId);
    setPage(1);
    loadShopOrders(currentShopId, { page: 1, limit, ...(statusFilter ? { status: statusFilter } : {}) });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentShopId]);

  // Reload when page/limit/status changes
  useEffect(() => {
    if (!currentShopId) return;
    loadShopOrders(currentShopId, { page, limit, ...(statusFilter ? { status: statusFilter } : {}) });
  }, [currentShopId, page, limit, statusFilter, loadShopOrders]);

  // ----------------------------------------------------------------
  // 3. Setup Socket listeners (không gọi API liên tục)
  // ----------------------------------------------------------------
  useEffect(() => {
    if (!currentShopId || !socket) return;

    const handleNewOrder = (newOrder) => {
      console.log("🔔 Đơn mới:", newOrder);

      audioRef.current.play().catch(() => {});
      const tag = orderTag(newOrder?._id);
      const customerName = newOrder?.user?.fullName || 'Khách';
      if (showToast) showToast(`Đơn mới ${tag}: ${customerName}`, 'success', {
        dedupeKey: `NEW_ORDER_TO_SHOP:${newOrder?._id}`,
        debounceMs: 3000,
        duration: 4500
      });

      setOrders((prev) => {
        // If user is not on page 1, don't mutate list (avoid confusing pagination)
        if (page !== 1) return prev;

        // Respect status filter (if any)
        if (statusFilter && newOrder?.status !== statusFilter) return prev;

        if (prev.find((o) => o._id === newOrder._id)) return prev;
        const next = [newOrder, ...prev];
        return next.slice(0, limit);
      });
    };

    const handleOrderReminder = (payload) => {
      const level = payload?.level;
      const tag = orderTag(payload?.orderId);
      const message = payload?.msg ? `${tag} - ${payload.msg}` : `${tag} - Bạn có đơn mới cần xử lý`;

      if (level >= 2) audioRef.current.play().catch(() => {});

      const type = level === 1 ? 'info' : (level === 2 ? 'warning' : 'warning');
      if (showToast) showToast(message, type, {
        dedupeKey: `ORDER_REMINDER:${payload?.orderId}:${level}`,
        debounceMs: 2500
      });
    };

    const handleAutoConfirmed = (payload) => {
      const orderId = payload?.orderId;
      if (!orderId) return;
      const tag = orderTag(orderId);
      const message = payload?.msg ? `${tag} - ${payload.msg}` : `${tag} - Đơn hàng được tự động xác nhận`;
      if (showToast) showToast(message, 'info', {
        dedupeKey: `ORDER_AUTO_CONFIRMED:${orderId}`,
        debounceMs: 3000
      });

      setOrders((prev) => {
        const updated = prev.map((o) => (o._id === orderId ? { ...o, status: 'Confirmed' } : o));
        return statusFilter && statusFilter !== 'Confirmed'
          ? updated.filter((o) => o._id !== orderId)
          : updated;
      });
    };

    const handleOrderCancelled = (payload) => {
      const orderId = payload?.orderId;
      const reason = payload?.reason;
      if (!orderId) return;

      const tag = orderTag(orderId);

      const msg = reason === 'SHOP_NO_RESPONSE'
        ? `${tag} - Đơn bị huỷ do quá hạn xác nhận`
        : (reason === 'NO_SHIPPER' ? `${tag} - Đơn bị huỷ do không tìm được tài xế` : (payload?.msg ? `${tag} - ${payload.msg}` : `${tag} - Đơn đã bị huỷ`));

      if (showToast) showToast(msg, 'error', {
        dedupeKey: `ORDER_CANCELLED:${orderId}:${reason || 'UNKNOWN'}`,
        debounceMs: 3000
      });

      setOrders((prev) => {
        const updated = prev.map((o) => (o._id === orderId ? { ...o, status: 'Canceled', cancelReason: reason } : o));
        return statusFilter && statusFilter !== 'Canceled'
          ? updated.filter((o) => o._id !== orderId)
          : updated;
      });
    };

    const handleOrderStatusUpdate = (payload) => {
      const orderId = payload?.orderId;
      const nextStatus = payload?.status;
      if (!orderId || !nextStatus) return;

      const tag = orderTag(orderId);
      const message = payload?.msg ? `${tag} - ${payload.msg}` : `${tag} - Trạng thái: ${nextStatus}`;

      if (showToast) {
        showToast(message, nextStatus === 'Delivered' ? 'success' : 'info', {
          dedupeKey: `ORDER_STATUS_UPDATE:${orderId}:${nextStatus}`,
          debounceMs: 2000,
          duration: 3500
        });
      }

      setOrders((prev) => {
        const exists = prev.some((o) => o._id === orderId);
        if (!exists) return prev;

        const updated = prev.map((o) => (o._id === orderId ? { ...o, status: nextStatus } : o));

        // Respect status filter (if any)
        return statusFilter && nextStatus !== statusFilter
          ? updated.filter((o) => o._id !== orderId)
          : updated;
      });
    };

    socket.on("NEW_ORDER_TO_SHOP", handleNewOrder);
    socket.on("ORDER_REMINDER", handleOrderReminder);
    socket.on("ORDER_AUTO_CONFIRMED", handleAutoConfirmed);
    socket.on("ORDER_CANCELLED", handleOrderCancelled);
    socket.on("ORDER_STATUS_UPDATE", handleOrderStatusUpdate);

    return () => {
      socket.off("NEW_ORDER_TO_SHOP", handleNewOrder);
      socket.off("ORDER_REMINDER", handleOrderReminder);
      socket.off("ORDER_AUTO_CONFIRMED", handleAutoConfirmed);
      socket.off("ORDER_CANCELLED", handleOrderCancelled);
      socket.off("ORDER_STATUS_UPDATE", handleOrderStatusUpdate);
    };
  }, [currentShopId, socket, setOrders, showToast, page, limit, statusFilter]);

  // ----------------------------------------------------------------
  // 4. HÀM XỬ LÝ CẬP NHẬT TRẠNG THÁI (FIX LỖI UI KHÔNG UPDATE)
  // ----------------------------------------------------------------
  const handleUpdateStatus = async (orderId, nextStatus) => {
    try {
      // A. Gọi API Backend
      await updateOrderStatusService(orderId, nextStatus);
      
      // B. Thông báo thành công
      if (showToast) showToast(`Cập nhật thành công: ${nextStatus}`, 'success');

      // C. Cập nhật UI ngay lập tức (Optimistic Update)
      setOrders((prev) =>
        prev.map((order) => {
          if (order._id === orderId) {
            return { 
                ...order, 
                status: transformStatus(nextStatus) 
            };
          }
          return order;
        })
      );

      // D. QUAN TRỌNG: Tải lại dữ liệu thật từ Server để đồng bộ
      // (Giúp tránh lỗi sai lệch dữ liệu nếu backend có xử lý phụ)
      if (currentShopId) {
          setTimeout(() => {
           loadShopOrders(currentShopId, { page, limit, ...(statusFilter ? { status: statusFilter } : {}) });
          }, 500); // Delay nhẹ để DB kịp update
      }

    } catch (error) {
      console.error("Lỗi update:", error);
      if (showToast) showToast(error.message || "Lỗi cập nhật", 'error');
    }
  };
  
  // Helper chuyển đổi status (Backend lowercase -> UI TitleCase)
  const transformStatus = (status) => {
      const map = {
          'confirmed': 'Confirmed',
          'preparing': 'Preparing',
          'shipping': 'Shipping',
          'completed': 'Delivered',
          'canceled': 'Canceled'
      };
      return map[status] || status.charAt(0).toUpperCase() + status.slice(1);
  }

  // Helper màu sắc
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Confirmed": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Preparing": return "bg-orange-100 text-orange-700 border-orange-200";
      case "Shipping": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Delivered": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // --- RENDER ---
  if (shopLoading) return <div className="p-10 text-center">Đang tải...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <span className="text-sm text-gray-500 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Realtime Active
        </span>
      </div>

      {/* Filters + Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Preparing">Preparing</option>
            <option value="Shipping">Shipping</option>
            <option value="Delivered">Delivered</option>
            <option value="Canceled">Canceled</option>
          </select>

          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value) || 10);
              setPage(1);
            }}
          >
            <option value={10}>10 / trang</option>
            <option value={20}>20 / trang</option>
            <option value={50}>50 / trang</option>
          </select>

          {/* Auto-accept toggle (menu đơn) */}
          <button
            type="button"
            onClick={() => toggleAutoAccept && toggleAutoAccept()}
            disabled={!toggleAutoAccept || shopLoading}
            className={`border border-gray-200 rounded-lg px-3 py-2 text-sm flex items-center gap-2 disabled:opacity-50 ${
              shop?.autoAccept ? "bg-blue-50" : "bg-white"
            }`}
            title="Tự động xác nhận đơn khi quán đang mở"
          >
            <span
              className={`w-9 h-5 rounded-full relative transition ${
                shop?.autoAccept ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition ${
                  shop?.autoAccept ? "right-0.5" : "left-0.5"
                }`}
              />
            </span>
            Auto-accept
          </button>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="text-sm text-gray-500">
            Tổng: {pagination?.total || 0}
          </span>
          <button
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-50"
            disabled={(pagination?.page || page) <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Trước
          </button>
          <span className="text-sm text-gray-700">
            Trang {pagination?.page || page} / {pagination?.totalPages || 1}
          </span>
          <button
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-50"
            disabled={pagination?.totalPages ? (pagination.page >= pagination.totalPages) : false}
            onClick={() => setPage((p) => p + 1)}
          >
            Sau
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* 1. Thông tin đơn */}
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="font-bold text-lg text-gray-900 mr-3">
                  #{order._id.slice(-6).toUpperCase()}
                </span>
                <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>

              {/* Tên khách hàng & SĐT */}
              <h3 className="font-semibold text-gray-800 mb-1">
                {/* Fallback nếu user chưa populate */}
                {typeof order.user === 'object' ? order.user?.fullName : "Khách vãng lai"}
                <span className="text-xs text-gray-400 font-normal ml-2">
                    ({order.contactPhone || "Không SĐT"})
                </span>
              </h3>
              
              {/* Địa chỉ (Nếu có) */}
              <p className="text-xs text-gray-500 mb-2">
                 📍 {order.address || "Địa chỉ giao hàng"}
              </p>

              {/* List món ăn */}
              <div className="text-gray-600 text-sm mb-2">
                  {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
              </div>

              <p className="text-orange-600 font-bold">
                {Number(order.totalAmount).toLocaleString("vi-VN")} VNĐ
              </p>
            </div>

            {/* 2. Trạng thái & Nút bấm */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className={`px-4 py-2 rounded-lg border font-semibold text-sm flex items-center ${getStatusColor(order.status)}`}>
                {order.status}
              </div>

              <div className="flex space-x-2">
                {/* Nút Xác nhận */}
                {order.status === "Pending" && (
                  <button
                    onClick={() => handleUpdateStatus(order._id, "confirmed")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
                  >
                    <CheckCircle size={16} /> Xác nhận
                  </button>
                )}

                {/* Nút Gọi Ship */}
                {order.status === "Confirmed" && (
                  <button
                    onClick={() => handleUpdateStatus(order._id, "preparing")}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 flex items-center gap-2"
                  >
                    <ChefHat size={16} /> Món xong / Gọi Ship
                  </button>
                )}

                {/* Đang tìm ship */}
                {order.status === "Preparing" && (
                  <button disabled className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed flex items-center gap-2">
                      <Truck size={16} /> Đang tìm tài xế...
                  </button>
                )}
                 
                {/* Shipper đang giao */}
                {order.status === "Shipping" && (
                  <span className="text-purple-600 text-sm font-medium italic">
                      Shipper đang giao...
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-10 text-gray-400">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
              Chưa có đơn hàng nào
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
// src/pages/Restaurant/Orders.jsx
import React, { useEffect, useRef } from "react"; // Thêm useRef để quản lý Audio tốt hơn
import { CheckCircle, Truck, ChefHat, Bell } from "lucide-react";
import { useOrders } from "../../hooks/useOrders";
import { updateOrderStatusService } from "../../services/orderServices";
import { useSocket } from "../../context/SocketContext"; 
import { useToast } from "../../context/ToastContext"; 
import { useShop } from "../../hooks/useShop"; 

const NOTIFICATION_SOUND = new Audio("/sounds/ding.mp3");

const Orders = () => {
  const { shop, loading: shopLoading, loadMyShop } = useShop(); 
  const { orders, setOrders, loadShopOrders } = useOrders();
  
  // 👇 1. SỬA QUAN TRỌNG: Lấy đúng tên hàm showToast
  const { showToast } = useToast(); 
  
  const socket = useSocket();
  const audioRef = useRef(NOTIFICATION_SOUND);

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
  // 2. Load Đơn hàng & Setup Socket (Logic gộp)
  // ----------------------------------------------------------------
  useEffect(() => {
    if (currentShopId) {
        console.log("🚀 Setup Orders cho Shop:", currentShopId);

        // A. Load API
        loadShopOrders(currentShopId);

        // B. Socket
        if (socket) {
            const roomName = `shop_${currentShopId}`;
            //socket.emit("JOIN_ROOM", roomName);
            //console.log("🔌 Joined room:", roomName);

            const handleNewOrder = (newOrder) => {
                console.log("🔔 Đơn mới:", newOrder);
                
                // Play Sound
                audioRef.current.play().catch(() => {});
                
                // Show Toast
                if (showToast) showToast(`Đơn mới: ${newOrder.user?.fullName || 'Khách'}!`, 'success');

                // Update UI (Thêm vào đầu danh sách)
                setOrders((prev) => {
                    if (prev.find(o => o._id === newOrder._id)) return prev;
                    return [newOrder, ...prev];
                });
            };

            socket.on("NEW_ORDER_TO_SHOP", handleNewOrder);

            return () => {
                socket.off("NEW_ORDER_TO_SHOP", handleNewOrder);
            };
        }
    }
  }, [currentShopId, socket, loadShopOrders, setOrders, showToast]);

  // ----------------------------------------------------------------
  // 3. HÀM XỬ LÝ CẬP NHẬT TRẠNG THÁI (FIX LỖI UI KHÔNG UPDATE)
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
             loadShopOrders(currentShopId);
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
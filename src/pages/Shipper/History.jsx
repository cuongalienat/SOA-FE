import React, { useState, useEffect } from "react";
import {
  Package,
  Clock,
  DollarSign,
  BarChart3,
  X,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuths";
import { getShipperHistoryService } from "../../services/shipperServices";

const ShipperHistory = () => {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // State quản lý Popup
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Logic fetch dữ liệu
  useEffect(() => {
    const loadHistory = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const data = await getShipperHistoryService();
        setHistory(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi tải lịch sử:", error);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, [token]);

  // 2. 🔥 LOGIC KHÓA CUỘN TRANG (Sửa theo ý bạn)
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const totalEarned = history.reduce(
    (sum, item) => sum + (item.shippingFee || 0),
    0
  );

  const openDetail = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  if (loading)
    return (
      <div className="p-10 text-center font-bold text-gray-400">
        Đang tải...
      </div>
    );

  return (
    <div className="p-4 space-y-6 relative">
      {/* Sub-Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg text-green-600">
            <BarChart3 size={20} />
          </div>
          <h2 className="font-black text-[#2e7d32] uppercase tracking-tight text-sm">
            Lịch sử thu nhập
          </h2>
        </div>
        <span className="text-[10px] font-black bg-gray-100 px-3 py-1 rounded-full text-gray-500 uppercase">
          {history.length} đơn
        </span>
      </div>

      {/* Card Thu nhập tổng */}
      <div className="bg-[#2e7d32] p-6 rounded-[32px] shadow-lg flex items-center justify-between relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">
            Tổng thu nhập
          </p>
          <h3 className="text-3xl font-[1000] text-white tracking-tighter">
            {totalEarned.toLocaleString()}
            <span className="text-sm ml-1 font-normal opacity-60 italic">
              đ
            </span>
          </h3>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white">
          <DollarSign size={24} strokeWidth={3} />
        </div>
      </div>

      {/* Danh sách đơn hàng */}
      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-20 text-gray-300 font-bold uppercase text-xs tracking-widest">
            <Package size={40} className="mx-auto mb-2 opacity-20" />
            Chưa có đơn hàng
          </div>
        ) : (
          history.map((item) => {
            const date = new Date(item.updatedAt || item.createdAt);
            return (
              <div
                key={item._id}
                onClick={() => openDetail(item)}
                className="bg-white p-5 rounded-[25px] border border-gray-100 shadow-sm active:scale-95 transition-transform cursor-pointer"
              >
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                  <span className="text-[10px] font-black bg-gray-50 px-2 py-1 rounded text-gray-400 font-mono">
                    #{item._id?.slice(-6).toUpperCase()}
                  </span>
                  <ChevronRight size={14} className="text-gray-300" />
                </div>

                <div style={styles.infoPanelInner}>
                  <p className="text-[13px] text-gray-700 font-bold truncate mb-1">
                    <span className="text-[#2e7d32]">Lấy:</span>{" "}
                    {item.pickup?.address}
                  </p>
                  <p className="text-[13px] text-gray-700 font-bold truncate">
                    <span className="text-[#e67e22]">Giao:</span>{" "}
                    {item.dropoff?.address}
                  </p>
                </div>

                <div className="flex justify-between items-end mt-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                    <Clock size={12} />
                    <span>{date.toLocaleDateString("vi-VN")}</span>
                  </div>
                  <p className="text-lg font-[1000] text-[#2e7d32]">
                    +{item.shippingFee?.toLocaleString()}đ
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ================= MODAL CHI TIẾT ĐƠN HÀNG (ĐÃ TỐI ƯU MOBILE) ================= */}
      {isModalOpen && selectedItem && (
        <div
          className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setIsModalOpen(false)} // Chạm nền để đóng
        >
          <div
            className="bg-white w-full max-w-md rounded-t-[40px] shadow-2xl animate-slide-up flex flex-col overflow-hidden"
            style={{ maxHeight: "90dvh" }} // Tránh bị thanh trình duyệt che
            onClick={(e) => e.stopPropagation()} // Ngăn đóng khi nhấn vào trong modal
          >
            {/* Thanh kéo giả lập App */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-2 flex-shrink-0" />

            {/* Header Modal - Cố định */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-50 flex-shrink-0">
              <h3 className="font-[1000] text-xl text-gray-900 uppercase tracking-tighter italic">
                Chi tiết đơn hàng
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-gray-100 rounded-full text-gray-500 active:scale-75 transition-transform"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nội dung Modal - Cho phép cuộn riêng */}
            <div className="p-6 overflow-y-auto flex-1 overscroll-contain">
              {/* Thông tin vận chuyển */}
              <div className="space-y-4 mb-8 bg-gray-50 p-5 rounded-[25px] border border-gray-100">
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Địa chỉ lấy hàng
                  </p>
                  <p className="text-sm font-bold text-gray-800 leading-tight">
                    {selectedItem.pickup?.address}
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Địa chỉ giao hàng
                  </p>
                  <p className="text-sm font-bold text-gray-800 leading-tight">
                    {selectedItem.dropoff?.address}
                  </p>
                  <p className="text-xs text-[#2e7d32] font-black mt-2 uppercase tracking-wide">
                    Khách: {selectedItem.dropoff?.name} •{" "}
                    {selectedItem.dropoff?.phone}
                  </p>
                </div>
              </div>

              {/* DANH SÁCH MÓN ĂN */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag size={18} className="text-[#2e7d32]" />
                  <p className="text-xs font-black text-gray-900 uppercase tracking-widest">
                    Món đã giao
                  </p>
                </div>
                <div className="space-y-3">
                  {selectedItem.orderId?.items?.map((food, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-white border border-gray-100 p-3 rounded-2xl shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 flex items-center justify-center bg-orange-50 text-orange-600 rounded-lg text-[10px] font-black border border-orange-100">
                          {food.quantity}x
                        </span>
                        <p className="text-sm font-bold text-gray-700">
                          {food.name || food.item?.name}
                        </p>
                      </div>
                      <p className="text-sm font-black text-gray-900">
                        {(food.price * food.quantity).toLocaleString()}đ
                      </p>
                    </div>
                  )) || (
                    <p className="text-gray-400 italic text-center text-sm py-4">
                      Không có thông tin món ăn
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Modal - Cố định ở đáy */}
            <div className="px-6 pb-8 pt-4 flex-shrink-0">
              <div className="bg-[#1a1a1a] text-white p-6 rounded-[30px] shadow-xl">
                <div className="flex justify-between mb-2 opacity-60 text-[10px] font-bold uppercase tracking-[0.2em]">
                  <span>Tiền ship thực nhận</span>
                  <span>+{selectedItem.shippingFee?.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                  <span className="text-sm font-bold uppercase tracking-tighter">
                    Tổng đơn khách trả
                  </span>
                  <span className="text-2xl font-[1000] text-orange-500 tracking-tighter">
                    {selectedItem.orderId?.totalAmount?.toLocaleString() || 0}đ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  infoPanelInner: {
    backgroundColor: "#fcfcfc",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #f0f0f0",
  },
};

export default ShipperHistory;

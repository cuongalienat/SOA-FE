import React, { useState, useEffect } from "react";
import { Package, Clock, DollarSign, BarChart3 } from "lucide-react";
import { useAuth } from "../../hooks/useAuths";
import { getShipperHistoryService } from "../../services/shipperServices";

const ShipperHistory = () => {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const totalEarned = history.reduce(
    (sum, item) => sum + (item.shippingFee || 0),
    0
  );

  if (loading)
    return (
      <div className="p-10 text-center font-bold text-gray-400">
        Đang tải...
      </div>
    );

  return (
    /* XÓA BỎ: Không dùng div bao có height 100vh ở đây nữa */
    <div className="p-4 space-y-6">
      {/* Sub-Header: Tiêu đề trang (Dùng style Dashboard của bạn) */}
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

      {/* Danh sách đơn hàng (Flat List) */}
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
                className="bg-white p-5 rounded-[25px] border border-gray-100 shadow-sm"
              >
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                  <span className="text-[10px] font-black bg-gray-50 px-2 py-1 rounded text-gray-400 font-mono">
                    #{item._id?.slice(-6).toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                    <Clock size={12} />
                    <span>
                      {date.toLocaleDateString("vi-VN")} |{" "}
                      {date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 bg-gray-50/50 p-3 rounded-2xl border border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]" />
                    <p className="text-[12px] font-bold text-gray-700 truncate">
                      {item.pickup?.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_#ef4444]" />
                    <p className="text-[12px] font-bold text-gray-700 truncate">
                      {item.dropoff?.address}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-end mt-4">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Khoảng cách
                    </p>
                    <p className="text-sm font-black text-gray-800">
                      {(item.distance / 1000).toFixed(1)} km
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Tiền ship
                    </p>
                    <p className="text-lg font-[1000] text-[#2e7d32]">
                      +{item.shippingFee?.toLocaleString()}đ
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f8f9fa",
    overflow: "hidden", // Ngăn cuộn toàn trang để header cố định
  },
  header: {
    backgroundColor: "white",
    borderBottom: "1px solid #eee",
    zIndex: 1000,
  },
  headerContent: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "10px" },
  headerIcon: {
    width: "32px",
    height: "32px",
    backgroundColor: "#e8f5e9",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: "14px",
    fontWeight: "800",
    color: "#2e7d32",
    letterSpacing: "0.5px",
  },
  headerBadge: {
    fontSize: "11px",
    fontWeight: "bold",
    color: "#999",
    backgroundColor: "#f5f5f5",
    padding: "4px 10px",
    borderRadius: "6px",
  },

  mainScrollable: {
    flex: 1,
    overflowY: "auto", // Cho phép cuộn nội dung
    WebkitOverflowScrolling: "touch", // Cuộn mượt trên iOS
    padding: "0 15px",
  },
  responsiveContainer: {
    maxWidth: "600px",
    margin: "0 auto",
    width: "100%",
  },

  incomeCard: {
    backgroundColor: "#2e7d32",
    padding: "25px 20px",
    borderRadius: "16px",
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
    boxShadow: "0 8px 20px rgba(46, 125, 50, 0.15)",
  },
  incomeLabel: {
    margin: 0,
    fontSize: "10px",
    color: "rgba(255,255,255,0.7)",
    fontWeight: "bold",
    letterSpacing: "1px",
  },
  incomeValue: {
    margin: 0,
    color: "white",
    fontSize: "32px",
    fontWeight: "900",
    letterSpacing: "-1px",
  },
  dollarCircle: {
    width: "50px",
    height: "50px",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "20px",
  },
  card: {
    backgroundColor: "white",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #eee",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
    alignItems: "center",
  },
  idTag: {
    fontSize: "10px",
    fontWeight: "bold",
    color: "#666",
    backgroundColor: "#f0f0f0",
    padding: "2px 8px",
    borderRadius: "4px",
  },
  timeInfo: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
    fontWeight: "bold",
    color: "#aaa",
  },

  routeBox: {
    padding: "12px",
    backgroundColor: "#fafafa",
    borderRadius: "8px",
    border: "1px solid #f0f0f0",
  },
  routeItem: { display: "flex", alignItems: "center", gap: "10px" },
  dot: { width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0 },
  routeLine: {
    width: "1px",
    height: "10px",
    backgroundColor: "#ddd",
    marginLeft: "3.5px",
    margin: "2px 0",
  },
  address: {
    margin: 0,
    fontSize: "13px",
    fontWeight: "bold",
    color: "#444",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  cardBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: "12px",
    paddingTop: "10px",
    borderTop: "1px dashed #eee",
  },
  subLabel: {
    display: "block",
    fontSize: "9px",
    fontWeight: "800",
    color: "#bbb",
    marginBottom: "2px",
    letterSpacing: "0.5px",
  },
  mainValue: { fontSize: "14px", fontWeight: "bold", color: "#333" },
  priceText: { fontSize: "18px", fontWeight: "900", color: "#2e7d32" },

  loadingScreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
  },
  spinner: {
    width: "35px",
    height: "35px",
    border: "3px solid #eee",
    borderTop: "3px solid #2e7d32",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "15px",
    color: "#666",
    fontWeight: "bold",
    fontSize: "14px",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 0",
    color: "#ccc",
    fontWeight: "bold",
  },
};

// Keyframe cho spinner (Sử dụng CSS-in-JS injection)
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
  document.head.appendChild(styleSheet);
}

export default ShipperHistory;

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Map, List, User, Bike } from "lucide-react";
import { useShipper } from "../../context/ShipperContext.jsx";

const ShipperLayout = ({ children }) => {
  const location = useLocation();
  const { isOnline } = useShipper();

  const navItems = [
    { path: "/shipper/dashboard", icon: Map, label: "Đơn hàng" },
    { path: "/shipper/history", icon: List, label: "Lịch sử" },
    { path: "/shipper/profile", icon: User, label: "Tài khoản" },
  ];

  return (
    /* SỬA: Dùng h-[100dvh] thay vì min-h-screen, dùng overflow-hidden để chặn rung lắc toàn trang */
    <div className="h-[100dvh] w-full bg-gray-100 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-gray-200">
      {/* Header - Cố định độ cao */}
      <div
        className={`px-4 py-3 text-white flex justify-between items-center transition-colors duration-300 flex-shrink-0 z-50 ${
          isOnline ? "bg-green-600" : "bg-gray-800"
        }`}
      >
        <div className="flex items-center space-x-2">
          <div className="bg-white/20 p-1.5 rounded-xl">
            <Bike size={20} />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase italic">
            Món<span className="text-orange-500">Việt</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-black px-3 py-1 bg-black/30 rounded-full tracking-widest uppercase">
            {isOnline ? "Trực tuyến" : "Ngoại tuyến"}
          </span>
        </div>
      </div>

      {/* Main - Vùng cuộn duy nhất */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden scrolling-touch overscroll-contain pb-24 bg-[#F8F9FA]">
        {/* scrolling-touch giúp vuốt trên iPhone cực mượt */}
        {children}
      </main>

      {/* Bottom navigation - Luôn dính chặt ở đáy container */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center py-2 px-2 z-[100] h-20 shadow-[0_-5px_15px_rgba(0,0,0,0.03)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full py-1 rounded-2xl transition-all duration-200 active:scale-90 ${
                isActive ? "text-green-600" : "text-gray-400"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? "bg-green-50" : ""
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span
                className={`text-[10px] mt-1 uppercase tracking-widest font-black ${
                  isActive ? "opacity-100" : "opacity-60"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default ShipperLayout;

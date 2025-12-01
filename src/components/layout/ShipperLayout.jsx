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
    <div className="min-h-screen bg-gray-100 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {/* Status Bar / Header */}
      <div
        className={`px-4 py-3 text-white flex justify-between items-center transition-colors duration-300 ${
          isOnline ? "bg-green-600" : "bg-gray-800"
        }`}
      >
        <div className="flex items-center space-x-2">
          <div className="bg-white/20 p-1.5 rounded-full">
            <Bike size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-white-800">
            Món<span className="text-orange-500">Việt</span>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium px-2 py-1 bg-black/20 rounded-full">
            {isOnline ? "TRỰC TUYẾN" : "NGOẠI TUYẾN"}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full bg-white border-t border-gray-200 flex justify-around py-2 z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive ? "text-green-600" : "text-gray-400"
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default ShipperLayout;

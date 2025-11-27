import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  Settings,
  LogOut,
  Store,
} from "lucide-react";

const RestaurantLayout = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Tổng quan", path: "/restaurant/dashboard", icon: LayoutDashboard },
    { name: "Thực đơn", path: "/restaurant/menu", icon: UtensilsCrossed },
    { name: "Đơn hàng", path: "/restaurant/orders", icon: ClipboardList },
    { name: "Cài đặt quán", path: "/restaurant/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white fixed h-full hidden md:flex flex-col">
        <div className="p-6 flex items-center space-x-2 border-b border-gray-800">
          <div className="bg-orange-500 p-1.5 rounded-lg">
            <Store className="text-white h-6 w-6" />
          </div>
          <span className="font-bold text-xl">
            MónViệt<span className="text-orange-500">Quán </span>
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-orange-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-gray-800 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span>Quay lại Web</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
};

export default RestaurantLayout;

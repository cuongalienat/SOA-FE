import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  Menu,
  X,
  ChefHat,
  User as UserIcon,
  LogOut,
  Settings,
  Bike, // 🔥 Icon cho Shipper
  Store, // 🔥 Icon cho Shop
} from "lucide-react";
import { useCart } from "../../../context/CartContext.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useWallet } from "../../../hooks/useWallet.jsx";
import LocationSelector from "../LocationSelector/LocationSelector.jsx";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, logout } = useAuth(); // user lấy từ useAuth bạn cung cấp
  const location = useLocation();
  const { wallet, fetchWallet, loading: walletLoading } = useWallet();

  // Fetch wallet when user is logged in
  useEffect(() => {
    if (user) {
      fetchWallet();
    }
  }, [user, fetchWallet]);

  const navLinks = [
    { name: "Trang chủ", path: "/" },
    { name: "Danh mục", path: "/category" },
    { name: "Liên hệ", path: "/contact" },
    { name: "Giỏ hàng", path: "/cart" },
  ];

  const isActive = (path) =>
    location.pathname === path
      ? "text-orange-600 font-semibold"
      : "text-gray-600 hover:text-orange-500";

  // Helper để check role cho gọn
  // Giả sử role trong DB lưu là 'SHIPPER' và 'MERCHANT' (hoặc 'SHOP')
  const isShipper = user?.role === "driver";
  const isShop = user?.role === "restaurant_manager";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Location */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-orange-500 p-1.5 rounded-lg">
                <ChefHat className="text-white h-6 w-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-800">
                Món<span className="text-orange-500">Việt</span>
              </span>
            </Link>
            <div className="hidden md:block">
              <LocationSelector />
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`${isActive(
                  link.path
                )} transition-colors duration-200`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Icons & Auth */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center ml-2 border-l pl-4 border-gray-200">
              {user ? (
                <div className="flex items-center space-x-3 group relative cursor-pointer">
                  <div className="text-right hidden lg:block">
                    <span className="text-sm font-semibold text-gray-700 block">
                      {user.name}
                    </span>
                    {/* Wallet Balance Logic */}
                    {wallet ? (
                      <span className="text-xs text-orange-600 font-bold block">
                        {(Number(wallet.balance) || 0).toLocaleString()}đ
                      </span>
                    ) : (
                      <Link
                        to="/profile?tab=wallet&action=create_wallet"
                        className="text-xs text-orange-500 font-bold hover:underline block flex items-center justify-end"
                      >
                        Mở ví ngay
                      </Link>
                    )}
                  </div>
                  <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                    <UserIcon size={18} />
                  </div>

                  {/* 🔥 UPDATED: Dropdown for Roles & Logout */}
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                    {/* Nút Về trang Shop (Nếu là Shop) */}
                    {isShop && (
                      <Link
                        to="/restaurant" // Hoặc "/merchant" tùy route bạn định nghĩa
                        className="w-full text-left px-4 py-2 text-sm text-blue-600 font-semibold hover:bg-blue-50 flex items-center"
                      >
                        <Store size={16} className="mr-2" /> Kênh người bán
                      </Link>
                    )}

                    {/* Nút Về trang Shipper (Nếu là Shipper) */}
                    {isShipper && (
                      <Link
                        to="/shipper"
                        className="w-full text-left px-4 py-2 text-sm text-green-600 font-semibold hover:bg-green-50 flex items-center"
                      >
                        <Bike size={16} className="mr-2" /> Kênh tài xế
                      </Link>
                    )}

                    {/* Divider nếu có nút đặc biệt */}
                    {(isShop || isShipper) && (
                      <div className="h-px bg-gray-100 my-1"></div>
                    )}

                    <Link
                      to="/profile"
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <Settings size={16} className="mr-2" /> Tài khoản
                    </Link>

                    <div className="h-px bg-gray-100 my-1"></div>

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" /> Đăng xuất
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    to="/signin"
                    className="text-sm font-semibold text-gray-600 hover:text-orange-500 px-3 py-2"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/signup"
                    className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition shadow-md"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>

            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50"
              >
                {link.name}
              </Link>
            ))}

            <div className="border-t border-gray-100 my-2 pt-2">
              {/* 🔥 UPDATED: Mobile Menu logic cho User đã đăng nhập */}
              {user ? (
                <>
                  <div className="px-3 py-2 flex items-center space-x-3 bg-gray-50 rounded-lg mx-2 mb-2">
                    <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                      <UserIcon size={18} />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 block">
                        {user.name}
                      </span>
                      {wallet && (
                        <span className="text-xs text-orange-600 font-bold">
                          Ví: {(Number(wallet.balance) || 0).toLocaleString()}đ
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Nút riêng cho Mobile */}
                  {isShop && (
                    <Link
                      to="/restaurant"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 text-blue-600 font-semibold hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        <Store size={18} /> Kênh người bán
                      </div>
                    </Link>
                  )}

                  {isShipper && (
                    <Link
                      to="/shipper"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 text-green-600 font-semibold hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        <Bike size={18} /> Kênh tài xế
                      </div>
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-gray-700 font-medium hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <Settings size={18} /> Tài khoản
                    </div>
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-red-500 font-medium hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <LogOut size={18} /> Đăng xuất
                    </div>
                  </button>
                </>
              ) : (
                // Chưa đăng nhập
                <div className="px-3 py-2 space-y-2">
                  <Link
                    to="/signin"
                    onClick={() => setIsOpen(false)}
                    className="block text-center w-full border border-gray-300 rounded-lg py-2 text-gray-700 font-semibold"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block text-center w-full bg-orange-500 rounded-lg py-2 text-white font-semibold"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>

            <div className="px-3 py-2">
              <LocationSelector />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

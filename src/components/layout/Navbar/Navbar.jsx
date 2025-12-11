import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  Menu,
  X,
  ChefHat,
  User as UserIcon,
  LogOut,
  Settings,
} from "lucide-react";
import { useCart } from "../../../context/CartContext.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import LocationSelector from "../LocationSelector/LocationSelector.jsx";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();

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
                    <span className="text-xs text-orange-600 font-bold block">
                      {(user.balance || 0).toLocaleString()}đ
                    </span>
                  </div>
                  <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                    <UserIcon size={18} />
                  </div>
                  {/* Dropdown for logout */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
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
              {/* {isAuthenticated && user ? (
                  <>
                    <div className="px-3 py-2 flex items-center space-x-3">
                      <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                        <UserIcon size={18} />
                      </div>
                      <span className="font-semibold text-gray-700">
                        {user.name}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-red-500 font-medium"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : ( */}
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
              {/* )} */}
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

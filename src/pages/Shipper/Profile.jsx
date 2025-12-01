import React from "react";
import {
  User,
  ChevronRight,
  Star,
  CreditCard,
  Settings,
  Bike,
  Shield,
  LogOut,
  FileText,
  Bell,
} from "lucide-react";
import { useShipper } from "../../context/ShipperContext.jsx";
import { useNavigate } from "react-router-dom";

const ShipperProfile = () => {
  const { driverProfile, toggleOnline, isOnline } = useShipper();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Force offline before "logout"
    if (isOnline) toggleOnline();
    navigate("/");
  };

  const MenuItem = ({ icon: Icon, label, subLabel }) => (
    <button className="w-full bg-white p-4 flex items-center justify-between border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-4">
          <Icon size={20} />
        </div>
        <div className="text-left">
          <p className="font-semibold text-gray-800 text-sm">{label}</p>
          {subLabel && <p className="text-xs text-gray-500">{subLabel}</p>}
        </div>
      </div>
      <ChevronRight size={18} className="text-gray-400" />
    </button>
  );

  return (
    <div className="bg-gray-100 min-h-full pb-20">
      {/* Header Profile */}
      <div className="bg-white p-6 pb-8 rounded-b-3xl shadow-sm">
        <div className="flex items-center space-x-4">
          <img
            src={driverProfile.avatar}
            alt="Driver"
            className="w-20 h-20 rounded-full object-cover border-4 border-gray-50"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {driverProfile.name}
            </h2>
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono mr-2">
                {driverProfile.id}
              </span>
            </div>
            <div className="flex items-center space-x-1 bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full inline-flex">
              <Star size={12} fill="currentColor" />
              <span className="text-xs font-bold">{driverProfile.rating}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">
              {driverProfile.totalTrips}
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Chuyến xe
            </p>
          </div>
          <div className="text-center border-l border-r border-gray-100">
            <p className="text-lg font-bold text-green-600">98%</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Nhận đơn
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-blue-600">100%</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Hoàn thành
            </p>
          </div>
        </div>
      </div>

      {/* Wallet Card */}
      <div className="px-4 -mt-4 mb-6">
        <div className="bg-gray-900 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-xs mb-1">Số dư ví tài xế</p>
            <h3 className="text-2xl font-bold">
              {driverProfile.balance.toLocaleString()}đ
            </h3>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition">
            Rút tiền
          </button>
        </div>
      </div>

      {/* Menu Groups */}
      <div className="px-4 space-y-6">
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 ml-2">
            Tài khoản
          </h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <MenuItem
              icon={User}
              label="Thông tin cá nhân"
              subLabel="SĐT, Email, Địa chỉ"
            />
            <MenuItem
              icon={Bike}
              label="Phương tiện"
              subLabel={`${driverProfile.vehicle} • ${driverProfile.plate}`}
            />
            <MenuItem icon={CreditCard} label="Tài khoản ngân hàng" />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 ml-2">
            Ứng dụng
          </h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <MenuItem icon={Bell} label="Cài đặt thông báo" />
            <MenuItem icon={FileText} label="Chính sách & Quy định" />
            <MenuItem icon={Shield} label="Trung tâm hỗ trợ" />
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-600 p-4 rounded-2xl font-bold flex items-center justify-center hover:bg-red-100 transition"
        >
          <LogOut size={20} className="mr-2" /> Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default ShipperProfile;

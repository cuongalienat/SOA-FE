import React, { useEffect, useState } from "react";
import {
  Power,
  MapPin,
  Navigation,
  Phone,
  DollarSign,
  Package,
  ChevronRight,
  Clock,
  ToggleLeft, // Thêm icon này
  ToggleRight, // Thêm icon này
} from "lucide-react";
import { useShipper } from "../../context/ShipperContext.jsx";
import { useNavigate } from "react-router-dom";

const ShipperDashboard = () => {
  const { isOnline, toggleOnline, currentOrder } = useShipper();
  const navigate = useNavigate();
  const [scanRipple, setScanRipple] = useState(false);

  // Animation effect for scanning
  useEffect(() => {
    let interval;
    if (isOnline && !currentOrder) {
      interval = setInterval(() => {
        setScanRipple((prev) => !prev);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOnline, currentOrder]);

  // --- TRẠNG THÁI ĐANG CÓ ĐƠN HÀNG ---
  if (currentOrder) {
    return (
      <div className="p-4 space-y-4 h-full flex flex-col bg-gray-50">
        {/* --- PHẦN MỚI THÊM: THANH ĐIỀU KHIỂN TRẠNG THÁI --- */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">
              Trạng thái nhận đơn
            </p>
            <p
              className={`text-sm font-bold ${isOnline ? "text-green-600" : "text-red-500"
                }`}
            >
              {isOnline ? "Tự động nhận đơn tiếp" : "Nghỉ sau đơn này"}
            </p>
          </div>
          <button
            onClick={toggleOnline}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${isOnline
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
          >
            <span className="text-xs font-bold">
              {isOnline ? "Bật" : "Tắt"}
            </span>
            {isOnline ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
          </button>
        </div>
        {/* -------------------------------------------------- */}

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center text-green-700">
            <div className="animate-pulse w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="font-bold">Bạn đang có đơn hàng!</span>
          </div>
          <span className="text-xs bg-white px-2 py-1 rounded border border-green-200 text-green-800 font-mono">
            {currentOrder.id}
          </span>
        </div>

        {/* Active Order Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex-1 flex flex-col">
          <div className="h-32 bg-gray-200 relative">
            {/* Mock Map Image */}
            <img
              src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/pass/GoogleMapTA.jpg"
              alt="Map"
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center hover:bg-blue-700 transition-colors">
                <Navigation size={16} className="mr-1" /> Mở bản đồ
              </button>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <div className="mb-6">
              <div className="flex items-start mb-4 relative">
                <div className="flex flex-col items-center mr-3 mt-1">
                  <div className="w-4 h-4 rounded-full border-4 border-green-500 bg-white z-10"></div>
                  <div className="w-0.5 h-10 bg-gray-300 -my-1"></div>
                  <div className="w-4 h-4 rounded-full border-4 border-red-500 bg-white z-10"></div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">
                      Lấy hàng
                    </p>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">
                      {currentOrder.restaurant.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {currentOrder.restaurant.address}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">
                      Giao đến
                    </p>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">
                      {currentOrder.customer.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {currentOrder.customer.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl mb-4">
              <div>
                <p className="text-xs text-gray-500">Thu hộ (COD)</p>
                <p className="text-xl font-bold text-green-600">
                  {currentOrder.total.toLocaleString()}đ
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Khoảng cách</p>
                <p className="font-bold text-gray-800">2.4 km</p>
              </div>
            </div>

            <div className="mt-auto">
              <button
                onClick={() => navigate(`/shipper/order/${currentOrder.id}`)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-200 flex items-center justify-center animate-bounce-small transition-all"
              >
                Xem chi tiết & Xử lý <ChevronRight size={20} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MÀN HÌNH CHỜ (GIỮ NGUYÊN) ---
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-green-50 to-transparent -z-10"></div>

      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Xin chào, Tài xế!
        </h1>
        <p className="text-gray-500">
          {isOnline
            ? "Hệ thống đang tự động tìm đơn hàng phù hợp cho bạn..."
            : "Bật trạng thái trực tuyến để bắt đầu nhận đơn tự động."}
        </p>
      </div>

      {/* Main Toggle Button */}
      <div className="relative mb-12">
        {isOnline && (
          <>
            <div
              className={`absolute inset-0 rounded-full bg-green-400 opacity-20 ${scanRipple ? "scale-150" : "scale-100"
                } transition-transform duration-1000`}
            ></div>
            <div
              className={`absolute inset-0 rounded-full bg-green-400 opacity-20 ${!scanRipple ? "scale-150" : "scale-100"
                } transition-transform duration-1000 delay-500`}
            ></div>
          </>
        )}

        <button
          onClick={toggleOnline}
          className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center shadow-2xl border-8 transition-all duration-300 transform active:scale-95 ${isOnline
              ? "bg-green-500 border-green-200 text-white"
              : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
            }`}
        >
          <Power size={48} className={isOnline ? "mb-2" : "mb-2 opacity-50"} />
          <span className="font-bold text-lg">
            {isOnline ? "ONLINE" : "OFFLINE"}
          </span>
        </button>
      </div>

      {/* Stats Summary (Mock) */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-400 mb-1">
            <Clock size={20} className="mx-auto" />
          </div>
          <div className="text-2xl font-bold text-gray-800">4.5h</div>
          <div className="text-xs text-gray-500">Thời gian chạy</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-green-500 mb-1">
            <DollarSign size={20} className="mx-auto" />
          </div>
          <div className="text-2xl font-bold text-gray-800">520k</div>
          <div className="text-xs text-gray-500">Tổng thu hôm nay</div>
        </div>
      </div>
    </div>
  );
};

export default ShipperDashboard;

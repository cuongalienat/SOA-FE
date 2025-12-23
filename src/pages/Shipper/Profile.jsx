import React from "react";
import {
  User,
  ChevronRight,
  Bike,
  LogOut,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useShipper } from "../../context/ShipperContext";
import { useAuth } from "../../hooks/useAuths";
import { useNavigate } from "react-router-dom";

const ShipperProfile = () => {
  const { logout, user: localUser } = useAuth();
  const { profile, isOnline, toggleOnline, currentDelivery, loading } =
    useShipper();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (currentDelivery) {
      alert("⚠️ Bạn đang thực hiện đơn hàng, không thể đăng xuất!");
      return;
    }
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi Món Việt?")) {
      try {
        if (isOnline) await toggleOnline();
        logout();
        window.location.href = "/#/";
      } catch (error) {
        logout();
        window.location.href = "/#/";
      }
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-400">Đang tải hồ sơ...</div>
    );
  if (!profile)
    return (
      <div className="p-10 text-center text-red-500">
        Không tìm thấy dữ liệu.
      </div>
    );

  const displayName = localUser?.name || profile?.user?.name || "Tài xế";
  const displayAvatar = localUser?.avatar || profile?.user?.avatar;
  const userData = profile.user || {};

  const getAvatarSrc = () => {
    if (
      displayAvatar &&
      displayAvatar.trim() !== "" &&
      displayAvatar.startsWith("http")
    ) {
      return displayAvatar;
    }
    // Nếu không có ảnh hoặc link sai, trả về link tạo ảnh chữ cái
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName
    )}&background=2e7d32&color=fff&size=128`;
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-12 font-sans">
      <div className="max-w-md mx-auto">
        {/* UNIFIED PROFILE CARD */}
        <div className="bg-white rounded-b-[50px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden border-b border-gray-100">
          {/* 1. Phần nền trang trí phía trên (Giữ nguyên layout cũ) */}
          <div className="h-32 bg-gradient-to-r from-[#2e7d32] to-[#4caf50] relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          </div>

          {/* 2. Nội dung chính đẩy lên trên nền */}
          <div className="px-6 pb-10 -mt-16 relative z-10 flex flex-col items-center">
            {/* Avatar lớn duy nhất */}
            <div
              className="relative group cursor-pointer"
              onClick={() => navigate("/shipper/edit-profile")}
            >
              <img
                src={getAvatarSrc()}
                alt="Avatar"
                onError={(e) => {
                  // Nếu link ảnh die, tự động chuyển về ảnh chữ cái
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    displayName
                  )}&background=2e7d32&color=fff`;
                }}
                className="w-32 h-32 rounded-[40px] object-cover border-8 border-white shadow-2xl transition-transform active:scale-95"
              />
              <div
                className={`absolute bottom-2 right-2 w-7 h-7 rounded-full border-4 border-white shadow-sm ${
                  isOnline ? "bg-[#4caf50]" : "bg-gray-400"
                }`}
              />
            </div>

            {/* Tên và Trạng thái - Style Dashboard */}
            <h2 className="mt-4 text-2xl font-bold text-[#333] tracking-tight uppercase text-center">
              {displayName}
            </h2>

            <div className="flex items-center gap-2 mt-2">
              <span
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
                  isOnline
                    ? "bg-green-50 text-[#2e7d32] border-green-100"
                    : "bg-gray-50 text-gray-400 border-gray-100"
                }`}
              >
                <ShieldCheck size={12} />
                {isOnline ? "Trực tuyến" : "Ngoại tuyến"}
              </span>
            </div>

            {/* KHỐI THÔNG TIN CHI TIẾT GỘP (Sửa theo Dashboard) */}
            <button
              onClick={() => navigate("/shipper/edit-profile")}
              className="w-full mt-10 bg-white border border-gray-200 rounded-[30px] p-6 shadow-sm active:bg-gray-50 transition-all text-left group"
            >
              <div className="flex justify-between items-center mb-6">
                <p className="text-[11px] font-bold text-[#999] uppercase tracking-[2px]">
                  Thông tin hồ sơ
                </p>
                <ChevronRight
                  size={16}
                  className="text-gray-300 group-hover:text-[#2e7d32]"
                />
              </div>

              <div className="space-y-6">
                {/* Dòng Liên hệ */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#2e7d32]">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#bbb] font-bold uppercase tracking-wider">
                      Số điện thoại
                    </p>
                    <p className="text-base font-bold text-[#333] tracking-tight">
                      {userData.phone || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                {/* Đường kẻ mảnh giữa 2 nội dung */}
                <div className="h-[1px] bg-gray-100 w-full" />

                {/* Dòng Phương tiện */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#2e7d32]">
                    <Bike size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#bbb] font-bold uppercase tracking-wider">
                      Phương tiện ({profile.vehicleType || "BIKE"})
                    </p>
                    <p className="text-base font-bold text-[#333] tracking-tight">
                      {profile.licensePlate || "Chưa có biển số"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-dashed border-gray-200 text-center">
                <p className="text-[11px] font-bold text-[#2e7d32] uppercase tracking-widest opacity-70">
                  Chạm để chỉnh sửa
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* 3. NÚT ĐĂNG XUẤT */}
        <div className="px-8 mt-10">
          <button
            onClick={handleLogout}
            className="w-full py-5 text-[#d32f2f] font-bold text-[12px] uppercase tracking-[2px] bg-white rounded-[25px] border border-[#ffcdd2] shadow-sm flex items-center justify-center gap-3 active:bg-red-50 transition-all"
          >
            <LogOut size={16} strokeWidth={2.5} />
            Đăng xuất tài khoản
          </button>
        </div>

        <div className="text-center mt-12 mb-8">
          <p className="text-[10px] text-[#ccc] font-bold uppercase tracking-[4px]">
            Món Việt Mobile
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShipperProfile;

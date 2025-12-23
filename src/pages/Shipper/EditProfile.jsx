import React, { useState, useEffect } from "react";
import { ArrowLeft, Camera, User, Bike, Save, Phone, Lock } from "lucide-react";
import { useShipper } from "../../context/ShipperContext";
import { useAuth } from "../../hooks/useAuths";
import { useNavigate } from "react-router-dom";
import { updateShipperProfileService } from "../../services/shipperServices";

const ShipperEditProfile = () => {
  const { profile, fetchProfile } = useShipper();
  const { token, updateUser, user: localUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    avatar: "",
    phone: "", // SĐT sẽ gửi lên DB
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: localUser?.name || profile.user?.name || "",
        avatar: profile.user?.avatar || "",
        phone: profile.user?.phone || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Cập nhật SĐT lên Database (DB)
      await updateShipperProfileService({ phone: formData.phone });

      // 2. Cập nhật Tên và Avatar vào Local Storage (Key: user)
      // Hàm này sẽ tự gọi localStorage.setItem("user", ...)
      updateUser({
        name: formData.name,
        avatar: formData.avatar,
      });

      // 3. Làm mới dữ liệu shipper (xe, biển số)
      await fetchProfile();

      alert("Cập nhật thành công! 🎉");

      // 4. Quay về Profile (Dùng Hash để không đi lạc)
      window.location.hash = "/shipper/profile";

      // Nếu Navbar vẫn chưa đổi tên, hãy thêm dòng dưới:
      // window.location.reload();
    } catch (error) {
      console.error("Update error:", error);
      alert("Lỗi: Không thể cập nhật");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-10 font-sans">
      <div className="bg-white p-4 flex items-center shadow-sm sticky top-0 z-10 border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <ArrowLeft size={24} className="text-[#333]" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold uppercase tracking-tight mr-10">
          Chỉnh sửa hồ sơ
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="p-5 max-w-md mx-auto space-y-6">
        {/* AVATAR SECTION */}
        <div className="flex flex-col items-center py-4">
          <div className="relative">
            <img
              src={
                formData.avatar ||
                `https://ui-avatars.com/api/?name=${formData.name}`
              }
              className="w-28 h-28 rounded-[35px] object-cover border-4 border-white shadow-xl"
              alt="Avatar"
            />
          </div>
        </div>

        {/* THÔNG TIN CÁ NHÂN (NAME - LOCAL, PHONE - DB) */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-[#999] uppercase tracking-widest ml-2">
            Thông tin tài khoản
          </p>
          <div className="bg-white rounded-[25px] border border-gray-200 p-2 shadow-sm">
            <div className="flex items-center p-4 border-b border-gray-50">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#2e7d32] mr-4">
                <User size={18} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-[#bbb] font-bold uppercase">
                  Tên hiển thị
                </p>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full font-bold text-[#333] focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center p-4">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#2e7d32] mr-4">
                <Phone size={18} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-[#bbb] font-bold uppercase">
                  Số điện thoại
                </p>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full font-bold text-[#333] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* THÔNG TIN PHƯƠNG TIỆN (READ ONLY) */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-[#999] uppercase tracking-widest ml-2 flex items-center gap-1">
            <Lock size={10} /> Thông tin phương tiện (Admin quản lý)
          </p>
          <div className="bg-gray-100 rounded-[25px] border border-gray-200 p-2 opacity-70 cursor-not-allowed">
            <div className="flex items-center p-4 border-b border-white">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 mr-4">
                <Bike size={18} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-[#bbb] font-bold uppercase">
                  Loại xe
                </p>
                <p className="font-bold text-gray-500 uppercase">
                  {profile.vehicleType}
                </p>
              </div>
            </div>
            <div className="flex items-center p-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 mr-4">
                <Bike size={18} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-[#bbb] font-bold uppercase">
                  Biển số xe
                </p>
                <p className="font-bold text-gray-500">
                  {profile.licensePlate}
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-[#2e7d32] text-white rounded-[25px] font-bold text-xs uppercase tracking-[2px] shadow-lg shadow-green-900/20 active:scale-95 transition-all"
        >
          {loading ? "Đang xử lý..." : "Lưu thay đổi hồ sơ"}
        </button>
      </form>
    </div>
  );
};

export default ShipperEditProfile;

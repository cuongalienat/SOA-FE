import React, { useRef, useState } from "react";
import { Upload, Save, Power, QrCode, Image as ImageIcon } from "lucide-react";

const Settings = () => {
  const info = {
    isOpen: true,
    name: "Quán Ăn Ngon",
    phone: "0123456789",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    coverImage: null,
    qrCode: null,
  };
  const toggleStatus = () => {
    // Logic để đổi trạng thái mở/đóng cửa quán
    info.isOpen = !info.isOpen;
    console.log("Toggled status:", info.isOpen ? "Open" : "Closed");
  };
  const updateInfo = (updatedFields) => {
    // Cập nhật thông tin quán (giả lập)
    Object.assign(info, updatedFields);
    console.log("Updated info:", info);
  };

  const coverInputRef = useRef(null);
  const qrInputRef = useRef(null);

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateInfo({ [field]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt quán</h1>
        <button
          onClick={toggleStatus}
          className={`px-6 py-3 rounded-xl font-bold flex items-center shadow-sm transition ${info.isOpen
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-red-500 text-white hover:bg-red-600"
            }`}
        >
          <Power size={20} className="mr-2" />
          {info.isOpen ? "Đang Mở Cửa" : "Đang Đóng Cửa"}
        </button>
      </div>

      <div className="space-y-8">
        {/* General Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Thông tin cơ bản
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên quán
              </label>
              <input
                value={info.name}
                onChange={(e) => updateInfo({ name: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                value={info.phone}
                onChange={(e) => updateInfo({ phone: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ
              </label>
              <input
                value={info.address}
                onChange={(e) => updateInfo({ address: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cover Image */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <ImageIcon size={20} className="mr-2 text-blue-500" /> Ảnh bìa
                quán
              </h2>
            </div>

            <div
              className="aspect-video bg-gray-100 rounded-xl overflow-hidden relative group cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 transition"
              onClick={() => coverInputRef.current.click()}
            >
              {info.coverImage ? (
                <img
                  src={info.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Upload size={32} />
                  <span className="mt-2 text-sm">Tải ảnh lên</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition flex items-center justify-center">
                <div className="bg-white px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition transform translate-y-2 group-hover:translate-y-0">
                  Thay đổi
                </div>
              </div>
            </div>
            <input
              type="file"
              ref={coverInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "coverImage")}
            />
          </div>

          {/* QR Code */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <QrCode size={20} className="mr-2 text-orange-500" /> Mã QR
                Thanh toán
              </h2>
            </div>

            <div
              className="aspect-square max-w-[200px] mx-auto bg-gray-100 rounded-xl overflow-hidden relative group cursor-pointer border-2 border-dashed border-gray-300 hover:border-orange-500 transition"
              onClick={() => qrInputRef.current.click()}
            >
              {info.qrCode ? (
                <img
                  src={info.qrCode}
                  alt="QR"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Upload size={32} />
                  <span className="mt-2 text-sm">Tải QR</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition flex items-center justify-center">
                <div className="bg-white px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition transform translate-y-2 group-hover:translate-y-0">
                  Thay đổi
                </div>
              </div>
            </div>
            <input
              type="file"
              ref={qrInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "qrCode")}
            />
            <p className="text-center text-xs text-gray-500 mt-4">
              Khách hàng sẽ quét mã này để thanh toán.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 flex items-center">
            <Save size={20} className="mr-2" /> Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

import React, { useEffect, useRef, useState } from "react";
import { Upload, Save, Power, QrCode, Image as ImageIcon } from "lucide-react";
import { useShop } from "../../hooks/useShop.jsx";

const Settings = () => {
  const {
    shop,
    loading,
    loadMyShop,
    updateShopInfo,
    toggleShopStatus,
  } = useShop();

  const [coverFile, setCoverFile] = useState(null);
  const [qrFile, setQrFile] = useState(null);

  const [coverPreview, setCoverPreview] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const coverInputRef = useRef(null);
  const qrInputRef = useRef(null);

  // Load shop lần đầu
  useEffect(() => {
    loadMyShop();
  }, [loadMyShop]);

  // Khi shop thay đổi → sync form + ảnh từ BE
  useEffect(() => {
    if (!shop) return;

    setForm({
      name: shop.name || "",
      phone: shop.phones?.[0] || "",
      address: shop.address || "",
    });

    setCoverPreview(shop.coverImage || null);
    setQrPreview(shop.qrImage || null);

    setCoverFile(null);
    setQrFile(null);
  }, [shop]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
      if (qrPreview?.startsWith("blob:")) URL.revokeObjectURL(qrPreview);
    };
  }, [coverPreview, qrPreview]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    if (type === "coverImage") {
      setCoverFile(file);
      setCoverPreview(previewUrl);
    }

    if (type === "qrImage") {
      setQrFile(file);
      setQrPreview(previewUrl);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("address", form.address);
    formData.append("phones[]", form.phone);

    if (coverFile) formData.append("coverImage", coverFile);
    if (qrFile) formData.append("qrImage", qrFile);

    await updateShopInfo(formData);
    // ❗ KHÔNG set form ở đây – chờ BE trả shop mới
  };

  if (loading && !shop) {
    return <div className="p-6">Loading shop...</div>;
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt quán</h1>
        <button
          onClick={toggleShopStatus}
          className={`px-6 py-3 rounded-xl font-bold flex items-center ${
            shop?.isOpen
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <Power size={20} className="mr-2" />
          {shop?.isOpen ? "Đang Mở Cửa" : "Đang Đóng Cửa"}
        </button>
      </div>

      {/* Info */}
      <div className="bg-white p-6 rounded-2xl border">
        <h2 className="font-bold mb-4">Thông tin cơ bản</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            value={form.name}
            onChange={e => handleChange("name", e.target.value)}
            placeholder="Tên quán"
            className="p-3 border rounded-xl"
          />
          <input
            value={form.phone}
            onChange={e => handleChange("phone", e.target.value)}
            placeholder="Số điện thoại"
            className="p-3 border rounded-xl"
          />
          <input
            value={form.address}
            onChange={e => handleChange("address", e.target.value)}
            placeholder="Địa chỉ"
            className="p-3 border rounded-xl md:col-span-2"
          />
        </div>
      </div>

      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cover */}
        <div className="bg-white p-6 rounded-2xl border">
          <h2 className="font-bold mb-3 flex items-center">
            <ImageIcon size={18} className="mr-2" /> Ảnh bìa
          </h2>
          <div
            className="aspect-video bg-gray-100 rounded-xl cursor-pointer flex items-center justify-center"
            onClick={() => coverInputRef.current.click()}
          >
            {coverPreview ? (
              <img src={coverPreview} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <Upload />
            )}
          </div>
          <input
            type="file"
            hidden
            ref={coverInputRef}
            accept="image/*"
            onChange={e => handleImageUpload(e, "coverImage")}
          />
        </div>

        {/* QR */}
        <div className="bg-white p-6 rounded-2xl border">
          <h2 className="font-bold mb-3 flex items-center">
            <QrCode size={18} className="mr-2" /> QR Thanh toán
          </h2>
          <div
            className="aspect-square max-w-[200px] mx-auto bg-gray-100 rounded-xl cursor-pointer flex items-center justify-center"
            onClick={() => qrInputRef.current.click()}
          >
            {qrPreview ? (
              <img src={qrPreview} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <Upload />
            )}
          </div>
          <input
            type="file"
            hidden
            ref={qrInputRef}
            accept="image/*"
            onChange={e => handleImageUpload(e, "qrImage")}
          />
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold flex items-center"
        >
          <Save size={20} className="mr-2" /> Lưu thay đổi
        </button>
      </div>
    </div>
  );
};

export default Settings;

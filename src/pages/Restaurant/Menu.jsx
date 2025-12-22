import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { CATEGORIES } from "../../constants.js";
import { useItems } from "../../hooks/useItems.jsx";
import { useShop } from "../../hooks/useShop.jsx";
import { useToast } from "../../context/ToastContext.jsx";

const Menu = () => {
  const {
    items,
    loadItemsShop,
    createShopItem,
    updateShopItem,
    deleteShopItem,
    loading
  } = useItems();

  const { shop } = useShop();
  const { showToast } = useToast();

  const [filterCategory, setFilterCategory] = useState("Tất cả");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: CATEGORIES[1] || "Món ăn",
    imageUrl: "",
    description: ""
  });

  // Load menu của shop
  useEffect(() => {
    if (!shop?._id) {
      console.log("Shop ID not available yet.");
      return ;
    }
    console.log("Loading items for shop ID:", shop._id);
    loadItemsShop(shop._id);
  }, [shop?._id]);

  // Filter menu theo category
  const filteredMenu = items.filter(item => {
    if (filterCategory === "Tất cả") return true;
    return item.categoryId?.name === filterCategory;
  });

  // ===== HANDLERS =====

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      price: "",
      category: CATEGORIES[1] || "Món ăn",
      imageUrl: "",
      description: ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl || "",
      description: item.description || ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa món này không?")) return;

    try {
      await deleteShopItem(id);
      showToast("Xóa món thành công", "success");
    } catch (err) {
      showToast("Xóa món thất bại", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingItem) {
        await updateShopItem(editingItem._id, formData);
        showToast("Cập nhật món thành công", "success");
      } else {
        await createShopItem({
          ...formData,
          shopId: shop._id // BẮT BUỘC
        });
        showToast("Thêm món mới thành công", "success");
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast("Có lỗi xảy ra", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== RENDER =====

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý thực đơn</h1>
        <button
          onClick={openAddModal}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center"
        >
          <Plus size={18} className="mr-2" /> Thêm món
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm ${
              filterCategory === cat
                ? "bg-gray-900 text-white"
                : "bg-white border text-gray-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenu.length === 0 ? (
          // EMPTY STATE
          <div className="col-span-full text-center py-20 text-gray-500">
            <p className="text-lg font-semibold">
              Chưa có món nào trong danh mục này 🍽️
            </p>
            <p className="text-sm mt-2">
              Hãy thêm món mới hoặc chọn danh mục khác
            </p>
          </div>
        ) : (
          filteredMenu.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl border shadow-sm overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={item.imageUrl || "https://via.placeholder.com/400"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 bg-white rounded shadow hover:text-blue-600"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 bg-white rounded shadow hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between">
                  <h3 className="font-bold">{item.name}</h3>
                  <span className="text-orange-600 font-bold">
                    {Number(item.price).toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {item.description}
                </p>
                <span className="inline-block mt-3 px-2 py-1 text-xs bg-gray-100 rounded">
                  {item.categoryId?.name}
                </span>
              </div>
            </div>
          ))
        )}
      </div>


      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">
                {editingItem ? "Sửa món" : "Thêm món"}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                placeholder="Tên món"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                type="number"
                required
                placeholder="Giá"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full border p-2 rounded"
              >
                {CATEGORIES.filter((c) => c !== "Tất cả").map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>

              <input
                placeholder="URL hình ảnh"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  className="w-16 h-16 object-cover rounded"
                />
              )}

              <textarea
                placeholder="Mô tả"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Hủy
                </button>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded"
                >
                  {editingItem ? "Lưu" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;

import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { useItems } from "../../hooks/useItems.jsx";
import { useShop } from "../../hooks/useShop.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { usePagination, getVisiblePages } from "../../hooks/usePagination.jsx";
import {
  createCategoryService,
  deleteCategoryService,
  fetchCategoriesByShopService,
  updateCategoryService,
} from "../../services/categoryServices.jsx";

const Menu = () => {
  const {
    itemsShop,
    loadItemsShop,
    createShopItem,
    updateShopItem,
    deleteShopItem,
    loading
  } = useItems();

  const { shop, loadMyShop } = useShop();
  const { showToast } = useToast();

  const [filterCategoryId, setFilterCategoryId] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination
  const { currentPage, limit, goToPage, resetPage } = usePagination(1, 9);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [categories, setCategories] = useState([]);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryId: "",
    description: ""
  });

  const categoryOptions = categories;
  const filterOptions = [
    { id: "all", name: "Tất cả" },
    ...categoryOptions.map((c) => ({ id: c._id, name: c.name }))
  ];

  useEffect(() => {
    console.log("AUTO LOAD SHOP");
    loadMyShop();
  }, [loadMyShop]);

  // Load menu của shop
  useEffect(() => {
    if (!shop) {
      loadMyShop();
      return;
    }
    if (!shop._id) {
      console.log("Shop ID not available yet.");
      return;
    }
    console.log("Loading items for shop ID:", shop._id);
    loadItemsShop(shop._id);
  }, [shop, loadMyShop]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!shop?._id) return;
      try {
        const res = await fetchCategoriesByShopService(shop._id);
        setCategories(res.data || res);
      } catch (err) {
        setCategories([]);
      }
    };

    fetchCategories();
  }, [shop?._id]);

  const refreshCategories = async () => {
    if (!shop?._id) return;
    const res = await fetchCategoriesByShopService(shop._id);
    setCategories(res.data || res);
  };

  // Filter menu theo category
  const filteredMenu = itemsShop.filter(item => {
    if (filterCategoryId === "all") return true;
    const itemCategoryId = typeof item.categoryId === "string" ? item.categoryId : item.categoryId?._id;
    return itemCategoryId === filterCategoryId;
  });

  // Reset page when filter changes
  useEffect(() => {
    resetPage();
  }, [filterCategoryId]);

  // Client-side Pagination Logic
  const totalPages = Math.ceil(filteredMenu.length / limit);
  const currentItems = filteredMenu.slice((currentPage - 1) * limit, currentPage * limit);

  // ===== HANDLERS =====

  const openAddModal = () => {
    setEditingItem(null);
    setImageFile(null);
    setImagePreview(null);
    setNewCategoryName("");
    setEditingCategoryId(null);
    setEditingCategoryName("");
    setFormData({
      name: "",
      price: "",
      categoryId: categoryOptions[0]?._id || "",
      description: ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setImageFile(null);
    setImagePreview(null);
    setNewCategoryName("");
    setEditingCategoryId(null);
    setEditingCategoryName("");

    const itemCategoryId = typeof item.categoryId === "string" ? item.categoryId : item.categoryId?._id;
    setFormData({
      name: item.name,
      price: item.price,
      categoryId: itemCategoryId || "",
      description: item.description || ""
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      showToast("Vui lòng nhập tên danh mục", "error");
      return;
    }

    setIsAddingCategory(true);
    try {
      const res = await createCategoryService({ name: newCategoryName.trim() });
      const created = res.data || res;

      await refreshCategories();
      setFormData((prev) => ({ ...prev, categoryId: created._id }));
      setNewCategoryName("");
      showToast("Thêm danh mục thành công", "success");
    } catch (err) {
      showToast(err?.message || "Thêm danh mục thất bại", "error");
    } finally {
      setIsAddingCategory(false);
    }
  };

  const startEditCategory = () => {
    if (!formData.categoryId) {
      showToast("Vui lòng chọn danh mục", "error");
      return;
    }
    const current = categories.find((c) => c._id === formData.categoryId);
    if (!current) {
      showToast("Không tìm thấy danh mục", "error");
      return;
    }
    setEditingCategoryId(current._id);
    setEditingCategoryName(current.name || "");
  };

  const cancelEditCategory = () => {
    setEditingCategoryId(null);
    setEditingCategoryName("");
  };

  const handleUpdateCategory = async () => {
    if (!editingCategoryId) return;
    if (!editingCategoryName.trim()) {
      showToast("Tên danh mục không được rỗng", "error");
      return;
    }
    setIsUpdatingCategory(true);
    try {
      await updateCategoryService(editingCategoryId, {
        name: editingCategoryName.trim(),
      });
      await refreshCategories();
      showToast("Cập nhật danh mục thành công", "success");
      cancelEditCategory();
    } catch (err) {
      showToast(err?.message || "Cập nhật danh mục thất bại", "error");
    } finally {
      setIsUpdatingCategory(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!formData.categoryId) {
      showToast("Vui lòng chọn danh mục", "error");
      return;
    }

    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) return;

    setIsDeletingCategory(true);
    try {
      await deleteCategoryService(formData.categoryId);
      await refreshCategories();

      setFormData((prev) => ({
        ...prev,
        categoryId: categories.filter((c) => c._id !== prev.categoryId)[0]?._id || "",
      }));

      showToast("Xóa danh mục thành công", "success");
    } catch (err) {
      showToast(err?.message || "Xóa danh mục thất bại", "error");
    } finally {
      setIsDeletingCategory(false);
    }
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

    if (!formData.categoryId) {
      showToast("Vui lòng chọn danh mục", "error");
      return;
    }

    setIsSubmitting(true);

    try {

      const payload = (() => {
        if (!imageFile) {
          return editingItem
            ? formData
            : {
              ...formData,
              shopId: shop._id
            };
        }

        const fd = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            fd.append(key, value);
          }
        });
        if (!editingItem) {
          fd.append("shopId", shop._id);
        }
        fd.append("image", imageFile);
        return fd;
      })();

      if (editingItem) {
        await updateShopItem(editingItem._id, payload);
        showToast("Cập nhật món thành công", "success");
      } else {
        await createShopItem(payload);
        showToast("Thêm món mới thành công", "success");
      }

      // Reload to get populated category name immediately (no F5)
      if (shop?._id) {
        await loadItemsShop(shop._id);
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
        {filterOptions.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategoryId(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm ${filterCategoryId === cat.id
              ? "bg-gray-900 text-white"
              : "bg-white border text-gray-600"
              }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentItems.length === 0 ? (
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
          currentItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col"
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

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between mb-2">
                  <h3 className="font-bold line-clamp-1" title={item.name}>{item.name}</h3>
                  <span className="text-orange-600 font-bold ml-2 shrink-0">
                    {Number(item.price).toLocaleString("vi-VN")} đ
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-1">
                  {item.description}
                </p>
                <div className="mt-3">
                  <span className="inline-block px-2 py-1 text-xs bg-gray-100 rounded">
                    {item.categoryId?.name}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4 pb-8">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Trước
          </button>

          {getVisiblePages(currentPage, totalPages).map((page, index) =>
            page === "..." ? (
              <span key={`dots-${index}`} className="px-4 py-2 text-gray-400">...</span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-4 py-2 border rounded-lg transition ${currentPage === page
                  ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                  : "hover:bg-gray-50 text-gray-700 bg-white"
                  }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Sau
          </button>
        </div>
      )}


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

              {/* Category (compact add/edit/delete) */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="flex-1 border p-2 rounded"
                    disabled={
                      isSubmitting ||
                      isAddingCategory ||
                      isUpdatingCategory ||
                      isDeletingCategory ||
                      categoryOptions.length === 0
                    }
                  >
                    <option value="">Chọn danh mục</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={startEditCategory}
                    disabled={
                      isSubmitting ||
                      isAddingCategory ||
                      isUpdatingCategory ||
                      isDeletingCategory ||
                      !formData.categoryId
                    }
                    className={`px-3 py-2 border rounded ${isSubmitting ||
                      isAddingCategory ||
                      isUpdatingCategory ||
                      isDeletingCategory ||
                      !formData.categoryId
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-gray-50"
                      }`}
                  >
                    Sửa
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteCategory}
                    disabled={
                      isSubmitting ||
                      isAddingCategory ||
                      isUpdatingCategory ||
                      isDeletingCategory ||
                      !formData.categoryId
                    }
                    className={`px-3 py-2 border rounded ${isSubmitting ||
                      isAddingCategory ||
                      isUpdatingCategory ||
                      isDeletingCategory ||
                      !formData.categoryId
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-gray-50"
                      }`}
                  >
                    {isDeletingCategory ? "..." : "Xóa"}
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    value={editingCategoryId ? editingCategoryName : newCategoryName}
                    onChange={(e) =>
                      editingCategoryId
                        ? setEditingCategoryName(e.target.value)
                        : setNewCategoryName(e.target.value)
                    }
                    placeholder={
                      editingCategoryId
                        ? "Đổi tên danh mục"
                        : "Thêm danh mục mới (vd: Best Seller)"
                    }
                    className="flex-1 border p-2 rounded"
                    disabled={
                      isSubmitting ||
                      isAddingCategory ||
                      isUpdatingCategory ||
                      isDeletingCategory
                    }
                  />

                  {editingCategoryId ? (
                    <>
                      <button
                        type="button"
                        onClick={handleUpdateCategory}
                        disabled={
                          isSubmitting ||
                          isAddingCategory ||
                          isUpdatingCategory ||
                          isDeletingCategory
                        }
                        className={`px-3 py-2 rounded bg-gray-900 text-white ${isSubmitting ||
                          isAddingCategory ||
                          isUpdatingCategory ||
                          isDeletingCategory
                          ? "opacity-70 cursor-not-allowed"
                          : "hover:bg-gray-800"
                          }`}
                      >
                        {isUpdatingCategory ? "Đang lưu..." : "Lưu"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditCategory}
                        disabled={
                          isSubmitting ||
                          isAddingCategory ||
                          isUpdatingCategory ||
                          isDeletingCategory
                        }
                        className={`px-3 py-2 border rounded ${isSubmitting ||
                          isAddingCategory ||
                          isUpdatingCategory ||
                          isDeletingCategory
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:bg-gray-50"
                          }`}
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      disabled={
                        isSubmitting ||
                        isAddingCategory ||
                        isUpdatingCategory ||
                        isDeletingCategory
                      }
                      className={`px-3 py-2 rounded bg-gray-900 text-white ${isSubmitting ||
                        isAddingCategory ||
                        isUpdatingCategory ||
                        isDeletingCategory
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-gray-800"
                        }`}
                    >
                      {isAddingCategory ? "Đang thêm..." : "Thêm"}
                    </button>
                  )}
                </div>

                {categoryOptions.length === 0 && (
                  <div className="text-sm text-gray-500">
                    Chưa có danh mục, hãy thêm danh mục trước.
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border p-2 rounded"
              />

              {/* <input
               // placeholder="URL hình ảnh"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className="w-full border p-2 rounded"
              /> */}

              {(imagePreview || editingItem?.imageUrl) && (
                <img
                  src={imagePreview || editingItem?.imageUrl}
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
                  disabled={isSubmitting}
                  className={`px-4 py-2 border rounded ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                >
                  Hủy
                </button>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className={`px-4 py-2 bg-orange-500 text-white rounded flex items-center gap-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-orange-600"
                    }`}
                >
                  {isSubmitting && (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {editingItem ? (isSubmitting ? "Đang lưu..." : "Lưu") : (isSubmitting ? "Đang thêm..." : "Thêm")}
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

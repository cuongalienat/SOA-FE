import React, { useState, useEffect, useMemo } from "react";
import { Filter, Search, X, Check } from "lucide-react"; // Import thêm icon
import FoodCard from "../../components/FoodCard.jsx";
import { CATEGORIES } from "../../constants.js";
import { useProduct } from "../../context/ProductContext.jsx";
import { usePagination, getVisiblePages } from "../../hooks/usePagination.jsx";
import { useSearchParams } from "react-router-dom";

export default function Category() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialSearch = searchParams.get("search") || "";

  // Context sản phẩm
  const { products: items, loading, loadProducts } = useProduct();

  // Pagination hook
  const { currentPage, limit, goToPage } = usePagination(initialPage, 42);

  // --- STATE QUẢN LÝ FILTER & MODAL ---
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // State lưu các điều kiện lọc
  const [filters, setFilters] = useState({
    category: "Tất cả",
    priceRange: "all", // all, <30k, 30k-70k, >70k
    merchant: "all",
    sort: "default", // default, price_asc, price_desc
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load sản phẩm khi mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Reset trang về 1 khi thay đổi search hoặc filter
  useEffect(() => {
    if (currentPage !== 1) {
      goToPage(1);
    }
  }, [filters, debouncedSearch]);

  // Sync URL (Optional - giữ đơn giản chỉ sync page và search)
  useEffect(() => {
    const params = {};
    if (currentPage > 1) params.page = currentPage;
    if (debouncedSearch) params.search = debouncedSearch;
    setSearchParams(params);
  }, [currentPage, debouncedSearch]);

  // --- LOGIC LẤY DANH SÁCH NHÀ HÀNG (MERCHANT) ---
  // Lấy list tên quán duy nhất từ danh sách sản phẩm để đưa vào bộ lọc
  const uniqueMerchants = useMemo(() => {
    if (!Array.isArray(items)) return [];
    // Giả sử item có field shopName hoặc merchant.name
    const names = items
      .map((item) => item.shopName || item.merchant?.name || "Khác")
      .filter(Boolean);
    return ["all", ...new Set(names)];
  }, [items]);

  // --- LOGIC LỌC & SẮP XẾP ---
  const filteredFood = useMemo(() => {
    if (!Array.isArray(items)) return [];
    let results = [...items];

    // 1. Lọc theo Search
    if (debouncedSearch) {
      const lowerSearch = debouncedSearch.toLowerCase();
      results = results.filter((item) =>
        item.name?.toLowerCase().includes(lowerSearch)
      );
    }

    // 2. Lọc theo Category
    if (filters.category !== "Tất cả") {
      results = results.filter(
        (item) =>
          item.category === filters.category ||
          item.categoryId?.name === filters.category
      );
    }

    // 3. Lọc theo Nhà hàng (Merchant)
    if (filters.merchant !== "all") {
      results = results.filter(
        (item) => (item.shopName || item.merchant?.name) === filters.merchant
      );
    }

    // 4. Lọc theo Giá
    if (filters.priceRange !== "all") {
      results = results.filter((item) => {
        const price = item.price || 0;
        switch (filters.priceRange) {
          case "under_30":
            return price < 30000;
          case "30_70":
            return price >= 30000 && price <= 70000;
          case "above_70":
            return price > 70000;
          default:
            return true;
        }
      });
    }

    // 5. Sắp xếp
    if (filters.sort === "price_asc") {
      results.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (filters.sort === "price_desc") {
      results.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else {
      // Mặc định: Random shuffle (Giữ logic cũ của bạn)
      // Lưu ý: Shuffle mỗi lần render có thể gây giật UI, nên dùng sort ổn định hơn.
      // Nhưng nếu muốn giữ "Ngẫu nhiên":
      for (let i = results.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [results[i], results[j]] = [results[j], results[i]];
      }
    }

    return results;
  }, [items, filters, debouncedSearch]);

  // --- PAGINATION CLIENT SIDE ---
  const totalPages = Math.ceil(filteredFood.length / limit);
  const validPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
  const currentItems = filteredFood.slice(
    (validPage - 1) * limit,
    validPage * limit
  );

  const paginate = (pageNumber) => {
    goToPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- HANDLER CHO MODAL ---
  const handleApplyFilter = (newFilters) => {
    setFilters(newFilters);
    setIsFilterOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* HEADER: Tiêu đề + Search + Nút Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Khám phá món ăn</h1>
          <p className="text-gray-500 mt-1">
            {filteredFood.length} kết quả tìm thấy
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Search Input */}
          <div className="relative group w-full sm:w-auto">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm món ăn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Filter Button - Kích hoạt Modal */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl shadow-sm border transition-all ${
              isFilterOpen ||
              filters.category !== "Tất cả" ||
              filters.merchant !== "all" ||
              filters.priceRange !== "all"
                ? "bg-orange-50 border-orange-200 text-orange-600"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter size={20} />
            <span className="font-medium">Bộ lọc</span>
          </button>
        </div>
      </div>

      {/* --- GRID HIỂN THỊ MÓN ĂN --- */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : filteredFood.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Không tìm thấy món nào
          </h3>
          <p className="text-gray-500 mt-2">
            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
          </p>
          <button
            onClick={() => {
              setFilters({
                category: "Tất cả",
                priceRange: "all",
                merchant: "all",
                sort: "default",
              });
              setSearchTerm("");
            }}
            className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
          {currentItems.map((item) => (
            <FoodCard key={item._id || item.id} food={item} />
          ))}
        </div>
      )}

      {/* --- PAGINATION --- */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-12 pb-10">
          <button
            onClick={() => paginate(validPage - 1)}
            disabled={validPage === 1}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Trước
          </button>

          {getVisiblePages(validPage, totalPages).map((page, index) =>
            page === "..." ? (
              <span key={`dots-${index}`} className="px-4 py-2 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => paginate(page)}
                className={`px-4 py-2 border rounded-lg transition ${
                  validPage === page
                    ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                    : "hover:bg-gray-50 text-gray-700 bg-white"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => paginate(validPage + 1)}
            disabled={validPage === totalPages}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Sau
          </button>
        </div>
      )}

      {/* --- MODAL BỘ LỌC (POPUP) --- */}
      {isFilterOpen && (
        <FilterModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          currentFilters={filters}
          onApply={handleApplyFilter}
          merchants={uniqueMerchants}
        />
      )}
    </div>
  );
}

// --- COMPONENT CON: MODAL FILTER ---
// Tách ra để code gọn hơn
const FilterModal = ({
  isOpen,
  onClose,
  currentFilters,
  onApply,
  merchants,
}) => {
  // State nội bộ của modal để user chỉnh sửa xong mới bấm "Áp dụng"
  const [tempFilters, setTempFilters] = useState(currentFilters);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end sm:justify-center items-center sm:items-start sm:pt-20">
      {/* Overlay backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full sm:w-[500px] h-full sm:h-auto sm:max-h-[85vh] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-in-right sm:animate-fade-in-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">Bộ lọc tìm kiếm</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* 1. Sắp xếp */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
              Sắp xếp theo
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "default", label: "Ngẫu nhiên / Mặc định" },
                { value: "price_asc", label: "Giá: Thấp đến Cao" },
                { value: "price_desc", label: "Giá: Cao đến Thấp" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() =>
                    setTempFilters({ ...tempFilters, sort: opt.value })
                  }
                  className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                    tempFilters.sort === opt.value
                      ? "bg-orange-50 border-orange-500 text-orange-700 font-medium"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Khoảng giá */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
              Khoảng giá
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "all", label: "Tất cả mức giá" },
                { value: "under_30", label: "Dưới 30.000đ" },
                { value: "30_70", label: "30.000đ - 70.000đ" },
                { value: "above_70", label: "Trên 70.000đ" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                    tempFilters.priceRange === opt.value
                      ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span
                    className={`text-sm ${
                      tempFilters.priceRange === opt.value
                        ? "text-orange-900 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {opt.label}
                  </span>
                  <input
                    type="radio"
                    name="price"
                    className="hidden"
                    checked={tempFilters.priceRange === opt.value}
                    onChange={() =>
                      setTempFilters({ ...tempFilters, priceRange: opt.value })
                    }
                  />
                  {tempFilters.priceRange === opt.value && (
                    <Check size={16} className="text-orange-600" />
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-white flex gap-4">
          <button
            onClick={() =>
              setTempFilters({
                category: "Tất cả",
                priceRange: "all",
                merchant: "all",
                sort: "default",
              })
            }
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
          >
            Đặt lại
          </button>
          <button
            onClick={() => onApply(tempFilters)}
            className="flex-[2] px-6 py-3 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:bg-orange-600 active:scale-95 transition-all"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};

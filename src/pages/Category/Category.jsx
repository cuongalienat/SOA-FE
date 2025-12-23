import React, { useState, useEffect, useMemo } from "react";
import { Filter, Search } from "lucide-react";
import FoodCard from "../../components/FoodCard.jsx";
import { CATEGORIES } from "../../constants.js";
import { useProduct } from "../../context/ProductContext.jsx";
import { usePagination, getVisiblePages } from "../../hooks/usePagination.jsx";
import { useSearchParams } from "react-router-dom";

export default function Category() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialCategory = searchParams.get("category") || "Tất cả";
  const initialSearch = searchParams.get("search") || "";

  // Use global product context
  const { products: items, loading, loadProducts } = useProduct();

  // Use local state for pagination logic (same as before)
  const { currentPage, limit, goToPage } = usePagination(initialPage, 42);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  // Debounce search term isn't strictly necessary for client-side filtering but good for URL sync
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update URL state
  useEffect(() => {
    const params = {};
    if (currentPage > 1) params.page = currentPage;
    if (selectedCategory !== "Tất cả") params.category = selectedCategory;
    if (debouncedSearch) params.search = debouncedSearch;
    setSearchParams(params);
  }, [currentPage, selectedCategory, debouncedSearch]);


  // Load ALL items using Global Context
  useEffect(() => {
    loadProducts();
  }, []); // Run once on mount (Context will handle caching)

  // Reset page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      goToPage(1);
    }
  }, [selectedCategory, debouncedSearch]);

  const rawItems = Array.isArray(items) ? items : [];

  // 1. Client-side Filtering
  // 1. Client-side Filtering & Randomization
  const filteredFood = useMemo(() => {
    // a. Filter
    let results = rawItems.filter((item) => {
      const matchesCategory = selectedCategory === "Tất cả" || item.category === selectedCategory || item.categoryId?.name === selectedCategory;
      const matchesSearch = !debouncedSearch || item.name?.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // b. Shuffle (Fisher-Yates) consistent for this filter state
    // Clone array to avoid mutating source
    results = [...results];
    for (let i = results.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [results[i], results[j]] = [results[j], results[i]];
    }

    return results;
  }, [rawItems, selectedCategory, debouncedSearch]);

  // 2. Client-side Pagination
  const totalPages = Math.ceil(filteredFood.length / limit);
  // Ensure currentPage is valid
  const validPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));

  const currentItems = filteredFood.slice((validPage - 1) * limit, validPage * limit);

  const paginate = (pageNumber) => {
    goToPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setSearchTerm(""); // Optionally clear search when changing category, or keep it. Let's keep it independent?
    // User expectation: usually category filters apply to current results. 
    // But here filtering is client side combinational. So it's fine.
    // If I clear search, I should also update state.
    // Let's NOT clear search to allow "Search 'Chicken' in 'Asian'"
    goToPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Danh mục món ăn</h1>
          <p className="text-gray-500 mt-1">Khám phá các món ngon theo sở thích của bạn</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative group w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Tìm món ăn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>
          <div className="flex items-center space-x-2 bg-white p-2 border border-gray-200 rounded-xl shadow-sm">
            <Filter size={20} className="text-gray-500 ml-2" />
            <span className="text-sm font-medium text-gray-700 pr-2">Bộ lọc: {selectedCategory}</span>
          </div>
        </div>
      </div>

      {/* Category List */}
      <div className="flex space-x-3 overflow-x-auto pb-6 scrollbar-hide mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${selectedCategory === cat
              ? "bg-orange-500 text-white border-orange-500 shadow-md transform scale-105"
              : "bg-white text-gray-600 border-gray-200 hover:border-orange-200 hover:text-orange-500 hover:bg-orange-50"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredFood.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Không tìm thấy món nào</h3>
          <p className="text-gray-500 mt-2">Thử thay đổi từ khóa tìm kiếm hoặc danh mục.</p>
          <button
            onClick={() => {
              setSelectedCategory("Tất cả");
              setSearchTerm("");
            }}
            className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
        {currentItems.map((item) => (
          <FoodCard key={item._id || item.id} food={item} />
        ))}
      </div>

      {/* Pagination */}
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
              <span key={`dots-${index}`} className="px-4 py-2 text-gray-400">...</span>
            ) : (
              <button
                key={page}
                onClick={() => paginate(page)}
                className={`px-4 py-2 border rounded-lg transition ${validPage === page
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
    </div>
  );
}

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Star, Clock, ShoppingBag, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { useShop } from "../../hooks/useShop";
import { useItems } from "../../hooks/useItems";
import { useRatings } from "../../hooks/useRatings";
import { useCategories } from "../../hooks/useCategories"; // Import useCategories
import { calculateAverageRating } from "../../utils/ratingUtils";
import FoodCard from "../../components/FoodCard";

const ShopDetail = () => {
    const { id } = useParams();
    const { shop, shopDashboard, loadShopDashboard, loadShopById, loading: shopLoading } = useShop();
    const { items, loadItemsShop, loading: itemsLoading } = useItems();
    const { ratingsShop, getRatingByShop } = useRatings();
    const { categoriesByShop, fetchCategoriesByShop } = useCategories(); // Use categories hook
    const [reviewPage, setReviewPage] = React.useState(1);

    useEffect(() => {
        if (id) {
            loadShopById(id);
            loadItemsShop(id);
            loadShopDashboard(id);
            getRatingByShop(id);
            fetchCategoriesByShop(id); // Fetch categories
        }
    }, [id]);

    const ratingData = React.useMemo(() => {
        return calculateAverageRating(ratingsShop?.data);
    }, [ratingsShop]);

    const paginatedReviews = React.useMemo(() => {
        if (!ratingsShop?.data) return [];
        const start = (reviewPage - 1) * 8;
        return ratingsShop.data.slice(start, start + 8);
    }, [ratingsShop, reviewPage]);

    const totalPages = Math.ceil((ratingsShop?.data?.length || 0) / 8);



    if (shopLoading || !shop) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }
    if (!shopDashboard) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Shop Header / Banner */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Shop Image/Avatar Placeholder */}
                        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 font-bold text-3xl">
                            {shop.name ? shop.name.charAt(0).toUpperCase() : "S"}
                        </div>

                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{shop.name}</h1>
                            <div className="flex flex-col space-y-2 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <MapPin size={16} className="mr-2 text-gray-400" />
                                    <span>{shop.address}</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock size={16} className="mr-2 text-gray-400" />
                                    <span className={shop.isOpen ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                                        {shop.isOpen ? "Đang mở cửa" : "Đóng cửa"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-8 bg-gray-50 px-6 py-4 rounded-xl border border-gray-100">
                            <div className="text-center">
                                <div className="flex items-center justify-center text-yellow-500 font-bold text-lg">
                                    <Star className="fill-current w-5 h-5 mr-1" />
                                    <span>{ratingData?.avgStars}</span>
                                </div>
                                <div className="text-xs text-gray-500">{ratingData?.length} Đánh giá</div>
                            </div>
                            <div className="w-px h-8 bg-gray-200"></div>
                            <div className="text-center">
                                <div className="font-bold text-lg text-gray-900">
                                    {items ? items.length : shopDashboard.stats.items}
                                </div>
                                <div className="text-xs text-gray-500">Món ăn</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <ShoppingBag className="mr-2 text-orange-500" />
                    Thực đơn
                </h2>

                {itemsLoading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                    </div>
                ) : items.length > 0 ? (
                    <div className="space-y-12">
                        {/* Group items by category. We iterate through categories to maintain order (if any), 
                            or we can just group dynamically. Since we fetched categories, let's use them as the base. */}
                        {categoriesByShop.map(category => {
                            // Filter items for this category
                            const categoryItems = items.filter(item => {
                                const itemCatId = typeof item.categoryId === 'object' ? item.categoryId._id || item.categoryId.id : item.categoryId;
                                const catId = category._id || category.id;
                                return itemCatId === catId;
                            });

                            if (categoryItems.length === 0) return null;

                            return (
                                <div key={category._id || category.id} id={`category-${category._id || category.id}`}>
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 pl-2 border-l-4 border-orange-500">
                                        {category.name}
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                        {categoryItems.map(item => (
                                            <FoodCard key={item._id} food={item} />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Items without category or category not in list (Uncategorized) */}
                        {items.filter(item => {
                            const itemCatId = typeof item.categoryId === 'object' ? item.categoryId._id || item.categoryId.id : item.categoryId;
                            // Check if this item's category is NOT in the fetched categories list
                            return !categoriesByShop.some(c => (c._id || c.id) === itemCatId);
                        }).length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 pl-2 border-l-4 border-gray-400">
                                        Khác
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                        {items.filter(item => {
                                            const itemCatId = typeof item.categoryId === 'object' ? item.categoryId._id || item.categoryId.id : item.categoryId;
                                            return !categoriesByShop.some(c => (c._id || c.id) === itemCatId);
                                        }).map(item => (
                                            <FoodCard key={item._id} food={item} />
                                        ))}
                                    </div>
                                </div>
                            )}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <p className="text-gray-500">Chưa có món ăn nào.</p>
                    </div>
                )}
            </div>

            {/* Reviews Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-200">
                <div className="flex items-center mb-8">
                    <MessageSquare className="mr-3 text-orange-500" size={28} />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Đánh giá cửa hàng</h2>
                        <div className="flex items-center mt-1">
                            <div className="flex text-yellow-500 mr-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(ratingData?.avgStars || 0) ? "fill-current" : "text-gray-300"}`} />
                                ))}
                            </div>
                            <span className="text-gray-600 text-sm font-medium">
                                {ratingData?.avgStars ? ratingData.avgStars.toFixed(1) : "0"} ({ratingData?.length || 0} đánh giá)
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {paginatedReviews.map((review, index) => (
                        <div key={review._id || index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold mr-3 text-sm">
                                        {(review.userId?.username?.charAt(0) || "U").toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{review.userId?.username || "Người dùng ẩn danh"}</h4>
                                        <div className="flex text-yellow-500 text-xs mt-0.5">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} className={`w-3 h-3 ${i < review.stars ? "fill-current" : "text-gray-300"}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm pl-13 ml-13 line-clamp-3">
                                {review.comment}
                            </p>
                        </div>
                    ))}
                </div>

                {(!ratingsShop?.data || ratingsShop.data.length === 0) && (
                    <div className="text-center py-10 text-gray-500">
                        Chưa có đánh giá nào cho cửa hàng này.
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-10 space-x-4">
                        <button
                            onClick={() => setReviewPage(p => Math.max(1, p - 1))}
                            disabled={reviewPage === 1}
                            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <span className="text-gray-600 font-medium">
                            Trang {reviewPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => setReviewPage(p => Math.min(totalPages, p + 1))}
                            disabled={reviewPage === totalPages}
                            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopDetail;

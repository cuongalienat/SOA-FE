import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Star, Clock, ShoppingBag } from "lucide-react";
import { useShop } from "../../hooks/useShop";
import { useItems } from "../../hooks/useItems";
import FoodCard from "../../components/FoodCard";

const ShopDetail = () => {
    const { id } = useParams();
    const { shop, shopDashboard, loadShopDashboard, loadShopById, loading: shopLoading } = useShop();
    const { items, loadItemsShop, loading: itemsLoading } = useItems();

    useEffect(() => {
        if (id) {
            loadShopById(id);
            loadItemsShop(id);
            loadShopDashboard(id);
        }
    }, [id]);

    useEffect(() => {
        console.log("shopDashboard updated:", shopDashboard);
    }, [shopDashboard]);

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
                                    <span>{shopDashboard.stats.rating}</span>
                                </div>
                                <div className="text-xs text-gray-500">Đánh giá</div>
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
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {items.map(item => (
                            <FoodCard key={item._id} food={item} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <p className="text-gray-500">Chưa có món ăn nào.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopDetail;

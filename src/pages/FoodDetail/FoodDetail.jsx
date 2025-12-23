import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Star,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { fetchItemByIdService } from "../../services/itemServices.jsx";
import { useShop } from "../../hooks/useShop.jsx";
import { useCategories } from "../../hooks/useCategories.jsx";

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { addToCart } = useCart();
  const { shop, loadShopById } = useShop();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);

  const { category, getCategoryById } = useCategories();

  // Review State
  const [reviews, setReviews] = useState([
    { id: 1, user: "Nguyễn Văn A", rating: 5, comment: "Món ăn rất ngon, đậm đà hương vị!", date: "2024-03-15" },
    { id: 2, user: "Trần Thị B", rating: 4, comment: "Giao hàng nhanh, đóng gói cẩn thận.", date: "2024-03-14" },
  ]);

  useEffect(() => {
    const fetchFood = async () => {
      setLoading(true);
      try {
        const data = await fetchItemByIdService(id);
        await getCategoryById(data.data.categoryId);
        // Handle various response structures
        if (data && data.data) {
          setFood(data.data);
        } else {
          setFood(data);
        }
      } catch (error) {
        console.error("Failed to fetch food details:", error);
        showToast("Không tìm thấy món ăn", "error");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFood();
    }
  }, [id, navigate, showToast]);

  useEffect(() => {
    if (food && food.shopId) {
      // Check if shopId is object or string
      const sId = typeof food.shopId === 'object' ? (food.shopId._id || food.shopId.id) : food.shopId;
      if (sId) {
        loadShopById(sId);
      }
    }
  }, [food]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!food) return null;



  if (!food) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="relative rounded-3xl overflow-hidden h-[300px] md:h-[400px] shadow-2xl">
          <img
            src={food.imageUrl}
            alt={food.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center">
          <div className="mb-4">
            {/* Shop Name */}
            {shop && (
              <Link to={`/shop/${shop._id || shop.id}`} className="inline-flex items-center text-gray-800 hover:text-orange-600 transition group mb-1">
                <div className="w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full mr-2 font-bold text-xs">
                  {shop.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-lg font-bold group-hover:underline">
                  {shop.name}
                </span>
              </Link>
            )}

            <div className="flex items-center space-x-2 mt-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wider">
                {category?.name}
              </span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
            {food.name}
          </h1>

          <div className="text-2xl font-bold text-orange-600 mb-6">
            {Number(food.price).toLocaleString('vi-VN')} VNĐ
          </div>

          {/* Description */}
          <div className="bg-gray-50 p-6 rounded-2xl mb-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2 flex items-center">
              Mô tả
            </h3>
            <p className="text-gray-600 leading-relaxed text-base">
              {food.description}
            </p>
          </div>

          {/* Rating */}

          <div className="flex space-x-4">
            <button
              onClick={() => {
                addToCart(food);
                showToast("Đã thêm món vào giỏ hàng thành công!", "success");
              }}
              className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold text-base hover:bg-orange-600 transition shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <ShoppingBag size={18} />
              <span>Thêm vào đơn hàng</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <div className="flex items-center mb-8">
          <div className="flex text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < Math.floor(food.rating || 3.6) ? "fill-current" : "text-gray-300"}`} />
            ))}
          </div>
          <span className="ml-2 text-sm font-bold text-gray-600">
            {food.rating || 3.6} (128 đánh giá)
          </span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Đánh giá & Nhận xét (128)</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Reviews List */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-xl font-bold mb-4">Đánh giá từ khách hàng</h3>
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold mr-3">
                      {review.user.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{review.user}</h4>
                      <div className="flex text-yellow-500 text-xs">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">{review.date}</span>
                </div>
                <p className="text-gray-600 ml-13 pl-13 mt-2">
                  {review.comment}
                </p>
              </div>
            ))}

            {reviews.length === 0 && (
              <p className="text-center text-gray-500 py-10">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;

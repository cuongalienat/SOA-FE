import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  ChefHat,
} from "lucide-react";
import { FOOD_DATA } from "../../constants.js";
import { useCart } from "../../context/CartContext.jsx";
import { useItems } from "../../hooks/useItems.jsx";
import { useToast } from "../../context/ToastContext.jsx";
// import {
//   generateFoodDescription,
//   askChefAI,
// } from "../../services/geminiService.js";

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { addToCart } = useCart();
  const { items, loadItems, loading } = useItems();
  useEffect(() => {
    loadItems();
  }, []);

  const [aiDescription, setAiDescription] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [chefQuery, setChefQuery] = useState("");
  const [chefAnswer, setChefAnswer] = useState("");
  const [loadingChef, setLoadingChef] = useState(false);

  // Review State
  const [reviews, setReviews] = useState([
    { id: 1, user: "Nguyễn Văn A", rating: 5, comment: "Món ăn rất ngon, đậm đà hương vị!", date: "2024-03-15" },
    { id: 2, user: "Trần Thị B", rating: 4, comment: "Giao hàng nhanh, đóng gói cẩn thận.", date: "2024-03-14" },
  ]);


  useEffect(() => {
    // Chỉ load nếu items chưa có (tối ưu hạn chế gọi API thừa)
    if (items.length === 0) {
      loadItems();
    }
  }, []);

  // Tìm món ăn trong danh sách items đã tải
  const food = items.find((f) => f._id === id || f.id === id);

  // 2. Xử lý Redirect an toàn
  useEffect(() => {
    // Chỉ redirect khi ĐÃ tải xong (loading = false) mà vẫn không thấy food
    if (!loading && items.length > 0 && !food) {
      navigate("/");
    }
  }, [food, loading, items, navigate]);

  const handleEnhanceDescription = async () => {
    if (!food) return;
    setLoadingAi(true);
    const desc = await generateFoodDescription(food.name, food.category);
    setAiDescription(desc);
    setLoadingAi(false);
  };


  if (!food) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="relative rounded-3xl overflow-hidden h-[400px] md:h-[500px] shadow-2xl">
          <img
            src={food.imageUrl}
            alt={food.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold uppercase tracking-wider">
              {food.category}
            </span>
            <div className="flex items-center text-yellow-500">
              <Star className="fill-current w-4 h-4" />
              <span className="ml-1 text-sm font-bold text-gray-700">
                {food.rating} (128 đánh giá)
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {food.name}
          </h1>

          <div className="text-3xl font-bold text-orange-600 mb-6">
            {Number(food.price).toLocaleString('vi-VN')} VNĐ
          </div>

          {/* AI Description Feature */}
          <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2 flex items-center">
              Mô tả
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {aiDescription || food.description}
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => {
                addToCart(food);
                showToast("Đã thêm món vào giỏ hàng thành công!", "success");
              }}
              className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <ShoppingBag size={20} />
              <span>Thêm vào đơn hàng</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Đánh giá & Nhận xét</h2>

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

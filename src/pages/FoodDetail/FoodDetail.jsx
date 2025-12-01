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
// import {
//   generateFoodDescription,
//   askChefAI,
// } from "../../services/geminiService.js";

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  // const handleAskChef = async () => {
  //   if (!chefQuery.trim()) return;
  //   setLoadingChef(true);
  //   const answer = await askChefAI(
  //     `Liên quan đến món ${food?.name}: ${chefQuery}`
  //   );
  //   setChefAnswer(answer);
  //   setLoadingChef(false);
  // };

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
            {food.price} VNĐ
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

          {/* Ask Chef AI Feature */}
          <div className="bg-blue-50 p-6 rounded-2xl mb-8 border border-blue-100">
            <div className="flex items-center mb-3 text-blue-800 font-bold">
              <ChefHat size={20} className="mr-2" />
              Hỏi Đầu bếp AI
            </div>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={chefQuery}
                onChange={(e) => setChefQuery(e.target.value)}
                placeholder="Món này có chứa gluten không?"
                className="flex-1 px-3 py-2 border border-blue-200 rounded-lg text-sm outline-none focus:border-blue-400"
              />
              {/* <button
                onClick={handleAskChef}
                disabled={loadingChef}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                Hỏi
              </button> */}
            </div>
            {chefAnswer && (
              <p className="text-sm text-blue-900 bg-blue-100 p-3 rounded-lg italic">
                "{chefAnswer}"
              </p>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => {
                addToCart(food);
                alert("Đã thêm món vào giỏ hàng thành công!");
              }}
              className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <ShoppingBag size={20} />
              <span>Thêm vào đơn hàng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;

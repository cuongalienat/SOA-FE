import React, { useEffect } from "react"; 
import { Link } from "react-router-dom";
import { Star, Plus } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useShop } from "../hooks/useShop.jsx";

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();
  const { shop, loadShopById } = useShop();
  useEffect(() => {
    loadShopById(food.shopId);
  }, [food.shopId]);
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
      <div className="relative h-40 overflow-hidden">
        <img
          src={food.imageUrl}
          alt={food.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center shadow-sm">
          <Star className="w-3 h-3 text-yellow-500 mr-1 fill-yellow-500" />
          {/* <span className="text-xs font-bold text-gray-800">{food.rating}</span> */}
        </div>
      </div>

      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-[10px] font-medium text-orange-500 uppercase tracking-wide">
              {food.category}
            </span>
            <Link to={`/food/${food._id}`}>
              <h3 className="text-base font-bold text-gray-800 leading-tight mb-1 hover:text-orange-600 transition line-clamp-2 min-h-[44px]">
                {food.name}
              </h3>
            </Link>
          </div>
        </div>
        <div className="text-xs text-gray-500 mb-3 h-8">
          <p className="font-semibold text-gray-700 truncate">
            {shop?.name || "Homeless"}
          </p>
          <p className="text-[10px] truncate">
            {shop?.address || "Unknown Address"}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-gray-900">
            {Number(food.price).toLocaleString('vi-VN')}đ
          </span>
          <button
            onClick={() => addToCart(food)}
            className="bg-gray-900 hover:bg-orange-500 text-white p-1.5 rounded-lg transition-colors duration-300 flex items-center justify-center"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;

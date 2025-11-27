import React from "react";
import FoodCard from "../../components/FoodCard.jsx";
import { FOOD_DATA } from "../../constants.js";

const Deals = () => {
  // Simulate deals by picking a few items and slashing prices
  const dealItems = FOOD_DATA.slice(0, 3).map((item) => ({
    ...item,
    price: item.price * 0.8, // 20% off
    name: `${item.name} (Ưu đãi đặc biệt)`,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Ưu đãi nóng hôm nay 🔥
        </h1>
        <p className="text-gray-500">Hãy chớp lấy trước khi nguội!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {dealItems.map((food) => (
          <div key={food.id} className="relative">
            <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-md">
              GIẢM 20%
            </div>
            <FoodCard food={food} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Deals;

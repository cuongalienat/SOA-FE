import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import FoodCard from "../../components/FoodCard.jsx";
import { FOOD_DATA, CATEGORIES } from "../../constants.js";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFood = FOOD_DATA.filter((food) => {
    const matchesCategory =
      selectedCategory === "Tất cả" || food.category === selectedCategory;
    const matchesSearch = food.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <section className="relative bg-orange-50 h-[500px] flex items-center overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-yellow-200 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 font-semibold text-sm">
                ⚡️ Giao nhanh nhanh chóng, tin cậy
              </span>
              <h1 className="text-5xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                Thèm là có, <span className="text-orange-500">Món ngon</span>{" "}
                <br /> gõ cửa ngay
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                Khám phá thiên đường ẩm thực quanh đây. Đặt món dễ dàng, giao
                hàng nhanh chóng. Lấp đầy chiếc bụng đói của bạn ngay lập tức!
              </p>

              <div className="flex bg-white p-2 rounded-2xl shadow-lg max-w-md border border-gray-100">
                <Search className="text-gray-400 ml-2 my-auto" />
                <input
                  type="text"
                  placeholder="Tìm kiếm món ăn, nhà hàng, ..."
                  className="flex-1 p-3 outline-none text-gray-700 placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition font-medium">
                  Tìm kiếm
                </button>
              </div>
            </div>

            <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1605311572312-a926afe51604?q=80&w=762&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Món ăn ngon"
                className="w-full max-w-md object-cover rounded-[2rem] shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Danh mục</h2>
          <div className="flex space-x-2">
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Filter size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-orange-500 text-white shadow-md transform scale-105"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-orange-200 hover:text-orange-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Food Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Phổ biến gần bạn
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredFood.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
        {filteredFood.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              Không tìm thấy món nào. Hãy thử danh mục hoặc từ khóa khác.
            </p>
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ưu đãi</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredFood.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
        {filteredFood.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              Không tìm thấy món nào. Hãy thử danh mục hoặc từ khóa khác.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

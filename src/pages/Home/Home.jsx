import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/category?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/category');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <section className="relative bg-orange-50 h-[600px] flex items-center overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-yellow-200 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 space-y-8">
              <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 font-semibold text-sm">
                Giao nhanh nhanh chóng, tin cậy
              </span>
              <h1 className="text-5xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                Thèm là có, <span className="text-orange-500">Món ngon</span>{" "}
                <br /> gõ cửa ngay
              </h1>
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                Khám phá thiên đường ẩm thực quanh đây. Đặt món dễ dàng, giao
                hàng nhanh chóng. Lấp đầy chiếc bụng đói của bạn ngay lập tức!
              </p>

              <div className="flex bg-white p-2 rounded-2xl shadow-xl max-w-lg border border-gray-100 transition-shadow hover:shadow-2xl">
                <Search className="text-gray-400 ml-3 my-auto" />
                <input
                  type="text"
                  placeholder="Tìm kiếm món ăn, nhà hàng, ..."
                  className="flex-1 p-4 outline-none text-gray-700 placeholder-gray-400 text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={handleSearch}
                  className="bg-gray-900 text-white px-8 py-3 rounded-xl hover:bg-orange-600 transition font-bold text-lg"
                >
                  Tìm kiếm
                </button>
              </div>

            </div>

            <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center relative">
              <div className="absolute -z-10 w-[120%] h-[120%] bg-orange-500/10 rounded-full blur-3xl"></div>
              <img
                src="https://images.unsplash.com/photo-1605311572312-a926afe51604?q=80&w=762&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Món ăn ngon"
                className="w-full max-w-md object-cover rounded-[2rem] shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
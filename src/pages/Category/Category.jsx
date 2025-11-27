import React from "react";
import FoodCard from "../../components/FoodCard";

export default function Category() {
  const foodItems = [
    {
      id: 1,
      name: "Cơm Gà Hải Nam",
      description: "Món cơm gà đúng chuẩn Singapore",
      price: 45000,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1604908176997-125f25cc6f2d?auto=format&w=800",
    },
    {
      id: 2,
      name: "Trà Sữa Matcha",
      description: "Matcha đậm vị, trân châu mềm",
      price: 35000,
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1603052875529-9b5f1a5f0de2?auto=format&w=800",
    },
  ];

  return (
    <div className="page-container">
      <h1>Kết quả tìm kiếm</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {foodItems.map((item) => (
          <FoodCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

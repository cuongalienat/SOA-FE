import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./FoodDetail.css";

export default function FoodDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Giả lập dữ liệu món ăn
    const food = {
        id,
        name: `Món ăn #${id}`,
        restaurant: `Quán Ăn Ngon #${id}`,
        price: "50.000đ",
        location: "Hà Nội",
        image: `https://source.unsplash.com/800x600/?food,${id}`,
        desc: "Món ăn được chế biến từ nguyên liệu tươi ngon, hương vị đậm đà, phù hợp với mọi lứa tuổi. Giao hàng nhanh chóng, an toàn.",
    };

    const handleOrderClick = () => {
        navigate(`/order/${food.id}`);
    };

    return (
        <div className="food-detail">
            <button className="back-btn" onClick={() => navigate(-1)}>← Quay lại</button>

            <div className="food-detail-container">
                <img src={food.image} alt={food.name} className="food-detail-img" />

                <div className="food-detail-info">
                    <h1>{food.name}</h1>
                    <p className="restaurant">{food.restaurant}</p>
                    <p className="location">📍 {food.location}</p>
                    <p className="price">{food.price}</p>
                    <p className="desc">{food.desc}</p>

                    <button className="order-btn" onClick={handleOrderClick}>
                        Đặt món ngay
                    </button>
                </div>
            </div>
        </div>
    );
}

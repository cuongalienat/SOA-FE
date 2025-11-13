import React from "react";
import { useParams, Link } from "react-router-dom";
import "./Category.css";

export default function Category() {
    const { type } = useParams();

    const allFoods = [
        { id: 1, name: "Cơm Gà Hải Nam", category: "com", price: "45.000đ", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f2d?auto=format&fit=crop&w=800&q=80" },
        { id: 2, name: "Cơm Tấm Sườn Bì", category: "com", price: "50.000đ", img: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=800&q=80" },
        { id: 3, name: "Trà Sữa Matcha", category: "tra-sua", price: "35.000đ", img: "https://images.unsplash.com/photo-1603052875529-9b5f1a5f0de2?auto=format&fit=crop&w=800&q=80" },
        { id: 4, name: "Trà Sữa Trân Châu", category: "tra-sua", price: "30.000đ", img: "https://images.unsplash.com/photo-1585314062340-f1a5a6c7c90b?auto=format&fit=crop&w=800&q=80" },
        { id: 5, name: "Pizza Hải Sản", category: "pizza", price: "120.000đ", img: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=800&q=80" },
        { id: 6, name: "Pizza Phô Mai", category: "pizza", price: "100.000đ", img: "https://images.unsplash.com/photo-1601924638867-3ec3b6e0b42d?auto=format&fit=crop&w=800&q=80" },
        { id: 7, name: "Mì Xào Bò", category: "mi", price: "55.000đ", img: "https://images.unsplash.com/photo-1617196034796-73dfa1df60d3?auto=format&fit=crop&w=800&q=80" },
        { id: 8, name: "Gà Rán Giòn", category: "ga-ran", price: "65.000đ", img: "https://images.unsplash.com/photo-1606756790138-8ec8d9a7f013?auto=format&fit=crop&w=800&q=80" },
    ];

    const filteredFoods = allFoods.filter(food => food.category === type);

    const categoryNames = {
        "com": "Cơm",
        "tra-sua": "Trà sữa",
        "pizza": "Pizza",
        "mi": "Mì",
        "ga-ran": "Gà rán"
    };

    return (
        <div className="category-page">
            <h1>{categoryNames[type] || "Danh mục"} 🍱</h1>

            {filteredFoods.length > 0 ? (
                <div className="food-grid">
                    {filteredFoods.map((item) => (
                        <Link to={`/food/${item.id}`} key={item.id} className="food-card">
                            <img src={item.img} alt={item.name} />
                            <div className="food-info">
                                <h3>{item.name}</h3>
                                <p className="price">{item.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="no-result">Chưa có món nào trong danh mục này.</p>
            )}
        </div>
    );
}

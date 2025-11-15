import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Order.css";

export default function Order() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [note, setNote] = useState("");

    const food = {
        id,
        name: "Cơm Gà Hải Nam",
        price: 45000,
        img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f2d?auto=format&fit=crop&w=800&q=80",
    };

    const handleAddToCart = () => {
        alert(`Đã thêm ${quantity} x ${food.name} vào giỏ hàng!`);
        navigate("/cart");
    };

    return (
        <div className="order-page">
            <div className="order-card">
                <img src={food.img} alt={food.name} className="order-img" />
                <div className="order-info">
                    <h2>{food.name}</h2>
                    <p className="price">{food.price.toLocaleString()}đ</p>

                    <div className="quantity-section">
                        <label>Số lượng:</label>
                        <div className="quantity-control">
                            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity((q) => q + 1)}>+</button>
                        </div>
                    </div>

                    <div className="note-section">
                        <label>Ghi chú:</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Không hành, ít cay..."
                        />
                    </div>

                    <button className="add-to-cart-btn" onClick={handleAddToCart}>
                        Thêm vào giỏ hàng
                    </button>
                </div>
            </div>
        </div>
    );
}

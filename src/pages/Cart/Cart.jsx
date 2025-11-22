import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./Cart.css";

export default function Cart() {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="cart-page">
      <h1>🛒 Giỏ hàng của bạn</h1>

      {/* Giỏ hàng trống */}
      {cart.length === 0 ? (
        <p>Hiện chưa có món nào trong giỏ hàng.</p>
      ) : (
        <div className="cart-list">
          {cart.map((item) => (
            <div className="cart-card" key={item.id}>
              <img src={item.image} alt={item.name} className="cart-img" />

              <div className="cart-info">
                <h3>{item.name}</h3>
                <p className="cart-price">{item.price.toLocaleString()}đ</p>
                <p className="cart-qty">Số lượng: {item.quantity}</p>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Xoá
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Nút thanh toán */}
      {cart.length > 0 && (
        <button className="checkout-btn" onClick={handleCheckout}>
          Xác nhận thanh toán
        </button>
      )}
    </div>
  );
}

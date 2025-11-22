import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./FoodDetail.css";
import "../Deals/Deals.css"; // Dùng lại CSS của voucher để giữ nguyên style

export default function FoodDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Fake data món ăn (sau này gọi API)
  const food = {
    id,
    name: `Món ăn #${id}`,
    restaurant: `Quán Ăn Ngon #${id}`,
    price: 50000,
    priceText: "50.000đ",
    location: "Hà Nội",
    image: `https://source.unsplash.com/800x600/?food,${id}`,
    desc: "Món ăn được chế biến từ nguyên liệu tươi ngon, hương vị đậm đà.",
  };

  // Fake voucher theo brand
  const vouchers = [
    {
      id: 1,
      brand: food.restaurant,
      image:
        "https://upload.wikimedia.org/wikipedia/vi/0/09/Highlands_Coffee_Logo.png",
      title: "Giảm 10% khi đặt Online",
      desc: "Áp dụng cho mọi đơn hàng trong hôm nay",
      code: "FOOD10",
      expiry: "HSD: 31/12/2025",
    },
    {
      id: 2,
      brand: food.restaurant,
      image: "https://upload.wikimedia.org/wikipedia/commons/6/6e/KFC_logo.svg",
      title: "Giảm 20% cho đơn > 100K",
      desc: "Áp dụng nội thành",
      code: "SAVE20",
      expiry: "HSD: 15/01/2026",
    },
  ];

  // Copy voucher
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Đã sao chép mã: ${code}`);
  };

  // ⚡ LOGIC ĐẶT MÓN (đã khôi phục)
  const handleOrder = () => {
    addToCart({
      id: food.id,
      name: food.name,
      price: food.price,
      image: food.image,
      quantity: 1,
    });

    alert("Đã thêm món vào giỏ hàng!");

    navigate("/cart");
  };

  return (
    <div className="food-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <div className="food-detail-container">
        <img src={food.image} alt={food.name} className="food-detail-img" />

        <div className="food-detail-info">
          <h1>{food.name}</h1>
          <p className="restaurant">{food.restaurant}</p>
          <p className="location">📍 {food.location}</p>
          <p className="price">{food.priceText}</p>
          <p className="desc">{food.desc}</p>

          <button className="order-btn" onClick={handleOrder}>
            Đặt món ngay
          </button>
        </div>
      </div>

      {/* Voucher Section */}
      <section className="food-voucher-section">
        <h2>Voucher dành riêng cho món này</h2>

        <div className="voucher-grid">
          {vouchers.map((v) => (
            <div className="voucher-card" key={v.id}>
              <div className="voucher-left">
                <img src={v.image} alt={v.brand} />
              </div>

              <div className="voucher-right">
                <h3>{v.title}</h3>
                <p className="desc">{v.desc}</p>
                <p className="expiry">{v.expiry}</p>

                <div className="voucher-actions">
                  <span className="voucher-code">{v.code}</span>
                  <button
                    className="copy-btn"
                    onClick={() => handleCopy(v.code)}
                  >
                    Lưu mã
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

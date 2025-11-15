import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
    const foodItems = [
        {
            id: 1,
            name: "Cơm Gà Hải Nam",
            location: "Quận 3, TP.HCM",
            price: "45.000đ",
            img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f2d?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            name: "Trà Sữa Matcha",
            location: "Quận 1, TP.HCM",
            price: "35.000đ",
            img: "https://images.unsplash.com/photo-1603052875529-9b5f1a5f0de2?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 3,
            name: "Pizza Hải Sản",
            location: "Quận 10, TP.HCM",
            price: "120.000đ",
            img: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 4,
            name: "Bún Bò Huế",
            location: "Quận Phú Nhuận",
            price: "50.000đ",
            img: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 5,
            name: "Sushi Set",
            location: "Quận Bình Thạnh",
            price: "150.000đ",
            img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 6,
            name: "Trà Đào Cam Sả",
            location: "Quận 7, TP.HCM",
            price: "40.000đ",
            img: "https://images.unsplash.com/photo-1561047029-3000e62f5e8c?auto=format&fit=crop&w=800&q=80"
        }
    ];

    return (
        <div className="home">
            {/* Banner */}
            <section className="banner">
                <div className="banner-content">
                    <h1>Đặt đồ ăn trực tuyến dễ dàng</h1>
                    <p>Giao nhanh – Món ngon – Giá tốt</p>
                    <div className="search-bar">
                        <input type="text" placeholder="Tìm quán ăn, món ăn..." />
                        <button>Tìm kiếm</button>
                    </div>
                </div>
            </section>

            {/* Danh mục phổ biến */}
            <section className="categories">
                <h2>Danh mục phổ biến</h2>
                <div className="category-grid">
                    <Link to="/category/com" className="category-item">
                        <img src="https://cdn-icons-png.flaticon.com/512/3480/3480759.png" alt="Cơm" />
                        <p>Cơm</p>
                    </Link>
                    <Link to="/category/tra-sua" className="category-item">
                        <img src="https://cdn-icons-png.flaticon.com/512/415/415733.png" alt="Trà sữa" />
                        <p>Trà sữa</p>
                    </Link>
                    <Link to="/category/pizza" className="category-item">
                        <img src="https://cdn-icons-png.flaticon.com/512/6978/6978255.png" alt="Pizza" />
                        <p>Pizza</p>
                    </Link>
                    <Link to="/category/mi" className="category-item">
                        <img src="https://cdn-icons-png.flaticon.com/512/857/857681.png" alt="Mì" />
                        <p>Mì</p>
                    </Link>
                    <Link to="/category/ga-ran" className="category-item">
                        <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="Gà rán" />
                        <p>Gà rán</p>
                    </Link>
                </div>
            </section>

            {/* Gợi ý món ăn */}
            <section className="featured">
                <h2>Gợi ý cho bạn</h2>
                <div className="food-grid">
                    {foodItems.map((item) => (
                        <Link
                            to={`/food/${item.id}`}
                            key={item.id}
                            className="food-card"
                        >
                            <img src={item.img} alt={item.name} />
                            <div className="food-info">
                                <h3>{item.name}</h3>
                                <p className="location">{item.location}</p>
                                <p className="price">{item.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

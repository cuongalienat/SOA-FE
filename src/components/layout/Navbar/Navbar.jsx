import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import LocationSelector from "../LocationSelector/LocationSelector";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Bên trái */}
                <div className="navbar-left">
                    <LocationSelector />
                    <Link to="/" className="logo-link">🍜 Foodie</Link>
                </div>

                {/* Bên phải */}
                <ul className="nav-links">
                    <li><Link to="/">Trang chủ</Link></li>
                    <li><Link to="/contact">Liên hệ</Link></li>
                    <li><Link to="/cart">🛒 Giỏ hàng</Link></li>
                    <li className="login-btn"><Link to="/signin">Đăng nhập</Link></li>
                </ul>
            </div>
        </nav>
    );
}
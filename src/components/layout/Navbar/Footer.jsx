import React from "react";
import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-logo">🍜 Foodie</div>
                <p>© 2025 Foodie. All rights reserved.</p>
                <div className="socials">
                    <a href="#">Facebook</a>
                    <a href="#">Instagram</a>
                    <a href="#">TikTok</a>
                </div>
            </div>
        </footer>
    );
}

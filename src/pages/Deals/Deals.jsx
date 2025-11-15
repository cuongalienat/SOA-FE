import React from "react";
import "./Deals.css";

export default function Deals() {
    const vouchers = [
        {
            id: 1,
            brand: "Highlands Coffee",
            image: "https://upload.wikimedia.org/wikipedia/vi/0/09/Highlands_Coffee_Logo.png",
            title: "Giảm 30% cho đơn từ 2 ly trở lên",
            desc: "Áp dụng tại toàn bộ chi nhánh TP.HCM",
            code: "HIGHLANDS30",
            expiry: "HSD: 30/11/2025",
        },
        {
            id: 2,
            brand: "The Coffee House",
            image: "https://upload.wikimedia.org/wikipedia/commons/8/8c/The_Coffee_House_logo.png",
            title: "Giảm 20% đơn hàng đầu tiên",
            desc: "Chỉ áp dụng khi đặt qua Foodie",
            code: "TCH20NEW",
            expiry: "HSD: 15/12/2025",
        },
        {
            id: 3,
            brand: "Pizza Hut",
            image: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Pizza_Hut_logo.svg",
            title: "Mua 1 tặng 1 Pizza size M",
            desc: "Áp dụng từ 17h - 21h mỗi ngày",
            code: "PIZZA1TANG1",
            expiry: "HSD: 31/12/2025",
        },
        {
            id: 4,
            brand: "Phúc Long",
            image: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Phuc_Long_logo.png",
            title: "Giảm 25% cho hóa đơn trên 100.000đ",
            desc: "Áp dụng toàn quốc",
            code: "PHUCLONG25",
            expiry: "HSD: 28/02/2026",
        },
        {
            id: 5,
            brand: "KFC Việt Nam",
            image: "https://upload.wikimedia.org/wikipedia/commons/6/6e/KFC_logo.svg",
            title: "Giảm 40% combo 2 người",
            desc: "Áp dụng tại chi nhánh nội thành",
            code: "KFC40",
            expiry: "HSD: 25/12/2025",
        },
    ];

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        alert(`Đã sao chép mã: ${code}`);
    };

    return (
        <div className="deals-page">
            <section className="deals-header">
                <h1>Voucher & Ưu đãi hot</h1>
                <p>Nhận mã giảm giá độc quyền – Săn deal siêu hời!</p>
            </section>

            <section className="voucher-grid">
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
            </section>
        </div>
    );
}

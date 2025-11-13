import React from "react";
import "./Contact.css";

export default function Contact() {
    return (
        <div className="contact-page">
            <section className="contact-header">
                <h1>Liên hệ với chúng tôi</h1>
                <p>
                    Nếu bạn có câu hỏi, góp ý hay cần hỗ trợ, vui lòng gửi tin nhắn cho chúng tôi.
                </p>
            </section>

            <section className="contact-content">
                {/* Form liên hệ */}
                <div className="contact-form">
                    <h2>Gửi tin nhắn</h2>
                    <form>
                        <div className="form-group">
                            <label htmlFor="name">Họ và tên</label>
                            <input type="text" id="name" placeholder="Nhập họ và tên của bạn" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" placeholder="Nhập địa chỉ email" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Nội dung</label>
                            <textarea id="message" rows="5" placeholder="Nhập tin nhắn của bạn..."></textarea>
                        </div>

                        <button type="submit" className="submit-btn">Gửi liên hệ</button>
                    </form>
                </div>

                {/* Thông tin liên hệ */}
                <div className="contact-info">
                    <h2>Thông tin</h2>
                    <ul>
                        <li>
                            📍 <strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM
                        </li>
                        <li>
                            📞 <strong>Hotline:</strong> 0123 456 789
                        </li>
                        <li>
                            📧 <strong>Email:</strong> support@foodie.vn
                        </li>
                        <li>
                            🕒 <strong>Giờ làm việc:</strong> 8:00 - 22:00 (Thứ 2 - CN)
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
}

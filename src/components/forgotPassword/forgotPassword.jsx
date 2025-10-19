import React from 'react';
import { useNavigate } from 'react-router-dom';
import './forgotPassword.css'; // File CSS mới ở dưới

export const ForgotPassword = () => {
    const navigate = useNavigate();

    const handleBackToLogin = () => {
        navigate('/signin');
    };

    const handleSubmit = (event) => {
        // Ngăn trình duyệt tải lại trang (hành vi mặc định của form)
        event.preventDefault();

        // Tại đây bạn có thể thêm logic kiểm tra email hoặc gọi API
        // ...

        // Sau khi xử lý xong, điều hướng đến trang đặt lại mật khẩu
        navigate('/set-password');
    };

    return (
        <div className="forgotPassword-body">
            <main className="forgotPassword-container">
                {/* === Cột Form (bên trái) === */}
                <section className="forgotPassword-section">
                    <div className="logo">Your Logo</div>

                    <span onClick={handleBackToLogin} className="back-link">
                        &lt; Back to login
                    </span>

                    <h1>Forgot your password?</h1>
                    <p className="subtitle">
                        Don't worry, happens to all of us. Enter your email below to recover your password.
                    </p>

                    <form className="forgotPassword-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" defaultValue="john.doe@gmail.com" required />
                        </div>
                        <button type="submit" className="submit-btn">Submit</button>
                    </form>

                    <div className="separator">Or login with</div>

                    <div className="social-login">
                        <button className="social-btn">Facebook</button>
                        <button className="social-btn">Google</button>
                        <button className="social-btn">Apple</button>
                    </div>
                </section>

                {/* === Cột ảnh minh họa (bên phải) === */}
                <div className="illustration-section">
                    {/* Ảnh nền được thêm từ CSS */}
                </div>
            </main>
        </div>
    );
};
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './setPassword.css';

export const SetPassword = () => {
    // 2. Khởi tạo hook
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // 3. Tạo hàm để quay lại trang forgot-password
    const handleBackToForgotPassword = () => {
        navigate('/forgot-password');
    };

    const handleSubmit = (event) => {
        // Ngăn trình duyệt tải lại trang
        event.preventDefault();

        console.log("Password updated successfully!");
        navigate('/signin');
    };

    return (
        <div className="setPassword-body">
            <main className="setPassword-container">
                <section className="setPassword-section">
                    <div className="logo">Your Logo</div>

                    {/* 4. Thêm dòng chữ có thể click để quay lại */}
                    <span onClick={handleBackToForgotPassword} className="back-link">
                        &lt; Back to forgot password
                    </span>

                    <h1>Set a password</h1>
                    <p className="subtitle">
                        Your previous password has been reseted. Please set a new password for your account.
                    </p>

                    <form className="setPassword-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="create-password">Create Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="create-password"
                                    name="create-password"
                                    defaultValue="7789BM&X@@H&SK_"
                                    required
                                />
                                <span
                                    className="toggle-password-visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </span>
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="reenter-password">Re-enter Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="reenter-password"
                                    name="reenter-password"
                                    defaultValue="7789BM&X@@H&SK_"
                                    required
                                />
                                <span
                                    className="toggle-password-visibility"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? "🙈" : "👁️"}
                                </span>
                            </div>
                        </div>

                        <button type="submit" className="setPassword-btn">Set password</button>
                    </form>
                </section>

                <div className="illustration-section">
                    {/* Ảnh nền được thêm từ CSS */}
                </div>
            </main>
        </div>
    );
};
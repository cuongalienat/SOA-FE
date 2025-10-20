import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './verifyEmail.css'; // File CSS sẽ tạo ở dưới

export const VerifyCode = () => {
    const navigate = useNavigate();

    const [showCode, setShowCode] = useState(false);

    const handleBackToLogin = () => {
        navigate('/signin');
    };

    const handleBackToSignup = () => {
        navigate('/signup');
    };

    const handleVerify = (event) => {
        event.preventDefault();
        // Logic xác thực mã ở đây
        console.log('Verifying code...');

    };

    return (
        <div className="verifyCode-body">
            <main className="verifyCode-container">
                {/* === Cột Form (bên trái) === */}
                <section className="verifyCode-section">
                    <div className="logo">Your Logo</div>

                    <span onClick={handleBackToSignup} className="back-link">
                        &lt; Back to signup
                    </span>

                    <h1>Verify code</h1>
                    <p className="subtitle">
                        An authentication code has been sent to your email.
                    </p>

                    <form className="verifyCode-form" onSubmit={handleVerify}>
                        <div className="input-group">
                            <label htmlFor="verify-code">Enter Code</label>
                            <div className="code-wrapper">
                                <input
                                    type={showCode ? "text" : "password"}
                                    id="verify-code"
                                    name="verify-code"
                                    defaultValue="7789BM&X"
                                    required
                                />
                                <span
                                    className="toggle-visibility"
                                    onClick={() => setShowCode(!showCode)}
                                >
                                    {/* Thay đổi icon dựa vào state */}
                                    {showCode ? "🙈" : "👁️"}
                                </span>
                            </div>
                        </div>

                        <p className="resend-link">
                            Didn't receive a code? <a href="#">Resend</a>
                        </p>

                        <button type="submit" onClick={handleBackToLogin} className="verifyCode-btn">Verify</button>
                    </form>
                </section>
            </main>
        </div>
    );
};
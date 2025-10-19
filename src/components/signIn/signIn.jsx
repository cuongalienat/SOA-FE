import React from 'react';
// 1. Import hook useNavigate
import { useNavigate } from 'react-router-dom';
import './signIn.css';

export const SignIn = () => {
    // 2. Khởi tạo hook
    const navigate = useNavigate();

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    // 3. Tạo hàm điều hướng đến trang đăng ký
    const handleSignUpRedirect = () => {
        navigate('/signup');
    };

    return (
        <div className="signIn-body">
            <main className="signIn-container">
                <section className="signIn-section">
                    <div className="logo">Your Logo</div>
                    <h1>Login</h1>
                    <p>Login to access your travelwise account</p>

                    <form className="signIn-form">
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" defaultValue="john.doe@gmail.com" required />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" defaultValue="12345678" required />
                        </div>

                        <div className="form-options">
                            <div className="remember-me">
                                <input type="checkbox" id="remember" />
                                <label htmlFor="remember">Remember me</label>
                            </div>

                            <span onClick={handleForgotPassword} className="forgot-password-link" style={{ cursor: 'pointer', color: '#007bff' }}>
                                Forgot Password
                            </span>
                        </div>

                        <button type="submit" className="signIn-btn">Login</button>
                    </form>

                    {/* 4. Cập nhật liên kết đăng ký */}
                    <p className="signup-link">
                        Don't have an account?
                        <span onClick={handleSignUpRedirect} style={{ cursor: 'pointer', color: '#007bff', fontWeight: 500 }}>
                            Sign up
                        </span>
                    </p>

                    <div className="separator">Or login with</div>

                    <div className="social-login">
                        <button className="social-btn">Facebook</button>
                        <button className="social-btn">Google</button>
                        <button className="social-btn">Apple</button>
                    </div>
                </section>

                <div className="illustration-section"></div>
            </main>
        </div>
    );
};
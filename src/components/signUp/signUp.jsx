import React from 'react';
import { useNavigate } from 'react-router-dom';
import './signUp.css'; // File CSS sẽ tạo ở dưới

export const SignUp = () => {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/signin');
    };

    // Hàm xử lý submit form
    const handleSignUp = (event) => {
        event.preventDefault();
        // Tại đây bạn sẽ xử lý logic đăng ký tài khoản (ví dụ: gọi API)
        console.log('Form submitted, creating account...');

        // Sau khi logic đăng ký hoàn tất, điều hướng đến trang xác thực
        navigate('/verify-code');
    };

    return (
        <div className="signup-body">

            {/* === Cột Form (bên phải) === */}
            <section className="form-column">
                <header className="form-header">
                    <div className="logo">Your Logo</div>
                </header>

                <div className="form-container">
                    <h1>Sign up</h1>
                    <p className="subtitle">Let's get you all st up so you can access your personal account.</p>

                    <form className="signup-form" onSubmit={handleSignUp}>
                        <div className="form-row">
                            <div className="input-group">
                                <label htmlFor="username">Username</label>
                                <input type="text" id="username" name="username" defaultValue="john.doe@gmail.com" required />
                            </div>
                            <div className="input-group">
                                <label htmlFor="full-name">Full Name</label>
                                <input type="text" id="full-name" name="full-name" defaultValue="john.doe@gmail.com" required />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="input-group">
                                <label htmlFor="age">Age</label>
                                <input type="age" id="age" name="age" defaultValue="18" required />
                            </div>
                            <div className="input-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input type="tel" id="phone" name="phone" defaultValue="john.doe@gmail.com" required />
                            </div>
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" defaultValue="john.doe@gmail.com" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-wrapper">
                                <input type="password" id="password" name="password" defaultValue="********" required />
                                <span className="toggle-password-visibility">👁️</span>
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="confirm-password">Confirm Password</label>
                            <div className="password-wrapper">
                                <input type="password" id="confirm-password" name="confirm-password" defaultValue="********" required />
                                <span className="toggle-password-visibility">👁️</span>
                            </div>
                        </div>

                        <div className="terms-group">
                            <input type="checkbox" id="terms" name="terms" style={{ width: "20px" }} required />
                            <label htmlFor="terms">
                                I agree to all the <a href="#">Terms</a> and <a href="#">Privacy Policies</a>
                            </label>
                        </div>

                        <button type="submit" className="signup-btn">Create account</button>
                    </form>

                    <p className="login-link">
                        Already have an account? <span onClick={handleLoginRedirect}>Login</span>
                    </p>

                    <div className="separator">Or Sign up with</div>

                    <div className="social-login">
                        <button className="social-btn">Facebook</button>
                        <button className="social-btn">Google</button>
                        <button className="social-btn">Apple</button>
                    </div>
                </div>
            </section>
        </div>
    );
};
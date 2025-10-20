import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuths';
import './signIn.css';

export const SignIn = () => {
    const navigate = useNavigate();
    const { login, loading, error } = useAuth();

    const [username, setUsername] = useState("john.doe@gmail.com");
    const [password, setPassword] = useState("12345678");

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    const handleSignUpRedirect = () => {
        navigate('/signup');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        const result = await login(username, password);

        if (result) {
            console.log("🎉 Đăng nhập thành công:", result);
        }
    };

    return (
        <div className="signIn-body">
            <main className="signIn-container">
                <section className="signIn-section">
                    <div className="logo">Your Logo</div>
                    <h1>Login</h1>
                    <p>Login to access your travelwise account</p>

                    {/* ✅ Gắn hàm handleSubmit */}
                    <form className="signIn-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="username"
                                id="username"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-options">
                            <span
                                onClick={handleForgotPassword}
                                className="forgot-password-link"
                                style={{ cursor: 'pointer', color: '#007bff' }}
                            >
                                Forgot Password
                            </span>
                        </div>

                        <button type="submit" className="signIn-btn" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <p className="signup-link">
                        Don't have an account?{" "}
                        <span
                            onClick={handleSignUpRedirect}
                            style={{ cursor: 'pointer', color: '#007bff', fontWeight: 500 }}
                        >
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
            </main>
        </div>
    );
};

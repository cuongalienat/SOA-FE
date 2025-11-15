import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuths';
import Logo from '../../components/common/Logo';
import Input from '../../components/common/Input';
import PasswordInput from '../../components/common/PasswordInput';
import NotificationPopup from '../../components/common/NotificationPopup';
import './styles.css';

const SignIn = () => {
    const navigate = useNavigate();
    const { signin, loading, error } = useAuth();

    const [username, setUsername] = useState("john.doe@gmail.com");
    const [password, setPassword] = useState("12345678");
    const [notification, setNotification] = useState({
        isVisible: false,
        message: '',
        type: 'info'
    });

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    const handleSignUpRedirect = () => {
        navigate('/signup');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Hiển thị thông báo đang đăng nhập
        setNotification({
            isVisible: true,
            message: 'Đang đăng nhập...',
            type: 'info'
        });

        const result = await signin(username, password);

        if (result) {
            // Đăng nhập thành công
            setNotification({
                isVisible: true,
                message: 'Đăng nhập thành công! Chào mừng bạn trở lại.',
                type: 'success'
            });

            // Chuyển hướng sau 1.5 giây
            setTimeout(() => {
                navigate('/dashboard'); // hoặc trang chính của app
            }, 1500);
        } else {
            // Đăng nhập thất bại
            setNotification({
                isVisible: true,
                message: error || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.',
                type: 'error'
            });
        }
    };

    return (
        <div className="signIn-body">
            <main className="signIn-container">
                <section className="signIn-section">
                    <Logo />
                    <h1 className="signIn-title">Sign in</h1>
                    <p className="signIn-subtitle">Login to access your travelwise account</p>

                    <form className="signIn-form" onSubmit={handleSubmit}>
                        <Input
                            label="Username"
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Tên đăng nhập"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />

                        <PasswordInput
                            label="Password"
                            id="password"
                            name="password"
                            placeholder="Mật khẩu"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <div className="form-options">
                            <span
                                onClick={handleForgotPassword}
                                className="forgot-password-link"
                            >
                                Forgot Password
                            </span>
                        </div>

                        <button type="submit" className="signIn-btn" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    {error && <p className="error-message">{error}</p>}

                    <p className="signup-link">
                        Don't have an account?{" "}
                        <span onClick={handleSignUpRedirect}>
                            Sign up
                        </span>
                    </p>
                </section>
            </main>

            {/* Notification Popup */}
            <NotificationPopup
                message={notification.message}
                type={notification.type}
                isVisible={notification.isVisible}
                onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
                position={{ vertical: 'top', horizontal: 'right' }}
                autoClose={true}
                duration={3000}
            />
        </div>
    );
};

export default SignIn;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuths';
import { useEmailVerification } from '../../hooks/useEmailVerification';
import Logo from '../../components/common/Logo';
import Input from '../../components/common/Input';
import PasswordInput from '../../components/common/PasswordInput';
import NotificationPopup from '../../components/common/NotificationPopup';
import './styles.css';

const SignIn = () => {
    const navigate = useNavigate();
    const { signin, loading, error } = useAuth();
    const { resendVerification } = useEmailVerification();
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
    const showNotification = (message, type = 'info') => {
        setNotification({
            isVisible: true,
            message,
            type
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await signin(username, password);
        console.log("isverified:", result?.data?.user);

        if (result.success === true && result.data?.user?.isVerified === "no") {
            const emailToVerify = result?.data?.user?.email || username;
            showNotification('Tài khoản chưa được xác thực. Đang gửi lại mã xác thực...', 'warning');
            resendVerification(emailToVerify);
            setTimeout(() => {
                navigate('/verify-code', {
                    state: {
                        email: emailToVerify,
                    },
                });
            }, 1200);
            return;
        }

        if (result.success === true) {
            // Đăng nhập thành công
            showNotification(result.data.message, 'success');

            // Chuyển hướng sau 1.5 giây
            setTimeout(() => {
                navigate('/dashboard'); // hoặc trang chính của app
            }, 1500);
        } else {
            // Đăng nhập thất bại
            showNotification(result.error, 'error');
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

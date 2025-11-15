import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuths';
import { validateSignupData } from '../../utils/validationUtils.js';
import Logo from '../../components/common/Logo';
import Input from '../../components/common/Input';
import PasswordInput from '../../components/common/PasswordInput';
import NotificationPopup from '../../components/common/NotificationPopup';
import './styles.css';

const SignUp = () => {
    const navigate = useNavigate();
    const { signup, loading, error } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        age: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [notification, setNotification] = useState({
        isVisible: false,
        message: '',
        type: 'info'
    });

    const handleLoginRedirect = () => {
        navigate('/signin');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const showNotification = (message, type = 'info') => {
        setNotification({
            isVisible: true,
            message,
            type
        });
    };

    const hideNotification = () => {
        setNotification(prev => ({
            ...prev,
            isVisible: false
        }));
    };

    const handleSignUp = async (event) => {
        event.preventDefault();

        // Kiểm tra mật khẩu xác nhận trước
        if (formData.password !== formData.confirmPassword) {
            showNotification('Mật khẩu xác nhận không khớp', 'error');
            return;
        }

        // Validate dữ liệu trước khi gọi API
        const validationErrors = validateSignupData({
            username: formData.username,
            fullName: formData.fullName,
            age: formData.age,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
        });

        if (validationErrors.length > 0) {
            showNotification(validationErrors.join(', '), 'error');
            return;
        }

        // Hiển thị thông báo đang xử lý
        showNotification('Đang xử lý đăng ký...', 'info');

        try {
            // Gọi API đăng ký (bỏ qua validation ở hook vì đã validate ở component)
            const result = await signup({
                username: formData.username,
                fullName: formData.fullName,
                age: parseInt(formData.age),
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            }, true); // skipValidation = true

            if (result) {
                // Đăng ký thành công
                showNotification('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.', 'success');

                // Chuyển hướng sau 2 giây
                setTimeout(() => {
                    navigate('/verify-code');
                }, 2000);
            } else {
                // Đăng ký thất bại - hiển thị lỗi từ API
                showNotification(error || 'Đăng ký thất bại. Vui lòng thử lại.', 'error');
            }
        } catch (err) {
            console.error('Signup error:', err);
            showNotification('Có lỗi xảy ra. Vui lòng thử lại.', 'error');
        }
    };

    return (
        <div className="signup-body">
            <section className="form-column">
                <header className="form-header">
                    <Logo />
                </header>

                <div className="form-container">
                    <h1 className="signup-title">Sign up</h1>
                    <p className="signup-subtitle">Let's get you all set up so you can access your personal account.</p>

                    <form className="signup-form" onSubmit={handleSignUp}>
                        <div className="form-row">
                            <Input
                                label="Username"
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="Tên đăng nhập"
                                required
                            />
                            <Input
                                label="Full Name"
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Họ tên"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <Input
                                label="Age"
                                type="number"
                                id="age"
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                placeholder="18"
                                min="1"
                                max="120"
                                required
                            />
                            <Input
                                label="Phone Number"
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="0123456789"
                                required
                            />
                        </div>

                        <Input
                            label="Email"
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="example@gmail.com"
                            required
                        />

                        <PasswordInput
                            label="Password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Mật khẩu"
                            required
                        />

                        <PasswordInput
                            label="Confirm Password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Nhập lại mật khẩu"
                            required
                        />

                        <div className="terms-group">
                            <input type="checkbox" id="terms" name="terms" className="terms-checkbox" required />
                            <label htmlFor="terms" className="terms-label">
                                I agree to all the <a href="#" className="terms-link">Terms</a> and <a href="#" className="terms-link">Privacy Policies</a>
                            </label>
                        </div>

                        <button type="submit" className="signup-btn" disabled={loading}>
                            {loading ? 'Đang đăng ký...' : 'Create account'}
                        </button>
                    </form>

                    <p className="login-link">
                        Already have an account? <span onClick={handleLoginRedirect}>Sign in</span>
                    </p>

                </div>
            </section>

            {/* Notification Popup */}
            <NotificationPopup
                message={notification.message}
                type={notification.type}
                isVisible={notification.isVisible}
                onClose={hideNotification}
                position={{ vertical: 'top', horizontal: 'right' }}
                autoClose={true}
                duration={4000}
            />
        </div>
    );
};

export default SignUp;

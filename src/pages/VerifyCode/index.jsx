import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import Input from '../../components/common/Input';
import BackLink from '../../components/common/BackLink';
import NotificationPopup from '../../components/common/NotificationPopup';
import { useEmailVerification } from '../../hooks/useEmailVerification.jsx';
import './styles.css';

const VerifyCode = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [notification, setNotification] = useState({
        isVisible: false,
        message: '',
        type: 'info',
    });
    const {
        loading,
        error,
        success,
        serverMessage,
        email,
        setEmail,
        otpCode,
        setOtpCode,
        verify,
        resendVerification,
    } = useEmailVerification();

    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        } else {
            setTimeout(() => navigate('/signup'), 0);
        }
    }, [location.state, navigate, setEmail]);

    const handleBackToSignup = () => {
        navigate('/signup');
    };

    const showNotification = (message, type = 'info') => {
        setNotification({
            isVisible: true,
            message,
            type,
        });
    };

    const hideNotification = () => {
        setNotification(prev => ({
            ...prev,
            isVisible: false,
        }));
    };

    useEffect(() => {
        if (success) {
            showNotification(serverMessage || 'Xác thực thành công! Đang chuyển hướng bạn sang trang đăng nhập...', 'success');
        }
    }, [success, serverMessage]);

    useEffect(() => {
        if (error) {
            showNotification(error, 'error');
        }
    }, [error]);

    const handleVerify = async (event) => {
        event.preventDefault();
        await verify(email, otpCode);
    };

    const handleResend = async (event) => {
        event.preventDefault();
        const result = await resendVerification(email);
        if (result?.success) {
            showNotification(result?.message || 'Đã gửi lại mã OTP, vui lòng kiểm tra email.', 'success');
        } else {
            showNotification(result?.error || 'Không thể gửi lại mã OTP.', 'error');
        }
    };

    return (
        <div className="verifyCode-body">
            <main className="verifyCode-container">
                <section className="verifyCode-section">
                    <Logo />
                    <BackLink text="Back to signup" onClick={handleBackToSignup} />

                    <h1 className="verifyCode-title">Verify code</h1>
                    <p className="verifyCode-subtitle">
                        An authentication code has been sent to your email.
                    </p>

                    <form className="verifyCode-form" onSubmit={handleVerify}>
                        <Input
                            label="Email"
                            type="email"
                            id="verify-email"
                            name="verify-email"
                            value={email}
                            readOnly
                            disabled
                        />

                        <Input
                            label="Mã OTP"
                            type="text"
                            id="verify-code"
                            name="verify-code"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            placeholder="Nhập mã OTP"
                            inputMode="numeric"
                            required
                        />

                        <p className="resend-link">
                            Chưa nhận được mã? <a href="#" onClick={handleResend}>Gửi lại</a>
                        </p>
                        <button type="submit" className="verifyCode-btn" disabled={loading}>
                            {loading ? 'Đang xác thực...' : 'Xác thực'}
                        </button>
                    </form>
                    <NotificationPopup
                        message={notification.message}
                        type={notification.type}
                        isVisible={notification.isVisible}
                        onClose={hideNotification}
                        autoClose
                        duration={3000}
                        position={{ vertical: 'top', horizontal: 'right' }}
                    />
                </section>
            </main>
        </div>
    );
};

export default VerifyCode;

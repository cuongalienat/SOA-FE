import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuths';
import Logo from '../../components/common/Logo';
import Input from '../../components/common/Input';
import PasswordInput from '../../components/common/PasswordInput';
import SocialLogin from '../../components/common/SocialLogin';
import Separator from '../../components/common/Separator';
import './styles.css';

const SignIn = () => {
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
                    <Logo />
                    <h1 className="signIn-title">Login</h1>
                    <p className="signIn-subtitle">Login to access your travelwise account</p>

                    <form className="signIn-form" onSubmit={handleSubmit}>
                        <Input
                            label="Username"
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />

                        <PasswordInput
                            label="Password"
                            id="password"
                            name="password"
                            value={password}
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

                    <Separator text="Or login with" />
                    <SocialLogin />
                </section>
            </main>
        </div>
    );
};

export default SignIn;

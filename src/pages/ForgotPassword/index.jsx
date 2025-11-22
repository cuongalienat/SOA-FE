import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import Input from '../../components/common/Input';
import BackLink from '../../components/common/BackLink';
import './styles.css';

const ForgotPassword = () => {
    const navigate = useNavigate();

    const handleBackToLogin = () => {
        navigate('/signin');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate('/set-password');
    };

    return (
        <div className="forgotPassword-body">
            <main className="forgotPassword-container">
                <section className="forgotPassword-section">
                    <Logo />
                    <BackLink text="Back to login" onClick={handleBackToLogin} />

                    <h1 className="forgotPassword-title">Forgot your password?</h1>
                    <p className="forgotPassword-subtitle">
                        Don't worry, happens to all of us. Enter your email below to recover your password.
                    </p>

                    <form className="forgotPassword-form" onSubmit={handleSubmit}>
                        <Input
                            label="Email"
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            required
                        />
                        <button type="submit" className="submit-btn">Submit</button>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default ForgotPassword;

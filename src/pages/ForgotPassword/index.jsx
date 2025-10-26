import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import Input from '../../components/common/Input';
import BackLink from '../../components/common/BackLink';
import SocialLogin from '../../components/common/SocialLogin';
import Separator from '../../components/common/Separator';
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
                            defaultValue="john.doe@gmail.com"
                            required
                        />
                        <button type="submit" className="submit-btn">Submit</button>
                    </form>

                    <Separator text="Or login with" />
                    <SocialLogin />
                </section>
            </main>
        </div>
    );
};

export default ForgotPassword;

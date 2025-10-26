import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import PasswordInput from '../../components/common/PasswordInput';
import BackLink from '../../components/common/BackLink';
import './styles.css';

const VerifyCode = () => {
    const navigate = useNavigate();

    const handleBackToSignup = () => {
        navigate('/signup');
    };

    const handleVerify = (event) => {
        event.preventDefault();
        console.log('Verifying code...');
        navigate('/signin');
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
                        <PasswordInput
                            label="Enter Code"
                            id="verify-code"
                            name="verify-code"
                            defaultValue="7789BM&X"
                            required
                        />

                        <p className="resend-link">
                            Didn't receive a code? <a href="#" onClick={(e) => { e.preventDefault(); console.log('Resend code'); }}>Resend</a>
                        </p>

                        <button type="submit" className="verifyCode-btn">Verify</button>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default VerifyCode;

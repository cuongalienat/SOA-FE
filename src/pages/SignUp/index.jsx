import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import Input from '../../components/common/Input';
import PasswordInput from '../../components/common/PasswordInput';
import SocialLogin from '../../components/common/SocialLogin';
import Separator from '../../components/common/Separator';
import './styles.css';

const SignUp = () => {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/signin');
    };

    const handleSignUp = (event) => {
        event.preventDefault();
        console.log('Form submitted, creating account...');
        navigate('/verify-code');
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
                                defaultValue="john.doe@gmail.com"
                                required
                            />
                            <Input
                                label="Full Name"
                                type="text"
                                id="full-name"
                                name="full-name"
                                defaultValue="John Doe"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <Input
                                label="Age"
                                type="number"
                                id="age"
                                name="age"
                                defaultValue="18"
                                required
                            />
                            <Input
                                label="Phone Number"
                                type="tel"
                                id="phone"
                                name="phone"
                                defaultValue="+1234567890"
                                required
                            />
                        </div>

                        <Input
                            label="Email"
                            type="email"
                            id="email"
                            name="email"
                            defaultValue="john.doe@gmail.com"
                            required
                        />

                        <PasswordInput
                            label="Password"
                            id="password"
                            name="password"
                            defaultValue="********"
                            required
                        />

                        <PasswordInput
                            label="Confirm Password"
                            id="confirm-password"
                            name="confirm-password"
                            defaultValue="********"
                            required
                        />

                        <div className="terms-group">
                            <input type="checkbox" id="terms" name="terms" className="terms-checkbox" required />
                            <label htmlFor="terms" className="terms-label">
                                I agree to all the <a href="#" className="terms-link">Terms</a> and <a href="#" className="terms-link">Privacy Policies</a>
                            </label>
                        </div>

                        <button type="submit" className="signup-btn">Create account</button>
                    </form>

                    <p className="login-link">
                        Already have an account? <span onClick={handleLoginRedirect}>Login</span>
                    </p>

                    <Separator text="Or Sign up with" />
                    <SocialLogin />
                </div>
            </section>
        </div>
    );
};

export default SignUp;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import PasswordInput from '../../components/common/PasswordInput';
import BackLink from '../../components/common/BackLink';
import './styles.css';

const SetPassword = () => {
  const navigate = useNavigate();

  const handleBackToForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Password updated successfully!");
    navigate('/signin');
  };

  return (
    <div className="setPassword-body">
      <main className="setPassword-container">
        <section className="setPassword-section">
          <Logo />
          <BackLink text="Back to forgot password" onClick={handleBackToForgotPassword} />

          <h1 className="setPassword-title">Set a password</h1>
          <p className="setPassword-subtitle">
            Your previous password has been reset. Please set a new password for your account.
          </p>

          <form className="setPassword-form" onSubmit={handleSubmit}>
            <PasswordInput
              label="New Password"
              id="create-password"
              name="create-password"
              defaultValue="7789BM&X@@H&SK_"
              required
            />

            <PasswordInput
              label="Confirm Password"
              id="reenter-password"
              name="reenter-password"
              defaultValue="7789BM&X@@H&SK_"
              required
            />

            <button type="submit" className="setPassword-btn">Set password</button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default SetPassword;

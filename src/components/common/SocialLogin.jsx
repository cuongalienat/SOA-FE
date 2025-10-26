import React from 'react';
import './SocialLogin.css';

const SocialLogin = () => {
    return (
        <div className="social-login">
            <button className="social-btn" type="button">Facebook</button>
            <button className="social-btn" type="button">Google</button>
            <button className="social-btn" type="button">Apple</button>
        </div>
    );
};

export default SocialLogin;

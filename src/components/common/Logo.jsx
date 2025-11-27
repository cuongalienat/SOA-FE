import React from 'react';
import './Logo.css';

const Logo = ({ text = "Your Logo" }) => {
    return <div className="logo">{text}</div>;
};

export default Logo;

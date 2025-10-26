import React, { useState } from 'react';
import './PasswordInput.css';

const PasswordInput = ({ 
    label, 
    id, 
    name, 
    value, 
    defaultValue,
    onChange, 
    required = false,
    placeholder,
    className = ""
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={`input-group ${className}`}>
            {label && <label htmlFor={id}>{label}</label>}
            <div className="password-wrapper">
                <input
                    type={showPassword ? "text" : "password"}
                    id={id}
                    name={name}
                    value={value}
                    defaultValue={defaultValue}
                    onChange={onChange}
                    required={required}
                    placeholder={placeholder}
                />
                <span
                    className="toggle-password-visibility"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? "🙈" : "👁️"}
                </span>
            </div>
        </div>
    );
};

export default PasswordInput;

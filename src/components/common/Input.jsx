import React from 'react';
import './Input.css';

const Input = ({ 
    label, 
    type = "text", 
    id, 
    name, 
    value, 
    defaultValue,
    onChange, 
    required = false,
    placeholder,
    className = ""
}) => {
    return (
        <div className={`input-group ${className}`}>
            {label && <label htmlFor={id}>{label}</label>}
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
            />
        </div>
    );
};

export default Input;

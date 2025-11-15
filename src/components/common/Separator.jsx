import React from 'react';
import './Separator.css';

const Separator = ({ text = "Or" }) => {
    return <div className="separator">{text}</div>;
};

export default Separator;

import React from 'react';
import './BackLink.css';

const BackLink = ({ text, onClick }) => {
    return (
        <span onClick={onClick} className="back-link">
            &lt; {text}
        </span>
    );
};

export default BackLink;

import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './GoogleSignIn.css';

const GoogleSignIn = ({ onClick }) => {
    const handleSuccess = (credentialResponse) => {
        // credentialResponse.credential là cái Token dài ngoằng
        console.log("Token từ Google:", credentialResponse.credential);

        // QUAN TRỌNG: Gọi hàm của cha và truyền Token lên
        if (onClick) {
            onClick(credentialResponse.credential);
        }
    };

    const handleError = () => {
        console.error("Google Login Failed");
        // Có thể gọi onClick với null hoặc thông báo lỗi tùy bạn
    };
    return (
        <div>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
            />
        </div>
    );
};

export default GoogleSignIn;
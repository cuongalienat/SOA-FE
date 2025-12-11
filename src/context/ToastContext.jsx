import React, { createContext, useContext, useState, useCallback } from 'react';
import ToastPopup from '../components/common/ToastPopup';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({
        isVisible: false,
        message: '',
        type: 'info' // success, error, warning, info
    });

    // Dùng useCallback để tránh re-render không cần thiết
    const showToast = useCallback((message, type = 'info') => {
        setToast({
            isVisible: true,
            message,
            type
        });
    }, []);

    const closeToast = useCallback(() => {
        setToast((prev) => ({ ...prev, isVisible: false }));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Popup nằm ở đây, đè lên toàn bộ ứng dụng */}
            <ToastPopup
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                onClose={closeToast}
            />
        </ToastContext.Provider>
    );
};

// Hook để dùng nhanh
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
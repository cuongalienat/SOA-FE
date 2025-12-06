import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, X, Info } from 'lucide-react';

const ToastPopup = ({ message, type = 'info', isVisible, onClose, duration = 3000 }) => {

    // Tự động tắt sau khoảng thời gian duration
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    // Cấu hình màu sắc và icon dựa trên type
    const config = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: <CheckCircle className="text-green-500" size={24} />
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: <AlertTriangle className="text-red-500" size={24} />
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            text: 'text-yellow-800',
            icon: <AlertTriangle className="text-yellow-500" size={24} />
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-800',
            icon: <Info className="text-blue-500" size={24} />
        }
    };

    const style = config[type] || config.info;

    return (
        <div className="fixed top-5 right-5 z-[9999] animate-slideIn">
            <div className={`flex items-start p-4 rounded-xl shadow-lg border ${style.bg} ${style.border} min-w-[300px] max-w-sm`}>
                <div className="flex-shrink-0 mr-3">
                    {style.icon}
                </div>
                <div className="flex-1 pt-0.5">
                    <h3 className={`font-bold text-sm ${style.text} uppercase mb-1`}>
                        {type === 'success' ? 'Thành công' : type === 'error' ? 'Lỗi' : 'Thông báo'}
                    </h3>
                    <p className={`text-sm ${style.text} opacity-90`}>
                        {message}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className={`ml-3 text-gray-400 hover:text-gray-600 transition`}
                >
                    <X size={18} />
                </button>
            </div>
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slideIn { animation: slideIn 0.3s ease-out; }
            `}</style>
        </div>
    );
};

export default ToastPopup;
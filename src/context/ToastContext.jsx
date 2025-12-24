import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import ToastPopup from '../components/common/ToastPopup';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [queue, setQueue] = useState([]);
    const [activeToast, setActiveToast] = useState(null);
    const lastShownRef = useRef(new Map());

    const defaultDurationByType = {
        success: 3500,
        info: 4000,
        warning: 6000,
        error: 8000
    };

    const makeId = () => {
        try {
            return crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
        } catch {
            return `${Date.now()}-${Math.random()}`;
        }
    };

    // Dùng useCallback để tránh re-render không cần thiết
    const showToast = useCallback((message, type = 'info', options = {}) => {
        if (!message) return;

        const duration = typeof options?.duration === 'number'
            ? options.duration
            : (defaultDurationByType[type] || 4000);

        const dedupeKey = options?.dedupeKey;
        const debounceMs = typeof options?.debounceMs === 'number' ? options.debounceMs : 2500;
        if (dedupeKey) {
            const now = Date.now();
            const last = lastShownRef.current.get(dedupeKey);
            if (last && now - last < debounceMs) return;
            lastShownRef.current.set(dedupeKey, now);
        }

        const item = {
            id: makeId(),
            message,
            type,
            duration
        };

        setQueue((prev) => [...prev, item]);
    }, []);

    // Pull next toast when none is active
    useEffect(() => {
        if (activeToast) return;
        if (!queue.length) return;

        setActiveToast(queue[0]);
        setQueue((prev) => prev.slice(1));
    }, [queue, activeToast]);

    const closeToast = useCallback(() => {
        setActiveToast(null);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Popup nằm ở đây, đè lên toàn bộ ứng dụng */}
            <ToastPopup
                isVisible={!!activeToast}
                message={activeToast?.message || ''}
                type={activeToast?.type || 'info'}
                duration={activeToast?.duration}
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
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
// 👇 1. Import hook lấy user hiện tại
import { useAuth } from '../hooks/useAuths'; 

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    
    // 👇 2. Lấy thông tin user đăng nhập
    const { user } = useAuth(); 

    useEffect(() => {
        // Chỉ kết nối khi đã có User (Đã login)
        // Nếu user chưa login thì không cần socket làm gì (hoặc logic khác tùy bạn)
        console.log("👤 User Info trong SocketContext:", user);

        if (!user || !user._id) {
            console.warn("⚠️ Chưa có User ID, không kết nối Socket.");
            return;
        }

        // 👇 1. CHUẨN BỊ QUERY PARAMS TRƯỚC
        const queryParams = {
            userId: user._id,
            role: user.role
        };

        // Nếu là chủ quán và có shopId (từ API Login trả về), nhét thêm vào query
        if (user.role === 'restaurant_manager' && user.shopId) {
            queryParams.shopId = user.shopId;
        }

        console.log("🔌 Connecting Socket with params:", queryParams);

        // 👇 2. KHỞI TẠO KẾT NỐI
        const newSocket = io('http://localhost:3000', {
            transports: ['websocket'],
            autoConnect: true,
            query: queryParams // Truyền object đã chuẩn bị vào đây
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            // Log cả ID để chắc chắn
            console.log(`🟢 Socket Connected [ID: ${user._id}]:`, newSocket.id);
        });
        
        newSocket.on('connect_error', (err) => {
            console.error("🔴 Socket Error:", err.message);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [user]); // 👈 4. Chạy lại khi user thay đổi (Login/Logout)

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
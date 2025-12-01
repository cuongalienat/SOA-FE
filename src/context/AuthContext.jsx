import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth as useAuthHook } from "../hooks/useAuths";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const auth = useAuthHook();

  // Manage User Orders locally in Context for this demo
  // In a real app, this would be fetched from an API in useAuth or a separate hook
  const [myOrders, setMyOrders] = useState([]);

  const placeOrder = (orderData) => {
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toLocaleString("vi-VN"),
      status: "Đang nấu", // Initial status
      ...orderData,
    };
    setMyOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  return (
    <AuthContext.Provider value={{ ...auth, myOrders, placeOrder }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

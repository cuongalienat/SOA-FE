import React, { createContext, useContext, useState, useEffect } from "react";
import { FOOD_DATA } from "../constants.js";

const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  // Restaurant Info State
  const [info, setInfo] = useState({
    name: "FlavorDash HQ",
    address: "123 Ẩm Thực, Hà Nội",
    phone: "0901234567",
    isOpen: true,
    coverImage:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000",
    qrCode: null, // Base64 string for QR
  });

  // Menu State
  const [menu, setMenu] = useState(FOOD_DATA);

  // Mock Orders State
  const [orders, setOrders] = useState([
    {
      id: 101,
      customer: "Nguyễn Văn A",
      total: 29.98,
      status: "Đang chờ",
      items: "2x Burger",
      date: "2023-10-25",
    },
    {
      id: 102,
      customer: "Trần Thị B",
      total: 12.5,
      status: "Đang nấu",
      items: "1x Pizza",
      date: "2023-10-25",
    },
    {
      id: 103,
      customer: "Lê Văn C",
      total: 45.0,
      status: "Hoàn thành",
      items: "3x Mì Ramen",
      date: "2023-10-24",
    },
    {
      id: 104,
      customer: "Phạm Thị D",
      total: 15.5,
      status: "Hoàn thành",
      items: "1x Burger",
      date: "2023-10-24",
    },
  ]);

  // Actions
  const toggleStatus = () =>
    setInfo((prev) => ({ ...prev, isOpen: !prev.isOpen }));

  const updateInfo = (newInfo) => setInfo((prev) => ({ ...prev, ...newInfo }));

  // Menu CRUD
  const addMenuItem = (item) => {
    const newItem = { ...item, id: Date.now(), rating: 0 };
    setMenu([newItem, ...menu]);
  };

  const updateMenuItem = (id, updatedItem) => {
    setMenu(
      menu.map((item) => (item.id === id ? { ...updatedItem, id } : item))
    );
  };

  const deleteMenuItem = (id) => {
    setMenu(menu.filter((item) => item.id !== id));
  };

  // Order Actions
  const updateOrderStatus = (id, status) => {
    setOrders(
      orders.map((order) => (order.id === id ? { ...order, status } : order))
    );
  };

  // Stats Calculation
  const stats = {
    revenue: orders.reduce((acc, curr) => acc + curr.total, 0),
    totalOrders: orders.length,
    avgOrderValue: orders.length
      ? orders.reduce((acc, curr) => acc + curr.total, 0) / orders.length
      : 0,
  };

  return (
    <RestaurantContext.Provider
      value={{
        info,
        toggleStatus,
        updateInfo,
        menu,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        orders,
        updateOrderStatus,
        stats,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => useContext(RestaurantContext);

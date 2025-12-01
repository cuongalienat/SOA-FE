import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

const ShipperContext = createContext();

// Mock pool of orders waiting for drivers
const PENDING_ORDERS = [
  {
    id: "ORD-9981",
    restaurant: {
      name: "Burger King - Cầu Giấy",
      address: "241 Xuân Thủy, Cầu Giấy, Hà Nội",
      phone: "024.7300.1234",
      lat: 21.0362,
      lng: 105.7905,
    },
    customer: {
      name: "Phạm Nhật Minh",
      address: "Ngõ 105 Doãn Kế Thiện, Mai Dịch",
      phone: "0988.777.666",
      note: "Gọi trước khi đến, nhà trong ngách nhỏ",
      lat: 21.04,
      lng: 105.78,
    },
    items: [
      { name: "Whopper Meal Medium", quantity: 1, price: 125000 },
      { name: "Onion Rings", quantity: 1, price: 45000 },
    ],
    total: 170000,
    shippingFee: 15000, // Earnings for driver
    paymentMethod: "COD", // Cash on Delivery
    status: "Finding Driver",
  },
  {
    id: "ORD-7722",
    restaurant: {
      name: "Phở Thìn Lò Đúc",
      address: "13 Lò Đúc, Hai Bà Trưng, Hà Nội",
      phone: "0901.222.333",
    },
    customer: {
      name: "Nguyễn Thu Hà",
      address: "Times City T1, 458 Minh Khai",
      phone: "0912.345.678",
      note: "Gửi sảnh lễ tân giúp em",
    },
    items: [
      { name: "Phở Tái Lăn", quantity: 2, price: 180000 },
      { name: "Quẩy", quantity: 5, price: 25000 },
    ],
    total: 205000,
    shippingFee: 22000,
    paymentMethod: "Banking",
    status: "Finding Driver",
  },
];

export const ShipperProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const algorithmTimeoutRef = useRef(null);

  // Mock Driver Profile
  const [driverProfile] = useState({
    name: "Nguyễn Văn Tài",
    id: "DRV-8888",
    rating: 4.9,
    totalTrips: 1245,
    vehicle: "Honda AirBlade",
    plate: "29-G1 567.89",
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60",
    balance: 1540000,
    todayIncome: 350000,
  });

  // Initial Mock History
  const [history, setHistory] = useState([
    {
      id: "ORD-1102",
      date: "2023-10-26 10:30",
      restaurant: { name: "Cơm Tấm Sài Gòn" },
      customer: { name: "Lê Thị B", address: "10 Nguyễn Trãi" },
      total: 85000,
      shippingFee: 15000,
      status: "Delivered",
    },
    {
      id: "ORD-1098",
      date: "2023-10-26 09:15",
      restaurant: { name: "Highlands Coffee" },
      customer: { name: "Trần Văn C", address: "Toà nhà Keangnam" },
      total: 120000,
      shippingFee: 18000,
      status: "Delivered",
    },
    {
      id: "ORD-1055",
      date: "2023-10-25 19:45",
      restaurant: { name: "KFC Phạm Ngọc Thạch" },
      customer: { name: "Hoàng Tùng", address: "5 Chùa Bộc" },
      total: 350000,
      shippingFee: 25000,
      status: "Delivered",
    },
  ]);

  // Function to toggle online status
  const toggleOnline = () => {
    setIsOnline((prev) => !prev);
  };

  // The "Algorithm" to automatically assign orders
  useEffect(() => {
    if (isOnline && !currentOrder) {
      // Simulate scanning delay (3-8 seconds)
      const delay = Math.floor(Math.random() * 5000) + 3000;

      console.log(`📡 Đang quét đơn hàng... (Giả lập chờ ${delay}ms)`);

      algorithmTimeoutRef.current = setTimeout(() => {
        // Randomly pick an order from pending pool
        const randomOrder =
          PENDING_ORDERS[Math.floor(Math.random() * PENDING_ORDERS.length)];

        // Assign to driver
        const assignedOrder = {
          ...randomOrder,
          status: "Driver Assigned",
          assignedAt: new Date().toLocaleTimeString(),
        };

        setCurrentOrder(assignedOrder);
        // Play sound or vibration here in a real app
        alert(`🔔 Đã tìm thấy đơn hàng mới: ${assignedOrder.restaurant.name}`);
      }, delay);
    } else {
      // Clear timeout if goes offline or gets an order
      if (algorithmTimeoutRef.current) {
        clearTimeout(algorithmTimeoutRef.current);
      }
    }

    return () => {
      if (algorithmTimeoutRef.current)
        clearTimeout(algorithmTimeoutRef.current);
    };
  }, [isOnline, currentOrder]);

  // Update order status workflow
  const updateOrderStatus = (status) => {
    if (!currentOrder) return;

    const updatedOrder = { ...currentOrder, status };
    setCurrentOrder(updatedOrder);

    if (status === "Delivered") {
      // Move to history and clear current order
      const completedOrder = {
        ...updatedOrder,
        date: new Date().toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
        }),
        shippingFee: updatedOrder.shippingFee || 15000, // Ensure fallback
      };

      setHistory((prev) => [completedOrder, ...prev]);
      setCurrentOrder(null);
    }
  };

  const cancelOrder = (reason) => {
    // Logic to release order back to pool (not implemented fully)
    setCurrentOrder(null);
  };

  return (
    <ShipperContext.Provider
      value={{
        isOnline,
        toggleOnline,
        currentOrder,
        updateOrderStatus,
        history,
        cancelOrder,
        driverProfile,
      }}
    >
      {children}
    </ShipperContext.Provider>
  );
};

export const useShipper = () => useContext(ShipperContext);

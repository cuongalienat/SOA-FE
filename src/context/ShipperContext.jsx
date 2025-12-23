import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useMemo } from "react";
import {
  updateShipperStatusService,
  getShipperProfileService,
  getCurrentDeliveryService,
  updateShipperLocationService,
  updateDeliveryStatusService,
} from "../services/shipperServices.jsx";
import { useToast } from "./ToastContext"; // Import Toast nếu muốn thông báo

const ShipperContext = createContext();

export const ShipperProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [currentDelivery, setCurrentDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ref để tránh re-render khi set interval
  const orderPollingRef = useRef(null);

  // ---------------------------------
  // 0. Lấy profile shipper
  // ---------------------------------
  const fetchProfile = async () => {
    try {
      const res = await getShipperProfileService();
      // Kiểm tra xem res là dữ liệu trực tiếp hay nằm trong res.data
      const shipperData = res.data || res;

      setProfile(shipperData);

      // SỬA TẠI ĐÂY: Nếu status là ONLINE hoặc SHIPPING thì đều coi là đang trực tuyến
      const onlineStatuses = ["ONLINE", "SHIPPING"];
      setIsOnline(onlineStatuses.includes(shipperData.status));

      return shipperData;
    } catch (error) {
      console.error("Lỗi lấy profile shipper:", error);
      return null;
    }
  };

  // ---------------------------------
  // 1. Bật / Tắt ONLINE
  // ---------------------------------
  const toggleOnline = async () => {
    try {
      // Nếu đang SHIPPING thì không cho tắt (logic nghiệp vụ)
      if (profile?.status === "SHIPPING") {
        alert("Bạn đang trong chuyến giao hàng, không thể tắt trực tuyến!");
        return;
      }

      const newStatus = isOnline ? "OFFLINE" : "ONLINE";
      await updateShipperStatusService(newStatus);

      setIsOnline(!isOnline);
      // Sau khi đổi status, nên fetch lại profile để đồng bộ DB
      await fetchProfile();
    } catch (error) {
      console.error("Lỗi bật tắt trạng thái", error);
    }
  };

  // ---------------------------------
  // 2. Lấy đơn hiện tại & CHECK ĐƠN MỚI
  // ---------------------------------
  const fetchCurrentDelivery = async () => {
    try {
      const delivery = await getCurrentDeliveryService();
      if (delivery && !currentDelivery) {
        // Play sound hoặc Toast thông báo có đơn mới
        console.log("🔔 TING TING! Có đơn hàng mới");
      }
      setCurrentDelivery(delivery || null);
      return delivery; // [NEW] Return để bên Dashboard dùng nếu cần check
    } catch (error) {
      console.error("Lỗi fetch đơn:", error);
      setCurrentDelivery(null);
      return null; // [NEW]
    }
  };
  // ---------------------------------
  // 3. Gửi GPS định kỳ (Chỉ gửi, không nhận đơn)
  // ---------------------------------
  const pingLocation = async () => {
    if (!navigator.geolocation || !isOnline) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const location = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        // Gửi ngầm, không cần await chặn UI
        updateShipperLocationService(location).catch((err) =>
          console.log("Lỗi GPS", err)
        );
      },
      (err) => console.log(err)
    );
  };

  // Effect 1: Ping GPS mỗi 30s (GPS không cần gửi quá dày đặc)
  useEffect(() => {
    if (isOnline) {
      const gpsInterval = setInterval(pingLocation, 30000);
      return () => clearInterval(gpsInterval);
    }
  }, [isOnline]);

  // 👇 EFFECT QUAN TRỌNG: Polling check đơn mới mỗi 10s
  useEffect(() => {
    if (isOnline) {
      // Gọi ngay 1 lần
      fetchCurrentDelivery();

      // Sau đó cứ 10s gọi 1 lần
      orderPollingRef.current = setInterval(() => {
        console.log("🔄 Auto-checking orders...");
        fetchCurrentDelivery();
      }, 10000);
    } else {
      if (orderPollingRef.current) clearInterval(orderPollingRef.current);
    }

    return () => {
      if (orderPollingRef.current) clearInterval(orderPollingRef.current);
    };
  }, [isOnline]); // Chỉ chạy lại khi trạng thái Online thay đổi

  // ---------------------------------
  // 4. Load lúc mở app
  // ---------------------------------
  useEffect(() => {
    const init = async () => {
      try {
        await fetchProfile();
        // Không cần gọi fetchCurrentDelivery ở đây vì effect trên đã lo rồi
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // ---------------------------------
  // 5. Update trạng thái đơn
  // ---------------------------------
  const updateDeliveryStatus = async (deliveryId, status, location = null) => {
    try {
      const updated = await updateDeliveryStatusService(
        deliveryId,
        status,
        location
      );
      setCurrentDelivery(updated);

      if (status === "COMPLETED" || status === "CANCELLED") {
        // Nếu xong đơn thì load lại để xem có đơn mới luôn không
        await fetchCurrentDelivery();
      }
    } catch (error) {
      console.error("Lỗi cập nhật đơn:", error);
      throw error; // Ném lỗi ra để component xử lý UI (nếu cần)
    }
  };

  const contextValue = useMemo(
    () => ({
      profile,
      fetchProfile,
      isOnline,
      toggleOnline,
      currentDelivery,
      fetchCurrentDelivery,
      updateDeliveryStatus,
      loading,
    }),
    [profile, isOnline, currentDelivery, loading]
  );
  return (
    <ShipperContext.Provider value={contextValue}>
      {children}
    </ShipperContext.Provider>
  );
};

export const useShipper = () => useContext(ShipperContext);

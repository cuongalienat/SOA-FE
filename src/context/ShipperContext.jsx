import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import {
  updateShipperStatusService,
  getShipperProfileService,
  getCurrentDeliveryService,
  updateDeliveryStatusService,
} from "../services/shipperServices.jsx";
// import { useToast } from "./ToastContext";

const ShipperContext = createContext();

export const ShipperProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  // 🔥 THAY ĐỔI 1: State mặc định là Mảng rỗng [] thay vì null
  const [currentDelivery, setCurrentDelivery] = useState([]);

  const [loading, setLoading] = useState(true);

  // ---------------------------------
  // 0. Lấy profile shipper
  // ---------------------------------
  const fetchProfile = async () => {
    try {
      const data = await getShipperProfileService();
      setProfile(data);

      // ❌ CODE CŨ (SAI): Chỉ tính là online nếu status đúng bằng "ONLINE"
      // setIsOnline(data.status === "ONLINE");

      // ✅ CODE MỚI (ĐÚNG): Tính là online nếu trạng thái là ONLINE hoặc SHIPPING
      setIsOnline(["ONLINE", "SHIPPING", "SEARCHING"].includes(data.status));

      return data;
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
      // Nếu đang OFFLINE thì bật lên ONLINE
      // Nếu đang ONLINE hoặc SHIPPING thì tắt về OFFLINE
      const newStatus = isOnline ? "OFFLINE" : "ONLINE";

      await updateShipperStatusService(newStatus);

      // Cập nhật state UI ngay lập tức
      setIsOnline(newStatus === "ONLINE");

      // Fetch lại profile để đồng bộ chuẩn xác với Server
      await fetchProfile();
    } catch (error) {
      console.error("Lỗi đổi trạng thái:", error);
      throw error;
    }
  };

  // ---------------------------------
  // 2. Lấy danh sách đơn hàng hiện tại
  // ---------------------------------
  const fetchCurrentDelivery = async () => {
    try {
      const data = await getCurrentDeliveryService();
      // 🔥 THAY ĐỔI 2: Xử lý data trả về để đảm bảo luôn là Mảng
      if (Array.isArray(data)) {
        setCurrentDelivery(data);
      } else if (data) {
        // Fallback: Nếu API cũ trả về 1 object thì nhét vào mảng
        setCurrentDelivery([data]);
      } else {
        setCurrentDelivery([]);
      }
    } catch (error) {
      console.error("Lỗi lấy đơn hiện tại:", error);
      setCurrentDelivery([]);
    }
  };

  // ---------------------------------
  // 3. Update trạng thái đơn (LOGIC MỚI CHO BATCHING)
  // ---------------------------------
  const updateDeliveryStatus = async (deliveryId, status, location = null) => {
    try {
      // Gọi API cập nhật
      const updated = await updateDeliveryStatusService(
        deliveryId,
        status,
        location
      );

      // 🔥 THAY ĐỔI 3: Cập nhật cục bộ trong mảng (Optimistic Update)
      setCurrentDelivery((prevDeliveries) => {
        if (!Array.isArray(prevDeliveries)) return [updated];

        // Tìm và thay thế đơn hàng vừa update trong danh sách
        return prevDeliveries.map((d) => (d._id === updated._id ? updated : d));
      });

      // Nếu đơn Hoàn thành hoặc Hủy -> Nên fetch lại để danh sách sạch sẽ (loại bỏ đơn đó ra)
      if (status === "COMPLETED" || status === "CANCELLED") {
        await fetchCurrentDelivery();
      }
    } catch (error) {
      console.error("Lỗi cập nhật đơn:", error);
      throw error;
    }
  };

  // ---------------------------------
  // 4. Load lúc mở app
  // ---------------------------------
  useEffect(() => {
    const init = async () => {
      try {
        await fetchProfile();
        // Gọi thêm cái này để đảm bảo load đơn ngay khi mở app
        await fetchCurrentDelivery();
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const contextValue = useMemo(
    () => ({
      profile,
      fetchProfile,
      isOnline,
      toggleOnline,
      currentDelivery, // Bây giờ biến này là Array []
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

export const useShipper = () => {
  return useContext(ShipperContext);
};

import { useState, useCallback } from "react";
import {
  getMyShopService,
  updateShopInfoService,
  //   toggleShopStatusService,
} from "../services/shopServices.jsx"; // Nhớ sửa đường dẫn đúng tới file service của bạn
import { useToast } from "../context/ToastContext"; // Import hook thông báo

export const useShop = () => {
  const [shop, setShop] = useState(null); // Lưu thông tin shop
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { showToast } = useToast();

  // 1. Lấy thông tin Shop (Thường gọi ở useEffect trong Dashboard)
  const loadMyShop = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyShopService();
      // Tùy cấu trúc BE trả về, có thể là data hoặc data.data
      // Giả sử service trả về { success: true, data: { ...shop } }
      setShop(data.data || data);
    } catch (err) {
      const msg = err.message || "Không thể tải thông tin cửa hàng";
      setError(msg);
      // showToast(msg, "error"); // Tùy chọn: có muốn hiện lỗi khi load trang không
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Cập nhật thông tin Shop (Tên, ảnh, địa chỉ...)
  const updateShopInfo = async (shopData) => {
    setLoading(true);
    try {
      const data = await updateShopInfoService(shopData);

      // Cập nhật lại state local ngay lập tức để UI thay đổi
      setShop((prev) => ({ ...prev, ...shopData }));
      // Hoặc an toàn hơn là set bằng dữ liệu BE trả về:
      // setShop(data.data || data);

      showToast("Cập nhật thông tin cửa hàng thành công!", "success");
      return { success: true, data };
    } catch (err) {
      const msg = err.message || "Cập nhật thất bại";
      showToast(msg, "error");
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // 3. Bật/Tắt trạng thái mở cửa
  const toggleShopStatus = async () => {
    setLoading(true);
    try {
      const data = await toggleShopStatusService();

      // Cập nhật UI: Đảo ngược trạng thái hiện tại (Optimistic update)
      // Hoặc lấy từ data trả về
      setShop((prev) => {
        if (!prev) return null;
        const newStatus = !prev.isOpen; // Giả sử field tên là isOpen
        showToast(
          newStatus ? "Cửa hàng đã MỞ CỬA" : "Cửa hàng đã ĐÓNG CỬA",
          newStatus ? "success" : "warning"
        );
        return { ...prev, isOpen: newStatus };
      });

      // Nếu BE trả về object shop mới nhất thì set lại cho chắc
      if (data.data) {
        setShop(data.data);
      }

      return { success: true };
    } catch (err) {
      const msg = err.message || "Không thể thay đổi trạng thái";
      showToast(msg, "error");
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return {
    shop,
    loading,
    error,
    loadMyShop,
    updateShopInfo,
    toggleShopStatus,
  };
};

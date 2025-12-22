import { useState, useCallback } from "react";
import {
  getMyShopService,
  updateShopService,
  updateShopStatusService,
  getShopByIdService,
  getMyShopDashboardService,
} from "../services/shopServices.jsx";
import { useToast } from "../context/ToastContext";

export const useShop = () => {
  const { showToast } = useToast();

  const [shop, setShop] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [error, setError] = useState(null);

  /* =======================
     LOAD SHOP (GET)
  ======================= */
  const loadMyShop = useCallback(async () => {
    if (shop) return; // 🔥 QUAN TRỌNG: đã có shop thì không load lại

    setLoading(true);
    try {
      const res = await getMyShopService();
      setShop(res.data || res);
    } catch (err) {
      setError(err.message || "Không thể tải thông tin cửa hàng");
    } finally {
      setLoading(false);
    }
  }, [shop]);

  /* =======================
     UPDATE SHOP INFO (PUT)
  ======================= */
  const updateShopInfo = async (shopData) => {
    setLoading(true);
    try {
      const res = await updateShopService(shopData);

      // ✅ DÙNG DUY NHẤT DATA BE
      setShop(res.shop);

      showToast("Cập nhật thông tin cửa hàng thành công!", "success");
    } catch (err) {
      showToast(err.message || "Cập nhật thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     TOGGLE SHOP STATUS
  ======================= */
  const toggleShopStatus = async () => {
    if (!shop) return;

    setLoading(true);
    try {
      const res = await updateShopStatusService(!shop.isOpen);

      setShop(res.shop); // ✅ BE quyết định

      showToast(
        res.shop.isOpen ? "Cửa hàng đã MỞ CỬA" : "Cửa hàng đã ĐÓNG CỬA",
        res.shop.isOpen ? "success" : "warning"
      );
    } catch (err) {
      showToast(err.message || "Không thể đổi trạng thái", "error");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     LOAD DASHBOARD
  ======================= */
  const loadDashboard = useCallback(async () => {
    setDashboardLoading(true);
    try {
      const res = await getMyShopDashboardService();
      setDashboard(res.data);
    } catch (err) {
      showToast(err.message || "Không thể tải dashboard", "error");
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  /* =======================
     LOAD SHOP BY ID (PUBLIC)
  ======================= */
  const loadShopById = async (shopId) => {
    setLoading(true);
    try {
      const res = await getShopByIdService(shopId);
      setShop(res.data || res);
    } catch (err) {
      showToast(err.message || "Không thể tải shop", "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    shop,
    dashboard,
    loading,
    dashboardLoading,
    error,
    loadMyShop,
    loadDashboard,
    updateShopInfo,
    toggleShopStatus,
    loadShopById,
  };
};

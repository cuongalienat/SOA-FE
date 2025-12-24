import { useState, useCallback } from "react";
import {
  getMyShopService,
  updateShopService,
  updateShopStatusService,
  updateShopAutoAcceptService,
  getShopByIdService,
  getMyShopDashboardService,
  getShopDashboardService,
} from "../services/shopServices.jsx";
import { useToast } from "../context/ToastContext";

// Module-level cache to store shop details across component instances
const SHOP_CACHE = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useShop = () => {
  const { showToast } = useToast();

  const [shop, setShop] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [shopDashboard, setShopDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [error, setError] = useState(null);

  /* =======================
     LOAD SHOP (GET)
  ======================= */
  const loadMyShop = useCallback(async () => {
    // For "My Shop", we might want fresh data or handle differently.
    // Keeping original logic for now, but adding basic state check
    if (shop) return;

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
      const updatedShop = res?.data || res?.shop || res;
      setShop(updatedShop);
      showToast(
        updatedShop.isOpen ? "Cửa hàng đã MỞ CỬA" : "Cửa hàng đã ĐÓNG CỬA",
        updatedShop.isOpen ? "success" : "warning"
      );
    } catch (err) {
      showToast(err.message || "Không thể đổi trạng thái", "error");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     TOGGLE AUTO-ACCEPT
  ======================= */
  const toggleAutoAccept = async () => {
    if (!shop) return;
    setLoading(true);
    try {
      const next = !shop.autoAccept;
      const res = await updateShopAutoAcceptService(next);
      // API returns { success, data } or { shop } depending on controller style
      const updatedShop = res?.data || res?.shop || res;
      setShop(updatedShop);
      showToast(
        next ? "Đã bật auto-accept" : "Đã tắt auto-accept",
        next ? "success" : "info"
      );
    } catch (err) {
      showToast(err.message || "Không thể cập nhật auto-accept", "error");
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

  const loadShopDashboard = useCallback(async (shopId) => {
    setDashboardLoading(true);
    try {
      const res = await getShopDashboardService(shopId);
      setShopDashboard(res.data || res);
    } catch (err) {
      showToast(err.message || "Không thể tải dashboard", "error");
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  /* =======================
     LOAD SHOP BY ID (PUBLIC) WITH CACHE
  ======================= */
  const loadShopById = async (shopId) => {
    if (!shopId) return;

    // 1. Check Cache
    const now = Date.now();
    const cached = SHOP_CACHE.get(shopId);

    if (cached && (now - cached.timestamp < CACHE_DURATION)) {
      setShop(cached.data);
      return;
    }

    setLoading(true);
    try {
      // 2. Fetch from API
      const res = await getShopByIdService(shopId);
      const data = res.data || res;

      // 3. Save to Cache
      SHOP_CACHE.set(shopId, {
        data: data,
        timestamp: now
      });

      setShop(data);
    } catch (err) {
      console.error("Load Shop Error:", err);
      // Don't show toast for every card failure to avoid spam
      // showToast(err.message || "Không thể tải shop", "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    shop,
    dashboard,
    shopDashboard,
    loading,
    dashboardLoading,
    error,
    loadMyShop,
    loadDashboard,
    loadShopDashboard,
    updateShopInfo,
    toggleShopStatus,
    toggleAutoAccept,
    loadShopById,
  };
};

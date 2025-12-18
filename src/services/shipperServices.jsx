// services/shipperServices.jsx
import api from "../config/config.js";

/**
 * =========================
 * SHIPPER SERVICES
 * =========================
 * - Tất cả request đều đi qua api (axios instance)
 * - Token được gắn tự động bằng interceptor
 * - BaseURL đã được cấu hình sẵn trong api
 */

/**
 * 1️⃣ Lấy thông tin Shipper (Profile)
 */
export const getShipperProfileService = async () => {
  const res = await api.get("/shippers/profile");
  return res.data.data;
};

/**
 * 2️⃣ Bật / Tắt trạng thái ONLINE / OFFLINE
 * @param {("ONLINE"|"OFFLINE")} status
 */
export const updateShipperStatusService = async (status) => {
  const res = await api.patch("/shippers/status", { status });
  return res.data.data;
};

/**
 * 3️⃣ [ĐÃ SỬA] Lấy đơn giao hiện tại của shipper
 * - Sử dụng 'api' instance thay vì axios trần.
 * - Không cần truyền token thủ công (Interceptor lo).
 */
export const getCurrentDeliveryService = async () => {
  // Code cũ bị lỗi: axios.get(...)
  // Code mới chuẩn:
  const res = await api.get("/deliveries/current-job");
  
  // Lưu ý: Kiểm tra lại backend trả về format nào. 
  // Nếu giống các API trên thì dùng res.data.data, nếu không thì dùng res.data
  return res.data.data; 
};

/**
 * 4️⃣ Update vị trí GPS của shipper
 * @param {{ lat: number, lng: number }}
 */
export const updateShipperLocationService = async ({ lat, lng }) => {
  const res = await api.patch("/shippers/location", { lat, lng });
  return res.data.data;
};

/**
 * 5️⃣ Cập nhật trạng thái đơn giao
 * @param {string} deliveryId
 * @param {string} status
 * @param {{ lat: number, lng: number } | null} location
 */
export const updateDeliveryStatusService = async (
  deliveryId,
  status,
  location = null
) => {
  const body = { status };
  if (location) body.location = location;

  const res = await api.patch(`/deliveries/${deliveryId}/status`, body);
  return res.data.data;
};

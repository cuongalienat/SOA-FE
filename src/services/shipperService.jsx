// /services/shipperService.js
import api from "../config/config.js";

// -----------------------------
// 1. Bật / Tắt ONLINE
// Backend yêu cầu body: { status: "ONLINE" | "OFFLINE" }
// -----------------------------
export const toggleShipperStatusService = async (status) => {
  console.log("FE gửi status:", status);
  const res = await api.patch("/shippers/status", { status });
  return res.data.data; // backend trả { success, message, data }
};

// -----------------------------
// 2. Lấy profile shipper
// -----------------------------
export const getShipperProfileService = async () => {
  const res = await api.get("/shippers/profile");
  return res.data.data;
};

// -----------------------------
// 3. Lấy đơn được assign hiện tại
// -----------------------------
export const getCurrentDeliveryService = async () => {
  const res = await api.get("/deliveries/current-job");
  return res.data.data;
};

// -----------------------------
// 4. Update GPS
// Backend yêu cầu { lat, lng }
// -----------------------------
export const updateShipperLocationService = async ({ lat, lng }) => {
  const res = await api.patch("/shippers/location", { lat, lng });
  return res.data;
};

// -----------------------------
// 5. Update trạng thái đơn
// -----------------------------
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

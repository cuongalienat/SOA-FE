import React, { useEffect, useState, useMemo } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuths";
import { useShipper } from "../../context/ShipperContext";
import {
  getNearbyOrders,
  acceptDelivery,
} from "../../services/deliveryServices";
import RealtimeMap from "../../components/common/Map/RealtimeMap";
import { ShoppingBag, X } from "lucide-react";

const ShipperDashboard = () => {
  const { token } = useAuth();
  const socket = useSocket();

  // 1. Context Data
  const {
    isOnline,
    toggleOnline,
    currentDelivery,
    fetchCurrentDelivery,
    loading: loadingContext,
  } = useShipper();

  // 2. Local State
  const [availableJobs, setAvailableJobs] = useState([]);
  const [shipperLoc, setShipperLoc] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Quản lý nhiều đơn
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState(null);

  // --- STATE CHO POPUP (MODAL) ---
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Realtime Data
  const [realtimeDataMap, setRealtimeDataMap] = useState({});

  // Helper GPS
  const getCurrentLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => {
          console.warn("GPS Error:", err);
          resolve(null);
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    });
  };

  // --- EFFECT 1: Đồng bộ dữ liệu ---
  useEffect(() => {
    let deliveries = [];
    if (Array.isArray(currentDelivery)) {
      deliveries = currentDelivery;
    } else if (currentDelivery) {
      deliveries = [currentDelivery];
    }

    setActiveDeliveries(deliveries);

    if (deliveries.length > 0) {
      const stillExists = deliveries.find((d) => d._id === selectedDeliveryId);
      if (!selectedDeliveryId || !stillExists) {
        setSelectedDeliveryId(deliveries[0]._id);
      }
    } else {
      setSelectedDeliveryId(null);
      setRealtimeDataMap({});
      setIsModalOpen(false);
    }

    if (deliveries.length > 0 && !shipperLoc && deliveries[0].location) {
      setShipperLoc(deliveries[0].location);
    }
  }, [currentDelivery, selectedDeliveryId]);

  // --- EFFECT: Khóa cuộn trang khi mở Modal (Logic của bạn) ---
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  // --- EFFECT 2: Load đơn quanh đây ---
  useEffect(() => {
    let isMounted = true;
    const loadNearbyJobs = async () => {
      if (isOnline && activeDeliveries.length < 3 && token && !isBusy) {
        try {
          const res = await getNearbyOrders(token);
          if (isMounted && res.data) {
            const myDeliveryIds = activeDeliveries.map((d) => d._id);
            const filteredJobs = res.data.filter(
              (job) => !myDeliveryIds.includes(job._id)
            );
            setAvailableJobs(filteredJobs);
          }
        } catch (error) {
          console.error("Lỗi tìm đơn:", error);
        }
      } else if (isMounted) {
        setAvailableJobs([]);
      }
    };
    loadNearbyJobs();
    const interval = setInterval(loadNearbyJobs, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isOnline, activeDeliveries.length, token, isBusy]);

  const switchToNextOrder = (completedId, currentList) => {
    const nextOrder = currentList.find((d) => d._id !== completedId);
    if (nextOrder) {
      setSelectedDeliveryId(nextOrder._id);
    } else {
      setSelectedDeliveryId(null);
    }
  };

  // --- EFFECT 3: Socket ---
  useEffect(() => {
    if (!socket) return;

    const handleNewJob = (newJobData) => {
      if (activeDeliveries.length < 3 && isOnline && !isBusy) {
        setAvailableJobs((prev) => {
          if (prev.find((j) => j._id === newJobData.deliveryId)) return prev;
          if (activeDeliveries.find((d) => d._id === newJobData.deliveryId))
            return prev;
          return [
            {
              _id: newJobData.deliveryId,
              shippingFee: newJobData.shippingFee,
              distance: newJobData.distance,
              estimatedDuration: newJobData.estimatedDuration,
              pickup: { address: newJobData.pickup },
              dropoff: { address: newJobData.dropoff },
              isNew: true,
            },
            ...prev,
          ];
        });
      }
    };

    const handleJobTaken = (data) => {
      setAvailableJobs((prev) => prev.filter((j) => j._id !== data.deliveryId));
    };

    const handleStatusUpdate = async (data) => {
      if (data.status === "COMPLETED") {
        const completedOrder = activeDeliveries.find(
          (d) => d._id === data.deliveryId
        );
        if (completedOrder && completedOrder.dropoff?.location) {
          const dropoffLoc = {
            lat: completedOrder.dropoff.location.coordinates[1],
            lng: completedOrder.dropoff.location.coordinates[0],
          };
          setShipperLoc(dropoffLoc);
          setRealtimeDataMap((prev) => {
            const newState = { ...prev };
            delete newState[data.deliveryId];
            return newState;
          });
          alert("🎉 Đã xong đơn! Đang điều hướng sang đơn tiếp theo...");
          switchToNextOrder(data.deliveryId, activeDeliveries);
        }
      }
      await fetchCurrentDelivery();
    };

    const handleShipperMoved = (data) => {
      setShipperLoc({ lat: data.lat, lng: data.lng });
      if (data.deliveryId) {
        setRealtimeDataMap((prev) => ({
          ...prev,
          [data.deliveryId]: { eta: data.etaText, dist: data.distanceText },
        }));
      }
    };

    activeDeliveries.forEach((d) => {
      const roomId = d.orderId?._id || d.orderId;
      if (roomId) socket.emit("JOIN_ORDER_ROOM", roomId);
    });

    socket.on("NEW_JOB", handleNewJob);
    socket.on("JOB_TAKEN", handleJobTaken);
    socket.on("ORDER_STATUS_UPDATE", handleStatusUpdate);
    socket.on("SHIPPER_MOVED", handleShipperMoved);

    return () => {
      socket.off("NEW_JOB", handleNewJob);
      socket.off("JOB_TAKEN", handleJobTaken);
      socket.off("ORDER_STATUS_UPDATE", handleStatusUpdate);
      socket.off("SHIPPER_MOVED", handleShipperMoved);
    };
  }, [socket, isOnline, activeDeliveries, fetchCurrentDelivery, isBusy]);

  // --- HANDLERS ---
  const handleToggleStatus = async () => {
    if (activeDeliveries.length > 0) {
      alert("Vui lòng hoàn thành hết các đơn trước khi Offline!");
      return;
    }
    setIsToggling(true);
    try {
      await toggleOnline();
    } catch (error) {
      alert("Lỗi kết nối.");
    } finally {
      setIsToggling(false);
    }
  };

  const handleAcceptJob = async (jobId) => {
    if (!token) return;
    setIsBusy(true);
    try {
      const currentLoc = await getCurrentLocation();
      if (currentLoc) setShipperLoc(currentLoc);

      await acceptDelivery(jobId, token, currentLoc);
      await fetchCurrentDelivery();
      setAvailableJobs((prev) => prev.filter((j) => j._id !== jobId));
      setRealtimeDataMap((prev) => ({
        ...prev,
        [jobId]: { eta: null, dist: null },
      }));
    } catch (error) {
      const msg = error.response?.data?.message || "Lỗi";
      alert(`⚠️ Không thể nhận: ${msg}`);
    } finally {
      setIsBusy(false);
    }
  };

  const selectedDelivery = useMemo(() => {
    return activeDeliveries.find((d) => d._id === selectedDeliveryId) || null;
  }, [activeDeliveries, selectedDeliveryId]);

  const currentRealtime = selectedDeliveryId
    ? realtimeDataMap[selectedDeliveryId]
    : null;

  if (loadingContext || isBusy) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
        }}
      >
        <div style={styles.spinner}></div>
        <p style={{ marginTop: "15px", color: "#666" }}>
          Đang đồng bộ dữ liệu...
        </p>
      </div>
    );
  }

  return (
    <div
      className="shipper-dashboard"
      style={{ minHeight: "100vh", background: "#f5f5f5" }}
    >
      {/* HEADER */}
      <div style={styles.headerBar}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: isOnline ? "#4caf50" : "#bdbdbd",
              boxShadow: isOnline ? "0 0 8px #4caf50" : "none",
            }}
          />
          <span
            style={{
              fontWeight: "bold",
              color: isOnline ? "#2e7d32" : "#757575",
            }}
          >
            {isOnline ? "TRỰC TUYẾN" : "NGOẠI TUYẾN"}
          </span>
        </div>
        <button
          onClick={handleToggleStatus}
          style={{
            ...styles.toggleBtn,
            justifyContent: isOnline ? "flex-end" : "flex-start",
            backgroundColor: isOnline ? "#4caf50" : "#e0e0e0",
            opacity: isToggling || activeDeliveries.length > 0 ? 0.6 : 1,
          }}
        >
          <div style={styles.toggleCircle} />
        </button>
      </div>

      {/* BODY */}
      {!isOnline ? (
        <div style={styles.offlineScreen}>
          <h1 style={{ fontSize: "60px", margin: 0 }}>😴</h1>
          <h3>Bạn đang nghỉ ngơi</h3>
          <p style={{ fontSize: "14px" }}>
            Bật trực tuyến để nhận đơn hàng mới
          </p>
        </div>
      ) : (
        <>
          {/* ACTIVE DELIVERIES */}
          {activeDeliveries.length > 0 ? (
            <div style={{ padding: "0 15px 15px" }}>
              {/* TABS */}
              <div
                style={{
                  display: "flex",
                  overflowX: "auto",
                  gap: "10px",
                  marginBottom: "15px",
                  paddingBottom: "5px",
                }}
              >
                {activeDeliveries.map((delivery, index) => {
                  const isSelected = selectedDeliveryId === delivery._id;
                  const isPickup = ["ASSIGNED", "PICKING_UP"].includes(
                    delivery.status
                  );
                  return (
                    <div
                      key={delivery._id}
                      onClick={() => setSelectedDeliveryId(delivery._id)}
                      style={{
                        minWidth: "140px",
                        backgroundColor: isSelected ? "#E3F2FD" : "white",
                        border: isSelected
                          ? "2px solid #2196F3"
                          : "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "10px",
                        cursor: "pointer",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "4px",
                        }}
                      >
                        <span style={{ fontWeight: "bold", fontSize: "13px" }}>
                          Đơn #{index + 1}
                        </span>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            color: isPickup ? "#e67e22" : "#2ecc71",
                          }}
                        >
                          {isPickup ? "📦 LẤY" : "🚀 GIAO"}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {isPickup
                          ? delivery.pickup?.address
                          : delivery.dropoff?.address}
                      </div>
                    </div>
                  );
                })}
                {activeDeliveries.length < 3 && (
                  <div
                    style={{
                      minWidth: "100px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px dashed #ccc",
                      borderRadius: "8px",
                      color: "#999",
                      fontSize: "12px",
                    }}
                  >
                    + Còn slot
                  </div>
                )}
              </div>

              {/* MAP */}
              <div
                className="map-container"
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  height: "400px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                {selectedDelivery &&
                  (() => {
                    const toLngLat = (loc) => {
                      if (!loc) return null;
                      if (Array.isArray(loc)) return loc;
                      if (loc.lat !== undefined && loc.lng !== undefined)
                        return [loc.lng, loc.lat];
                      return null;
                    };
                    const rawStart =
                      shipperLoc ||
                      selectedDelivery.pickup.location.coordinates;
                    const rawEnd =
                      selectedDelivery.dropoff.location.coordinates;
                    const startPoint = toLngLat(rawStart);
                    const targetPoint = toLngLat(rawEnd);

                    if (!startPoint || !targetPoint)
                      return (
                        <div style={{ padding: 20, textAlign: "center" }}>
                          ⏳ Đang lấy toạ độ...
                        </div>
                      );

                    return (
                      <RealtimeMap
                        pickup={startPoint}
                        dropoff={targetPoint}
                        shipperLocation={{
                          lat: startPoint[1],
                          lng: startPoint[0],
                        }}
                        destination={targetPoint}
                        isNavigationMode={true}
                      />
                    );
                  })()}
              </div>

              {/* STATS */}
              {selectedDelivery && (
                <>
                  <div style={styles.liveStatsContainer}>
                    <div style={styles.liveStatItem}>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          textTransform: "uppercase",
                        }}
                      >
                        Dự kiến đến
                      </span>
                      <strong style={{ fontSize: "20px", color: "#e67e22" }}>
                        {currentRealtime?.eta ||
                          selectedDelivery.estimatedDuration ||
                          "..."}
                      </strong>
                    </div>
                    <div style={{ width: "1px", background: "#ddd" }}></div>
                    <div style={styles.liveStatItem}>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          textTransform: "uppercase",
                        }}
                      >
                        Còn lại
                      </span>
                      <strong style={{ fontSize: "20px", color: "#333" }}>
                        {currentRealtime?.dist ||
                          (selectedDelivery.distance
                            ? `${(selectedDelivery.distance / 1000).toFixed(
                                1
                              )} km`
                            : "...")}
                      </strong>
                    </div>
                    {currentRealtime?.eta && (
                      <div style={styles.liveIndicator}>LIVE</div>
                    )}
                  </div>

                  {/* 🔥 PHẦN SỬA LẠI: CARD & ONCLICK POPUP */}
                  <div
                    style={styles.infoPanel}
                    onClick={() => setIsModalOpen(true)} // Mở Modal khi click
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p style={{ margin: "5px 0" }}>
                        <strong>Lấy:</strong> {selectedDelivery.pickup?.address}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p style={{ margin: "5px 0" }}>
                        <strong>Giao:</strong>{" "}
                        {selectedDelivery.dropoff?.address}
                      </p>
                    </div>
                    <div
                      style={{
                        marginTop: "10px",
                        paddingTop: "10px",
                        borderTop: "1px solid #eee",
                      }}
                    >
                      <strong>Khách:</strong> {selectedDelivery.dropoff?.name} -{" "}
                      {selectedDelivery.dropoff?.phone}
                    </div>
                    <div
                      style={{
                        textAlign: "center",
                        marginTop: "12px",
                        color: "#2e7d32",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      Xem chi tiết đơn hàng &gt;
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : null}

          {/* AVAILABLE JOBS (Giữ nguyên) */}
          {activeDeliveries.length < 3 && (
            <div
              style={{ padding: "15px", maxWidth: "600px", margin: "0 auto" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <h3 style={{ margin: 0 }}>📍 Đơn hàng quanh đây</h3>
                <span
                  style={{
                    fontSize: "13px",
                    background: "#e0e0e0",
                    padding: "2px 8px",
                    borderRadius: "10px",
                  }}
                >
                  {availableJobs.length} đơn
                </span>
              </div>

              {availableJobs.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "40px",
                    color: "#999",
                  }}
                >
                  <div style={styles.radarWave}>📡</div>
                  <p style={{ marginTop: "20px" }}>Đang quét tìm đơn hàng...</p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                  }}
                >
                  {availableJobs.map((job) => (
                    <div
                      key={job._id}
                      style={{
                        ...styles.jobCard,
                        border: job.isNew
                          ? "2px solid #4caf50"
                          : "1px solid #eee",
                        animation: job.isNew ? "flash 1s" : "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "12px",
                          paddingBottom: "10px",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "#2e7d32",
                            fontSize: "18px",
                          }}
                        >
                          +{job.shippingFee?.toLocaleString()} đ
                        </span>
                        <span style={styles.distanceBadge}>
                          {(job.distance / 1000).toFixed(1)} km
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "15px",
                          background: "#f5f5f5",
                          padding: "8px",
                          borderRadius: "6px",
                          marginBottom: "10px",
                          fontSize: "13px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <span>📍 Cách:</span>
                          <strong>{(job.distance / 1000).toFixed(1)} km</strong>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <span>⏱️ Ước tính:</span>
                          <strong>{job.estimatedDuration}</strong>
                        </div>
                      </div>
                      <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                        <span style={{ color: "#888" }}>🏪 Lấy:</span>{" "}
                        <strong>{job.pickup.address}</strong>
                      </div>
                      <div style={{ fontSize: "14px", marginBottom: "15px" }}>
                        <span style={{ color: "#888" }}>🏠 Giao:</span>{" "}
                        <strong>{job.dropoff.address}</strong>
                      </div>
                      <button
                        onClick={() => handleAcceptJob(job._id)}
                        style={styles.btnAcceptList}
                      >
                        NHẬN ĐƠN NGAY (Gom đơn)
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ================= MODAL CHI TIẾT (COPY TỪ FILE BẠN YÊU CẦU) ================= */}
      {isModalOpen && selectedDelivery && (
        <div style={modalStyles.overlay} onClick={() => setIsModalOpen(false)}>
          <div
            style={modalStyles.container}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={modalStyles.dragHandle} />

            {/* Header Modal */}
            <div style={modalStyles.header}>
              <h3 style={modalStyles.headerTitle}>Chi tiết đơn hàng</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={modalStyles.closeBtn}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body Modal */}
            <div style={modalStyles.body}>
              {/* Thông tin địa chỉ */}
              <div style={modalStyles.addressBox}>
                <div style={{ marginBottom: "10px" }}>
                  <p style={modalStyles.addressLabel}>Địa chỉ lấy hàng</p>
                  <p style={modalStyles.addressText}>
                    {selectedDelivery.pickup?.address}
                  </p>
                </div>
                <div
                  style={{ borderTop: "1px solid #e5e7eb", paddingTop: "10px" }}
                >
                  <p style={modalStyles.addressLabel}>Địa chỉ giao hàng</p>
                  <p style={modalStyles.addressText}>
                    {selectedDelivery.dropoff?.address}
                  </p>
                  <p style={modalStyles.customerText}>
                    Khách: {selectedDelivery.dropoff?.name} •{" "}
                    {selectedDelivery.dropoff?.phone}
                  </p>
                </div>
              </div>

              {/* Danh sách món ăn */}
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  <ShoppingBag size={18} style={{ color: "#2e7d32" }} />
                  <p style={modalStyles.sectionTitle}>Món cần giao</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {selectedDelivery.orderId?.items?.map((food, idx) => (
                    <div key={idx} style={modalStyles.foodItem}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span style={modalStyles.quantityBadge}>
                          {food.quantity}x
                        </span>
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#374151",
                          }}
                        >
                          {food.name || food.item?.name}
                        </p>
                      </div>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "900",
                          color: "#111827",
                        }}
                      >
                        {(food.price * food.quantity).toLocaleString()}đ
                      </p>
                    </div>
                  )) || (
                    <p
                      style={{
                        color: "#9ca3af",
                        fontStyle: "italic",
                        textAlign: "center",
                        fontSize: "13px",
                      }}
                    >
                      Không có thông tin chi tiết món ăn
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div style={modalStyles.footer}>
              <div style={modalStyles.footerCard}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                    opacity: 0.6,
                    fontSize: "10px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                  }}
                >
                  <span>Tiền ship thực nhận</span>
                  <span>
                    +{selectedDelivery.shippingFee?.toLocaleString()}đ
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "10px",
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    Tổng đơn khách trả
                  </span>
                  <span
                    style={{
                      fontSize: "24px",
                      fontWeight: "900",
                      color: "#f97316",
                    }}
                  >
                    {selectedDelivery.orderId?.totalAmount?.toLocaleString() ||
                      0}
                    đ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- STYLES ---
const styles = {
  headerBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
    backgroundColor: "white",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    marginBottom: "20px",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  toggleBtn: {
    width: "50px",
    height: "28px",
    borderRadius: "30px",
    border: "none",
    display: "flex",
    alignItems: "center",
    padding: "2px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  toggleCircle: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  offlineScreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "60vh",
    color: "#757575",
  },
  jobCard: {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    transition: "all 0.3s ease",
  },
  distanceBadge: {
    backgroundColor: "#f5f5f5",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    color: "#666",
  },
  btnAcceptList: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    boxShadow: "0 4px 6px rgba(46, 125, 50, 0.2)",
  },
  infoPanel: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    cursor: "pointer", // Thêm cursor
    transition: "transform 0.1s",
  },
  radarWave: {
    fontSize: "50px",
    animation: "pulse 2s infinite",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e0e0e0",
    borderTop: "4px solid #2e7d32",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  liveStatsContainer: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "12px",
    marginTop: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    position: "relative",
    overflow: "hidden",
  },
  liveStatItem: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
  },
  liveIndicator: {
    position: "absolute",
    top: "5px",
    right: "5px",
    backgroundColor: "red",
    color: "white",
    fontSize: "9px",
    fontWeight: "bold",
    padding: "2px 5px",
    borderRadius: "4px",
    animation: "pulse 1.5s infinite",
  },
};

// --- STYLES MODAL (Đã chuyển từ Tailwind sang CSS Object) ---
const modalStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 200,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(4px)",
    transition: "opacity 0.3s",
  },
  container: {
    backgroundColor: "white",
    width: "100%",
    maxWidth: "448px",
    borderTopLeftRadius: "40px",
    borderTopRightRadius: "40px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    display: "flex",
    flexDirection: "column",
    maxHeight: "90vh",
    animation: "slide-up 0.3s ease-out",
  },
  dragHandle: {
    width: "48px",
    height: "6px",
    backgroundColor: "#e5e7eb",
    borderRadius: "9999px",
    margin: "16px auto 8px auto",
    flexShrink: 0,
  },
  header: {
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #f9fafb",
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: "20px",
    fontWeight: "900",
    color: "#111827",
    textTransform: "uppercase",
    letterSpacing: "-0.025em",
    fontStyle: "italic",
    margin: 0,
  },
  closeBtn: {
    padding: "8px",
    backgroundColor: "#f3f4f6",
    borderRadius: "9999px",
    color: "#6b7280",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    padding: "24px",
    overflowY: "auto",
    flex: 1,
    overscrollBehavior: "contain",
  },
  addressBox: {
    marginBottom: "32px",
    backgroundColor: "#f9fafb",
    padding: "20px",
    borderRadius: "25px",
    border: "1px solid #f3f4f6",
  },
  addressLabel: {
    fontSize: "10px",
    fontWeight: "900",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: "4px",
  },
  addressText: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#1f2937",
    lineHeight: "1.25",
    margin: 0,
  },
  customerText: {
    fontSize: "12px",
    color: "#2e7d32",
    fontWeight: "900",
    marginTop: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.025em",
    margin: "8px 0 0 0",
  },
  sectionTitle: {
    fontSize: "12px",
    fontWeight: "900",
    color: "#111827",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    margin: 0,
  },
  foodItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    border: "1px solid #f3f4f6",
    padding: "12px",
    borderRadius: "16px",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  },
  quantityBadge: {
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff7ed",
    color: "#ea580c",
    borderRadius: "8px",
    fontSize: "10px",
    fontWeight: "900",
    border: "1px solid #ffedd5",
  },
  footer: {
    padding: "16px 24px 32px 24px",
    flexShrink: 0,
  },
  footerCard: {
    backgroundColor: "#1a1a1a",
    color: "white",
    padding: "24px",
    borderRadius: "30px",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes pulse { 0% { opacity: 0.5; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0.5; transform: scale(0.9); } }
@keyframes flash { 0% { background-color: #e8f5e9; } 100% { background-color: white; } }
@keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
`;
if (!document.getElementById("dashboard-styles")) {
  styleSheet.id = "dashboard-styles";
  document.head.appendChild(styleSheet);
}

export default ShipperDashboard;

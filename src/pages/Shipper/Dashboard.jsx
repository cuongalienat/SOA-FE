import React, { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../hooks/useAuths'; // Sửa lại đúng tên hook
// 👇 THÊM: import hàm acceptDelivery
import { getCurrentJob, acceptDelivery, getNearbyOrders } from '../../services/deliveryServices';
import RealtimeMap from '../../components/common/Map/RealtimeMap';
import { updateShipperStatus, getShipperProfile } from '../../services/shipperServices.jsx';
const ShipperDashboard = () => {
    const { token, user } = useAuth(); 
    const socket = useSocket();
    
    const [currentOrder, setCurrentOrder] = useState(null);
    const [shipperLoc, setShipperLoc] = useState(null);
    const [availableJobs, setAvailableJobs] = useState([]); // Danh sách đơn hàng chờ
    const [isOnline, setIsOnline] = useState(true); // Quản lý trạng thái online/offline
    const [isLoadingToggle, setIsLoadingToggle] = useState(false); // Quản lý trạng thái loading khi toggle

    // 👇 THÊM: State quản lý đơn hàng mới đến (để hiện Popup)
    const [incomingJob, setIncomingJob] = useState(null);

    useEffect(() => {
        const initDashboard = async () => {
            if (!token) return;
            try {
                // A. Lấy thông tin Shipper để biết đang Online hay Offline
                const profileRes = await getShipperProfile(token);
                if (profileRes?.data) {
                    const onlineStatus = profileRes.data.status === 'ONLINE';
                    setIsOnline(onlineStatus);
                    if (onlineStatus) {
                        console.log("🔄 Đang Online sẵn, load danh sách đơn...");
                        try {
                            const nearbyRes = await getNearbyOrders(token);
                            if (nearbyRes.data) {
                                // Map dữ liệu API sang format của State (nếu cần)
                                // Giả sử API trả về mảng khớp format rồi
                                setAvailableJobs(nearbyRes.data);
                            }
                        } catch (err) {
                            console.error("Lỗi load đơn init:", err);
                        }
                    }
                }

                // B. Kiểm tra xem có đơn hàng nào đang dang dở không
                const jobRes = await getCurrentJob(token);
                if (jobRes?.data) {
                    setCurrentOrder(jobRes.data);
                    // Quan trọng: Join vào room socket của đơn hàng để nghe update
                    if (socket) {
                        const orderId = jobRes.data.orderId._id || jobRes.data.orderId;
                        socket.emit('JOIN_ORDER_ROOM', orderId);
                    }
                }
            } catch (error) {
                console.error("Lỗi khởi tạo dashboard:", error);
            }
        };

        initDashboard();
    }, [token, socket]);

    // 1. Hàm load đơn hàng hiện tại (Tách ra để tái sử dụng)
    const fetchJob = async () => {
        if (!token) return;
        try {
            const res = await getCurrentJob(token);
            if (res.data) {
                setCurrentOrder(res.data);
                // Join room đơn hàng hiện tại
                if(socket) {
                // Lưu ý: res.data.orderId có thể là object hoặc string tùy populate
                    const roomId = res.data.orderId._id || res.data.orderId;
                    socket.emit('JOIN_ORDER_ROOM', roomId);
                }
                
                // Nếu đã có đơn thì tắt popup đơn mới (nếu đang hiện)
                setIncomingJob(null);
            }
        } catch (error) {
            console.error("Lỗi lấy đơn:", error);
        }
    };

    const fetchAvailableJobs = async () => {
        if (!token) return;
        try {
            const res = await getNearbyOrders(token);
            if (res && res.success) {
                // Map dữ liệu nếu cần thiết để có estimatedDuration
                const jobs = res.data.map(job => ({
                    ...job,
                    // Fallback nếu API chưa trả về, hoặc giữ nguyên
                    estimatedDuration: job.estimatedDuration || 'Checking...' 
                }));
                setAvailableJobs(jobs);
            }
        } catch (error) {
            console.error("Lỗi lấy đơn hàng quanh đây:", error);
        }
    };

    // Load lần đầu
    useEffect(() => {
        fetchJob();
    }, [token, socket]);

    // 2. Lắng nghe Socket
    useEffect(() => {
        if (!socket) return;

        // --- Logic cũ: Tracking ---
        socket.on('SHIPPER_MOVED', (data) => setShipperLoc(data));

        socket.on('ORDER_STATUS_UPDATE', (data) => {
            console.log("🔔 Status Update:", data); 
            // data trả về thường là: { status: 'PICKING_UP', message: '...' }

            if (data.status === 'COMPLETED') {
                // 1. Nếu xong rồi -> Reset về giao diện rảnh tay
                alert("🎉 Đơn hàng hoàn tất! Đã cộng tiền.");
                setCurrentOrder(null); 
                setShipperLoc(null);
                fetchAvailableJobs(); // Load lại danh sách đơn chờ
            } else {
                // 2. Nếu đang chạy (PICKING_UP, DELIVERING) -> Cập nhật chữ Status
                // Dùng callback trong setState để đảm bảo lấy được state cũ nhất
                setCurrentOrder(prevOrder => {
                    if (!prevOrder) return null;
                    // Giữ nguyên các thông tin cũ (pickup, dropoff...), chỉ thay status
                    return { ...prevOrder, status: data.status };
                });
            }
        });

        socket.on('NEW_JOB', (newJobData) => {
            // newJobData: { deliveryId, pickup, dropoff, fee, distance }
            
            if (!currentOrder && isOnline) {
                setAvailableJobs(prev => {
                    // 1. Chống trùng (Quan trọng vì Socket có thể bắn trùng)
                    if (prev.find(j => j._id === newJobData.deliveryId)) return prev;
                    
                    // 2. Format dữ liệu để hiển thị
                    const jobFormatted = {
                        _id: newJobData.deliveryId,
                        shippingFee: newJobData.fee,
                        distance: newJobData.distance,
                        estimatedDuration: newJobData.estimatedDuration,
                        pickup: { address: newJobData.pickup },   // ✅ Map thành object có key address
                        dropoff: { address: newJobData.dropoff }, // Backend gửi string địa chỉ
                        isNew: true // Cờ đánh dấu để làm hiệu ứng nhấp nháy
                    };
                    
                    // 3. Chèn lên đầu
                    return [jobFormatted, ...prev];
                });
            }
        });

        socket.on('JOB_TAKEN', (data) => {
            setAvailableJobs(prev => prev.filter(j => j._id !== data.deliveryId));
        });

        return () => {
            socket.off('SHIPPER_MOVED');
            socket.off('ORDER_STATUS_UPDATE');
            socket.off('NEW_JOB'); // Dọn dẹp
            socket.off('JOB_TAKEN');
        };
    }, [socket, currentOrder]); // Thêm dependency currentOrder

    // 👇 THÊM: Xử lý chấp nhận đơn
    const handleAcceptJob = async (jobId) => {
        if (!token) return;
        try {
            await acceptDelivery(jobId, token);
            alert("Nhận đơn thành công! 🚀");
            setAvailableJobs([]); // Clear list sau khi nhận
            
            // Load lại job để vào màn hình Map
            const res = await getCurrentJob(token);
            if (res?.data) {
                setCurrentOrder(res.data);
                if(socket) socket.emit('JOIN_ORDER_ROOM', res.data.orderId._id || res.data.orderId);
            }
        } catch (error) {
            console.error(error);
            alert("Chậm tay rồi! Đơn đã bị người khác nhận.");
            // Xóa đơn đó khỏi list hiển thị
            setAvailableJobs(prev => prev.filter(j => j._id !== jobId));
        }
    };

    // 👇 THÊM: Xử lý từ chối
    const handleRejectJob = () => {
        setIncomingJob(null);
    };

    const handleToggleStatus = async () => {
        if (currentOrder) {
            alert("Bạn không thể đổi trạng thái khi đang có đơn hàng!");
            return; // Không cho đổi khi đang có đơn
        }
        if (!token) return;
        setIsLoadingToggle(true);
        try {
            const newStatus = isOnline ? 'OFFLINE' : 'ONLINE';
            await updateShipperStatus(newStatus, token);
            
            setIsOnline(!isOnline); // Cập nhật UI
            
            // Nếu tắt Online -> Xóa hết đơn chờ (Incoming)
            if (newStatus === 'OFFLINE') {
                setIncomingJob(null);
            }
        } catch (error) {
            console.error("Lỗi đổi trạng thái:", error);
            alert("Không thể đổi trạng thái lúc này!");
        } finally {
            setIsLoadingToggle(false);
        }
    };

    // --- RENDER ---

    return (
        <div className="shipper-dashboard" style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            
            {/* --- HEADER --- */}
            <div style={styles.headerBar}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '12px', height: '12px', borderRadius: '50%',
                        backgroundColor: isOnline ? '#4caf50' : '#bdbdbd',
                        boxShadow: isOnline ? '0 0 8px #4caf50' : 'none'
                    }} />
                    <span style={{ fontWeight: 'bold', color: isOnline ? '#2e7d32' : '#757575' }}>
                        {isOnline ? 'TRỰC TUYẾN' : 'NGOẠI TUYẾN'}
                    </span>
                </div>
                <button 
                    onClick={handleToggleStatus}
                    disabled={isLoadingToggle} 
                    style={{
                        ...styles.toggleBtn,
                        justifyContent: isOnline ? 'flex-end' : 'flex-start',
                        backgroundColor: isOnline ? '#4caf50' : '#e0e0e0',
                        opacity: isLoadingToggle ? 0.7 : 1 
                    }}
                >
                    <div style={styles.toggleCircle} />
                </button>
            </div>

            {/* --- BODY --- */}
            {!isOnline ? (
                // 1. MÀN HÌNH OFFLINE
                <div style={styles.offlineScreen}>
                    <h1 style={{ fontSize: '60px', margin: 0 }}>😴</h1>
                    <h3>Bạn đang nghỉ ngơi</h3>
                </div>
            ) : (
                // 2. MÀN HÌNH ONLINE
                <>
                    {/* CASE A: ĐANG RẢNH -> HIỆN LIST ĐƠN */}
                    {!currentOrder ? (
                        <div style={{ padding: '15px', maxWidth: '600px', margin: '0 auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <h3 style={{ margin: 0 }}>📍 Đơn hàng quanh đây</h3>
                                <span style={{fontSize: '13px', background: '#e0e0e0', padding: '2px 8px', borderRadius: '10px'}}>
                                    {availableJobs.length} đơn
                                </span>
                            </div>

                            {availableJobs.length === 0 ? (
                                <div style={{ textAlign: 'center', marginTop: '80px', color: '#999' }}>
                                    <div style={styles.radarWave}>📡</div>
                                    <p style={{ marginTop: '20px' }}>Đang quét tìm đơn hàng...</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {availableJobs.map(job => (
                                        <div key={job._id} style={{
                                            ...styles.jobCard,
                                            border: job.isNew ? '2px solid #4caf50' : '1px solid #eee',
                                            animation: job.isNew ? 'flash 1s' : 'none'
                                        }}>
                                            {/* Header Card: Giá tiền + Khoảng cách */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid #f0f0f0' }}>
                                                <span style={{ fontWeight: 'bold', color: '#2e7d32', fontSize: '18px' }}>
                                                    +{job.shippingFee?.toLocaleString()} đ
                                                </span>
                                                <span style={{ 
                                                    ...styles.distanceBadge, 
                                                    backgroundColor: '#e8f5e9',
                                                    color: '#2e7d32' 
                                                }}>
                                                    {/* API trả về chuỗi "25 phút" rồi nên hiển thị luôn */}
                                                    ⏱️ {job.estimatedDuration || 'Calculating...'} 
                                                </span>
                                                <span style={styles.distanceBadge}>
                                                    {(job.distance / 1000).toFixed(1)} km
                                                </span>
                                            </div>
                                            
                                            {/* Nội dung địa chỉ */}
                                            <div style={{ fontSize: '14px', marginBottom: '8px', display: 'flex', gap: '10px' }}>
                                                <span style={{color: '#888'}}>🏪 Lấy:</span> 
                                                <strong style={{flex: 1}}>{job.pickup.address}</strong>
                                            </div>
                                            <div style={{ fontSize: '14px', marginBottom: '15px', display: 'flex', gap: '10px' }}>
                                                <span style={{color: '#888'}}>🏠 Giao:</span> 
                                                <strong style={{flex: 1}}>{job.dropoff.address}</strong>
                                            </div>
                                            
                                            {/* Nút nhận đơn */}
                                            <button 
                                                onClick={() => handleAcceptJob(job._id)}
                                                style={styles.btnAcceptList}
                                            >
                                                NHẬN ĐƠN NGAY
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        // CASE B: ĐANG BẬN -> HIỆN MAP (Giữ nguyên)
                        <div style={{ padding: '0 15px 15px' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h2 style={{ margin: 0 }}>📦 Đang thực hiện</h2>
                                <span style={styles.statusBadge}>{currentOrder.status}</span>
                            </div>
                            <div className="map-container" style={{ borderRadius: '12px', overflow: 'hidden', height: '400px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                <RealtimeMap 
                                    pickup={currentOrder.pickup.location.coordinates} 
                                    dropoff={currentOrder.dropoff.location.coordinates}
                                    shipperLocation={shipperLoc} 
                                />
                            </div>
                            <div style={styles.infoPanel}>
                                <p><strong>Lấy:</strong> {currentOrder.pickup.address}</p>
                                <p><strong>Giao:</strong> {currentOrder.dropoff.address}</p>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

// CSS inline đơn giản cho Modal (Bạn có thể chuyển sang file CSS riêng)
const styles = {
    headerBar: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '15px 20px', backgroundColor: 'white',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)', marginBottom: '20px',
        position: 'sticky', top: 0, zIndex: 100
    },
    toggleBtn: {
        width: '50px', height: '28px', borderRadius: '30px',
        border: 'none', display: 'flex', alignItems: 'center',
        padding: '2px', cursor: 'pointer', transition: 'all 0.3s ease'
    },
    toggleCircle: {
        width: '24px', height: '24px', borderRadius: '50%',
        backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    },
    offlineScreen: {
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', height: '60vh', color: '#757575'
    },
    modalOverlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        backdropFilter: 'blur(3px)'
    },
    modalContent: {
        backgroundColor: 'white', padding: '25px', borderRadius: '16px',
        width: '90%', maxWidth: '400px', textAlign: 'center',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        animation: 'popIn 0.3s ease'
    },
    buttonGroup: {
        display: 'flex', gap: '10px', marginTop: '20px'
    },
    btnReject: {
        flex: 1, padding: '12px', backgroundColor: '#f5f5f5', color: '#333',
        border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
    },
    btnAccept: {
        flex: 1, padding: '12px', backgroundColor: '#2e7d32', color: 'white',
        border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
        boxShadow: '0 4px 6px rgba(46, 125, 50, 0.3)'
    },
    infoPanel: {
        backgroundColor: 'white', padding: '20px', borderRadius: '12px',
        marginTop: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    statusBadge: {
        backgroundColor: '#e3f2fd', color: '#1565c0', 
        padding: '4px 12px', borderRadius: '20px', 
        fontSize: '12px', fontWeight: 'bold'
    },
    radarWave: {
        fontSize: '50px',
        animation: 'pulse 2s infinite'
    }
};

export default ShipperDashboard;
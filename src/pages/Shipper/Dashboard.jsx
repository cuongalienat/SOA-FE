import React, { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../hooks/useAuths'; // Sửa lại đúng tên hook
// 👇 THÊM: import hàm acceptDelivery
import { getCurrentJob, acceptDelivery } from '../../services/deliveryServices';
import RealtimeMap from '../../components/common/Map/RealtimeMap';
import { updateShipperStatus, getShipperProfile } from '../../services/shipperServices.jsx';
const ShipperDashboard = () => {
    const { token, user } = useAuth(); 
    const socket = useSocket();
    
    const [currentOrder, setCurrentOrder] = useState(null);
    const [shipperLoc, setShipperLoc] = useState(null);

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
                    setIsOnline(profileRes.data.status === 'ONLINE');
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

        // 👇 THÊM: Lắng nghe đơn hàng mới (Từ logic tìm shipper quanh đây)
        socket.on('NEW_JOB', (data) => {
            console.log("🔔 CÓ ĐƠN HÀNG MỚI:", data);
            // data: { deliveryId, pickup, dropoff, fee, distance }
            
            // Chỉ hiện nếu đang rảnh (chưa có currentOrder)
            if (!currentOrder) {
                setIncomingJob(data);
                
                // Phát âm thanh thông báo nếu muốn (Optional)
                // new Audio('/path/to/sound.mp3').play();
            }
        });

        return () => {
            socket.off('SHIPPER_MOVED');
            socket.off('ORDER_STATUS_UPDATE');
            socket.off('NEW_JOB'); // Dọn dẹp
        };
    }, [socket, currentOrder]); // Thêm dependency currentOrder

    // 👇 THÊM: Xử lý chấp nhận đơn
    const handleAcceptJob = async () => {
        if (!incomingJob || !token) return;
        try {
            await acceptDelivery(incomingJob.deliveryId, token);
            alert("Đã nhận đơn thành công! 🚀");
            
            // Ẩn popup & Load lại dashboard để vào giao diện Map
            setIncomingJob(null);
            fetchJob(); 

        } catch (error) {
            console.error("Lỗi nhận đơn:", error);
            alert("Lỗi: Có thể đơn đã bị người khác nhận mất!");
            setIncomingJob(null);
        }
    };

    // 👇 THÊM: Xử lý từ chối
    const handleRejectJob = () => {
        setIncomingJob(null);
    };

    const handleToggleStatus = async () => {
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
        <div className="shipper-dashboard" style={{ position: 'relative', minHeight: '100vh', background: '#f5f5f5' }}>
            
            {/* --- HEADER ĐIỀU KHIỂN TRẠNG THÁI --- */}
            <div style={styles.headerBar}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '12px', height: '12px', borderRadius: '50%',
                        backgroundColor: isOnline ? '#4caf50' : '#bdbdbd',
                        boxShadow: isOnline ? '0 0 8px #4caf50' : 'none',
                        transition: 'all 0.3s'
                    }} />
                    <span style={{ fontWeight: 'bold', color: isOnline ? '#2e7d32' : '#757575' }}>
                        {isOnline ? 'ĐANG TRỰC TUYẾN' : 'ĐANG NGOẠI TUYẾN'}
                    </span>
                </div>

                <button 
                    onClick={handleToggleStatus}
                    disabled={isLoadingToggle || currentOrder} 
                    style={{
                        ...styles.toggleBtn,
                        backgroundColor: isOnline ? '#4caf50' : '#e0e0e0',
                        justifyContent: isOnline ? 'flex-end' : 'flex-start'
                    }}
                >
                    <div style={styles.toggleCircle} />
                </button>
            </div>

            {/* --- LOGIC HIỂN THỊ CHÍNH --- */}
            {!isOnline ? (
                // 1. MÀN HÌNH OFFLINE
                <div style={styles.offlineScreen}>
                    <h1 style={{ fontSize: '60px', marginBottom: '10px' }}>😴</h1>
                    <h2>Bạn đang ngoại tuyến</h2>
                    <p>Bật trạng thái để bắt đầu kiếm tiền nhé!</p>
                </div>
            ) : (
                // 2. MÀN HÌNH ONLINE
                <>
                    {/* A. POPUP NHẬN ĐƠN (MODAL) */}
                    {incomingJob && !currentOrder && (
                        <div style={styles.modalOverlay}>
                            <div style={styles.modalContent}>
                                <div style={{ marginBottom: '15px' }}>
                                    <h2 style={{ color: '#d32f2f', margin: 0 }}>🔥 ĐƠN HÀNG MỚI!</h2>
                                    <p style={{ color: '#666', fontSize: '14px' }}>Cách bạn {incomingJob.distance ? (incomingJob.distance/1000).toFixed(1) : 0} km</p>
                                </div>
                                
                                <div style={{ textAlign: 'left', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
                                    <p style={{margin: '5px 0'}}>🏪 <strong>Lấy:</strong> {incomingJob.pickup}</p>
                                    <p style={{margin: '5px 0'}}>🏠 <strong>Giao:</strong> {incomingJob.dropoff}</p>
                                    <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '10px 0' }}/>
                                    <p style={{margin: '5px 0', fontSize: '18px', color: '#2e7d32'}}>💰 <strong>Thu nhập: {incomingJob.fee?.toLocaleString()} đ</strong></p>
                                </div>

                                <div style={styles.buttonGroup}>
                                    <button onClick={handleRejectJob} style={styles.btnReject}>Bỏ qua</button>
                                    <button onClick={handleAcceptJob} style={styles.btnAccept}>NHẬN ĐƠN NGAY</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* B. DASHBOARD CHÍNH */}
                    {!currentOrder ? (
                        // Trạng thái chờ đơn
                        <div className="p-4" style={{ textAlign: 'center', marginTop: '100px' }}>
                            <div style={styles.radarWave}>📡</div>
                            <h3 style={{ marginTop: 20, color: '#333' }}>Đang quét đơn hàng quanh đây...</h3>
                            <p style={{ color: '#666' }}>Vui lòng giữ ứng dụng mở để nhận thông báo</p>
                        </div>
                    ) : (
                        // Trạng thái đang giao hàng
                        <div style={{ padding: '0 15px 15px 15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h2 style={{ margin: 0 }}>📦 Đang thực hiện</h2>
                                <span style={styles.statusBadge}>{currentOrder.status}</span>
                            </div>
                            
                            <div className="map-container" style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                <RealtimeMap 
                                    pickup={currentOrder.pickup.location.coordinates} 
                                    dropoff={currentOrder.dropoff.location.coordinates}
                                    shipperLocation={shipperLoc} 
                                />
                            </div>

                            <div className="info-panel" style={styles.infoPanel}>
                                <div style={{ marginBottom: '10px' }}>
                                    <div style={{ fontSize: '12px', color: '#888' }}>ĐIỂM LẤY HÀNG</div>
                                    <div style={{ fontWeight: 500 }}>{currentOrder.pickup.address}</div>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <div style={{ fontSize: '12px', color: '#888' }}>ĐIỂM GIAO HÀNG</div>
                                    <div style={{ fontWeight: 500 }}>{currentOrder.dropoff.address}</div>
                                </div>
                                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #ddd', display: 'flex', justifyContent: 'space-between' }}>
                                    <strong>Tổng tiền thu hộ:</strong>
                                    <span style={{ color: '#d32f2f', fontSize: '18px', fontWeight: 'bold' }}>
                                        {currentOrder.orderId.totalAmount?.toLocaleString()} đ
                                    </span>
                                </div>
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
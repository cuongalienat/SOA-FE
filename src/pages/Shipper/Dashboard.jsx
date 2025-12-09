import React, { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../hooks/useAuths'; // Sửa lại đúng tên hook
// 👇 THÊM: import hàm acceptDelivery
import { getCurrentJob, acceptDelivery } from '../../services/deliveryServices';
import RealtimeMap from '../../components/common/Map/RealtimeMap';

const ShipperDashboard = () => {
    const { token, user } = useAuth(); 
    const socket = useSocket();
    
    const [currentOrder, setCurrentOrder] = useState(null);
    const [shipperLoc, setShipperLoc] = useState(null);

    // 👇 THÊM: State quản lý đơn hàng mới đến (để hiện Popup)
    const [incomingJob, setIncomingJob] = useState(null);

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

    // --- RENDER ---

    return (
        <div className="shipper-dashboard" style={{ position: 'relative' }}>
            
            {/* 👇 1. POPUP NHẬN ĐƠN (Modal) */}
            {incomingJob && !currentOrder && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h2 style={{ color: '#d32f2f' }}>🔔 Đơn hàng mới!</h2>
                        <div style={{ textAlign: 'left', margin: '15px 0' }}>
                            <p><strong>📍 Lấy:</strong> {incomingJob.pickup}</p>
                            <p><strong>📍 Giao:</strong> {incomingJob.dropoff}</p>
                            <p><strong>📏 Khoảng cách:</strong> {incomingJob.distance ? (incomingJob.distance/1000).toFixed(1) : 0} km</p>
                            <p><strong>💰 Thu nhập:</strong> {incomingJob.fee?.toLocaleString()} đ</p>
                        </div>
                        <div style={styles.buttonGroup}>
                            <button onClick={handleRejectJob} style={styles.btnReject}>Bỏ qua</button>
                            <button onClick={handleAcceptJob} style={styles.btnAccept}>NHẬN ĐƠN</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 👇 2. GIAO DIỆN CHÍNH (Map hoặc Rảnh) */}
            {!currentOrder ? (
                <div className="p-4" style={{ textAlign: 'center', marginTop: '50px' }}>
                    <h2>💤 Bạn đang rảnh (Online)</h2>
                    <p>Đang tìm đơn hàng quanh đây...</p>
                    {/* Icon loading quay quay cho đẹp */}
                    <div className="loader">Searching...</div>
                </div>
            ) : (
                // Giao diện có đơn (Giữ nguyên code cũ của bạn)
                <div>
                     <h1>📦 Đơn hàng hiện tại: {currentOrder.status}</h1>
                     <div className="map-container" style={{ marginTop: '20px' }}>
                        <RealtimeMap 
                            pickup={currentOrder.pickup.location.coordinates} 
                            dropoff={currentOrder.dropoff.location.coordinates}
                            shipperLocation={shipperLoc} 
                        />
                    </div>
                    <div className="info-panel" style={{ padding: '20px' }}>
                        <p>📍 <strong>Lấy hàng:</strong> {currentOrder.pickup.address}</p>
                        <p>📍 <strong>Giao tới:</strong> {currentOrder.dropoff.address}</p>
                        <p>💰 <strong>Tiền thu:</strong> {currentOrder.orderId.totalAmount?.toLocaleString()} đ</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// CSS inline đơn giản cho Modal (Bạn có thể chuyển sang file CSS riêng)
const styles = {
    modalOverlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000,
        display: 'flex', justifyContent: 'center', alignItems: 'center'
    },
    modalContent: {
        backgroundColor: 'white', padding: '30px', borderRadius: '15px',
        width: '90%', maxWidth: '400px', textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    buttonGroup: {
        display: 'flex', justifyContent: 'space-between', marginTop: '20px'
    },
    btnReject: {
        padding: '10px 20px', backgroundColor: '#e0e0e0', border: 'none',
        borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
    },
    btnAccept: {
        padding: '10px 20px', backgroundColor: '#2e7d32', color: 'white',
        border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
    }
};

export default ShipperDashboard;
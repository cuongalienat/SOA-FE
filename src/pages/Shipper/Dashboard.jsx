import React, { useEffect, useState, useCallback } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../hooks/useAuths';
import { useShipper } from '../../context/ShipperContext'; 
import { getNearbyOrders, acceptDelivery } from '../../services/deliveryServices';
import RealtimeMap from '../../components/common/Map/RealtimeMap';

const ShipperDashboard = () => {
    const { token } = useAuth();
    const socket = useSocket();

    // 1. Context Data
    const {     
        isOnline, 
        toggleOnline, 
        currentDelivery, 
        fetchCurrentDelivery, 
        loading: loadingContext 
    } = useShipper();

    // 2. Local State
    const [availableJobs, setAvailableJobs] = useState([]);
    const [shipperLoc, setShipperLoc] = useState(null);
    const [isToggling, setIsToggling] = useState(false);
    
    // isBusy: Khóa UI khi đang xử lý nhận đơn
    const [isBusy, setIsBusy] = useState(false);

    // ----------------------------------------------------
    // HELPER: Lấy vị trí GPS hiện tại (Promise wrapper)
    // ----------------------------------------------------
    const getCurrentLocation = () => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve(null);
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => {
                    console.warn("GPS Error/Timeout:", err);
                    resolve(null);
                },
                { timeout: 5000, enableHighAccuracy: true }
            );
        });
    };

    // ----------------------------------------------------
    // A. EFFECT: Load đơn hàng quanh đây
    // ----------------------------------------------------
    useEffect(() => {
        let isMounted = true;
        
        const loadNearbyJobs = async () => {
            // Chỉ load khi Online, chưa có đơn, và không đang bận xử lý
            if (isOnline && !currentDelivery && token && !isBusy) {
                try {
                    console.log("📡 Scanning for nearby jobs...");
                    const res = await getNearbyOrders(token);
                    if (isMounted && res.data) {
                        setAvailableJobs(res.data);
                    }
                } catch (error) {
                    console.error("Lỗi tìm đơn quanh đây:", error);
                }
            } else if (isMounted) {
                setAvailableJobs([]);
            }
        };

        loadNearbyJobs();

        return () => { isMounted = false; };
    }, [isOnline, currentDelivery, token, isBusy]);

    // ----------------------------------------------------
    // B. EFFECT: Socket Listeners
    // ----------------------------------------------------
    useEffect(() => {
        if (!socket) return;

        const handleNewJob = (newJobData) => {
            // Chỉ nhận job mới vào list khi chưa có đơn
            if (!currentDelivery && isOnline && !isBusy) {
                setAvailableJobs(prev => {
                    if (prev.find(j => j._id === newJobData.deliveryId)) return prev;
                    const jobFormatted = {
                        _id: newJobData.deliveryId,
                        shippingFee: newJobData.fee,
                        distance: newJobData.distance,
                        pickup: { address: newJobData.pickup },
                        dropoff: { address: newJobData.dropoff },
                        isNew: true
                    };
                    return [jobFormatted, ...prev];
                });
            }
        };

        const handleJobTaken = (data) => {
            setAvailableJobs(prev => prev.filter(j => j._id !== data.deliveryId));
        };

        const handleStatusUpdate = async (data) => {
            console.log("🔔 Status Update:", data);
            await fetchCurrentDelivery(); // Cập nhật lại trạng thái đơn hàng
            if (data.status === 'COMPLETED') {
                alert("🎉 Đơn hàng hoàn tất! Đã cộng tiền.");
                setShipperLoc(null);
            }
        };

        const handleShipperMoved = (data) => {
            setShipperLoc(data);
        };

        // Join room nếu đang có đơn
        if (currentDelivery) {
            const roomId = currentDelivery.orderId?._id || currentDelivery.orderId;
            if (roomId) socket.emit('JOIN_ORDER_ROOM', roomId);
        }

        socket.on('NEW_JOB', handleNewJob);
        socket.on('JOB_TAKEN', handleJobTaken);
        socket.on('ORDER_STATUS_UPDATE', handleStatusUpdate);
        socket.on('SHIPPER_MOVED', handleShipperMoved);

        return () => {
            socket.off('NEW_JOB', handleNewJob);
            socket.off('JOB_TAKEN', handleJobTaken);
            socket.off('ORDER_STATUS_UPDATE', handleStatusUpdate);
            socket.off('SHIPPER_MOVED', handleShipperMoved);
        };
    }, [socket, isOnline, currentDelivery, fetchCurrentDelivery, isBusy]);

    // ----------------------------------------------------
    // C. Handlers
    // ----------------------------------------------------
    
    const handleToggleStatus = async () => {
        if (currentDelivery) {
            alert("Bạn đang có đơn hàng, không thể Offline lúc này!");
            return;
        }
        setIsToggling(true);
        try {
            await toggleOnline();
        } catch (error) {
            alert("Lỗi kết nối, thử lại sau.");
        } finally {
            setIsToggling(false);
        }
    };

    // [REFACTORED] Logic nhận đơn chuẩn: Try-Catch-Finally
    const handleAcceptJob = async (jobId) => {
        if (!token) return;
        
        // 1. Khóa UI ngay lập tức
        setIsBusy(true); 

        try {
            // 2. Lấy vị trí (Async)
            const currentLoc = await getCurrentLocation();

            // 3. Gọi API nhận đơn
            await acceptDelivery(jobId, token, currentLoc);
            
            // 4. Đồng bộ dữ liệu từ Context (quan trọng)
            // Khi hàm này chạy xong, state 'currentDelivery' trong Context sẽ thay đổi
            // Component sẽ re-render và tự động chuyển sang giao diện Map
            await fetchCurrentDelivery();
            
            // 5. Clear list job để UX sạch sẽ
            setAvailableJobs([]);
            
            // alert("Nhận đơn thành công! 🚀"); // Tắt alert để trải nghiệm mượt hơn

        } catch (error) {
            console.error("Lỗi nhận đơn:", error);
            const msg = error.response?.data?.message || "Có lỗi xảy ra";
            alert(`⚠️ Không thể nhận đơn: ${msg}`);

            // Nếu lỗi 404/400 (đơn đã bị lấy hoặc hủy), xóa khỏi list hiển thị
            if (error.response?.status === 400 || error.response?.status === 404) {
                 setAvailableJobs(prev => prev.filter(j => j._id !== jobId));
            }
        } finally {
            // [QUAN TRỌNG] Luôn mở khóa UI dù thành công hay thất bại
            setIsBusy(false); 
        }
    };

    // ----------------------------------------------------
    // D. Render Logic
    // ----------------------------------------------------

    // Màn hình Loading khi đang fetch context hoặc đang nhận đơn
    if (loadingContext || isBusy) {
        return (
            <div style={{display: 'flex', height: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5'}}>
                <div style={styles.spinner}></div>
                <p style={{marginTop: '15px', color: '#666', fontWeight: '500'}}>
                    {isBusy ? 'Đang nhận đơn & Đồng bộ...' : 'Đang tải dữ liệu...'}
                </p>
            </div>
        );
    }

    return (
        <div className="shipper-dashboard" style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            
            {/* HEADER */}
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
                    //disabled={isToggling || !!currentDelivery} 
                    style={{
                        ...styles.toggleBtn, 
                        justifyContent: isOnline ? 'flex-end' : 'flex-start', 
                        backgroundColor: isOnline ? '#4caf50' : '#e0e0e0',
                        opacity: (isToggling || !!currentDelivery) ? 0.6 : 1
                    }}
                >
                    <div style={styles.toggleCircle} />
                </button>
            </div>

            {/* BODY */}
            {!isOnline ? (
                <div style={styles.offlineScreen}>
                    <h1 style={{ fontSize: '60px', margin: 0 }}>😴</h1>
                    <h3>Bạn đang nghỉ ngơi</h3>
                    <p style={{fontSize: '14px'}}>Bật trực tuyến để nhận đơn hàng mới</p>
                </div>
            ) : (
                <>
                    {/* Logic Render: Nếu KHÔNG có đơn thì hiện List, CÓ đơn thì hiện Map */}
                    {!currentDelivery ? (
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
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid #f0f0f0' }}>
                                                <span style={{ fontWeight: 'bold', color: '#2e7d32', fontSize: '18px' }}>
                                                    +{job.shippingFee?.toLocaleString()} đ
                                                </span>
                                                <span style={styles.distanceBadge}>
                                                    {(job.distance / 1000).toFixed(1)} km
                                                </span>
                                            </div>
                                            
                                            <div style={{ fontSize: '14px', marginBottom: '8px', display: 'flex', gap: '10px' }}>
                                                <span style={{color: '#888'}}>🏪 Lấy:</span> 
                                                <strong style={{flex: 1}}>{job.pickup.address}</strong>
                                            </div>
                                            <div style={{ fontSize: '14px', marginBottom: '15px', display: 'flex', gap: '10px' }}>
                                                <span style={{color: '#888'}}>🏠 Giao:</span> 
                                                <strong style={{flex: 1}}>{job.dropoff.address}</strong>
                                            </div>
                                            
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
                        <div style={{ padding: '0 15px 15px' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h2 style={{ margin: 0 }}>📦 Đang thực hiện</h2>
                                <span style={styles.statusBadge}>{currentDelivery.status}</span>
                            </div>
                            <div className="map-container" style={{ borderRadius: '12px', overflow: 'hidden', height: '400px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                {currentDelivery.pickup && currentDelivery.dropoff && (
                                    <RealtimeMap 
                                        pickup={currentDelivery.pickup.location.coordinates} 
                                        dropoff={currentDelivery.dropoff.location.coordinates}
                                        shipperLocation={shipperLoc} 
                                    />
                                )}
                            </div>
                            <div style={styles.infoPanel}>
                                <p><strong>Lấy:</strong> {currentDelivery.pickup?.address}</p>
                                <p><strong>Giao:</strong> {currentDelivery.dropoff?.address}</p>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

// --- STYLES (Giữ nguyên) ---
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
    jobCard: {
        backgroundColor: 'white', padding: '15px', borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'all 0.3s ease'
    },
    distanceBadge: {
        backgroundColor: '#f5f5f5', padding: '2px 8px', borderRadius: '4px',
        fontSize: '12px', color: '#666'
    },
    btnAcceptList: {
        width: '100%', padding: '12px', backgroundColor: '#2e7d32', color: 'white',
        border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
        fontSize: '14px', boxShadow: '0 4px 6px rgba(46, 125, 50, 0.2)'
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
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #e0e0e0',
        borderTop: '4px solid #2e7d32',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    }
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes pulse { 0% { opacity: 0.5; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0.5; transform: scale(0.9); } }
@keyframes flash { 0% { background-color: #e8f5e9; } 100% { background-color: white; } }
`;
document.head.appendChild(styleSheet);

export default ShipperDashboard;
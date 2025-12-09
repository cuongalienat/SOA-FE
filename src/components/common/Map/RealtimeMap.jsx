import React, { useRef, useEffect, useState } from 'react';
import polyline from '@mapbox/polyline'; // Đảm bảo đã npm install @mapbox/polyline

// 👇 CẤU HÌNH KEY (Thay bằng Key thật của bạn)
const GOONG_MAP_KEY = "4WkfOyMzqqfcnR656w7Bk6WFVx8pHUKH8XPw27fm"; // Key cho Frontend (Map Tiles)
const GOONG_API_KEY = "63QnExA88BuAbVaQNU4EDxGyfjAbNZRO9Bqhh2NK"; // Key cho Backend (API Services - Directions)

const RealtimeMap = ({ pickup, dropoff, shipperLocation }) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    
    // 👇 KHAI BÁO BIẾN QUAN TRỌNG NÀY (Để fix lỗi ReferenceError)
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    // Refs để quản lý Markers (để cập nhật vị trí mà không cần vẽ lại)
    const markersRef = useRef({
        pickup: null,
        dropoff: null,
        shipper: null
    });

    // ---------------------------------------------------------
    // 1. KHỞI TẠO BẢN ĐỒ (INIT MAP)
    // ---------------------------------------------------------
    useEffect(() => {
        const goongjs = window.goongjs;
        if (!goongjs || mapInstanceRef.current) return;

        goongjs.accessToken = GOONG_MAP_KEY;

        const map = new goongjs.Map({
            container: mapContainerRef.current,
            style: 'https://tiles.goong.io/assets/goong_map_web.json',
            center: [105.804817, 21.028511],
            zoom: 12
        });

        map.addControl(new goongjs.NavigationControl(), 'top-right');
        
        // Sự kiện khi Map tải xong
        map.on('load', () => {
            console.log("✅ Map Loaded & Ready!");
            setIsMapLoaded(true); // Bật cờ true
        });

        mapInstanceRef.current = map;

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    // ---------------------------------------------------------
    // 2. VẼ MARKER & FIT BOUNDS
    // ---------------------------------------------------------
    useEffect(() => {
        const map = mapInstanceRef.current;
        const goongjs = window.goongjs;

        if (!map || !isMapLoaded || !goongjs) return;

        const drawMarker = (type, coords, iconHTML) => {
            if (!coords || coords.length < 2) return;

            if (!markersRef.current[type]) {
                const el = document.createElement('div');
                el.innerHTML = iconHTML;
                el.style.cursor = 'pointer';
                
                markersRef.current[type] = new goongjs.Marker(el)
                    .setLngLat([coords[0], coords[1]])
                    .addTo(map);
            } else {
                markersRef.current[type].setLngLat([coords[0], coords[1]]);
                if (!markersRef.current[type].getElement().parentElement) {
                    markersRef.current[type].addTo(map);
                }
            }
        };

        // Vẽ 2 điểm
        drawMarker('pickup', pickup, '<div style="font-size: 35px;">🏪</div>');
        drawMarker('dropoff', dropoff, '<div style="font-size: 35px;">🏠</div>');

        // Zoom map để thấy cả 2 điểm
        if (pickup && dropoff) {
             const bounds = new goongjs.LngLatBounds();
             bounds.extend(pickup);
             bounds.extend(dropoff);
             try {
                // padding: khoảng cách từ marker đến mép bản đồ
                map.fitBounds(bounds, { padding: 80, maxZoom: 15 });
             } catch(e) {}
        }
    }, [pickup, dropoff, isMapLoaded]);

    // ---------------------------------------------------------
    // 3. VẼ ĐƯỜNG ĐI MÀU ĐỎ (POLYLINE)
    // ---------------------------------------------------------
    useEffect(() => {
        const map = mapInstanceRef.current;
        // Chỉ vẽ khi Map đã load + có đủ 2 điểm Pickup/Dropoff
        if (!map || !isMapLoaded || !pickup || !dropoff) return;

        const fetchRoute = async () => {
            try {
                // Gọi API Goong Directions
                const origin = `${pickup[1]},${pickup[0]}`; // Lat,Lng
                const destination = `${dropoff[1]},${dropoff[0]}`;
                const url = `https://rsapi.goong.io/Direction?origin=${origin}&destination=${destination}&vehicle=bike&api_key=${GOONG_API_KEY}`;
                
                const res = await fetch(url);
                const data = await res.json();

                if (data.routes && data.routes[0]) {
                    // Giải mã Polyline
                    const encodedPolyline = data.routes[0].overview_polyline.points;
                    const decodedPoints = polyline.decode(encodedPolyline);
                    
                    // Convert [lat, lng] -> [lng, lat] cho GeoJSON
                    const coordinates = decodedPoints.map(point => [point[1], point[0]]);

                    const routeGeoJSON = {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: coordinates
                        }
                    };

                    // Vẽ hoặc Cập nhật Layer
                    if (map.getSource('route')) {
                        map.getSource('route').setData(routeGeoJSON);
                    } else {
                        map.addSource('route', {
                            'type': 'geojson',
                            'data': routeGeoJSON
                        });
                        map.addLayer({
                            'id': 'route',
                            'type': 'line',
                            'source': 'route',
                            'layout': {
                                'line-join': 'round',
                                'line-cap': 'round'
                            },
                            'paint': {
                                'line-color': '#ef4444', // Màu đỏ (Red-500)
                                'line-width': 5,
                                'line-opacity': 0.8
                            }
                        });
                        
                        // Đưa layer đường xuống dưới layer marker (symbol)
                        // map.moveLayer('route', markersRef.current.pickup ...); 
                        // (Optional: Goong tự xử lý z-index marker div khá tốt)
                    }
                }
            } catch (error) {
                console.error("❌ Lỗi vẽ đường:", error);
            }
        };

        fetchRoute();

    }, [pickup, dropoff, isMapLoaded]);

    // ---------------------------------------------------------
    // 4. XỬ LÝ SHIPPER DI CHUYỂN (REALTIME)
    // ---------------------------------------------------------
    useEffect(() => {
        const map = mapInstanceRef.current;
        const goongjs = window.goongjs;
        if (!map || !isMapLoaded || !shipperLocation) return;

        const { lat, lng } = shipperLocation;
        const coords = [lng, lat];

        if (!markersRef.current.shipper) {
            const el = document.createElement('div');
            el.innerHTML = '<div style="font-size: 40px; transition: transform 0.2s;">🛵</div>';
            markersRef.current.shipper = new goongjs.Marker(el)
                .setLngLat(coords)
                .addTo(map);
        } else {
            markersRef.current.shipper.setLngLat(coords);
            // Đảm bảo marker luôn được gắn vào map
            if (!markersRef.current.shipper.getElement().parentElement) {
                 markersRef.current.shipper.addTo(map);
            }
        }

        // Camera bay theo xe
        try {
            // Speed thấp (0.5 - 0.8) để camera mượt, ko bị giật cục
            map.flyTo({ center: coords, zoom: 15, speed: 0.8 }); 
        } catch(e) {}

    }, [shipperLocation, isMapLoaded]);

    return (
        <div 
            ref={mapContainerRef} 
            style={{ width: '100%', height: '500px', borderRadius: '12px', border: '2px solid #ddd', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
        />
    );
};

export default RealtimeMap;
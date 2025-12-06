import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { X, MapPin, Check, Crosshair } from "lucide-react";

// Fix for Leaflet default icon not showing
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to update map view when position changes
function MapUpdater({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 16);
        }
    }, [position, map]);
    return null;
}

// Component to handle map clicks
function LocationMarker({ position, setPosition, fetchAddress }) {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            fetchAddress(e.latlng.lat, e.latlng.lng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

const LocationPicker = ({ onClose, onConfirm }) => {
    // Default position: Hanoi
    const [position, setPosition] = useState({ lat: 21.0285, lng: 105.8542 });
    const [address, setAddress] = useState("Chọn vị trí trên bản đồ");
    const [loadingLocation, setLoadingLocation] = useState(false);

    // Function to fetch address from coordinates
    const fetchAddress = useCallback(async (lat, lng) => {
        try {
            setAddress("Đang lấy địa chỉ...");
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            if (data && data.display_name) {
                setAddress(data.display_name);
            } else {
                setAddress("Không tìm thấy địa chỉ");
            }
        } catch (error) {
            console.error("Error fetching address:", error);
            setAddress("Lỗi khi lấy địa chỉ");
        }
    }, []);

    // Function to get current user location
    const handleLocateMe = () => {
        setLoadingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    const newPos = { lat: latitude, lng: longitude };
                    setPosition(newPos);
                    // Fetch address for the found location
                    fetchAddress(latitude, longitude);
                    setLoadingLocation(false);
                },
                (err) => {
                    console.log("Geolocation error:", err);
                    setAddress("Không thể lấy vị trí hiện tại");
                    setLoadingLocation(false);
                }
            )
        } else {
            setAddress("Trình duyệt không hỗ trợ Geolocation");
            setLoadingLocation(false);
        }
    };

    // Auto-locate on first open
    useEffect(() => {
        handleLocateMe();
    }, []);

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col h-[80vh]">

                {/* Header */}
                <div className="bg-gray-900 p-4 text-white flex justify-between items-center z-10">
                    <h2 className="text-xl font-bold flex items-center">
                        <MapPin className="mr-2" /> Chọn vị trí giao hàng
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Map Area */}
                <div className="flex-1 relative">
                    <MapContainer
                        center={position}
                        zoom={13}
                        scrollWheelZoom={true}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker position={position} setPosition={setPosition} fetchAddress={fetchAddress} />
                        <MapUpdater position={position} />
                    </MapContainer>

                    {/* Locate Me Button */}
                    <button
                        onClick={handleLocateMe}
                        className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-md z-[400] text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition"
                        title="Vị trí của tôi"
                    >
                        {loadingLocation ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                        ) : (
                            <Crosshair size={24} />
                        )}
                    </button>

                    {/* Address Overlay */}
                    <div className="absolute bottom-6 left-4 right-4 bg-white p-4 rounded-xl shadow-lg z-[400] flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-100">
                        <div className="flex items-start md:items-center">
                            <div className="bg-orange-100 p-2 rounded-full text-orange-600 mr-3 mt-1 md:mt-0">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">Địa chỉ đã chọn</p>
                                <p className="text-sm text-gray-900 font-medium line-clamp-2 md:line-clamp-1">{address}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => onConfirm(address)}
                            className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition flex items-center justify-center whitespace-nowrap shadow-md"
                        >
                            <Check size={18} className="mr-2" /> Xác nhận
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationPicker;

import axios from 'axios'; // Hoặc instance axios bạn đã config
// Import URL
const API_URL = import.meta.env.VITE_API_URL;

export const getCurrentJob = async (token) => {
    const response = await axios.get(`${API_URL}/deliveries/current-job`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Thêm hàm này vào file service
export const acceptDelivery = async (deliveryId, token, location) => {
    // location format: { lat: 21.xxx, lng: 105.xxx }
    const response = await axios.patch(
        `${API_URL}/deliveries/${deliveryId}`,
        {
            status: "ASSIGNED",
            location: location // 👈 Gửi thêm cái này
        },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const getNearbyOrders = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/deliveries/nearby`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data; // Trả về danh sách đơn hàng
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
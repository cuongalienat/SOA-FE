import axios from 'axios'; // Hoặc instance axios bạn đã config
// Import URL
const API_URL = 'http://localhost:3000/v1';

export const getCurrentJob = async (token) => {
    const response = await axios.get(`${API_URL}/deliveries/current-job`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Thêm hàm này vào file service
export const acceptDelivery = async (deliveryId, token) => {
    // Gọi API PATCH /deliveries/:id/accept
    const response = await axios.patch(
        `${API_URL}/deliveries/${deliveryId}/accept`,
        {}, // Body rỗng
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
import axios from 'axios';

const API_URL = 'http://localhost:3000/v1'; 

// 1. Lấy thông tin Shipper (Profile)
// Để biết đang Online hay Offline, biển số xe, rating...
export const getShipperProfile = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/shippers/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        // Ném lỗi ra để Component xử lý (hoặc return null tùy logic)
        throw error.response?.data || error.message;
    }
};

// 2. Cập nhật trạng thái (Online/Offline)
export const updateShipperStatus = async (status, token) => {
    // status: 'ONLINE' | 'OFFLINE'
    try {
        const response = await axios.patch(
            `${API_URL}/shippers/status`,
            { status }, // Body
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// // 3. Đăng ký làm Shipper (Nếu bạn muốn làm form đăng ký trên web)
// export const registerShipper = async (data, token) => {
//     // data: { vehicleType, licensePlate, ... }
//     try {
//         const response = await axios.post(
//             `${API_URL}/shippers/register`,
//             data,
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || error.message;
//     }
// };


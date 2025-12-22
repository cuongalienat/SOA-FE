import ENDPOINTS from "../config/endpoints";
import api from "../config/config";

export const calculateShippingFee = async (data) => {
    try {
        const response = await api.post(ENDPOINTS.SHIPPING.CALCULATE_FEE, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

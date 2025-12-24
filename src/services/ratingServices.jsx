import ENDPOINTS from "../config/endpoints";
import api from "../config/config";

export const createRating = async (data) => {
    try {
        const response = await api.post(ENDPOINTS.RATING.CREATE, data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getRatingByItem = async (itemId) => {
    try {
        const endpoint = ENDPOINTS.RATING.GET_BY_ITEM.replace(":itemId", itemId);
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getRatingByShop = async (shopId) => {
    try {
        const endpoint = ENDPOINTS.RATING.GET_BY_SHOP.replace(":shopId", shopId);
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getRatingByOrder = async (orderId) => {
    try {
        const endpoint = ENDPOINTS.RATING.GET_BY_ORDER.replace(":orderId", orderId);
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

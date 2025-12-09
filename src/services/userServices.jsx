import api from "../config/config";
import ENDPOINTS from "../config/endpoints";

export const getUserInfoService = async (username) => {
    try {
        const response = await api.get(ENDPOINTS.USER.GET_USER_INFO, {
            params: { username }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Lỗi không xác định" };
    }
};

export const updateUserService = async (username, data) => {
    try {
        const response = await api.put(ENDPOINTS.USER.UPDATE_USER_INFO, { username, ...data });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Lỗi không xác định" };
    }
};

export const deleteUserService = async (username) => {
    try {
        const response = await api.delete(ENDPOINTS.USER.DELETE_USER, {
            params: { username }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Lỗi không xác định" };
    }
};
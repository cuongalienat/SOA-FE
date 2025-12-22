import ENDPOINTS from "../config/endpoints";
import api from "../config/config";

export const createWallet = async (pin) => {
    try {
        const response = await api.post(ENDPOINTS.WALLET.CREATE_WALLET, {
            pin: pin
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getWallet = async () => {
    try {
        const response = await api.get(ENDPOINTS.WALLET.GET_WALLET);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const depositWallet = async (amount) => {
    try {
        const response = await api.post(ENDPOINTS.WALLET.DEPOSIT, {
            amount: amount
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getHistory = async () => {
    try {
        const response = await api.get(ENDPOINTS.WALLET.GET_HISTORY);
        return response.data;
    } catch (error) {
        throw error;
    }
}
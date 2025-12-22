import { useState, useCallback } from "react";
import {
    createWallet,
    getWallet,
    depositWallet,
    getHistory,
} from "../services/walletService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export const useWallet = () => {
    const { user } = useAuth();
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { showToast } = useToast();

    const fetchWallet = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getWallet();
            setWallet(data.data !== undefined ? data.data : data);
        } catch (err) {
            // Wallet might not exist yet, which is fine in some contexts
            // setError(err.message || "Không thể tải thông tin ví");
        } finally {
            setLoading(false);
        }
    }, []);

    const createMyWallet = useCallback(async (pin) => {
        if (!user?._id) {
            showToast("Không tìm thấy thông tin người dùng", "error");
            return { success: false, error: "User not found" };
        }
        setLoading(true);
        setError(null);
        try {
            console.log("Creating wallet for user:", user._id);
            const data = await createWallet(pin, user._id);
            setWallet(data.data || data);
            showToast("Tạo ví thành công!", "success");
            return { success: true, data };
        } catch (err) {
            const msg = err.message || "Tạo ví thất bại";
            setError(msg);
            showToast(msg, "error");
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    }, [user, showToast]);

    const depositMoney = useCallback(async (amount) => {
        setLoading(true);
        setError(null);
        try {
            const data = await depositWallet(amount);
            setWallet(data.data || data); // Update wallet balance
            showToast("Nạp tiền thành công!", "success");
            return { success: true, data };
        } catch (err) {
            const msg = err.message || "Nạp tiền thất bại";
            setError(msg);
            showToast(msg, "error");
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getHistory();
            const txList = data.data || data;
            setTransactions(Array.isArray(txList) ? txList : []);
        } catch (err) {
            console.error("Lỗi tải lịch sử giao dịch:", err);
            // Optional: showToast("Không thể tải lịch sử giao dịch", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        wallet,
        transactions,
        loading,
        error,
        fetchWallet,
        createMyWallet,
        depositMoney,
        fetchTransactions,
    };
};
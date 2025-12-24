import { useState, useCallback } from "react";
import {
    createRating as createRatingService,
    getRatingByItem as getRatingByItemService,
    getRatingByShop as getRatingByShopService,
    getRatingByOrder as getRatingByOrderService,
} from "../services/ratingServices";
import { useToast } from "../context/ToastContext";

export const useRatings = () => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [ratingsOrder, setRatingsOrder] = useState([]);
    const [ratingsItem, setRatingsItems] = useState([]);
    const [ratingsShop, setRatingsShop] = useState([]);

    const createRating = useCallback(async (data) => {
        setLoading(true);
        setError(null);
        try {
            const result = await createRatingService(data);
            showToast("Đánh giá thành công!", "success");
            return result;
        } catch (err) {
            setError(err);
            showToast(err.response?.data?.message || "Có lỗi xảy ra khi đánh giá.", "error");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getRatingByItem = useCallback(async (itemId) => {
        setLoading(true);
        setError(null);
        try {
            const result = await getRatingByItemService(itemId);
            setRatingsItems(result);
            return result;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getRatingByShop = useCallback(async (shopId) => {
        setLoading(true);
        setError(null);
        try {
            const result = await getRatingByShopService(shopId);
            setRatingsShop(result);
            return result;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getRatingByOrder = useCallback(async (orderId) => {
        setLoading(true);
        setError(null);
        try {
            const result = await getRatingByOrderService(orderId);
            setRatingsOrder(result);
            return result;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        ratingsOrder,
        ratingsItem,
        ratingsShop,
        createRating,
        getRatingByItem,
        getRatingByShop,
        getRatingByOrder,
    };
};

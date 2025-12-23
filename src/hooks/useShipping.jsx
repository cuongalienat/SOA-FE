import { useState, useCallback } from "react";
import { calculateShippingFee } from "../services/shippingServices.jsx";

export const useShipping = () => {
    const [shippingFee, setShippingFee] = useState(0);
    const [distanceData, setDistanceData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const calculateFee = useCallback(async (data) => {
        if (!data || !data.userLocation || !data.shopId) return;

        setLoading(true);
        setError(null);
        try {
            const feeData = await calculateShippingFee(data);
            const fee = feeData?.data?.shippingFee || 0;
            setShippingFee(fee);
            setDistanceData(feeData?.data?.distanceData);
            return fee;
        } catch (err) {
            console.error("Error calculating shipping fee:", err);
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);


    return {
        shippingFee,
        distanceData,
        loading,
        error,
        calculateFee,
    };
};

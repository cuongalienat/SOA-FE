/**
 * Calculate shipping fee based on distance
 * @param {number} distanceInMeters - Distance in meters
 * @returns {number} Shipping fee in VND
 */
export const calculateShippingFee = (distanceInMeters) => {
    if (!distanceInMeters || distanceInMeters < 0) return 0;

    const baseFee = 16000; // 16k for first 2km
    const baseDistance = 2000; // 2km
    const feePerKm = 5000; // 5k for each next km

    if (distanceInMeters <= baseDistance) {
        let totalFee = baseFee;
        // Peak hour surcharge: 11:00-13:00 and 17:00-19:00
        const now = new Date();
        const currentHour = now.getHours();
        if ((currentHour >= 11 && currentHour <= 13) || (currentHour >= 17 && currentHour <= 19)) {
            totalFee += 5000;
        }
        return totalFee;
    }

    const extraDistance = distanceInMeters - baseDistance;
    const extraFee = Math.ceil(extraDistance / 1000) * feePerKm;

    let totalFee = baseFee + extraFee;

    // Peak hour surcharge: 11:00-13:00 and 17:00-19:00
    const now = new Date();
    const currentHour = now.getHours();
    if ((currentHour >= 11 && currentHour <= 13) || (currentHour >= 17 && currentHour <= 19)) {
        totalFee += 5000;
    }

    return totalFee;
};
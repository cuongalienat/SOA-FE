import { useState } from "react";
import { fetchAllItemsServices, fetchItemsByShopService } from "../services/itemServices.jsx";

export const useItems = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        totalPages: 1,
        totalDocs: 0,
        hasPrevPage: false,
        hasNextPage: false
    });

    const loadItems = async (params = {}) => {
        setLoading(true);
        try {
            const response = await fetchAllItemsServices(params); // Gọi API
            if (response) {
                // Case 1: Response has 'data' property (standard API response)
                const responseData = response.data || response;

                if (Array.isArray(responseData)) {
                    // Trường hợp backend trả về array trực tiếp trong data
                    setItems(responseData);
                } else if (responseData.data && Array.isArray(responseData.data)) {
                    // [NEW CASE MATCHING LOGS]
                    setItems(responseData.data);
                    if (responseData.meta) {
                        setPagination({
                            totalPages: responseData.meta.totalPages,
                            totalDocs: responseData.meta.totalDocuments,
                            page: responseData.meta.page,
                            hasPrevPage: responseData.meta.page > 1,
                            hasNextPage: responseData.meta.page < responseData.meta.totalPages
                        });
                    }
                } else if (responseData.docs) {
                    // Trường hợp phân trang chuẩn mongoose-paginate
                    setItems(responseData.docs);
                    setPagination({
                        totalPages: responseData.totalPages,
                        totalDocs: responseData.totalDocs,
                        page: responseData.page,
                        hasPrevPage: responseData.hasPrevPage,
                        hasNextPage: responseData.hasNextPage
                    });
                } else if (response.docs) {
                    // Trường hợp response chính là pagination object (ko có wrapper data)
                    setItems(response.docs);
                    setPagination({
                        totalPages: response.totalPages,
                        totalDocs: response.totalDocs,
                        page: response.page,
                        hasPrevPage: response.hasPrevPage,
                        hasNextPage: response.hasNextPage
                    });
                } else {
                    // Fallback: struct lạ, thử ép kiểu mảng hoặc rỗng
                    console.warn("Unknown data structure, defaulting to empty array or trying direct assign.");
                    setItems(Array.isArray(response) ? response : []);
                }
            } else {
                setItems([]);
            }

        } catch (error) {
            console.error(error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const loadItemsShop = async (shopId) => {
        setLoading(true);
        try {
            const response = await fetchItemsByShopService(shopId); // Gọi API với shopId
            if (response && response.data) {
                setItems(response.data);
            } else {
                setItems([]); // Fallback nếu không có data
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return { items, loadItems, loadItemsShop, loading, pagination };
};
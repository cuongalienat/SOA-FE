import api from "../config/config";
import ENDPOINTS from "../config/endpoints";

// Gọi API lấy tất cả mặt hàng
// Gọi API lấy tất cả mặt hàng
export const fetchAllItemsServices = async (params) => {
  try {
    const response = await api.get(ENDPOINTS.ITEM.GET_ALL_ITEMS, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Lỗi không xác định" };
  }
};

export const fetchItemsByShopService = async (shopId) => {
  try {
    const response = await api.get(ENDPOINTS.ITEM.GET_ALL_ITEMS, { params: { shopId, limit: 1000 } });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Lỗi không xác định" };
  }
};

export const fetchItemByIdService = async (id) => {
  try {
    const response = await api.get(ENDPOINTS.ITEM.GET_BY_ID.replace(":id", id));
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Lỗi không xác định" };
  }
};

export const createItemService = async (data) => {
  try {
    const response = await api.post(ENDPOINTS.ITEM.CREATE, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Lỗi không xác định" };
  }
};

export const updateItemService = async (id, data) => {
  try {
    const response = await api.put(
      ENDPOINTS.ITEM.UPDATE.replace(":id", id),
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Lỗi không xác định" };
  }
};


export const deleteItemService = async (id) => {
  try {
    const response = await api.delete(
      ENDPOINTS.ITEM.DELETE.replace(":id", id)
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Lỗi không xác định" };
  }
};
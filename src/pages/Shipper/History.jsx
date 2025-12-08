import React from "react";
import { Package } from "lucide-react";
import { useShipper } from "../../context/ShipperContext.jsx";

const ShipperHistory = () => {
  const { history, loadingHistory } = useShipper();

  // Khi context đang load dữ liệu
  if (loadingHistory) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        Đang tải lịch sử...
      </div>
    );
  }

  // Nếu history undefined hoặc null
  const safeHistory = Array.isArray(history) ? history : [];

  const totalEarned = safeHistory.reduce(
    (sum, item) => sum + (item.shippingFee || 0),
    0
  );

  return (
    <div className="bg-gray-50 min-h-full pb-20">
      {/* Header thu nhập */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Lịch sử hoạt động</h1>

        <div className="flex justify-between items-center mt-4 bg-green-50 p-3 rounded-xl border border-green-100">
          <div>
            <p className="text-xs text-green-600 font-medium">
              Thu nhập tạm tính
            </p>
            <p className="text-xl font-bold text-green-700">
              {totalEarned.toLocaleString()}đ
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-green-600 font-medium">Tổng đơn</p>
            <p className="text-xl font-bold text-green-700">
              {safeHistory.length}
            </p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="p-4 space-y-4">
        {safeHistory.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Package className="w-16 h-16 mx-auto mb-2 opacity-50" />
            <p>Chưa có đơn hàng nào.</p>
          </div>
        ) : (
          safeHistory.map((delivery) => {
            const order = delivery.orderId ?? {};
            const restaurant = order.restaurant ?? {};
            const customer = order.customer ?? {};

            const date = new Date(delivery.updatedAt || delivery.createdAt);

            return (
              <div
                key={delivery._id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              >
                {/* Header info */}
                <div className="flex justify-between items-start mb-3 border-b border-gray-50 pb-2">
                  <div>
                    <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {delivery._id?.slice(-6)?.toUpperCase() ?? "ID"}
                    </span>

                    <span className="text-xs text-gray-400 ml-2">
                      {date.toLocaleDateString()} —{" "}
                      {date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="block font-bold text-green-600">
                      +{(delivery.shippingFee || 0).toLocaleString()}đ
                    </span>
                  </div>
                </div>

                {/* Route steps */}
                <div className="space-y-3 relative">
                  <div className="absolute left-[7px] top-2 bottom-4 w-0.5 bg-gray-200"></div>

                  {/* Pickup */}
                  <div className="flex items-start relative z-10">
                    <div className="w-4 h-4 rounded-full border-2 border-green-500 bg-white mr-3 mt-0.5 flex-shrink-0"></div>
                    <div>
                      <p className="text-xs text-gray-500">Lấy hàng</p>
                      <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                        {restaurant.name || "Quán ăn"}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {restaurant.address || ""}
                      </p>
                    </div>
                  </div>

                  {/* Dropoff */}
                  <div className="flex items-start relative z-10">
                    <div className="w-4 h-4 rounded-full border-2 border-red-500 bg-white mr-3 mt-0.5 flex-shrink-0"></div>
                    <div>
                      <p className="text-xs text-gray-500">Giao đến</p>
                      <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                        {customer.name || "Khách hàng"}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {customer.address || ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-3 pt-2 border-t border-gray-50 flex justify-between items-center">
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-md">
                    {delivery.status === "completed"
                      ? "Hoàn thành"
                      : delivery.status}
                  </span>

                  <span className="text-xs text-gray-500">
                    Thu hộ: {(order.total || 0).toLocaleString()}đ
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ShipperHistory;

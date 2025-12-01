import React from "react";
import { Calendar, DollarSign, MapPin, Package } from "lucide-react";
import { useShipper } from "../../context/ShipperContext.jsx";

const ShipperHistory = () => {
  const { history, driverProfile } = useShipper();

  const totalEarned = history.reduce(
    (sum, item) => sum + (item.shippingFee || 0),
    0
  );

  return (
    <div className="bg-gray-50 min-h-full pb-20">
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
            <p className="text-xl font-bold text-green-700">{history.length}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Package className="w-16 h-16 mx-auto mb-2 opacity-50" />
            <p>Chưa có đơn hàng nào.</p>
          </div>
        ) : (
          history.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start mb-3 border-b border-gray-50 pb-2">
                <div>
                  <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {order.id}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">
                    {order.date}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-green-600">
                    +{order.shippingFee?.toLocaleString() || "15,000"}đ
                  </span>
                </div>
              </div>

              <div className="space-y-3 relative">
                {/* Connecting Line */}
                <div className="absolute left-[7px] top-2 bottom-4 w-0.5 bg-gray-200"></div>

                <div className="flex items-start relative z-10">
                  <div className="w-4 h-4 rounded-full border-2 border-green-500 bg-white mr-3 mt-0.5 flex-shrink-0"></div>
                  <div>
                    <p className="text-xs text-gray-500">Lấy hàng</p>
                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                      {order.restaurant.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start relative z-10">
                  <div className="w-4 h-4 rounded-full border-2 border-red-500 bg-white mr-3 mt-0.5 flex-shrink-0"></div>
                  <div>
                    <p className="text-xs text-gray-500">Giao đến</p>
                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                      {order.customer.name}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {order.customer.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-50 flex justify-between items-center">
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-md">
                  Hoàn thành
                </span>
                <span className="text-xs text-gray-500">
                  Thu hộ: {order.total.toLocaleString()}đ
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShipperHistory;

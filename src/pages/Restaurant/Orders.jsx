import React from "react";
import { Clock, CheckCircle, Truck, ChefHat } from "lucide-react";
import { useRestaurant } from "../../context/RestaurantContext.jsx";

const Orders = () => {
  const { orders, updateOrderStatus } = useRestaurant();

  const getStatusColor = (status) => {
    switch (status) {
      case "Đang chờ":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Đang nấu":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Đang giao":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Hoàn thành":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Quản lý đơn hàng
      </h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="font-bold text-lg text-gray-900 mr-3">
                  #{order.id}
                </span>
                <span className="text-sm text-gray-500">{order.date}</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">
                {order.customer}
              </h3>
              <p className="text-gray-600 text-sm">{order.items}</p>
              <p className="text-orange-600 font-bold mt-2">
                ${order.total.toFixed(2)}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div
                className={`px-4 py-2 rounded-lg border font-semibold text-sm flex items-center ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status === "Đang chờ" && (
                  <Clock size={16} className="mr-2" />
                )}
                {order.status === "Đang nấu" && (
                  <ChefHat size={16} className="mr-2" />
                )}
                {order.status === "Đang giao" && (
                  <Truck size={16} className="mr-2" />
                )}
                {order.status === "Hoàn thành" && (
                  <CheckCircle size={16} className="mr-2" />
                )}
                {order.status}
              </div>

              <div className="flex space-x-2">
                {order.status === "Đang chờ" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "Đang nấu")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Nhận đơn
                  </button>
                )}
                {order.status === "Đang nấu" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "Đang giao")}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
                  >
                    Giao hàng
                  </button>
                )}
                {order.status === "Đang giao" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "Hoàn thành")}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                  >
                    Hoàn tất
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            Chưa có đơn hàng nào.
          </p>
        )}
      </div>
    </div>
  );
};

export default Orders;

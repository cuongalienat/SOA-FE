import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  Navigation,
  ArrowLeft,
  Package,
  MapPin,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useShipper } from "../../context/ShipperContext.jsx";

const ShipperOrderDetail = () => {
  const { currentOrder, updateOrderStatus } = useShipper();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!currentOrder) {
    return (
      <div className="p-8 text-center">
        <p>
          Không tìm thấy đơn hàng.{" "}
          <button
            onClick={() => navigate("/shipper/dashboard")}
            className="text-blue-500 underline"
          >
            Quay lại
          </button>
        </p>
      </div>
    );
  }

  const steps = [
    "Driver Assigned",
    "Arrived at Restaurant",
    "Picked Up",
    "Delivering",
    "Delivered",
  ];
  const currentStepIndex =
    steps.indexOf(currentOrder.status) === -1
      ? 0
      : steps.indexOf(currentOrder.status);

  // Define the next action based on current status
  const getNextAction = () => {
    switch (currentOrder.status) {
      case "Driver Assigned":
        return {
          label: "Đã đến quán",
          nextStatus: "Arrived at Restaurant",
          color: "bg-blue-600",
        };
      case "Arrived at Restaurant":
        return {
          label: "Đã lấy hàng",
          nextStatus: "Picked Up",
          color: "bg-orange-600",
        };
      case "Picked Up":
        return {
          label: "Bắt đầu giao",
          nextStatus: "Delivering",
          color: "bg-purple-600",
        };
      case "Delivering":
        return {
          label: "Đã giao thành công",
          nextStatus: "Delivered",
          color: "bg-green-600",
        };
      default:
        return null;
    }
  };

  const action = getNextAction();

  const handleMainAction = () => {
    if (action.nextStatus === "Delivered") {
      setShowConfirm(true); // Confirm before finishing
    } else {
      updateOrderStatus(action.nextStatus);
    }
  };

  const confirmDelivery = () => {
    updateOrderStatus("Delivered");
    navigate("/shipper/dashboard"); // Go back to dashboard to find new order
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center">
        <button
          onClick={() => navigate("/shipper/dashboard")}
          className="p-2 mr-2"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-bold text-lg">Đơn #{currentOrder.id}</h1>
          <p className="text-xs text-gray-500">{currentOrder.status}</p>
        </div>
        <div className="ml-auto">
          <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
            COD: {currentOrder.total.toLocaleString()}đ
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Status Progress */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Nhận đơn</span>
            <span>Lấy hàng</span>
            <span>Giao hàng</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${(currentStepIndex / 4) * 100}%` }}
            ></div>
          </div>
        </div>
        {/* Restaurant Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-800 text-lg">Lấy hàng</h3>
            <div className="flex space-x-2">
              <button className="p-2 bg-gray-100 rounded-full text-blue-600">
                <Phone size={18} />
              </button>
              <button className="p-2 bg-gray-100 rounded-full text-green-600">
                <Navigation size={18} />
              </button>
            </div>
          </div>
          <h4 className="font-bold text-gray-900">
            {currentOrder.restaurant.name}
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            {currentOrder.restaurant.address}
          </p>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <h5 className="text-xs font-bold text-gray-500 uppercase mb-2">
              Chi tiết món
            </h5>
            <ul className="space-y-2 text-sm">
              {currentOrder.items.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>
                    <span className="font-bold text-green-600">
                      {item.quantity}x
                    </span>{" "}
                    {item.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Customer Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-800 text-lg">Giao đến</h3>
            <div className="flex space-x-2">
              <button className="p-2 bg-gray-100 rounded-full text-blue-600">
                <Phone size={18} />
              </button>
              <button className="p-2 bg-gray-100 rounded-full text-green-600">
                <Navigation size={18} />
              </button>
            </div>
          </div>
          <h4 className="font-bold text-gray-900">
            {currentOrder.customer.name}
          </h4>
          <p className="text-sm text-gray-600 mb-2">
            {currentOrder.customer.address}
          </p>
          {currentOrder.customer.note && (
            <div className="flex items-start text-xs text-orange-600 bg-orange-50 p-2 rounded">
              <AlertCircle size={14} className="mr-1 mt-0.5 flex-shrink-0" />
              <span>Ghi chú: {currentOrder.customer.note}</span>
            </div>
          )}
        </div>
        {/* Payment Info */}
        <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
          <span className="text-gray-600 font-medium">
            Khách cần thanh toán:
          </span>
          <span className="text-2xl font-bold text-gray-900">
            {currentOrder.total.toLocaleString()}đ
          </span>
        </div>
        <div className="h-20"></div> {/* Spacer for fixed bottom button */}
      </div>

      {/* Fixed Bottom Action Button */}
      {action && (
        <div className="fixed bottom-16 left-0 w-full p-4 bg-white border-t border-gray-200 z-20">
          <button
            onClick={handleMainAction}
            className={`w-full ${action.color} text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center text-lg active:scale-95 transition-transform`}
          >
            {action.label}
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Xác nhận giao thành công?
            </h3>
            <p className="text-gray-500 mb-6">
              Hãy chắc chắn rằng bạn đã nhận{" "}
              {currentOrder.total.toLocaleString()}đ từ khách hàng.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 bg-gray-100 font-bold rounded-xl text-gray-700"
              >
                Quay lại
              </button>
              <button
                onClick={confirmDelivery}
                className="flex-1 py-3 bg-green-600 font-bold rounded-xl text-white"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipperOrderDetail;

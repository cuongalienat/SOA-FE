import React, { useState, useEffect } from "react";
import { User, Wallet, CreditCard, Clock, Save, Plus, History, Package, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useForm } from "../../hooks/useForm.jsx";
import { useOrders } from "../../hooks/useOrders.jsx";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user, updateUser, topUpWallet } = useAuth();
  const { loadMyOrders, orders, loading: loadingOrders } = useOrders();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("info"); // 'info' | 'wallet' | 'history'
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");

  // Load orders when switching to history tab
  useEffect(() => {
    if (activeTab === 'history') {
      loadMyOrders();
    }
  }, [activeTab, loadMyOrders]);

  // Form for Personal Info
  const { values, handleChange, handleSubmit, isSubmitting } = useForm(
    {
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      email: user?.email || "",
      address: user?.address || "",
    },
    async (formData) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      updateUser({
        name: formData.fullName,
        phone: formData.phone,
        address: formData.address,
      });
      alert("Cập nhật thông tin thành công!");
    }
  );

  const handleTopUp = (e) => {
    e.preventDefault();
    if (!topUpAmount || isNaN(topUpAmount) || Number(topUpAmount) <= 0) {
      alert("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    // Simulate Payment Processing
    setTimeout(() => {
      topUpWallet(Number(topUpAmount));
      setTopUpAmount("");
      setShowTopUp(false);
      alert(
        `Đã nạp thành công ${Number(topUpAmount).toLocaleString()}đ vào ví!`
      );
    }, 1500);
  };

  // Mock Transaction History
  const transactions = [
    {
      id: 1,
      type: "payment",
      desc: "Thanh toán đơn hàng #101",
      amount: -150000,
      date: "2023-10-25",
    },
    {
      id: 2,
      type: "topup",
      desc: "Nạp tiền vào ví",
      amount: 500000,
      date: "2023-10-24",
    },
    {
      id: 3,
      type: "payment",
      desc: "Thanh toán đơn hàng #98",
      amount: -85000,
      date: "2023-10-20",
    },
  ];

  if (!user)
    return (
      <div className="p-10 text-center">Vui lòng đăng nhập để xem hồ sơ.</div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header / Tabs */}
        <div className="border-b border-gray-100">
          <div className="flex p-6 pb-0 space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("info")}
              className={`pb-4 px-2 font-bold text-sm flex items-center transition-colors border-b-2 ${activeTab === "info"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
            >
              <User size={18} className="mr-2" /> Thông tin cá nhân
            </button>
            <button
              onClick={() => setActiveTab("wallet")}
              className={`pb-4 px-2 font-bold text-sm flex items-center transition-colors border-b-2 ${activeTab === "wallet"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
            >
              <Wallet size={18} className="mr-2" /> Ví của tôi
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-4 px-2 font-bold text-sm flex items-center transition-colors border-b-2 ${activeTab === "history"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
            >
              <Package size={18} className="mr-2" /> Lịch sử đơn hàng
            </button>
          </div>
        </div>

        <div className="p-8">
          {activeTab === "info" && (
            <div className="max-w-xl">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Chỉnh sửa hồ sơ
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên hiển thị
                  </label>
                  <input
                    name="fullName"
                    value={values.fullName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      disabled
                      value={values.email}
                      className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      placeholder="Chưa cập nhật"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ giao hàng mặc định
                  </label>
                  <input
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ của bạn"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition flex items-center disabled:opacity-70"
                >
                  <Save size={18} className="mr-2" />
                  {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "wallet" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* Balance Card */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white opacity-5 rounded-full"></div>

                  <p className="text-gray-400 text-sm mb-1 flex items-center">
                    <Wallet size={16} className="mr-2" /> Số dư hiện tại
                  </p>
                  <h3 className="text-3xl font-bold mb-6">
                    {(user.balance || 0).toLocaleString()}đ
                  </h3>

                  <button
                    onClick={() => setShowTopUp(!showTopUp)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition flex items-center"
                  >
                    <Plus size={16} className="mr-1" /> Nạp tiền
                  </button>
                </div>

                {/* Top Up Form */}
                {showTopUp && (
                  <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 animate-fadeIn">
                    <h3 className="font-bold text-gray-900 mb-4">
                      Nạp tiền vào ví
                    </h3>
                    <div className="space-y-4">
                      <input
                        type="number"
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        placeholder="Nhập số tiền (VNĐ)"
                        className="w-full p-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                      />
                      <button
                        onClick={handleTopUp}
                        className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition"
                      >
                        Xác nhận nạp tiền
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Transactions */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <History size={20} className="mr-2 text-gray-500" /> Lịch sử
                  giao dịch
                </h3>
                <div className="bg-gray-50 rounded-2xl p-2">
                  {transactions.map((t) => (
                    <div
                      key={t.id}
                      className="flex justify-between items-center p-4 bg-white rounded-xl mb-2 last:mb-0 shadow-sm"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${t.type === "topup"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                            }`}
                        >
                          {t.type === "topup" ? (
                            <Plus size={20} />
                          ) : (
                            <CreditCard size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {t.desc}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center">
                            <Clock size={12} className="mr-1" /> {t.date}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`font-bold ${t.amount > 0 ? "text-green-600" : "text-gray-900"
                          }`}
                      >
                        {t.amount > 0 ? "+" : ""}
                        {t.amount.toLocaleString()}đ
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Đơn hàng của bạn</h2>
              {loadingOrders ? (
                <div className="text-center py-10">Đang tải đơn hàng...</div>
              ) : orders.filter(o => ['Delivered', 'Cancelled'].includes(o.status)).length === 0 ? (
                <div className="text-center py-10 text-gray-500">Bạn chưa có đơn hàng nào trong lịch sử.</div>
              ) : (
                orders.filter(o => ['Delivered', 'Cancelled'].includes(o.status)).map((order) => (
                  <div
                    key={order._id}
                    onClick={() => navigate(`/order/${order._id}`)}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900">Đơn hàng #{order._id?.slice(-6).toUpperCase()}</h3>
                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                        {order.status === 'Pending' && 'Chờ xác nhận'}
                        {order.status === 'Confirmed' && 'Đã xác nhận'}
                        {order.status === 'Shipping' && 'Đang giao'}
                        {order.status === 'Delivered' && 'Hoàn thành'}
                        {order.status === 'Cancelled' && 'Đã hủy'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{order.items?.length} món</span>
                      <div className="flex items-center font-bold text-orange-600">
                        {order.totalAmount?.toLocaleString()}đ
                        <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

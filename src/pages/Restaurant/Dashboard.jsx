import React, { useEffect } from "react";
import { DollarSign, ShoppingBag, Star, TrendingUp } from "lucide-react";
import { useShop } from "../../hooks/useShop.jsx";

const Dashboard = () => {
  const {
    shop,
    dashboard,
    dashboardLoading,
    loading,
    loadMyShop,
    loadDashboard,
  } = useShop();

  useEffect(() => {
    loadMyShop();
    loadDashboard();
  }, [loadMyShop, loadDashboard]);

  if (dashboardLoading || !dashboard) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  const { shop: shopInfo, stats, topProducts, recentOrders } = dashboard;

  const info = shopInfo || shop || {
    isOpen: false,
    name: "Quán ăn",
  };
  const max = Math.max(...topProducts.map(p => p.value));
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className={`p-4 rounded-full ${color} bg-opacity-10`}>
        <Icon className={`w-8 h-8 ${color.replace("bg-", "text-")}`} />
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Xin chào, Chủ quán! 👋
          </h1>
          <p className="text-gray-500">Đây là tình hình kinh doanh hôm nay.</p>
        </div>
        <div
          className={`px-4 py-2 rounded-full text-sm font-bold ${
            info.isOpen
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {info.isOpen ? "Đang Mở Cửa" : "Đang Đóng Cửa"}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng doanh thu"
          value={`${stats.revenue.toLocaleString("vi-VN")} VNĐ`}
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Tổng đơn hàng"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="bg-blue-500"
        />
        <StatCard
          title="Trung bình đơn"
          value={`${stats.avgOrderValue.toLocaleString("vi-VN")} VNĐ`}
          icon={TrendingUp}
          color="bg-purple-500"
        />
        <StatCard
          title="Đánh giá"
          value={stats.rating.toFixed(1)}
          icon={Star}
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Sản phẩm bán chạy
          </h3>
          <div className="space-y-4">
            {topProducts.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">
                    {item.label}
                  </span>
                  <span className="text-gray-500">{item.value}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="bg-orange-500 h-2.5 rounded-full"
                    style={{ width: `${(item.value / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Đơn hàng gần đây
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="pb-3">Khách hàng</th>
                  <th className="pb-3">Tổng tiền</th>
                  <th className="pb-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentOrders.map((order, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="py-3 text-gray-900 font-medium">
                      {order.customer}
                    </td>
                    <td className="py-3 text-gray-600">
                      {order.total.toLocaleString("vi-VN")} VNĐ
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-bold ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-600"
                            : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

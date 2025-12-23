import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CreditCard,
  ShoppingBag,
  Clock,
  MapPin,
  Phone,
  X,
  Bike,
  Wallet,
  AlertTriangle,
  Loader,
} from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useForm } from "../../hooks/useForm.jsx";
import { useOrders } from "../../hooks/useOrders.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import LocationPicker from "../../components/common/LocationPicker.jsx";
import { useShipping } from "../../hooks/useShipping";
import { useShop } from "../../hooks/useShop";
import { useUser } from "../../hooks/useUser.jsx";
import { useWallet } from "../../hooks/useWallet.jsx";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, updateItemNote, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { updateUser } = useUser();
  const navigate = useNavigate();

  const { orders, createOrder, loadMyOrders, cancelOrder } = useOrders();

  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "cart");

  // Sync tab with URL
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Update URL when tab changes internally
  useEffect(() => {
    if (activeTab === "orders") {
      setSearchParams({ tab: "orders" });
    } else {
      setSearchParams({});
    }
  }, [activeTab, setSearchParams]);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const { showToast } = useToast();
  const { shop, loadShopById } = useShop();
  const { wallet, fetchWallet, fetchTransactions } = useWallet();

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  const { shippingFee, distanceData, calculateFee } = useShipping();

  const userId = user?._id;

  useEffect(() => {
    if (userId) {
      loadMyOrders({ userID: userId });
    }
  }, [userId, loadMyOrders]);

  // Fetch shop location
  // Fetch shop location
  useEffect(() => {
    if (items.length > 0) {
      let shopId = items[0].shopId;
      if (shopId && typeof shopId === 'object') {
        shopId = shopId._id || shopId.id;
      }
      if (shopId) {
        loadShopById(shopId);
      }
    }
  }, [items]); // Re-run if items change (different shop?)

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;

    try {
      const success = await cancelOrder(orderId);
      if (success) {
        await loadMyOrders({ userID: userId });
        showToast("Hủy đơn hàng thành công", "success");
        // Update wallet in case of refund
        await fetchWallet();
        await fetchTransactions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const canCancel = (order) => {
    if (order.status === 'Pending') return true;
    if (order.status === 'Confirmed') {
      const updatedAt = new Date(order.updatedAt);
      const now = new Date();
      const diffMinutes = (now - updatedAt) / 1000 / 60;
      return diffMinutes < 10;
    }
    return false;
  };

  // Form thông tin giao hàng
  const { values, handleChange, setValue } = useForm({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    address: user?.address || "",
    note: "",
  });

  // Update form values when user data becomes available (e.g. after page load)
  useEffect(() => {
    if (user) {
      if (!values.fullName && user.fullName) setValue("fullName", user.fullName);
      if (!values.phone && user.phone) setValue("phone", user.phone);
      if (!values.address && user.address) setValue("address", user.address);
    }
  }, [user]);

  // Automatically calculate shipping fee for default address
  useEffect(() => {
    const calcDefaultAddressFee = async () => {
      // Condition: User has address, currently showing default address
      if (user?.address && values.address === user.address) {
        try {
          // 2. Calculate fee via Backend API (using Hook)
          if (shop?._id) {
            await calculateFee({ userLocation: values.address, shopId: shop._id });
          }
        } catch (error) {
          console.error("Error calculating fee for default address:", error);
        }
      }
    }
    calcDefaultAddressFee();
  }, [user, values.address, shop, calculateFee]);

  const handleAddressBlur = async () => {
    if (values.address && shop?._id) {
      console.log("Address Blur - Recalculating Fee:", values.address);
      await calculateFee({ userLocation: values.address, shopId: shop._id });
    }
  };

  const handleAddressConfirm = async ({ address }) => {
    const event = {
      target: {
        name: "address",
        value: address
      }
    };
    handleChange(event);
    setShowMap(false);

    console.log("Handle Address Confirm:", address);

    // Calculate Fee via Backend (using Hook)
    if (shop?._id) {
      await calculateFee({ userLocation: address, shopId: shop._id });
    }
  };
  // Tính toán chi phí

  // const deliveryFee = 3000; // Old static fee
  const finalTotal = cartTotal + shippingFee;


  // Xử lý khi bấm nút "Đặt hàng"
  const handlePreCheckout = (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!user) {
      alert("Vui lòng đăng nhập để đặt hàng");
      navigate("/signin");
      return;
    }
    if (paymentMethod === "COD") {
      confirmPayment();
    } else {
      // Mở modal hóa đơn (chỉ cho ví)
      setShowInvoiceModal(true);
    }
  };

  const [paymentMethod, setPaymentMethod] = useState("Wallet");

  const confirmPayment = async () => {
    if (!user) return;

    // 1. Kiểm tra số dư ví (Nếu dùng ví)
    if (paymentMethod === "Wallet") {
      if (!wallet) {
        showToast("Không tìm thấy thông tin ví", "error");
        return;
      }
      if (wallet.balance < finalTotal) {
        showToast("Số dư ví không đủ!", "error");
        return;
      }
    }

    try {
      // 2. Chuẩn bị dữ liệu
      // Lấy ID nhà hàng từ món đầu tiên (Giả sử giỏ hàng chỉ chứa món của 1 quán)
      console.log("item 0:", items[0]);
      let shopId = items[0]?.shopId;
      // Ensure restaurantId is a string ID
      if (shopId && typeof shopId === 'object') {
        shopId = shopId._id || shopId.id;
      }
      console.log("Restaurant ID to send:", shopId);

      if (!shopId) {
        showToast("Lỗi dữ liệu món ăn (thiếu ID quán)", "error");
        return;
      }

      // Map items sang format backend cần: { item: itemID, quantity: N, note: ... }
      const orderItems = items.map(i => ({
        item: i._id || i.id, // ID món ăn
        quantity: i.quantity,
        imageUrl: i.imageUrl,
        price: i.price, // Giá tại thời điểm mua (quan trọng)
        options: i.note ? [i.note] : [] // Ghi chú được lưu vào options
      }));

      // 4. Trừ tiền ví ảo ở Client (Cập nhật UI ngay cho mượt)
      // 4. Trừ tiền ví ảo ở Client (Cập nhật UI ngay cho mượt)
      // Note: We rely on backend to handle deduction. Logic moved to backend.

      // 5. GỌI API TẠO ĐƠN HÀNG (Dùng hook useOrders)
      const result = await createOrder({
        userId: user._id,
        shopId: shopId,
        items: orderItems,
        paymentMethod: paymentMethod === "Wallet" ? "Wallet" : "COD",
        shippingFee: shippingFee, // Send shipping fee to backend
        totalAmount: finalTotal,
        userLocation: {
          address: values.address
        },
        distanceData: distanceData,
      });

      if (result.success) {
        showToast("Đặt hàng thành công!", "success");

        // Cleanup
        setShowInvoiceModal(false);
        clearCart();
        await loadMyOrders({ userID: user._id }); // Force refresh orders list
        setActiveTab("orders"); // Chuyển sang tab đơn hàng
        window.scrollTo(0, 0);
        window.scrollTo(0, 0);
        if (paymentMethod === "Wallet") {
          await fetchWallet();
          await fetchTransactions(); // Update history even if not shown here
        }
      } else {
        if (paymentMethod === "Wallet") {
          fetchWallet(); // Re-fetch to sync if failed
        }
        showToast(result.error, "error");
      }

    } catch (error) {
      console.error(error);
      showToast("Có lỗi xảy ra khi thanh toán", "error");
    }
  };

  const orderHistory = Array.isArray(orders) ? orders : [];

  // Filter active orders for this view
  const activeOrders = orderHistory.filter(order =>
    ['Pending', 'Confirmed', 'Shipping'].includes(order.status)
  );

  // Render Tab Giỏ hàng + Form Thanh toán
  const renderCartAndCheckout = () => {
    if (items.length === 0) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-4">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-2130356-1800917.png"
            alt="Empty Cart"
            className="w-64 opacity-50 mb-6"
          />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Giỏ hàng trống
          </h2>
          <p className="text-gray-500 mb-8">Có vẻ bạn chưa thêm gì.</p>
          <Link
            to="/"
            className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition shadow-lg"
          >
            Bắt đầu đặt hàng
          </Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
        {/* Cột trái: Danh sách món */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <ShoppingBag className="mr-2 text-orange-500" /> Món ăn đã chọn (
              {items.length})
            </h2>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item._id || item.id || index}
                  className="border-b border-gray-50 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{item.name}</h3>
                      <p className="text-gray-500 text-xs">{item.category}</p>
                      <div className="text-orange-600 font-bold mt-1">
                        {item.price} VNĐ
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item._id || item.id, -1)}
                        className="p-1 hover:bg-white rounded-md transition shadow-sm"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-semibold w-6 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id || item.id, 1)}
                        className="p-1 hover:bg-white rounded-md transition shadow-sm"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id || item.id)}
                      className="text-gray-400 hover:text-red-500 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Note Input */}
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Ghi chú cho món này (VD: Ít cay, không hành...)"
                      className="w-full text-sm bg-gray-50 border border-transparent focus:bg-white focus:border-orange-200 rounded-lg px-3 py-2 outline-none transition-all placeholder-gray-400 text-gray-700"
                      value={item.note || ""}
                      onChange={(e) => updateItemNote(item._id || item.id, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={clearCart}
              className="text-red-500 text-sm font-semibold hover:underline mt-4"
            >
              Xóa tất cả
            </button>
          </div>

          {/* Thông tin giao hàng (Form) */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <MapPin className="mr-2 text-orange-500" /> Thông tin giao hàng
            </h2>
            <form
              id="checkout-form"
              onSubmit={handlePreCheckout}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between items-center">
                  <span>Địa chỉ nhận hàng</span>
                  <button
                    type="button"
                    onClick={() => setShowMap(true)}
                    className="text-orange-600 text-xs font-bold hover:underline flex items-center"
                  >
                    <MapPin size={12} className="mr-1" /> Chọn trên bản đồ
                  </button>
                </label>
                <input
                  required
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleAddressBlur}
                  className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-orange-500"
                  placeholder="Số nhà, đường, phường..."
                />
              </div>
            </form>
          </div>
        </div>

        {/* Cột phải: Tổng quan & Thanh toán */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Thanh toán</h2>

            {/* Chọn phương thức thanh toán */}
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Phương thức thanh toán</h3>
            <div className="space-y-3 mb-6">
              {/* Option: Wallet */}
              <div
                onClick={() => setPaymentMethod("Wallet")}
                className={`p-4 rounded-xl border cursor-pointer transition flex justify-between items-center ${paymentMethod === "Wallet" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-200"
                  }`}
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg text-white mr-3 ${paymentMethod === "Wallet" ? "bg-orange-500" : "bg-gray-400"
                    }`}>
                    <Wallet size={20} />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${paymentMethod === "Wallet" ? "text-orange-700" : "text-gray-700"
                      }`}>Ví FlavorDash</p>
                    {wallet && <p className="text-xs text-gray-500">Số dư: {Number(wallet.balance).toLocaleString('vi-VN')}đ</p>}
                  </div>
                </div>
                {paymentMethod === "Wallet" && <div className="w-4 h-4 rounded-full bg-orange-500" />}
              </div>

              {/* Option: Cash (COD) */}
              <div
                onClick={() => setPaymentMethod("COD")}
                className={`p-4 rounded-xl border cursor-pointer transition flex justify-between items-center ${paymentMethod === "COD" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-200"
                  }`}
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg text-white mr-3 ${paymentMethod === "COD" ? "bg-green-600" : "bg-gray-400"
                    }`}>
                    <p className="font-bold text-xs">TIỀN</p>
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${paymentMethod === "COD" ? "text-orange-700" : "text-gray-700"
                      }`}>Tiền mặt (COD)</p>
                    <p className="text-xs text-gray-500">Thanh toán khi nhận hàng</p>
                  </div>
                </div>
                {paymentMethod === "COD" && <div className="w-4 h-4 rounded-full bg-orange-500" />}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{cartTotal.toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí giao hàng</span>
                <span>{(shippingFee || 0).toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <div className="h-px bg-gray-200 my-4"></div>
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Tổng cộng</span>
                <span className="text-orange-600">{finalTotal.toLocaleString('vi-VN')} VNĐ</span>
              </div>
            </div>

            <button
              form="checkout-form"
              type="submit"
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-lg flex items-center justify-center space-x-2"
            >
              <span>{paymentMethod === 'Wallet' ? 'Thanh toán ngay' : 'Đặt hàng (COD)'}</span>
              <CreditCard size={20} />
            </button>

            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-gray-500 text-sm hover:text-orange-500 flex items-center justify-center"
              >
                <ArrowLeft size={14} className="mr-1" /> Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Tab Đơn hàng
  const renderOrders = () => {

    if (activeOrders.length === 0) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-4">
          <Clock className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Chưa có đơn hàng nào
          </h2>
          <p className="text-gray-500 mb-8">Bạn chưa đặt món ăn nào gần đây.</p>
          <button
            onClick={() => setActiveTab("cart")}
            className="text-orange-500 font-bold hover:underline"
          >
            Quay lại giỏ hàng
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
        {activeOrders.map((order) => (
          <div
            key={order.id || order._id}
            onClick={() => navigate(`/order/${order._id || order.id}`)}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition hover:shadow-md cursor-pointer group"
          >
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 border-b border-gray-50 pb-4">
              <div>
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                    #{order._id ? order._id.slice(-6).toUpperCase() : order.id}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Pending"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {order.status === 'Pending' ? 'Chờ xác nhận' :
                      order.status === 'Confirmed' ? 'Đã xác nhận' :
                        order.status === 'Shipping' ? 'Đang giao' :
                          order.status === 'Delivered' ? 'Hoàn thành' :
                            order.status === 'Cancelled' ? 'Đã hủy' : order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(order.createdAt).toLocaleString('vi-VN')} • {order.items?.length} món
                </p>
              </div>
              <div className="mt-2 md:mt-0 text-right">
                <p className="font-bold text-lg text-orange-600">
                  {order.totalAmount?.toLocaleString()} VNĐ
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-6 bg-gray-50 p-4 rounded-xl">
              {order.items?.slice(0, 2).map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    <span className="font-bold">{item.quantity}x</span>{" "}
                    {item.name || item.item?.name}
                  </span>
                  <span className="text-gray-500">
                    {((item.price || 0) * item.quantity).toLocaleString()} VNĐ
                  </span>
                </div>
              ))}
              {order.items?.length > 2 && (
                <p className="text-xs text-gray-400 italic text-center pt-1">+ {order.items.length - 2} món khác</p>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500 flex items-center">
                <MapPin size={14} className="mr-1" /> <span className="line-clamp-1">{order.address}</span>
              </div>
              <div className="flex space-x-2">
                {canCancel(order) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelOrder(order._id || order.id);
                    }}
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition flex items-center border border-transparent hover:border-red-200 text-sm"
                  >
                    Hủy đơn
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTrackingOrder(order);
                  }}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-white hover:text-orange-600 hover:shadow-md transition flex items-center border border-transparent hover:border-orange-100"
                >
                  <MapPin size={16} className="mr-2" /> Theo dõi
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Tabs Switcher */}
      <div className="flex justify-center mb-10">
        <div className="bg-gray-100 p-1 rounded-xl inline-flex shadow-inner">
          <button
            onClick={() => setActiveTab("cart")}
            className={`px-8 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === "cart"
              ? "bg-white text-orange-600 shadow-sm"
              : "text-gray-500 hover:text-gray-800"
              }`}
          >
            Giỏ hàng ({items.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-8 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === "orders"
              ? "bg-white text-orange-600 shadow-sm"
              : "text-gray-500 hover:text-gray-800"
              }`}
          >
            Đơn hàng ({activeOrders.length})
          </button>
        </div>
      </div>

      {activeTab === "cart" ? renderCartAndCheckout() : renderOrders()}

      {/* Invoice Confirmation Modal */}
      {showInvoiceModal && user && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="bg-gray-900 p-6 text-white relative">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
              <h2 className="text-xl font-bold flex items-center">
                <Wallet className="mr-2" /> Xác nhận thanh toán
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Kiểm tra lại hóa đơn trước khi trừ ví
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Số dư ví hiện tại</span>
                  <span className="font-medium text-gray-900">
                    {(wallet?.balance || 0).toLocaleString()}đ
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Tổng tiền đơn hàng</span>
                  <span className="font-bold text-orange-600">
                    -{finalTotal} VNĐ
                  </span>
                </div>
                <div className="h-px bg-gray-200 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">
                    Số dư còn lại (ước tính)
                  </span>
                  <span
                    className={`font-bold text-lg ${(wallet?.balance || 0) - finalTotal < 0
                      ? "text-red-500"
                      : "text-green-600"
                      }`}
                  >
                    {((wallet?.balance || 0) - finalTotal).toLocaleString()}đ
                  </span>
                </div>
              </div>

              {(wallet?.balance || 0) - finalTotal < 0 && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-start">
                  <AlertTriangle
                    size={16}
                    className="mr-2 mt-0.5 flex-shrink-0"
                  />
                  <span>Số dư không đủ. Vui lòng nạp thêm tiền.</span>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={confirmPayment}
                  disabled={processingPayment || (wallet?.balance || 0) - finalTotal < 0}
                  className={`flex-1 py-3 text-white font-bold rounded-xl flex items-center justify-center transition shadow-lg
                                ${(wallet?.balance || 0) - finalTotal < 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                    }
                            `}
                >
                  {processingPayment ? "Đang xử lý..." : "Xác nhận"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Picker Modal */}
      {showMap && (
        <LocationPicker
          onClose={() => setShowMap(false)}
          onConfirm={handleAddressConfirm}
        />
      )}

      {/* Tracking Modal */}
      {trackingOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative animate-scaleIn">
            <button
              onClick={() => setTrackingOrder(null)}
              className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white z-10"
            >
              <X size={20} />
            </button>

            {/* Mock Map Area */}
            <div className="h-64 bg-gray-200 relative overflow-hidden">
              <img
                src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/pass/GoogleMapTA.jpg"
                alt="Map"
                className="w-full h-full object-cover opacity-80"
              />

              <div className="absolute top-1/2 left-10 transform -translate-y-1/2 z-10 animate-slideRight">
                <div className="bg-white p-2 rounded-full shadow-lg border-2 border-orange-500 text-orange-600">
                  <Bike size={24} />
                </div>
                <div className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  Đang giao...
                </div>
              </div>

              <div className="absolute top-1/2 right-10 transform -translate-y-1/2 z-0">
                <MapPin
                  size={32}
                  className="text-red-500 drop-shadow-lg"
                  fill="currentColor"
                />
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Đang giao hàng
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Dự kiến đến: 15 phút
                  </p>
                </div>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                  #{trackingOrder.id}
                </span>
              </div>

              {/* Shipper Info */}
              <div className="flex items-center bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60"
                  alt="Shipper"
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div className="flex-1">
                  <p className="font-bold text-gray-900">Nguyễn Văn Tài</p>
                  <p className="text-xs text-gray-500">
                    Honda AirBlade • 29-G1 567.89
                  </p>
                </div>
                <button className="bg-green-100 p-2 rounded-full text-green-600 hover:bg-green-200 transition">
                  <Phone size={20} />
                </button>
              </div>

              {/* Progress */}
              <div className="relative pt-6 pb-2">
                <div className="h-1 bg-gray-200 rounded-full mb-2">
                  <div className="h-full bg-green-500 rounded-full w-3/4"></div>
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-400">
                  <span className="text-green-600">Đã nhận</span>
                  <span className="text-green-600">Đang giao</span>
                  <span>Đã đến</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideRight {
          0% { left: 10%; }
          50% { left: 50%; }
          100% { left: 80%; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
        .animate-slideRight { animation: slideRight 10s linear infinite alternate; }
      `}</style>
    </div>
  );
};
export default Cart;
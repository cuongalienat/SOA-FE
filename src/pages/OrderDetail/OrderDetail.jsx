import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Star, Package, MessageSquare, Truck, AlertCircle } from "lucide-react";
import { useOrders } from "../../hooks/useOrders.jsx";
import { useToast } from "../../context/ToastContext.jsx";

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { loadOrderDetails, orderDetail, loading, error } = useOrders();
    const { showToast } = useToast();

    // Review State (Local Mock)
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (id) {
            loadOrderDetails(id);
        }
    }, [id, loadOrderDetails]);

    if (loading) return <div className="p-10 text-center">Đang tải thông tin đơn hàng...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
    if (!orderDetail) return null;

    const handleBack = () => navigate('/cart?tab=orders');

    const handleCancel = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;

        const success = await cancelOrder(orderDetail._id || orderDetail.id);
        if (success) {
            loadOrderDetails(id); // Reload to update status
        }
    };



    const handleSubmitReview = async () => {
        if (!comment.trim()) return;
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        showToast("Đã gửi đánh giá thành công!", "success");
        setComment("");
        setIsSubmitting(false);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={handleBack}
                    className="flex items-center text-gray-600 hover:text-orange-600 transition"
                >
                    <ArrowLeft size={20} className="mr-2" /> Quay lại
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-8">
                {/* Header */}
                <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center bg-opacity-50">
                    <div>
                        <span className="text-gray-500 text-sm block">Mã đơn hàng</span>
                        <h1 className="text-2xl font-bold text-gray-900">#{orderDetail._id?.slice(-6).toUpperCase()}</h1>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-bold ${orderDetail.status === 'Completed' ? 'bg-green-100 text-green-600' :
                        orderDetail.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                            'bg-blue-100 text-blue-600'
                        }`}>
                        {orderDetail.status === 'Pending' ? 'Chờ xác nhận' :
                            orderDetail.status === 'Confirmed' ? 'Đã xác nhận' :
                                orderDetail.status === 'Shipping' ? 'Đang giao' :
                                    orderDetail.status === 'Delivered' ? 'Đã giao' :
                                        orderDetail.status === 'Cancelled' ? 'Đã hủy' : orderDetail.status}
                    </div>
                </div>

                <div className="p-8 space-y-10">
                    {/* 1. Thông tin giao hàng */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900 text-lg flex items-center">
                            Thông tin giao hàng
                        </h3>
                        <div className="bg-gray-50 p-6 rounded-2xl space-y-4 border border-gray-100">

                            <div className="flex items-start text-gray-700">
                                <MapPin size={20} className="mr-3 mt-0.5 text-orange-500 shrink-0" />
                                <div>
                                    <span className="block font-medium text-sm text-gray-500 mb-1">Địa chỉ nhận hàng</span>
                                    <p className="font-medium">{orderDetail.address}</p>
                                </div>
                            </div>
                            <div className="flex items-start text-gray-700">
                                <Clock size={20} className="mr-3 mt-0.5 text-orange-500 shrink-0" />
                                <div>
                                    <span className="block font-medium text-sm text-gray-500 mb-1">Thời gian đặt</span>
                                    <p className="font-medium">{new Date(orderDetail.createdAt).toLocaleString('vi-VN')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Món đã đặt */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            Món đã đặt
                        </h3>
                        <div className="space-y-4 border rounded-2xl p-4 border-gray-100">
                            {orderDetail.items?.map((item, index) => (
                                <div key={index} className="flex items-center space-x-4 p-2">
                                    <img
                                        src={item.imageUrl || "https://via.placeholder.com/60"}
                                        alt={item.name}
                                        className="w-16 h-16 rounded-xl object-cover shadow-sm border border-gray-100"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 line-clamp-1 text-lg">{item.name}</h4>
                                        <p className="text-sm text-gray-500">x{item.quantity}</p>
                                    </div>
                                    <span className="font-bold text-gray-900">
                                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Shipping & Total */}
                    <div className="pt-2">
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Phí giao hàng</span>
                                <span>{orderDetail.shippingFee ? orderDetail.shippingFee.toLocaleString('vi-VN') : '3,000'}đ</span>
                            </div>
                            {/* Divider with dashed line */}
                            <div className="border-t border-dashed border-gray-200 my-4"></div>

                            <div className="flex justify-between items-center text-orange-600">
                                <span className="font-medium text-gray-900 text-lg">Tổng tiền</span>
                                <span className="text-3xl font-bold">
                                    {orderDetail.totalAmount?.toLocaleString('vi-VN')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Form (Side or Bottom? User asked for layout of Detail. I'll put Review in a nice card below) */}
            {orderDetail.status === 'Delivered' && (
                <div className="bg-white border-2 border-orange-100 p-8 rounded-3xl shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <MessageSquare size={24} className="mr-3 text-orange-500" /> Viết đánh giá
                    </h3>

                    <div className="space-y-6">
                        <div className="flex items-center justify-center space-x-4 bg-orange-50 p-4 rounded-2xl">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none hover:scale-110 transition-transform p-1"
                                >
                                    <Star
                                        className={`w-10 h-10 ${star <= rating ? "fill-yellow-400 text-yellow-400 drop-shadow-sm" : "text-gray-300"}`}
                                    />
                                </button>
                            ))}
                        </div>

                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Món ăn thế nào? Hãy chia sẻ cảm nhận của bạn..."
                            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none resize-none text-base bg-gray-50 min-h-[120px]"
                        ></textarea>

                        <button
                            onClick={handleSubmitReview}
                            disabled={!comment.trim() || isSubmitting}
                            className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition disabled:opacity-50 shadow-lg shadow-orange-200"
                        >
                            {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetail;

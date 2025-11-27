import React, { useState } from "react";
import { useCart } from "../../context/CartContext.jsx";
import { useNavigate, Link } from "react-router-dom"; // <-- Thêm chữ Link vào đây
import { useForm } from "../../hooks/useForm.jsx";

// 1. Hàm Validate (Kiểm tra lỗi)
const validateOrder = (values) => {
  const errors = {};

  if (!values.fullName.trim()) errors.fullName = "Vui lòng nhập họ tên";
  if (!values.address.trim()) errors.address = "Vui lòng nhập địa chỉ";
  if (!values.city.trim()) errors.city = "Vui lòng nhập thành phố";

  // Validate số thẻ (đơn giản)
  if (!values.cardNum.trim()) errors.cardNum = "Thiếu số thẻ";
  else if (values.cardNum.replace(/\s/g, "").length < 16)
    errors.cardNum = "Số thẻ phải đủ 16 số";

  if (!values.exp.trim()) errors.exp = "Thiếu hạn thẻ";
  if (!values.cvv.trim()) errors.cvv = "Thiếu mã CVV";

  return errors;
};

const Order = () => {
  // Lưu ý: cartTotal thường là hàm, nên cần gọi cartTotal() để lấy giá trị
  const { cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  // 2. Logic Submit form
  const handleOrderSubmit = async (values) => {
    // Giả lập gọi API mất 2 giây
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Thứ tự quan trọng: Set success trước -> Xóa giỏ hàng sau
    // Để tránh màn hình bị nhảy sang giao diện "Giỏ hàng trống"
    setSuccess(true);
    clearCart();

    // Chuyển hướng sau 2 giây
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  // 3. Gọi useForm với đầy đủ tham số
  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm(
    {
      fullName: "",
      address: "",
      city: "",
      zip: "",
      cardNum: "",
      exp: "",
      cvv: "",
    },
    handleOrderSubmit, // Hàm xử lý submit
    validateOrder // Hàm validate
  );

  // --- CASE 1: Đặt hàng thành công ---
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
        <h2 className="text-3xl font-bold text-green-600 mb-4">
          Đặt hàng thành công!
        </h2>
        <p className="text-gray-600 mb-4">Cảm ơn bạn đã ủng hộ FlavorDash.</p>
        <p className="text-sm text-gray-500">Đang chuyển về trang chủ...</p>
        [Image of delivery scooter illustration]
      </div>
    );
  }

  // --- CASE 2: Giỏ hàng trống (Chặn không cho thanh toán) ---
  // Chỉ hiện khi chưa success và tổng tiền = 0
  const total = typeof cartTotal === "function" ? cartTotal() : cartTotal;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-10 text-center space-y-4">
        <div className="text-6xl">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="text-gray-500">
          Hãy chọn vài món ngon trước khi thanh toán nhé!
        </p>
        <Link
          to="/menu"
          className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
        >
          Xem Thực Đơn
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Delivery Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="bg-orange-100 text-orange-600 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
              1
            </span>{" "}
            Thông tin giao hàng
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <input
                required
                name="fullName"
                value={values.fullName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ
              </label>
              <input
                required
                name="address"
                value={values.address}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="123 Đường Ẩm Thực"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thành phố
                </label>
                <input
                  required
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Hà Nội"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã bưu chính
                </label>
                <input
                  required
                  name="zip"
                  value={values.zip}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="100000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="bg-orange-100 text-orange-600 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
              2
            </span>{" "}
            Phương thức thanh toán
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số thẻ
              </label>
              <input
                required
                name="cardNum"
                value={values.cardNum}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="0000 0000 0000 0000"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày hết hạn
                </label>
                <input
                  required
                  name="exp"
                  value={values.exp}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  required
                  name="cvv"
                  value={values.cvv}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="123"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-lg flex items-center justify-center disabled:opacity-70"
        >
          {isSubmitting
            ? "Đang xử lý..."
            : `Thanh toán ${cartTotal * 1.1 + 3000} VNĐ`}
        </button>
      </form>
    </div>
  );
};

export default Order;

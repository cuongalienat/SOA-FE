import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft, CreditCard } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, cartTotal, clearCart } =
    useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
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

  const tax = cartTotal * 0.1;
  const deliveryFee = 3000;
  const finalTotal = cartTotal + tax + deliveryFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Đơn hàng của bạn
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                <p className="text-gray-500 text-sm">{item.category}</p>
                <div className="text-orange-600 font-bold mt-1">
                  {item.price} VNĐ
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-1">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="p-1 hover:bg-white rounded-md transition shadow-sm"
                >
                  <Minus size={16} />
                </button>
                <span className="font-semibold w-6 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="p-1 hover:bg-white rounded-md transition shadow-sm"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-gray-400 hover:text-red-500 p-2"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-red-500 text-sm font-semibold hover:underline mt-4"
          >
            Xóa giỏ hàng
          </button>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{cartTotal} VNĐ</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Thuế (10%)</span>
                <span>{tax} VNĐ</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí giao hàng</span>
                <span>{deliveryFee} VNĐ</span>
              </div>
              <div className="h-px bg-gray-200 my-4"></div>
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Tổng cộng</span>
                <span>{finalTotal} VNĐ</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/order")}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-lg flex items-center justify-center space-x-2"
            >
              <span>Tiến hành thanh toán</span>
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
    </div>
  );
};

export default Cart;

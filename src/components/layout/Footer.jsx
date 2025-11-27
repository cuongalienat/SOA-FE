import React from "react";
import { ChefHat, Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <ChefHat className="text-orange-500 h-6 w-6" />
              <span className="font-bold text-xl">
                Món<span className="text-orange-500">Việt</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Dịch vụ giao đồ ăn nhanh chóng, tin cậy giúp bạn tận hưởng từng
              bữa cơm.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-orange-500">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500">
                  Tính năng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500">
                  Tin tức
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500">
                  Thực đơn
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-orange-500">
                  Tài khoản
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500">
                  Trung tâm hỗ trợ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500">
                  Phản hồi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500">
                  Khả năng truy cập
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Liên hệ</h3>
            <p className="text-gray-400 text-sm mb-4">
              Câu hỏi hoặc phản hồi? Chúng tôi muốn nghe từ bạn.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Món Việt. Đã đăng ký bản quyền.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

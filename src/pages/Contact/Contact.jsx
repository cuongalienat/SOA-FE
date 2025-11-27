import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Liên hệ với chúng tôi</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">Chúng tôi rất muốn nghe từ bạn. Đội ngũ thân thiện của chúng tôi luôn sẵn sàng trò chuyện.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
           <div className="flex items-start space-x-4">
             <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
               <Mail size={24} />
             </div>
             <div>
               <h3 className="font-bold text-lg text-gray-900">Email</h3>
               <p className="text-gray-500">Đội ngũ thân thiện của chúng tôi luôn sẵn sàng giúp đỡ.</p>
               <p className="text-orange-600 font-semibold mt-1">support@flavordash.ai</p>
             </div>
           </div>

           <div className="flex items-start space-x-4">
             <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
               <MapPin size={24} />
             </div>
             <div>
               <h3 className="font-bold text-lg text-gray-900">Văn phòng</h3>
               <p className="text-gray-500">Hãy đến chào chúng tôi tại trụ sở chính.</p>
               <p className="text-orange-600 font-semibold mt-1">100 Foodie Lane, Flavor Town, NY</p>
             </div>
           </div>

           <div className="flex items-start space-x-4">
             <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
               <Phone size={24} />
             </div>
             <div>
               <h3 className="font-bold text-lg text-gray-900">Điện thoại</h3>
               <p className="text-gray-500">Thứ Hai - Thứ Sáu từ 8h sáng đến 5h chiều.</p>
               <p className="text-orange-600 font-semibold mt-1">+1 (555) 000-0000</p>
             </div>
           </div>
        </div>

        {/* Form */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                 <Send className="text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Đã gửi tin nhắn!</h3>
              <p className="text-gray-500 mt-2">Chúng tôi sẽ phản hồi sớm.</p>
              <button onClick={() => setSubmitted(false)} className="mt-6 text-orange-500 font-semibold hover:underline">Gửi tin khác</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên của bạn</label>
                <input required type="text" className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="Nguyễn Văn A" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ Email</label>
                <input required type="email" className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="ban@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tin nhắn</label>
                <textarea required rows={4} className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="Chúng tôi có thể giúp gì?"></textarea>
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition flex items-center justify-center">
                Gửi tin nhắn <Send size={18} className="ml-2" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
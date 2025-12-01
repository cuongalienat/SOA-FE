// import { GoogleGenAI } from "@google/genai";

// const apiKey = process.env.API_KEY || '';
// const ai = new GoogleGenAI({ apiKey });

// export const generateFoodDescription = async (foodName, category) => {
//   if (!apiKey) {
//     return "Dịch vụ AI không khả dụng: Thiếu khóa API.";
//   }

//   try {
//     const response = await ai.models.generateContent({
//       model: 'gemini-2.5-flash',
//       contents: `Viết một đoạn mô tả ngắn gọn, hấp dẫn, kích thích vị giác (tối đa 30 từ) bằng tiếng Việt cho món ăn "${foodName}" thuộc danh mục "${category}". Tập trung vào hương vị và kết cấu.`,
//     });

//     return response.text || "Món ăn ngon đang chờ đón bạn!";
//   } catch (error) {
//     console.error("Gemini API Error:", error);
//     return "Một món ngon được chuẩn bị riêng cho bạn.";
//   }
// };

// export const askChefAI = async (query) => {
//   if (!apiKey) return "Tôi đang ngoại tuyến ngay bây giờ.";

//   try {
//     const response = await ai.models.generateContent({
//       model: 'gemini-2.5-flash',
//       contents: `Bạn là trợ lý đầu bếp đẳng cấp thế giới cho một ứng dụng giao đồ ăn. Hãy trả lời câu hỏi của khách hàng này một cách ngắn gọn và hữu ích bằng tiếng Việt: "${query}"`,
//     });
//     return response.text || "Tôi không tìm thấy câu trả lời cho câu hỏi đó.";
//   } catch (error) {
//     return "Xin lỗi, tôi đang gặp khó khăn khi suy nghĩ ngay bây giờ.";
//   }
// };

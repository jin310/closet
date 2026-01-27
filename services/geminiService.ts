
import { GoogleGenAI, Type } from "@google/genai";

// 助手函数：确保 API Key 存在
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Missing API_KEY in environment");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeClothingImage = async (base64Image: string) => {
  try {
    const ai = getAI();
    const data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { inlineData: { data: data, mimeType: 'image/jpeg' } },
        { text: "Analyze garment in detail. Return JSON with category, color, style and a catchy product name." }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mainCategory: { type: Type.STRING },
            subCategory: { type: Type.STRING },
            color: { type: Type.STRING },
            style: { type: Type.STRING },
            suggestedName: { type: Type.STRING }
          },
          required: ["mainCategory", "subCategory", "color", "style", "suggestedName"]
        }
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return null;
  }
};

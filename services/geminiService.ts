
import { GoogleGenAI, Type } from "@google/genai";

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
        { text: "Detailed garment analysis. Detect: category, color, style, season (Spring, Summer, Autumn, Winter, All-season), and suggested name. Return JSON." }
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
            season: { type: Type.STRING },
            suggestedName: { type: Type.STRING }
          },
          required: ["mainCategory", "subCategory", "color", "style", "season", "suggestedName"]
        }
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return null;
  }
};

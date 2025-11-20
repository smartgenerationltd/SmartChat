import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
// Initialize safely. If no key, we will handle it gracefully in the call.
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const getGeminiResponse = async (userMessage: string): Promise<string> => {
  if (!ai) {
    return "I'm currently offline (API Key missing).";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: "You are a helpful, friendly, and concise AI assistant inside a WhatsApp-like chat application. Keep your answers brief and conversational, using emojis occasionally.",
      },
    });
    return response.text || "Thinking...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't process that request right now.";
  }
};


import { GoogleGenAI, Modality, Type } from "@google/genai";

// API key is handled directly in initialization as per guidelines

export const getGeminiResponse = async (prompt: string, context?: string) => {
  // Always use a named parameter and obtain API key directly from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-pro-preview";
  
  const systemInstruction = `Tu es l'assistant intelligent de Plameraie BST, une application de gestion de palmeraie. 
  Réponds aux questions de l'utilisateur sur la plantation, donne des conseils agronomiques (fertilisation, lutte contre les nuisibles) 
  et aide à l'analyse des données financières si nécessaire. 
  Utilise un ton professionnel et encourageant.
  Context actuel de l'application: ${context || "Aucun context spécifique"}`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    return response.text || "Désolé, je n'ai pas pu générer de réponse.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Une erreur est survenue lors de la communication avec l'IA.";
  }
};

export const generateTTS = async (text: string) => {
  // Always use a named parameter and obtain API key directly from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

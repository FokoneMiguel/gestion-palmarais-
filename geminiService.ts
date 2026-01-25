import { GoogleGenAI, Modality } from "@google/genai";

export const checkApiHealth = async (): Promise<{ok: boolean, message: string}> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined') {
    return { ok: false, message: "Clé API non configurée." };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: "ping" }] }],
    });
    
    return response.text ? { ok: true, message: "Connecté." } : { ok: false, message: "Pas de réponse." };
  } catch (error: any) {
    return { ok: false, message: error.message || "Erreur API." };
  }
};

export const getGeminiResponse = async (prompt: string, context?: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "Erreur : Clé API manquante.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: `Tu es l'assistant de Plameraie BST. Réponds de façon experte sur la plantation de palmiers. Contexte : ${context || "Général"}`,
        temperature: 0.7,
      }
    });
    
    return response.text || "Désolé, je n'ai pas pu générer de réponse.";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return "L'assistant rencontre une difficulté technique. Veuillez réessayer.";
  }
};

export const generateTTS = async (text: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  
  try {
    const ai = new GoogleGenAI({ apiKey });
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
    return null;
  }
};
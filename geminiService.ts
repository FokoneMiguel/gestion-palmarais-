import { GoogleGenAI, Modality } from "@google/genai";

export const checkApiHealth = async (): Promise<{ok: boolean, message: string}> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
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
    console.warn("API Health check failed:", error);
    return { ok: false, message: error.message || "Erreur de connexion API." };
  }
};

export const getGeminiResponse = async (prompt: string, context?: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined' || apiKey === '') return "Erreur : Clé API non disponible sur ce serveur.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: `Tu es l'assistant expert de Plameraie BST. Réponds aux questions sur la gestion des palmiers à huile. Contexte actuel de l'utilisateur : ${context || "Général"}.`,
        temperature: 0.7,
      }
    });
    
    return response.text || "Désolé, je ne parviens pas à formuler une réponse.";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return "L'assistant expert rencontre un problème technique temporaire.";
  }
};

export const generateTTS = async (text: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined' || apiKey === '') return null;
  
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
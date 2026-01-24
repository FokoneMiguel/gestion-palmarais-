
import { GoogleGenAI, Modality } from "@google/genai";

export const checkApiHealth = async (): Promise<{ok: boolean, message: string}> => {
  if (!process.env.API_KEY || process.env.API_KEY === 'undefined') {
    return { ok: false, message: "Clé API manquante (API_KEY non définie)." };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: "ping" }] }],
    });
    
    if (response.text) {
      return { ok: true, message: "Connecté à Gemini avec succès." };
    }
    return { ok: false, message: "Réponse vide du modèle." };
  } catch (error: any) {
    console.error("Diagnostic API Gemini:", error);
    return { 
      ok: false, 
      message: `Erreur API: ${error.message || "Problème de connexion"}` 
    };
  }
};

export const getGeminiResponse = async (prompt: string, context?: string) => {
  if (!process.env.API_KEY) return "Erreur : La clé API n'est pas configurée.";

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `Tu es l'assistant intelligent de Plameraie BST. 
  Réponds aux questions de l'utilisateur sur la plantation, donne des conseils agronomiques. 
  Sois concis. Contexte: ${context || "Aucun"}`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: prompt }] }],
      config: { systemInstruction, temperature: 0.7 }
    });
    
    return response.text || "Désolé, je n'ai pas pu générer de réponse.";
  } catch (error: any) {
    console.error("Gemini Response Error:", error);
    if (error.message?.includes("403")) return "Erreur 403 : Accès refusé. Vérifiez que votre clé API a accès au modèle Gemini 3 Flash.";
    if (error.message?.includes("401")) return "Erreur 401 : Clé API invalide.";
    return "L'assistant rencontre une difficulté technique temporaire.";
  }
};

export const generateTTS = async (text: string) => {
  if (!process.env.API_KEY) return null;
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

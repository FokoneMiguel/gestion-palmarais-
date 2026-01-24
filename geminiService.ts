
import { GoogleGenAI, Modality } from "@google/genai";

/**
 * Service pour interagir avec l'IA Gemini.
 * Note: L'instance doit être créée au moment de l'appel pour garantir l'accès à la clé API injectée.
 */

export const checkApiHealth = async (): Promise<{ok: boolean, message: string}> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined') {
    return { ok: false, message: "Clé API non configurée." };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: "Vérification de connexion. Réponds par 'OK'." }] }],
    });
    
    return response.text ? { ok: true, message: "Connecté." } : { ok: false, message: "Réponse vide." };
  } catch (error: any) {
    console.error("Health Check Error:", error);
    return { ok: false, message: error.message || "Erreur de connexion." };
  }
};

export const getGeminiResponse = async (prompt: string, context?: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "Configuration requise : Clé API manquante.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const modelName = "gemini-3-flash-preview";
    
    const systemInstruction = `Tu es l'assistant expert de Plameraie BST. 
    Ton rôle est d'aider le gestionnaire de plantation. 
    Donne des conseils sur : 
    1. L'agronomie (palmier à huile, fertilisation NPK, lutte contre le Cercospora).
    2. La gestion (optimisation des coûts, calcul de rendement huile/matière).
    3. L'utilisation de l'application.
    Sois professionnel, concis et utilise un ton encourageant.
    Contexte actuel : ${context || "Tableau de bord général"}`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ parts: [{ text: prompt }] }],
      config: { 
        systemInstruction,
        temperature: 0.7,
        topP: 0.95
      }
    });
    
    return response.text || "Je n'ai pas pu formuler de réponse. Pouvez-vous reformuler ?";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return "Désolé, je rencontre une erreur de communication. Vérifiez votre connexion.";
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
    console.error("TTS Error:", error);
    return null;
  }
};

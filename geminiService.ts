
import { GoogleGenAI, Modality } from "@google/genai";

/**
 * Service pour interagir avec l'IA Gemini.
 */

export const checkApiHealth = async (): Promise<{ok: boolean, message: string}> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    return { ok: false, message: "La clé API Gemini est manquante ou invalide dans l'environnement." };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    // Test minimaliste avec Gemini 3 Flash
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: "Vérifie la connexion. Réponds par un seul mot : Connecté." }] }],
      config: { maxOutputTokens: 10 }
    });
    
    if (response && response.text) {
      return { ok: true, message: "Connecté à l'IA avec succès." };
    }
    return { ok: false, message: "Le modèle n'a pas renvoyé de texte." };
  } catch (error: any) {
    console.error("Health Check Error:", error);
    let errorMsg = "Erreur de connexion.";
    if (error.message?.includes("403")) errorMsg = "Accès refusé (403). Vérifiez les permissions de votre clé API.";
    if (error.message?.includes("401")) errorMsg = "Clé API non autorisée (401).";
    return { ok: false, message: `${errorMsg} Détails: ${error.message?.substring(0, 50)}...` };
  }
};

export const getGeminiResponse = async (prompt: string, context?: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined') return "⚠️ Configuration requise : La clé API n'est pas détectée. Contactez l'administrateur.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const modelName = "gemini-3-flash-preview";
    
    const systemInstruction = `Tu es l'assistant intelligent de Plameraie BST. 
    Ton expertise couvre l'agronomie tropicale, la gestion de palmeraies et la comptabilité agricole.
    Réponds de manière précise, concise et professionnelle.
    Utilise le contexte suivant pour tes réponses : ${context || "Pas de contexte spécifique fourni"}.
    Si l'utilisateur pose une question hors sujet (autre que plantation/gestion/aide app), redirige-le poliment vers le domaine de la palmeraie.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ parts: [{ text: prompt }] }],
      config: { 
        systemInstruction,
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 800
      }
    });
    
    return response.text || "Désolé, je n'ai pas pu générer de réponse intelligible.";
  } catch (error: any) {
    console.error("Gemini Response Error:", error);
    if (error.message?.includes("Safety")) return "Désolé, ma politique de sécurité m'empêche de répondre à cette requête spécifique.";
    return `Erreur technique : ${error.message || "Le service est temporairement indisponible"}. Veuillez réessayer dans quelques instants.`;
  }
};

export const generateTTS = async (text: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined') return null;
  
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

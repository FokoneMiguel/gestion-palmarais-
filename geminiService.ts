
import { GoogleGenAI, Modality, Type } from "@google/genai";

export const getGeminiResponse = async (prompt: string, context?: string) => {
  // Initialisation avec la clé d'environnement
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Utilisation de Flash pour une meilleure réactivité dans le chat
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `Tu es l'assistant intelligent de Plameraie BST, une application de gestion de palmeraie. 
  Réponds aux questions de l'utilisateur sur la plantation, donne des conseils agronomiques (fertilisation, lutte contre les nuisibles) 
  et aide à l'analyse des données financières si nécessaire. 
  Utilise un ton professionnel, expert et encourageant.
  Sois concis dans tes réponses.
  Contexte actuel de l'application: ${context || "Aucun contexte spécifique"}`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });
    
    return response.text || "Désolé, je n'ai pas pu générer de réponse.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "L'assistant rencontre une difficulté technique. Vérifiez votre connexion ou la validité de la clé API.";
  }
};

export const generateTTS = async (text: string) => {
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

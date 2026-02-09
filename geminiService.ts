
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
      contents: "ping",
    });
    
    return response.text ? { ok: true, message: "Connecté." } : { ok: false, message: "Pas de réponse." };
  } catch (error: any) {
    return { ok: false, message: "Erreur de connexion API." };
  }
};

export const getGeminiResponse = async (prompt: string, context?: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined') return "Erreur : La clé API n'est pas activée.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    // Utilisation d'un format de contenu simplifié pour éviter les erreurs de structure
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `Tu es l'assistant expert technique de Plameraie BST. 
        RÈGLE CRITIQUE : N'utilise JAMAIS de symboles Markdown (pas de **, pas de #, pas de *). 
        Écris uniquement en texte brut, simple et clair. 
        Si tu dois faire une liste, utilise des tirets (-) simples.
        Contexte utilisateur : ${context || "Gestion de palmeraie"}.`,
        temperature: 0.5, // Réduction de la température pour plus de stabilité
      }
    });
    
    // Nettoyage manuel au cas où le modèle ignorerait l'instruction système
    let text = response.text || "Désolé, je ne parviens pas à répondre.";
    return text.replace(/\*\*/g, '').replace(/###/g, '').replace(/#/g, '');
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return "Désolé, je rencontre une petite difficulté technique pour accéder au réseau IA. Réessayez dans un instant.";
  }
};

export const generateTTS = async (text: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined') return null;
  
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: text,
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

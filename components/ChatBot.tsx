
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse, generateTTS, checkApiHealth } from '../geminiService';
import { AppState } from '../types';

interface ChatBotProps {
  state: AppState;
  t: any;
}

const ChatBot: React.FC<ChatBotProps> = ({ state, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<{ok: boolean | null, message: string}>({ ok: null, message: "Initialisation..." });
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: "Bonjour ! Je suis l'assistant expert de Plameraie BST. Comment puis-je vous aider aujourd'hui ? Posez-moi vos questions sur la gestion, l'agronomie ou l'utilisation de l'application." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Vérifier la connexion lors de l'ouverture
  useEffect(() => {
    if (isOpen && apiStatus.ok === null) {
      const runCheck = async () => {
        const status = await checkApiHealth();
        setApiStatus(status);
        if (!status.ok) {
          setMessages(prev => [...prev, { role: 'ai', content: `⚠️ Note : L'IA est actuellement indisponible (${status.message}). Vous pouvez tout de même utiliser l'application normalement.` }]);
        }
      };
      runCheck();
    }
  }, [isOpen]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const context = `Utilisateur: ${state.currentUser?.username} (${state.currentUser?.role}). Plantation ID: ${state.currentUser?.plantationId}. Activités totales: ${state.activities.length}. Ventes totales: ${state.sales.length}.`;
      const aiResponse = await getGeminiResponse(userMsg, context);
      
      // Petit délai pour simuler une réflexion humaine (optionnel mais agréable)
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
        setIsLoading(false);
      }, 500);
      
    } catch (err: any) {
      console.error("ChatBot Send Error:", err);
      setMessages(prev => [...prev, { role: 'ai', content: "Une erreur inattendue est survenue. Vérifiez votre connexion internet." }]);
      setIsLoading(false);
    }
  };

  const playAudio = async (text: string) => {
    const audioData = await generateTTS(text);
    if (audioData) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
      const binaryString = atob(audioData);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const dataInt16 = new Int16Array(bytes.buffer);
      const frameCount = dataInt16.length;
      const buffer = audioContext.createBuffer(1, frameCount, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }
      
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start();
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 text-white rounded-[2rem] shadow-2xl flex items-center justify-center text-3xl hover:scale-110 hover:rotate-6 active:scale-95 transition-all border-4 border-white dark:border-slate-900 group"
      >
        <span className="group-hover:animate-pulse">{isOpen ? '✕' : '✨'}</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-28 right-6 z-50 w-[90vw] md:w-[450px] h-[75vh] max-h-[700px] bg-white dark:bg-slate-800 rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col border border-slate-200 dark:border-slate-700 animate-in slide-in-from-bottom-20 zoom-in-95 duration-500 overflow-hidden">
          {/* Header */}
          <div className="p-7 bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="flex items-center space-x-4 relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/20">🤖</div>
              <div>
                <p className="font-black text-lg tracking-tight">BST Expert AI</p>
                <div className="flex items-center space-x-1.5">
                  <span className={`w-2 h-2 rounded-full ${apiStatus.ok ? 'bg-green-300 animate-pulse' : 'bg-red-400'}`}></span>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{apiStatus.ok ? 'Connecté' : 'Erreur'}</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition-all">✕</button>
          </div>
          
          {/* Chat area */}
          <div className="flex-1 overflow-y-auto p-7 space-y-6 custom-scrollbar bg-slate-50 dark:bg-slate-900/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`
                  max-w-[88%] px-6 py-4 rounded-[2rem] text-sm leading-relaxed shadow-sm
                  ${m.role === 'user' 
                    ? 'bg-amber-500 text-white rounded-tr-none font-bold' 
                    : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-600 rounded-tl-none'}
                `}>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.role === 'ai' && apiStatus.ok && (
                    <button 
                      onClick={() => playAudio(m.content)} 
                      className="mt-4 flex items-center space-x-2 text-[9px] font-black opacity-40 hover:opacity-100 uppercase tracking-widest transition-all group"
                    >
                      <span className="text-sm group-hover:scale-125 transition-transform">🔊</span> <span>Synthèse Vocale</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white dark:bg-slate-700 px-7 py-4 rounded-[2rem] border border-slate-100 dark:border-slate-600 flex items-center space-x-3">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Réflexion en cours...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <div className="p-7 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="flex space-x-3 items-center">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
                placeholder="Expliquez-moi le rendement huile..."
                className="flex-1 bg-slate-100 dark:bg-slate-700 border-none rounded-[1.5rem] px-6 py-4 text-sm focus:ring-2 focus:ring-amber-500 dark:text-white outline-none disabled:opacity-50 transition-all font-medium"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`bg-amber-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all ${isLoading || !input.trim() ? 'opacity-30' : 'bg-gradient-to-br from-amber-500 to-orange-600'}`}
              >
                <span className="text-xl">🚀</span>
              </button>
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Powered by Gemini 3 Flash</p>
              <button className="text-[9px] text-amber-600 font-black uppercase tracking-widest hover:underline">Aide & Astuces</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;

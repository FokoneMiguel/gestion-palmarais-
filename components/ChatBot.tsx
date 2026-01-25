
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse, generateTTS, checkApiHealth } from '../geminiService';
import { AppState } from '../types';

const ChatBot: React.FC<{ state: AppState; t: any }> = ({ state, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<{ok: boolean | null, message: string}>({ ok: null, message: "Initialisation..." });
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: "Bonjour ! Je suis l'assistant expert de Plameraie BST. Comment puis-je vous aider aujourd'hui ? Je peux vous conseiller sur la plantation, les maladies ou l'utilisation de l'app." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && apiStatus.ok === null) {
      checkApiHealth().then(status => {
        setApiStatus(status);
        if (!status.ok) {
          setMessages(prev => [...prev, { role: 'ai', content: `⚠️ Note : L'IA semble indisponible pour le moment (${status.message}).` }]);
        }
      });
    }
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      // Contexte enrichi pour Gemini
      const context = `Utilisateur: ${state.currentUser?.username} (${state.currentUser?.role}). Plantation ID: ${state.currentUser?.plantationId}. Langue: ${state.language}.`;
      const response = await getGeminiResponse(userMsg, context);
      
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages(prev => [...prev, { role: 'ai', content: "Désolé, j'ai rencontré un problème technique. Vérifiez votre connexion." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = async (text: string) => {
    try {
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
        const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) {
          channelData[i] = dataInt16[i] / 32768.0;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start();
      }
    } catch (e) {
      console.error("Audio Playback Error:", e);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-20 h-20 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 text-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(234,88,12,0.4)] flex items-center justify-center text-4xl hover:scale-110 active:scale-95 transition-all border-4 border-white dark:border-slate-900 group"
      >
        <span className="group-hover:rotate-12 transition-transform">{isOpen ? '✕' : '🤖'}</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-32 right-6 z-50 w-[90vw] md:w-[500px] h-[75vh] max-h-[800px] bg-white dark:bg-slate-800 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] flex flex-col border border-slate-200 dark:border-slate-700 animate-in slide-in-from-bottom-20 zoom-in-95 duration-500 overflow-hidden">
          {/* Header */}
          <div className="p-8 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="flex items-center space-x-5 relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center text-3xl shadow-inner border border-white/20">✨</div>
              <div>
                <p className="font-black text-xl tracking-tight leading-none mb-1">BST Expert AI</p>
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${apiStatus.ok ? 'bg-green-300 animate-pulse' : 'bg-red-400'}`}></span>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">{apiStatus.ok ? 'Connecté' : 'Erreur'}</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center hover:bg-black/20 transition-all font-bold text-lg">✕</button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-slate-50 dark:bg-slate-900/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-5 duration-300`}>
                <div className={`
                  max-w-[88%] px-6 py-4 rounded-[2.2rem] text-[15px] leading-relaxed shadow-sm
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
                      <span className="text-sm group-hover:scale-125 transition-transform">🔊</span> <span>Vocal</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white dark:bg-slate-700 px-8 py-5 rounded-[2.5rem] border border-slate-100 dark:border-slate-600 flex items-center space-x-4">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Réflexion de l'expert...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-8 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="flex space-x-4 items-center">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
                placeholder="Posez votre question à l'expert..."
                className="flex-1 bg-slate-100 dark:bg-slate-700 border-none rounded-[1.8rem] px-8 py-5 text-sm focus:ring-4 focus:ring-amber-500/20 dark:text-white outline-none disabled:opacity-50 transition-all font-medium"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`bg-amber-500 text-white w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all ${isLoading || !input.trim() ? 'opacity-30 grayscale' : 'bg-gradient-to-br from-amber-500 to-orange-600'}`}
              >
                <span className="text-2xl">🚀</span>
              </button>
            </div>
            <div className="flex justify-between items-center mt-6">
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">Plameraie BST Intelligence</p>
              <div className="flex space-x-1">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                 <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                 <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;

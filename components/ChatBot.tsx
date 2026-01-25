import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse, generateTTS, checkApiHealth } from '../geminiService';
import { AppState } from '../types';

const ChatBot: React.FC<{ state: AppState; t: any }> = ({ state, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<{ok: boolean | null, message: string}>({ ok: null, message: "Initialisation..." });
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: "Bonjour ! Je suis l'assistant expert de Plameraie BST. Comment puis-je vous aider aujourd'hui ?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && apiStatus.ok === null) {
      checkApiHealth().then(setApiStatus);
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
      const context = `Utilisateur: ${state.currentUser?.username}. Activités: ${state.activities.length}. Ventes: ${state.sales.length}.`;
      const response = await getGeminiResponse(userMsg, context);
      
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Désolé, une erreur s'est produite lors de la connexion à l'IA." }]);
    } finally {
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
      const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
      buffer.getChannelData(0).set(Array.from(dataInt16).map(v => v / 32768.0));
      
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
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 text-white rounded-3xl shadow-2xl flex items-center justify-center text-3xl hover:scale-110 active:scale-95 transition-all border-4 border-white dark:border-slate-900"
      >
        {isOpen ? '✕' : '✨'}
      </button>

      {isOpen && (
        <div className="fixed bottom-28 right-6 z-50 w-[90vw] md:w-[450px] h-[70vh] bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl flex flex-col border border-slate-200 dark:border-slate-700 animate-in slide-in-from-bottom-10 duration-500 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">🤖</div>
              <div>
                <p className="font-black text-sm tracking-tight">BST Expert AI</p>
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{apiStatus.ok ? 'Connecté' : 'Vérification...'}</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">✕</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50 dark:bg-slate-900/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-5 py-3 rounded-[2rem] text-sm shadow-sm ${m.role === 'user' ? 'bg-amber-500 text-white rounded-tr-none' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-600'}`}>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.role === 'ai' && (
                    <button onClick={() => playAudio(m.content)} className="mt-2 text-[10px] font-black opacity-40 hover:opacity-100 uppercase tracking-widest block">🔊 Écouter</button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-700 px-6 py-3 rounded-full flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-6 border-t border-slate-100 dark:border-slate-700">
            <div className="flex space-x-3 items-center">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
                placeholder="Posez votre question..."
                className="flex-1 bg-slate-100 dark:bg-slate-700 border-none rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-amber-500 dark:text-white outline-none"
              />
              <button onClick={handleSend} disabled={isLoading || !input.trim()} className={`bg-amber-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isLoading || !input.trim() ? 'opacity-30' : ''}`}>🚀</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
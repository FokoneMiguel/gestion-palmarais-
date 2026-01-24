
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse, generateTTS } from '../geminiService';
import { AppState } from '../types';

interface ChatBotProps {
  state: AppState;
  t: any;
}

const ChatBot: React.FC<ChatBotProps> = ({ state, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: "Bonjour ! Je suis l'assistant Plameraie BST. Comment puis-je vous aider aujourd'hui ? Je peux vous conseiller sur l'entretien, analyser vos rendements ou vous expliquer une fonctionnalité." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const context = `Plantation: ${state.currentUser?.plantationId}. Activities: ${state.activities.length}. Sales: ${state.sales.length}. Language: ${state.language}`;
    const aiResponse = await getGeminiResponse(userMsg, context);
    
    setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    setIsLoading(false);
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
        className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-amber-500 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl hover:bg-amber-600 transition-all hover:scale-110 border-4 border-white dark:border-slate-900"
      >
        {isOpen ? '✕' : '✨'}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 md:w-96 h-[550px] bg-white dark:bg-slate-800 rounded-3xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-700 animate-in slide-in-from-bottom-10 duration-300 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-lg">🤖</span>
              <div>
                <p className="text-sm">Assistant BST</p>
                <p className="text-[10px] font-normal opacity-80">Propulsé par Gemini 3</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-[10px]">En ligne</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50 dark:bg-slate-900/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                  max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                  ${m.role === 'user' 
                    ? 'bg-amber-500 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-600 rounded-tl-none'}
                `}>
                  <p>{m.content}</p>
                  {m.role === 'ai' && (
                    <button onClick={() => playAudio(m.content)} className="mt-3 flex items-center space-x-1 text-[10px] font-bold opacity-60 hover:opacity-100 uppercase tracking-widest transition-opacity">
                      <span>🔊</span> <span>Écouter</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-700 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-600">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="flex space-x-2">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Posez une question agronomique..."
                className="flex-1 bg-slate-100 dark:bg-slate-700 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 dark:text-white outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className={`bg-amber-500 text-white p-2.5 rounded-xl hover:bg-amber-600 transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : 'active:scale-90 shadow-lg shadow-amber-500/20'}`}
              >
                🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;


import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse, generateTTS } from '../geminiService';
import { AppState } from '../types';

interface ChatBotProps {
  state: AppState;
  t: any;
}

const ChatBot: React.FC<ChatBotProps> = ({ state, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);
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

    const context = `Plantation stats: Total activities: ${state.activities.length}, Total sales: ${state.sales.length}, Language: ${state.language}`;
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
        className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-amber-500 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl hover:bg-amber-600 transition-all hover:scale-110"
      >
        {isOpen ? '✕' : '✨'}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 md:w-96 h-[500px] bg-white dark:bg-slate-800 rounded-3xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-700 animate-in slide-in-from-bottom-10 duration-300 overflow-hidden">
          <div className="p-4 bg-amber-500 text-white font-bold flex items-center space-x-2">
            <span>🤖</span>
            <span>{t.aiAssistant} BST</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50 dark:bg-slate-900/50">
            {messages.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm italic">
                Posez vos questions sur la gestion de la palmeraie !
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                  max-w-[85%] px-4 py-2 rounded-2xl text-sm
                  ${m.role === 'user' 
                    ? 'bg-amber-500 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-600 rounded-tl-none'}
                `}>
                  <p>{m.content}</p>
                  {m.role === 'ai' && (
                    <button onClick={() => playAudio(m.content)} className="mt-2 text-xs opacity-50 hover:opacity-100">🔊 Ecouter</button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-700 px-4 py-2 rounded-2xl animate-pulse text-slate-400">...</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex space-x-2">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Votre message..."
                className="flex-1 bg-slate-100 dark:bg-slate-700 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 dark:text-white"
              />
              <button 
                onClick={handleSend}
                className="bg-amber-500 text-white p-2 rounded-xl hover:bg-amber-600 transition-colors"
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

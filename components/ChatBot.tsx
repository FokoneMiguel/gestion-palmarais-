import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse, generateTTS, checkApiHealth } from '../geminiService';
import { AppState } from '../types';

const ChatBot: React.FC<{ state: AppState; t: any }> = ({ state, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<{ok: boolean | null, message: string}>({ ok: null, message: "Initialisation..." });
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: "Bonjour ! Je suis l'assistant expert de Plameraie BST. Comment puis-je vous aider ?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && apiStatus.ok === null) {
      checkApiHealth().then(status => setApiStatus(status));
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
      const response = await getGeminiResponse(userMsg, `User:${state.currentUser?.username}. Language:${state.language}`);
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Erreur de connexion IA." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-amber-400 to-orange-600 text-white rounded-3xl shadow-2xl flex items-center justify-center text-3xl hover:scale-110 active:scale-95 transition-all border-4 border-white dark:border-slate-900"
      >
        <span>{isOpen ? '✕' : '🤖'}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-x-4 bottom-24 md:inset-auto md:right-6 md:bottom-32 z-50 md:w-[450px] h-[70vh] max-h-[600px] bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl flex flex-col border border-slate-200 dark:border-slate-700 animate-in slide-in-from-bottom-10">
          {/* Header */}
          <div className="p-6 bg-amber-600 text-white flex items-center justify-between rounded-t-[3rem]">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">✨</div>
              <p className="font-black uppercase tracking-tight">BST Expert AI</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="opacity-50 hover:opacity-100">✕</button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50 dark:bg-slate-900/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm font-medium ${m.role === 'user' ? 'bg-amber-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-700 dark:text-white border border-slate-100 dark:border-slate-600 rounded-tl-none shadow-sm'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input - Fix visibilité bouton */}
          <div className="p-4 bg-white dark:bg-slate-800 rounded-b-[3rem] border-t border-slate-100 dark:border-slate-700">
            <div className="flex space-x-2">
              <input 
                value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Votre question..."
                className="flex-1 bg-slate-100 dark:bg-slate-700 border-none rounded-2xl px-5 py-4 text-sm dark:text-white outline-none"
              />
              <button 
                onClick={handleSend} disabled={!input.trim() || isLoading}
                className="bg-amber-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform disabled:opacity-50"
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
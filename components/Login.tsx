
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  users: User[];
  t: any;
  theme: string;
  language: string;
  onThemeToggle: () => void;
  onLanguageToggle: () => void;
}

const Login: React.FC<LoginProps> = ({ 
  onLogin, users, t, theme, language, onThemeToggle, onLanguageToggle 
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [plantationCode, setPlantationCode] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const checkCode = (username === 'MiguelF') ? 'SYSTEM' : plantationCode;

    const user = users.find(u => 
        u.username.toLowerCase() === username.toLowerCase() && 
        u.password === password && 
        (checkCode === '' || u.plantationId === checkCode)
    );

    if (user) {
      onLogin(user);
    } else {
      setError("Identifiants ou Code Plantation incorrect.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 px-6 py-12 transition-colors font-sans">
      <div className="fixed top-6 right-6 flex space-x-3">
        <button onClick={onLanguageToggle} className="w-10 h-10 flex items-center justify-center text-[10px] font-black dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm transition-transform active:scale-90 uppercase tracking-widest">
          {language}
        </button>
        <button onClick={onThemeToggle} className="w-10 h-10 flex items-center justify-center text-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm transition-transform active:scale-90">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-600 to-green-800 rounded-[2.5rem] shadow-2xl shadow-green-900/30 text-5xl text-white font-black mb-6 transform hover:rotate-6 transition-transform border-4 border-white/20">
            P
          </div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter leading-none mb-2">Plameraie BST</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Système de Gestion de Plantation</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[3rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] border border-white dark:border-slate-700 transition-colors">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Code Plantation</label>
              <input 
                type="text" 
                value={plantationCode} 
                onChange={e => setPlantationCode(e.target.value.toUpperCase())}
                placeholder="Ex: PALM-123"
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 border border-transparent focus:border-green-500 rounded-3xl outline-none dark:text-white focus:ring-4 focus:ring-green-500/10 transition-all font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Utilisateur</label>
              <input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                required
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 border border-transparent focus:border-green-500 rounded-3xl outline-none dark:text-white focus:ring-4 focus:ring-green-500/10 transition-all font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Mot de passe</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 border border-transparent focus:border-green-500 rounded-3xl outline-none dark:text-white focus:ring-4 focus:ring-green-500/10 transition-all font-bold"
              />
            </div>

            {error && (
              <div className="flex items-center justify-center space-x-2 text-red-500 text-xs font-black uppercase tracking-widest bg-red-50 dark:bg-red-900/20 py-3 rounded-2xl border border-red-100 dark:border-red-900/30">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-gradient-to-br from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-green-900/20 transition-all transform active:scale-95 uppercase tracking-widest text-xs"
            >
              Se Connecter
            </button>
          </form>
        </div>
        
        <p className="mt-10 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          &copy; 2025 Plameraie BST - MiguelF
        </p>
      </div>
    </div>
  );
};

export default Login;

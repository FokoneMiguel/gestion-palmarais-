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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 transition-colors">
      <div className="absolute top-6 right-6 flex space-x-3">
        <button onClick={onLanguageToggle} className="px-4 py-2 text-xs font-black dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm shadow-sm uppercase tracking-widest">{language}</button>
        <button onClick={onThemeToggle} className="p-3 text-xl bg-white/50 dark:bg-slate-800/50 rounded-2xl shadow-sm">{theme === 'light' ? '🌙' : '☀️'}</button>
      </div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-600 to-green-800 rounded-[2.5rem] shadow-2xl text-4xl text-white font-black mb-6 transform hover:rotate-12 transition-transform">
            P
          </div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">Plameraie BST</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Accès sécurisé à votre gestion</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-amber-500 to-green-500"></div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Code Plantation</label>
              <input 
                type="text" value={plantationCode} onChange={e => setPlantationCode(e.target.value.toUpperCase())}
                placeholder="Ex: PALM-123"
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-2xl outline-none dark:text-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Utilisateur</label>
              <input 
                type="text" value={username} onChange={e => setUsername(e.target.value)} required
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-2xl outline-none dark:text-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Mot de passe</label>
              <input 
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-2xl outline-none dark:text-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all font-bold"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl">
                <p className="text-red-600 dark:text-red-400 text-xs font-black text-center">{error}</p>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white font-black py-5 rounded-2xl shadow-xl shadow-green-900/20 transition-all transform active:scale-95 uppercase tracking-widest text-xs"
            >
              Se Connecter
            </button>
          </form>
        </div>
        
        <p className="text-center mt-8 text-slate-400 text-[10px] font-black uppercase tracking-widest">Plameraie BST © 2024</p>
      </div>
    </div>
  );
};

export default Login;
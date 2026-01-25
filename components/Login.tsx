
import React, { useState } from 'react';
import { User, UserRole } from '../types';

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
    setError('');

    const cleanUsername = username.trim().toLowerCase();
    const cleanCode = plantationCode.trim().toUpperCase();

    // Recherche de l'utilisateur avec une logique plus souple
    const user = users.find(u => {
      const sameName = u.username.toLowerCase() === cleanUsername;
      const samePass = u.password === password;
      
      // Si c'est le Super Admin, on ignore le code plantation
      if (u.role === UserRole.SUPER_ADMIN) {
        return sameName && samePass;
      }
      
      // Pour les autres, le nom, le pass ET le code plantation doivent correspondre
      const sameCode = u.plantationId === cleanCode;
      return sameName && samePass && sameCode;
    });

    if (user) {
      onLogin(user);
    } else {
      setError("Identifiants ou Code Plantation incorrect.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 px-6 py-12 transition-colors font-sans overflow-hidden">
      {/* Boutons de réglages rapides - Plus gros pour Android */}
      <div className="fixed top-6 right-6 flex space-x-3 z-50">
        <button onClick={onLanguageToggle} className="w-12 h-12 flex items-center justify-center text-[10px] font-black dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg transition-transform active:scale-90 uppercase tracking-widest">
          {language}
        </button>
        <button onClick={onThemeToggle} className="w-12 h-12 flex items-center justify-center text-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg transition-transform active:scale-90">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      <div className="w-full max-w-md relative">
        {/* Décoration de fond pour Android */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -z-10"></div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-green-600 to-green-800 rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(22,101,52,0.4)] text-5xl text-white font-black mb-6 transform hover:rotate-6 transition-transform border-4 border-white/20">
            P
          </div>
          <h1 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter leading-none mb-2">Plameraie BST</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Système de Gestion de Plantation</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[3.5rem] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.15)] border border-white dark:border-slate-700 transition-colors">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Code Plantation</label>
              <input 
                type="text" 
                value={plantationCode} 
                onChange={e => setPlantationCode(e.target.value)}
                placeholder="PALM-XXX"
                className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-700 border-2 border-transparent focus:border-green-500 rounded-[1.8rem] outline-none dark:text-white focus:ring-8 focus:ring-green-500/5 transition-all font-bold placeholder:text-slate-300 dark:placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Utilisateur</label>
              <input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                required
                className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-700 border-2 border-transparent focus:border-green-500 rounded-[1.8rem] outline-none dark:text-white focus:ring-8 focus:ring-green-500/5 transition-all font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Mot de passe</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required
                className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-700 border-2 border-transparent focus:border-green-500 rounded-[1.8rem] outline-none dark:text-white focus:ring-8 focus:ring-green-500/5 transition-all font-bold"
              />
            </div>

            {error && (
              <div className="flex items-center justify-center space-x-2 text-red-500 text-xs font-black uppercase tracking-widest bg-red-50 dark:bg-red-900/20 py-4 rounded-3xl border border-red-100 dark:border-red-900/30 animate-bounce">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-gradient-to-br from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-green-900/40 transition-all transform active:scale-95 uppercase tracking-widest text-xs border-b-4 border-green-900/50"
            >
              Accéder au Système
            </button>
          </form>
        </div>
        
        <p className="mt-12 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
          &copy; 2025 Plameraie BST - Premium Management
        </p>
      </div>
    </div>
  );
};

export default Login;

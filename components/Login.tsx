
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
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Pour le SuperAdmin MiguelF, on force le code SYSTEM s'il ne l'a pas mis
    const checkCode = (username === 'MiguelF') ? 'SYSTEM' : plantationCode;

    const user = users.find(u => 
        u.username === username && 
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
      <div className="absolute top-4 right-4 flex space-x-2">
        <button onClick={onLanguageToggle} className="p-2 text-sm font-bold dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl">{language}</button>
        <button onClick={onThemeToggle} className="p-2 text-xl">{theme === 'light' ? '🌙' : '☀️'}</button>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-in fade-in duration-1000">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-700 rounded-3xl shadow-xl text-4xl text-white font-bold mb-4 transform hover:rotate-12 transition-transform">
            P
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Plameraie BST</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Gestion Intelligente de Plantation</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Code Plantation</label>
              <input 
                type="text" value={plantationCode} onChange={e => setPlantationCode(e.target.value.toUpperCase())}
                placeholder="Ex: BST-001 (ou SYSTEM pour MiguelF)"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none dark:text-white focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Utilisateur</label>
              <input 
                type="text" value={username} onChange={e => setUsername(e.target.value)} required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none dark:text-white focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe</label>
              <input 
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none dark:text-white focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>

            {error && <p className="text-red-500 text-xs font-bold text-center bg-red-50 dark:bg-red-900/10 py-2 rounded-lg">{error}</p>}

            <button 
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 mt-2"
            >
              Accéder au Système
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Technologie Plameraie BST</p>
            <p className="text-[10px] text-slate-400 mt-1 italic">Entièrement fonctionnel sans connexion internet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

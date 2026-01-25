
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
      <div className="absolute top-4 right-4 flex space-x-2">
        <button onClick={onLanguageToggle} className="p-2 text-sm font-bold dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl">{language}</button>
        <button onClick={onThemeToggle} className="p-2 text-xl">{theme === 'light' ? '🌙' : '☀️'}</button>
      </div>

      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-center">
        {/* Panneau d'information Démo */}
        <div className="w-full md:w-1/2 order-2 md:order-1">
          <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl">
            <h3 className="text-lg font-bold text-green-800 dark:text-green-400 mb-4 flex items-center">
              <span className="mr-2">🚀</span> Accès Démonstration
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-white dark:bg-slate-700 rounded-2xl border border-slate-100 dark:border-slate-600">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Compte Administrateur</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-500">Code: <span className="font-bold text-slate-800 dark:text-white">BST-001</span></div>
                  <div className="text-slate-500">User: <span className="font-bold text-slate-800 dark:text-white">admin</span></div>
                  <div className="text-slate-500">Pass: <span className="font-bold text-slate-800 dark:text-white">admin</span></div>
                </div>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-2xl border border-slate-100 dark:border-slate-600">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Compte Employé</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-500">Code: <span className="font-bold text-slate-800 dark:text-white">BST-001</span></div>
                  <div className="text-slate-500">User: <span className="font-bold text-slate-800 dark:text-white">worker</span></div>
                  <div className="text-slate-500">Pass: <span className="font-bold text-slate-800 dark:text-white">worker</span></div>
                </div>
              </div>
              <div className="p-3 bg-slate-900 text-white rounded-2xl">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Super Admin (Propriétaire)</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-300">Code: <span className="font-bold text-white">SYSTEM</span></div>
                  <div className="text-slate-300">User: <span className="font-bold text-white">MiguelF</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire de Connexion */}
        <div className="w-full md:w-1/2 order-1 md:order-2">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-700 rounded-2xl shadow-xl text-3xl text-white font-bold mb-3 transform hover:rotate-6 transition-transform">
              P
            </div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Plameraie BST</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Gestion Intelligente de Plantation</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Code Plantation</label>
                <input 
                  type="text" value={plantationCode} onChange={e => setPlantationCode(e.target.value.toUpperCase())}
                  placeholder="Ex: BST-001"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

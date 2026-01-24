
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
    // Simulation SaaS: On vérifie si l'user existe dans les comptes locaux ou si c'est un nouveau proprio
    const user = users.find(u => 
        u.username === username && 
        u.password === password && 
        u.role === role &&
        (plantationCode === '' || u.plantationId === plantationCode)
    );

    if (user) {
      onLogin(user);
    } else {
      setError("Identifiants ou Code Plantation invalide.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 transition-colors">
      <div className="absolute top-4 right-4 flex space-x-2">
        <button onClick={onLanguageToggle} className="p-2 text-sm font-bold dark:text-white">{language}</button>
        <button onClick={onThemeToggle} className="p-2 text-xl">{theme === 'light' ? '🌙' : '☀️'}</button>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-700 rounded-3xl shadow-xl text-4xl text-white font-bold mb-4">
            P
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Plameraie BST</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Solution SaaS de Gestion Agricole</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
              <button 
                type="button" onClick={() => setRole(UserRole.ADMIN)}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === UserRole.ADMIN ? 'bg-white dark:bg-slate-600 shadow-sm text-green-700 dark:text-green-300' : 'text-slate-400'}`}
              >
                {t.admin}
              </button>
              <button 
                type="button" onClick={() => setRole(UserRole.EMPLOYEE)}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === UserRole.EMPLOYEE ? 'bg-white dark:bg-slate-600 shadow-sm text-green-700 dark:text-green-300' : 'text-slate-400'}`}
              >
                {t.employee}
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Code Plantation</label>
              <input 
                type="text" value={plantationCode} onChange={e => setPlantationCode(e.target.value.toUpperCase())}
                placeholder="Ex: BST-001"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none dark:text-white focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.username}</label>
              <input 
                type="text" value={username} onChange={e => setUsername(e.target.value)} required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none dark:text-white focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.password}</label>
              <input 
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none dark:text-white focus:ring-2 focus:ring-green-500"
              />
            </div>

            {error && <p className="text-red-500 text-xs font-bold text-center animate-pulse">{error}</p>}

            <button 
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 mt-2"
            >
              Démarrer ma session
            </button>
          </form>
          
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Système Prêt pour l'Usage Hors-ligne</span>
            </div>
            <p className="text-center text-[10px] text-slate-400">
              Chaque modification est sauvegardée localement et synchronisée dès qu'une connexion est disponible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

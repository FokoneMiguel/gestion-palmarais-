
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
  const [showPassword, setShowPassword] = useState(false);
  const [plantationCode, setPlantationCode] = useState('');
  const [error, setError] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanCode = plantationCode.trim().toUpperCase();

    // 1. Vérifier si le code plantation existe dans la liste des utilisateurs chargés
    const usersInPlantation = users.filter(u => u.plantationId.trim().toUpperCase() === cleanCode || u.role === UserRole.SUPER_ADMIN);
    
    if (usersInPlantation.length === 0 && cleanCode !== 'SYSTEM') {
      setError(`Le code "${cleanCode}" est introuvable sur cet appareil.`);
      return;
    }

    // 2. Chercher l'utilisateur précis
    const user = users.find(u => {
      const sameName = u.username.toLowerCase().trim() === cleanUsername;
      const samePass = u.password?.trim() === cleanPassword;
      
      if (u.role === UserRole.SUPER_ADMIN) {
        return sameName && samePass;
      }
      
      const sameCode = u.plantationId.trim().toUpperCase() === cleanCode;
      return sameName && samePass && sameCode;
    });

    if (user) {
      onLogin(user);
    } else {
      // Diagnostic plus précis
      const nameExists = users.some(u => u.username.toLowerCase().trim() === cleanUsername && u.plantationId.toUpperCase() === cleanCode);
      if (!nameExists) {
        setError("Utilisateur inconnu pour ce code.");
      } else {
        setError("Mot de passe incorrect.");
      }
    }
  };

  const handleManualImport = () => {
    try {
      const decoded = JSON.parse(atob(importData));
      localStorage.setItem('plameraie_db_v3', JSON.stringify(decoded));
      window.location.reload();
    } catch (e) {
      alert("Code de synchronisation invalide.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 px-6 py-12 transition-colors font-sans overflow-hidden">
      <div className="fixed top-6 right-6 flex space-x-3 z-50">
        <button onClick={() => setShowImport(!showImport)} className="w-12 h-12 flex items-center justify-center text-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg">
          📲
        </button>
        <button onClick={onLanguageToggle} className="w-12 h-12 flex items-center justify-center text-[10px] font-black dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg">
          {language}
        </button>
        <button onClick={onThemeToggle} className="w-12 h-12 flex items-center justify-center text-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-600 to-green-800 rounded-[2rem] shadow-2xl text-5xl text-white font-black mb-4">P</div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">Plameraie BST</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-2">Accès Sécurisé Plantation</p>
        </div>

        {showImport ? (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-2xl border border-blue-100 animate-in zoom-in-95">
            <h3 className="font-black mb-4 dark:text-white">Synchronisation Directe</h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">Collez le code de synchronisation envoyé par le Super-Admin pour activer votre compte sur ce téléphone.</p>
            <textarea 
              value={importData} 
              onChange={e => setImportData(e.target.value)}
              placeholder="Collez le code ici..."
              className="w-full p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl text-[10px] font-mono mb-4 h-32 outline-none border-2 border-transparent focus:border-blue-500"
            />
            <button onClick={handleManualImport} className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg uppercase text-[10px] tracking-widest">Activer l'appareil</button>
            <button onClick={() => setShowImport(false)} className="w-full py-4 mt-2 text-slate-400 font-bold text-[10px]">Retour</button>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-white dark:border-slate-700 transition-colors">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Code Plantation</label>
                <input 
                  type="text" 
                  value={plantationCode} 
                  onChange={e => setPlantationCode(e.target.value)}
                  placeholder="PALM-XXX"
                  required
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 border-2 border-transparent focus:border-green-500 rounded-2xl outline-none dark:text-white font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Identifiant</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  required
                  placeholder="Nom d'utilisateur"
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 border-2 border-transparent focus:border-green-500 rounded-2xl outline-none dark:text-white font-bold"
                />
              </div>

              <div className="space-y-1 relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Mot de passe</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required
                    placeholder="••••••••"
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 border-2 border-transparent focus:border-green-500 rounded-2xl outline-none dark:text-white font-bold pr-14"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xl"
                  >
                    {showPassword ? '👁️' : '🕶️'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-100 dark:border-red-900/30 flex items-start space-x-3 animate-in shake duration-300">
                  <span className="text-lg">⚠️</span>
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-tight leading-tight pt-1">{error}</p>
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-green-700 hover:bg-green-800 text-white font-black py-5 rounded-2xl shadow-xl transition-all transform active:scale-95 uppercase tracking-widest text-[11px]"
              >
                Accéder au Système
              </button>
            </form>
          </div>
        )}
        
        <p className="mt-8 text-center text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] opacity-50">
          © 2025 Plameraie BST • Système Local Sécurisé
        </p>
      </div>
    </div>
  );
};

export default Login;

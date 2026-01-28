import React, { useState, useRef, useEffect } from 'react';
import { User, Notification, Plantation } from '../types';

interface HeaderProps {
  t: any;
  theme: 'light' | 'dark';
  language: 'FR' | 'EN';
  onThemeToggle: () => void;
  onLanguageToggle: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  user: User;
  notifications: Notification[];
  markAllRead: () => void;
  onHelpClick: () => void;
  onMenuToggle: () => void;
  currentPlantation?: Plantation;
}

const Header: React.FC<HeaderProps> = ({ 
  t, theme, language, onThemeToggle, onLanguageToggle, searchQuery, setSearchQuery, user, notifications, markAllRead, onHelpClick, onMenuToggle, currentPlantation
}) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-[140] flex items-center justify-between bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl px-4 md:px-8 py-4 border-b border-slate-100 dark:border-slate-700 transition-all shadow-sm">
      <div className="flex items-center space-x-4">
        {/* Bouton Menu Android-Optimized */}
        <button 
          onClick={onMenuToggle}
          className="md:hidden w-12 h-12 flex items-center justify-center bg-green-700 text-white rounded-2xl shadow-lg shadow-green-900/20 active:scale-90 transition-transform"
        >
          <span className="text-2xl">☰</span>
        </button>

        <div className="hidden sm:block">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Connecté à</p>
          <h2 className="text-sm font-black text-green-700 dark:text-green-400 tracking-tight">{currentPlantation?.name || 'BST System'}</h2>
        </div>
      </div>

      <div className="flex-1 max-w-[120px] md:max-w-xs hidden lg:block mx-8">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">🔍</span>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-none rounded-[1.2rem] focus:ring-4 focus:ring-green-500/10 text-xs dark:text-white transition-all font-bold"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <button 
          onClick={onHelpClick}
          className="w-11 h-11 md:w-auto md:px-5 md:py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 text-amber-600 transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center space-x-2 border border-transparent hover:border-amber-100"
        >
          <span className="text-xl">🎓</span> <span className="hidden md:inline">Aide</span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifs(!showNotifs)} 
            className={`w-11 h-11 md:w-12 md:h-12 rounded-2xl transition-all relative flex items-center justify-center border ${unreadCount > 0 ? 'bg-red-50 border-red-100 text-red-600 dark:bg-red-900/20 dark:border-red-800' : 'bg-slate-50 border-slate-100 dark:bg-slate-700/50 dark:border-slate-600 dark:text-slate-400 text-slate-500'}`}
          >
            <span className="text-xl">🔔</span>
            {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-slate-800 animate-bounce">{unreadCount}</span>}
          </button>

          {showNotifs && (
            <div className="fixed sm:absolute right-4 left-4 sm:left-auto top-[75px] sm:top-full mt-2 sm:w-[380px] bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 z-[250]">
              <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/20">
                <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-[10px]">{t.notifications}</h3>
                {unreadCount > 0 && <button onClick={markAllRead} className="text-[10px] text-green-600 font-black uppercase tracking-widest">{t.markAllRead}</button>}
              </div>
              <div className="max-h-[70vh] sm:max-h-[450px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                    <div className="p-16 text-center text-slate-300">
                        <span className="text-5xl block mb-4 opacity-20">📭</span>
                        <p className="text-[10px] font-black uppercase tracking-widest">{t.noNotifications}</p>
                    </div>
                ) : (
                  notifications.map(notif => (
                    <div key={notif.id} className={`p-6 border-b border-slate-50 dark:border-slate-700/50 flex space-x-4 ${!notif.isRead ? 'bg-green-50/20 dark:bg-green-900/10' : 'opacity-60'}`}>
                      <div className="text-2xl pt-1">{notif.type === 'SUCCESS' ? '✅' : notif.type === 'ALERT' ? '🚨' : 'ℹ️'}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-800 dark:text-slate-200 leading-tight">{notif.message}</p>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">{notif.date}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700/50 p-1.5 rounded-[1.2rem] border border-slate-200 dark:border-slate-600">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-green-800 text-white flex items-center justify-center font-black shadow-lg text-sm">
            {user.username.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
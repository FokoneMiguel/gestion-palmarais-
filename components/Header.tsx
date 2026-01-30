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
    <header className="sticky top-0 z-[140] flex items-center justify-between bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl px-4 md:px-8 py-3 border-b border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
      <div className="flex items-center space-x-3">
        <button 
          onClick={onMenuToggle}
          className="md:hidden w-11 h-11 flex items-center justify-center bg-green-700 text-white rounded-xl shadow-lg active:scale-90"
        >
          <span className="text-xl">☰</span>
        </button>

        <div className="hidden sm:block">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{language === 'FR' ? "DOMAINE" : "ESTATE"}</p>
          <h2 className="text-xs font-black text-green-700 dark:text-green-400 truncate max-w-[150px]">{currentPlantation?.name || 'BST Master'}</h2>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <button 
          onClick={onThemeToggle} 
          className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 flex items-center justify-center text-lg"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifs(!showNotifs)} 
            className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center border transition-all ${unreadCount > 0 ? 'bg-red-50 border-red-200 text-red-600' : 'bg-slate-50 border-slate-100 dark:bg-slate-700 dark:border-slate-600 text-slate-500'}`}
          >
            🔔
            {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-slate-800">{unreadCount}</span>}
          </button>

          {showNotifs && (
            <div className="fixed md:absolute right-4 left-4 md:left-auto top-20 md:top-full mt-2 md:w-80 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center border-b dark:border-slate-700">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.notifications}</span>
                <button onClick={markAllRead} className="text-[10px] text-green-600 font-black uppercase">{t.markAllRead}</button>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-8 text-center text-xs text-slate-400 font-bold uppercase">{t.noNotifications}</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-4 border-b dark:border-slate-700 flex space-x-3">
                      <span className="text-lg">{n.type === 'SUCCESS' ? '✅' : 'ℹ️'}</span>
                      <p className="text-xs font-bold dark:text-white leading-tight">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 p-1.5 rounded-xl border dark:border-slate-600">
          <div className="w-8 h-8 rounded-lg bg-green-700 text-white flex items-center justify-center font-black text-xs">
            {user.username.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
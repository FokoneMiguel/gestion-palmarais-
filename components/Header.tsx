
import React, { useState, useRef, useEffect } from 'react';
import { User, Notification } from '../types';

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
}

const Header: React.FC<HeaderProps> = ({ 
  t, theme, language, onThemeToggle, onLanguageToggle, searchQuery, setSearchQuery, user, notifications, markAllRead 
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
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl px-4 md:px-8 py-4 border-b border-slate-200 dark:border-slate-700 transition-all shadow-sm">
      <div className="flex-1 max-w-[200px] md:max-w-md">
        <div className="relative group">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-green-600 transition-colors">
            🔍
          </span>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-100/50 dark:bg-slate-700/50 border-none rounded-[1.5rem] focus:ring-4 focus:ring-green-500/10 text-sm transition-all dark:text-white placeholder:text-slate-400 font-bold"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Indicateur de Sync Équipe */}
        <div className="hidden lg:flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-2xl border border-green-100 dark:border-green-900/30">
          <div className="flex space-x-1">
             <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
             <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          </div>
          <span className="text-[9px] font-black text-green-700 dark:text-green-400 uppercase tracking-widest">Équipe Connectée</span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all relative ${showNotifs ? 'bg-green-100 text-green-700 dark:bg-green-900/40 shadow-inner' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
          >
            <span className="text-2xl">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full ring-4 ring-white dark:ring-slate-800 animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="fixed sm:absolute right-4 sm:right-0 mt-4 w-[calc(100vw-2rem)] sm:w-96 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-10 duration-500 z-[100]">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md">
                <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[10px] font-black uppercase tracking-widest text-green-600 hover:text-green-700 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-xl">
                    {t.markAllRead}
                  </button>
                )}
              </div>
              <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-16 text-center flex flex-col items-center">
                    <span className="text-5xl mb-4 opacity-10">🍃</span>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{t.noNotifications}</p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div key={notif.id} className={`p-6 border-b border-slate-50 dark:border-slate-700/50 flex space-x-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 ${!notif.isRead ? 'bg-green-50/50 dark:bg-green-900/10' : 'opacity-60 grayscale-[0.5]'}`}>
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center text-2xl shadow-sm shrink-0">
                        {notif.type === 'SUCCESS' ? '✅' : notif.type === 'WARNING' ? '⚠️' : notif.type === 'ALERT' ? '🚨' : 'ℹ️'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-800 dark:text-slate-100 leading-tight mb-1">{notif.message}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{notif.date}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={onLanguageToggle}
          className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 font-black text-[10px] tracking-widest transition-all"
        >
          {language}
        </button>

        <button 
          onClick={onThemeToggle}
          className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-all active:scale-90"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

        <div className="flex items-center space-x-3 pl-2 group">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-black text-slate-800 dark:text-white leading-none">{user.username}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{user.role}</p>
          </div>
          <div className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-white font-black shadow-lg shadow-green-900/20 border-2 border-white dark:border-slate-700 group-hover:scale-110 transition-transform">
            {user.username.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

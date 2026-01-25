
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
    <header className="sticky top-0 z-40 flex items-center justify-between bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg px-4 md:px-8 py-3 md:py-4 border-b border-slate-200 dark:border-slate-700 transition-colors">
      <div className="flex-1 max-w-xs md:max-w-md">
        <div className="relative group">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 group-focus-within:text-green-600 transition-colors">
            🔍
          </span>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-none rounded-2xl focus:ring-2 focus:ring-green-500 text-sm transition-all dark:text-white placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center space-x-1 md:space-x-4 ml-2">
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className={`p-2 rounded-xl transition-all relative ${showNotifs ? 'bg-green-100 text-green-700 dark:bg-green-900/40' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
          >
            <span className="text-xl">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white dark:ring-slate-800 animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-3 w-72 md:w-96 bg-white dark:bg-slate-800 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-50">
              <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter">{t.notifications}</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[10px] font-black uppercase tracking-widest text-green-600 hover:text-green-700">
                    {t.markAllRead}
                  </button>
                )}
              </div>
              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-10 text-center flex flex-col items-center">
                    <span className="text-4xl mb-3 opacity-20">🍃</span>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{t.noNotifications}</p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div key={notif.id} className={`p-4 border-b border-slate-50 dark:border-slate-700/50 flex space-x-3 transition-colors ${!notif.isRead ? 'bg-green-50/50 dark:bg-green-900/10' : 'opacity-70'}`}>
                      <div className="text-xl shrink-0">
                        {notif.type === 'SUCCESS' ? '✅' : notif.type === 'WARNING' ? '⚠️' : notif.type === 'ALERT' ? '🚨' : 'ℹ️'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">{notif.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase">{notif.date}</p>
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
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 font-black text-[10px] tracking-widest transition-colors min-w-[36px]"
        >
          {language}
        </button>

        <button 
          onClick={onThemeToggle}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-all active:scale-90"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 md:mx-2"></div>

        <div className="flex items-center space-x-3 pl-1">
          <div className="hidden md:block text-right">
            <p className="text-sm font-black text-slate-800 dark:text-white leading-none">{user.username}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{user.role}</p>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-white font-black shadow-lg shadow-green-900/20 border-2 border-white dark:border-slate-700">
            {user.username.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

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
  onHelpClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  t, theme, language, onThemeToggle, onLanguageToggle, searchQuery, setSearchQuery, user, notifications, markAllRead, onHelpClick 
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
    <header className="sticky top-0 z-30 flex items-center justify-between bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-4 md:px-8 py-4 border-b border-slate-200 dark:border-slate-700 transition-colors">
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">🔍</span>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-none rounded-xl focus:ring-2 focus:ring-green-500 text-sm dark:text-white transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <button 
          onClick={onHelpClick}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-400 transition-all font-black text-xs uppercase tracking-widest hidden md:flex items-center space-x-2"
        >
          <span>🎓</span> <span>Aide</span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setShowNotifs(!showNotifs)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors relative">
            <span className="text-xl">🔔</span>
            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-pulse">{unreadCount}</span>}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-white">{t.notifications}</h3>
                {unreadCount > 0 && <button onClick={markAllRead} className="text-xs text-green-600 font-semibold">{t.markAllRead}</button>}
              </div>
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? <div className="p-8 text-center text-slate-400 text-sm italic">{t.noNotifications}</div> : (
                  notifications.map(notif => (
                    <div key={notif.id} className={`p-4 border-b border-slate-50 dark:border-slate-700/50 flex space-x-3 ${!notif.isRead ? 'bg-green-50/50 dark:bg-green-900/10' : 'opacity-70'}`}>
                      <div className="text-xl">{notif.type === 'SUCCESS' ? '✅' : notif.type === 'WARNING' ? '⚠️' : notif.type === 'ALERT' ? '🚨' : 'ℹ️'}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-tight">{notif.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{notif.date}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button onClick={onLanguageToggle} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 font-bold text-sm transition-colors">{language}</button>
        <button onClick={onThemeToggle} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-all">{theme === 'light' ? '🌙' : '☀️'}</button>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

        <div className="flex items-center space-x-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">{user.username}</p>
            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{user.role}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-green-700 text-white flex items-center justify-center font-bold shadow-lg">
            {user.username.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
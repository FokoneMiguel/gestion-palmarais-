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
    <header className="sticky top-0 z-[60] flex items-center justify-between bg-white/90 dark:bg-slate-800/95 backdrop-blur-xl px-4 md:px-8 py-3 border-b border-slate-100 dark:border-slate-700 transition-all shadow-sm">
      <div className="flex-1 max-w-[120px] md:max-w-md hidden sm:block">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">🔍</span>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border-none rounded-2xl focus:ring-4 focus:ring-green-500/10 text-xs dark:text-white transition-all font-medium"
          />
        </div>
      </div>

      <div className="flex items-center space-x-1.5 md:space-x-4 ml-auto">
        <button 
          onClick={onHelpClick}
          className="p-2 md:p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 text-amber-600 transition-all font-black text-[10px] uppercase tracking-widest flex items-center space-x-1 border border-transparent hover:border-amber-100"
        >
          <span className="text-xl">🎓</span> <span className="hidden md:inline">Aide</span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifs(!showNotifs)} 
            className={`p-2.5 md:p-3 rounded-2xl transition-all relative border ${unreadCount > 0 ? 'bg-red-50 border-red-100 text-red-600 dark:bg-red-900/20 dark:border-red-800' : 'bg-slate-50 border-slate-100 dark:bg-slate-700/50 dark:border-slate-600 dark:text-slate-400 text-slate-500'}`}
          >
            <span className="text-xl">🔔</span>
            {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-slate-800 animate-bounce">{unreadCount}</span>}
          </button>

          {showNotifs && (
            <div className="fixed sm:absolute right-4 left-4 sm:left-auto top-[70px] sm:top-full mt-2 sm:w-[350px] bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 z-[200]">
              <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/20">
                <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-[9px]">{t.notifications}</h3>
                {unreadCount > 0 && <button onClick={markAllRead} className="text-[9px] text-green-600 font-black uppercase tracking-widest">{t.markAllRead}</button>}
              </div>
              <div className="max-h-[60vh] sm:max-h-[400px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                    <div className="p-12 text-center text-slate-300">
                        <span className="text-4xl block mb-2 opacity-20">📭</span>
                        <p className="text-[10px] font-black uppercase tracking-widest">{t.noNotifications}</p>
                    </div>
                ) : (
                  notifications.map(notif => (
                    <div key={notif.id} className={`p-5 border-b border-slate-50 dark:border-slate-700/50 flex space-x-4 ${!notif.isRead ? 'bg-green-50/20 dark:bg-green-900/10' : 'opacity-60'}`}>
                      <div className="text-2xl pt-1">{notif.type === 'SUCCESS' ? '✅' : notif.type === 'ALERT' ? '🚨' : 'ℹ️'}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">{notif.message}</p>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{notif.date}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-700/50 p-1.5 rounded-[1.2rem] border border-slate-100 dark:border-slate-600">
          <div className="hidden lg:block text-right mr-1">
            <p className="text-[10px] font-black text-slate-800 dark:text-white leading-tight uppercase tracking-tight">{user.username}</p>
            <p className="text-[8px] text-slate-400 uppercase font-black">{user.role}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-600 to-green-800 text-white flex items-center justify-center font-black shadow-lg text-sm">
            {user.username.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
import React, { useState } from 'react';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  t: any;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userRole, t, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: '📊', restricted: false },
    { id: 'creation', label: t.creation, icon: '🌱', restricted: false },
    { id: 'maintenance', label: t.maintenance, icon: '🛠️', restricted: false },
    { id: 'harvest', label: t.harvest, icon: '🚜', restricted: false },
    { id: 'production', label: t.production, icon: '🏭', restricted: false },
    { id: 'packaging', label: t.packaging, icon: '📦', restricted: false },
    { id: 'sales', label: t.sales, icon: '💰', restricted: false },
    { id: 'cash', label: t.cash, icon: '🏦', restricted: true },
    { id: 'stats', label: t.stats, icon: '📈', restricted: true },
    { id: 'tutorial', label: t.tutorial, icon: '🎓', restricted: false },
    { id: 'users', label: t.users, icon: '👥', restricted: true },
  ];

  const filteredItems = menuItems.filter(item => {
    if (userRole === UserRole.SUPER_ADMIN) return true;
    if (userRole === UserRole.ADMIN) return true;
    return !item.restricted;
  });

  return (
    <>
      {/* Overlay pour Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Bouton Toggle Mobile amélioré */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-[100] md:hidden bg-green-700 text-white w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center text-2xl transform active:scale-90 transition-transform"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      <aside className={`
        fixed inset-y-0 left-0 z-[100] w-72 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700
        transform transition-all duration-300 ease-in-out md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none'}
      `}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center space-x-3 px-2 py-4 mb-8">
            <div className="w-12 h-12 bg-green-700 rounded-2xl flex items-center justify-center text-2xl text-white font-black shadow-lg shadow-green-900/20">P</div>
            <div>
              <h1 className="text-xl font-black text-slate-800 dark:text-white tracking-tighter">Plameraie BST</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master System</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
            {filteredItems.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all
                  ${activeTab === item.id 
                    ? 'bg-green-700 text-white shadow-lg shadow-green-900/20 scale-[1.02]' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-black uppercase tracking-tight">{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-700 mt-6 space-y-4">
            <div className="px-4">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Session</p>
                <div className="flex items-center space-x-2 mt-1">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <p className="text-xs font-black text-slate-800 dark:text-slate-200">{userRole}</p>
                </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-black uppercase text-[10px] tracking-widest transition-colors"
            >
              <span className="text-xl">🚪</span>
              <span>{t.logout}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
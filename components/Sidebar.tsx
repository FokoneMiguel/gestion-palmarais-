import React from 'react';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  t: any;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userRole, t, onLogout, isOpen, setIsOpen }) => {
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
      {/* Overlay Mobile Plein Écran */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[250] md:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-[260] w-[85%] sm:w-80 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700
        transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) md:relative md:translate-x-0 md:w-72
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0 shadow-none'}
      `}>
        <div className="h-full flex flex-col p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-700 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl text-white font-black shadow-xl shadow-green-900/30">P</div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">BST</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Palmeraie Pro</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="md:hidden w-11 h-11 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-xl"
            >
              ✕
            </button>
          </div>

          <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar pr-2">
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
                  w-full flex items-center space-x-5 px-5 py-4 rounded-[1.8rem] transition-all
                  ${activeTab === item.id 
                    ? 'bg-green-700 text-white shadow-xl shadow-green-900/40 scale-[1.03]' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}
                `}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm font-black uppercase tracking-wider">{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-700 mt-6 space-y-4 sm:space-y-6">
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-5 px-6 py-4 rounded-[1.8rem] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-black uppercase text-[10px] tracking-[0.2em] transition-all border border-transparent hover:border-red-100"
            >
              <span className="text-2xl">🚪</span>
              <span>{t.logout}</span>
            </button>
            
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Système</p>
               <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <p className="text-[11px] font-black text-slate-700 dark:text-slate-300 truncate">{userRole}</p>
               </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
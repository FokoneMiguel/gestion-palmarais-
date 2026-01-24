
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

  // Définition des accès : certains menus sont réservés aux ADMIN ou SUPER_ADMIN
  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: '📊', restricted: false },
    { id: 'creation', label: t.creation, icon: '🌱', restricted: false },
    { id: 'maintenance', label: t.maintenance, icon: '🛠️', restricted: false },
    { id: 'harvest', label: t.harvest, icon: '🚜', restricted: false },
    { id: 'production', label: t.production, icon: '🏭', restricted: false },
    { id: 'packaging', label: t.packaging, icon: '📦', restricted: false },
    { id: 'sales', label: t.sales, icon: '💰', restricted: false },
    { id: 'cash', label: t.cash, icon: '🏦', restricted: true }, // Caché pour employé
    { id: 'stats', label: t.stats, icon: '📈', restricted: true }, // Caché pour employé
    { id: 'tutorial', label: t.tutorial, icon: '🎓', restricted: false },
    { id: 'users', label: t.users, icon: '👥', restricted: true }, // Caché pour employé
  ];

  // Un employé ne peut voir que les menus non-restreints
  const filteredItems = menuItems.filter(item => {
    if (userRole === UserRole.SUPER_ADMIN) return true;
    if (userRole === UserRole.ADMIN) return true;
    return !item.restricted; // Si c'est un EMPLOYEE, on ne garde que les non-restreints
  });

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 md:hidden bg-green-700 text-white p-3 rounded-full shadow-lg"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700
        transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center space-x-2 px-2 py-6 mb-4">
            <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center text-xl text-white font-bold">P</div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">Plameraie BST</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Système de Gestion</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1">
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
                  w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors
                  ${activeTab === item.id 
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
            <div className="px-3 py-2 mb-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Session</p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-300 truncate">{userRole}</p>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <span className="text-lg">🚪</span>
              <span className="text-sm font-medium">{t.logout}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

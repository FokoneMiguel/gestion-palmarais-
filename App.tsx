
import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRole, AppState, Activity, Sale, CashMovement, Notification } from './types';
import { TRANSLATIONS } from './constants';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './components/Login';
import ActivityModule from './components/ActivityModule';
import SalesModule from './components/SalesModule';
import CashModule from './components/CashModule';
import StatsModule from './components/StatsModule';
import UserManagement from './components/UserManagement';
import ChatBot from './components/ChatBot';
import TutorialModule from './components/TutorialModule';
import ProductionModule from './components/ProductionModule';
import { syncDataWithServer } from './syncService';

const INITIAL_USERS: User[] = [
  { id: '1', username: 'admin', role: UserRole.ADMIN, password: 'admin', plantationId: 'BST-001' },
  { id: '2', username: 'worker', role: UserRole.EMPLOYEE, password: 'worker', plantationId: 'BST-001' }
];

const App: React.FC = () => {
  const getTabFromHash = () => window.location.hash.replace('#', '') || 'dashboard';

  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('plameraie_state_saas');
    if (saved) {
        return JSON.parse(saved);
    }
    return {
      users: INITIAL_USERS,
      currentUser: null,
      activities: [],
      sales: [],
      cashMovements: [],
      notifications: [],
      language: 'FR',
      theme: 'light',
      isOnline: navigator.onLine,
      isSyncing: false
    };
  });

  const [activeTab, setActiveTab] = useState<string>(getTabFromHash());
  const [searchQuery, setSearchQuery] = useState('');

  // Détection de connexion
  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Synchronisation automatique quand on revient en ligne
  useEffect(() => {
    if (state.isOnline && !state.isSyncing) {
      syncDataWithServer(state, setState);
    }
  }, [state.isOnline, state.activities, state.sales, state.cashMovements]);

  useEffect(() => {
    localStorage.setItem('plameraie_state_saas', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  useEffect(() => {
    const handleHashChange = () => setActiveTab(getTabFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const t = TRANSLATIONS[state.language];

  // FILTRAGE DES DONNÉES PAR PLANTATION (Multi-Propriétaire)
  const filteredActivities = useMemo(() => 
    state.activities.filter(a => a.plantationId === state.currentUser?.plantationId),
  [state.activities, state.currentUser]);

  const filteredSales = useMemo(() => 
    state.sales.filter(s => s.plantationId === state.currentUser?.plantationId),
  [state.sales, state.currentUser]);

  const filteredCash = useMemo(() => 
    state.cashMovements.filter(c => c.plantationId === state.currentUser?.plantationId),
  [state.cashMovements, state.currentUser]);

  const handleLogin = (user: User) => {
    setState(prev => ({ ...prev, currentUser: user }));
    addNotification('INFO', `${t.login} : ${user.username}`);
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
    window.location.hash = '';
  };

  const addNotification = (type: Notification['type'], message: string) => {
    const newNotif: Notification = {
      id: Date.now().toString(),
      type,
      message,
      date: new Date().toLocaleString(),
      isRead: false
    };
    setState(prev => ({
      ...prev,
      notifications: [newNotif, ...prev.notifications].slice(0, 50)
    }));
  };

  const addActivity = (activity: Omit<Activity, 'id' | 'plantationId' | 'updatedAt'>) => {
    const newActivity: Activity = { 
      ...activity, 
      id: Date.now().toString(), 
      plantationId: state.currentUser!.plantationId,
      updatedAt: Date.now(),
      synced: false
    };
    
    setState(prev => ({
        ...prev,
        activities: [newActivity, ...prev.activities],
        cashMovements: activity.cost > 0 ? [
            {
              id: `cm-${Date.now()}`,
              plantationId: state.currentUser!.plantationId,
              date: activity.date,
              type: 'OUT' as const,
              amount: activity.cost,
              reason: `${activity.label} (${activity.zone})`,
              updatedAt: Date.now(),
              synced: false
            },
            ...prev.cashMovements
          ] : prev.cashMovements
    }));
    
    addNotification('SUCCESS', `${t[activity.type.toLowerCase()]} : ${activity.label}`);
  };

  const addSale = (sale: Omit<Sale, 'id' | 'plantationId' | 'updatedAt'>) => {
    const newSale: Sale = { 
        ...sale, 
        id: Date.now().toString(), 
        plantationId: state.currentUser!.plantationId,
        updatedAt: Date.now(),
        synced: false
    };
    setState(prev => ({
      ...prev,
      sales: [newSale, ...prev.sales],
      cashMovements: [
        {
          id: `cm-s-${Date.now()}`,
          plantationId: state.currentUser!.plantationId,
          date: sale.date,
          type: 'IN' as const,
          amount: sale.total,
          reason: `Vente: ${sale.product}`,
          updatedAt: Date.now(),
          synced: false
        },
        ...prev.cashMovements
      ]
    }));
    addNotification('SUCCESS', `${t.sales} : ${sale.product}`);
  };

  if (!state.currentUser) {
    return (
      <Login 
        onLogin={handleLogin} 
        users={state.users} 
        t={t} 
        theme={state.theme} 
        language={state.language}
        onLanguageToggle={() => setState(p => ({ ...p, language: p.language === 'FR' ? 'EN' : 'FR' }))}
        onThemeToggle={() => setState(p => ({ ...p, theme: p.theme === 'light' ? 'dark' : 'light' }))}
      />
    );
  }

  const renderContent = () => {
    const scopedState = { ...state, activities: filteredActivities, sales: filteredSales, cashMovements: filteredCash };
    switch (activeTab) {
      case 'dashboard': return <Dashboard state={scopedState} t={t} />;
      case 'creation': return <ActivityModule type="CREATION" state={scopedState} onAdd={addActivity} t={t} />;
      case 'maintenance': return <ActivityModule type="MAINTENANCE" state={scopedState} onAdd={addActivity} t={t} />;
      case 'harvest': return <ActivityModule type="HARVEST" state={scopedState} onAdd={addActivity} t={t} />;
      case 'production': return <ProductionModule state={scopedState} onAdd={addActivity} t={t} />;
      case 'packaging': return <ActivityModule type="PACKAGING" state={scopedState} onAdd={addActivity} t={t} />;
      case 'sales': return <SalesModule state={scopedState} onAdd={addSale} t={t} />;
      case 'cash': return <CashModule state={scopedState} t={t} />;
      case 'stats': return <StatsModule state={scopedState} t={t} />;
      case 'users': return <UserManagement state={state} setState={setState} t={t} />;
      case 'tutorial': return <TutorialModule t={t} />;
      default: return <Dashboard state={scopedState} t={t} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={tab => window.location.hash = tab} 
        userRole={state.currentUser.role} 
        t={t} 
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Barre d'état Offline/Sync */}
        <div className={`h-1 w-full absolute top-0 z-50 transition-all duration-1000 ${state.isSyncing ? 'bg-amber-500 animate-pulse' : state.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
        {!state.isOnline && (
          <div className="bg-red-500 text-white text-[10px] font-bold py-1 px-4 text-center uppercase tracking-widest">
            Mode Hors-ligne - Les données seront synchronisées plus tard
          </div>
        )}

        <Header 
          t={t} theme={state.theme} language={state.language} 
          onThemeToggle={() => setState(p => ({ ...p, theme: p.theme === 'light' ? 'dark' : 'light' }))}
          onLanguageToggle={() => setState(p => ({ ...p, language: p.language === 'FR' ? 'EN' : 'FR' }))}
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          user={state.currentUser} notifications={state.notifications}
          markAllRead={() => setState(p => ({ ...p, notifications: p.notifications.map(n => ({ ...n, isRead: true })) }))}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {renderContent()}
        </main>
      </div>

      <ChatBot state={state} t={t} />
    </div>
  );
};

export default App;

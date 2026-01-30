import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRole, AppState, Activity, Sale, CashMovement, Notification, Plantation } from './types.ts';
import { TRANSLATIONS } from './constants.tsx';
import Dashboard from './components/Dashboard.tsx';
import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import Login from './components/Login.tsx';
import ActivityModule from './components/ActivityModule.tsx';
import SalesModule from './components/SalesModule.tsx';
import CashModule from './components/CashModule.tsx';
import StatsModule from './components/StatsModule.tsx';
import UserManagement from './components/UserManagement.tsx';
import ChatBot from './components/ChatBot.tsx';
import TutorialModule from './components/TutorialModule.tsx';
import ProductionModule from './components/ProductionModule.tsx';
import SuperAdminModule from './components/SuperAdminModule.tsx';
import Toast from './components/Toast.tsx';
import { syncDataWithServer } from './syncService.ts';

const INITIAL_USERS: User[] = [
  { id: 'master-01', username: 'MiguelF', role: UserRole.SUPER_ADMIN, password: 'MF-05', plantationId: 'SYSTEM' },
];

const INITIAL_PLANTATIONS: Plantation[] = [
  { id: 'SYSTEM', name: 'Plameraie BST Master', ownerName: 'MiguelF', contactEmail: 'master@palmeraie.com', status: 'ACTIVE', expiryDate: '2099-01-01' },
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('plameraie_db_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Erreur de lecture Storage", e);
    }
    return {
      plantations: INITIAL_PLANTATIONS,
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

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<{id: string, message: string, type: 'success' | 'error' | 'info'}[]>([]);

  const t = TRANSLATIONS[state.language];

  // Fix critique : Appliquer le thème immédiatement à la racine
  useEffect(() => {
    const root = window.document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.theme]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'date' | 'isRead'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      isRead: false
    };
    setState(prev => ({ ...prev, notifications: [newNotif, ...prev.notifications] }));
  };

  useEffect(() => {
    localStorage.setItem('plameraie_db_v3', JSON.stringify(state));
  }, [state]);

  const currentPlantation = useMemo(() => 
    state.plantations.find(p => p.id === state.currentUser?.plantationId),
  [state.plantations, state.currentUser]);

  const isAccessSuspended = state.currentUser?.role !== UserRole.SUPER_ADMIN && currentPlantation?.status === 'SUSPENDED';

  const handleLogin = (user: User) => {
    setState(prev => ({ ...prev, currentUser: user }));
    addToast(state.language === 'FR' ? `Bienvenue, ${user.username} !` : `Welcome, ${user.username}!`, 'success');
    if (user.role === UserRole.SUPER_ADMIN) {
        setActiveTab('superadmin');
    } else {
        setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
    addToast(state.language === 'FR' ? "Déconnexion réussie" : "Logged out successfully", 'info');
  };

  const addActivity = (activity: any) => {
    if (isAccessSuspended) return;
    const newActivity = { ...activity, id: Date.now().toString(), plantationId: state.currentUser!.plantationId, updatedAt: Date.now(), synced: false };
    setState(prev => ({ ...prev, activities: [newActivity, ...prev.activities] }));
    addNotification({ type: 'SUCCESS', message: `${state.currentUser!.username} : ${activity.label}` });
    addToast(state.language === 'FR' ? "Opération enregistrée !" : "Operation saved!");
  };

  const deleteActivity = (id: string) => {
    const confirmMsg = state.language === 'FR' ? "Supprimer cette opération ?" : "Delete this operation?";
    if (window.confirm(confirmMsg)) {
      setState(prev => ({ ...prev, activities: prev.activities.filter(a => a.id !== id) }));
      addToast(state.language === 'FR' ? "Supprimé avec succès" : "Deleted successfully", 'info');
    }
  };

  const onAddSale = (sale: any) => {
    if (isAccessSuspended) return;
    const newSale = { ...sale, id: Date.now().toString(), plantationId: state.currentUser!.plantationId, updatedAt: Date.now(), synced: false };
    setState(prev => ({ ...prev, sales: [newSale, ...prev.sales] }));
    addToast(state.language === 'FR' ? "Vente enregistrée !" : "Sale recorded!");
  };

  const deleteSale = (id: string) => {
    const confirmMsg = state.language === 'FR' ? "Supprimer cette vente ?" : "Delete this sale?";
    if (window.confirm(confirmMsg)) {
      setState(prev => ({ ...prev, sales: prev.sales.filter(s => s.id !== id) }));
      addToast(state.language === 'FR' ? "Vente annulée" : "Sale cancelled", 'info');
    }
  };

  const renderContent = () => {
    if (state.currentUser?.role === UserRole.SUPER_ADMIN) {
        return <SuperAdminModule state={state} setState={setState} t={t} />;
    }

    if (isAccessSuspended) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl animate-in zoom-in">
                <div className="w-32 h-32 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-7xl mb-8">🛑</div>
                <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">Accès Suspendu</h2>
                <p className="text-slate-500 mt-6 max-w-md text-lg">Contactez <b>MiguelF</b> pour régulariser votre abonnement.</p>
                <button onClick={handleLogout} className="mt-10 px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Déconnexion</button>
            </div>
        );
    }

    const scopedState = { ...state, 
        activities: state.activities.filter(a => a.plantationId === state.currentUser?.plantationId), 
        sales: state.sales.filter(s => s.plantationId === state.currentUser?.plantationId), 
        cashMovements: state.cashMovements.filter(c => c.plantationId === state.currentUser?.plantationId) 
    };
    
    switch (activeTab) {
      case 'dashboard': return <Dashboard state={scopedState} t={t} />;
      case 'creation': return <ActivityModule type="CREATION" state={scopedState} onAdd={addActivity} onDelete={deleteActivity} t={t} />;
      case 'maintenance': return <ActivityModule type="MAINTENANCE" state={scopedState} onAdd={addActivity} onDelete={deleteActivity} t={t} />;
      case 'harvest': return <ActivityModule type="HARVEST" state={scopedState} onAdd={addActivity} onDelete={deleteActivity} t={t} />;
      case 'production': return <ProductionModule state={scopedState} onAdd={addActivity} onDelete={deleteActivity} t={t} />;
      case 'packaging': return <ActivityModule type="PACKAGING" state={scopedState} onAdd={addActivity} onDelete={deleteActivity} t={t} />;
      case 'sales': return <SalesModule state={scopedState} onAdd={onAddSale} onDelete={deleteSale} t={t} />;
      case 'cash': return <CashModule state={scopedState} t={t} />;
      case 'stats': return <StatsModule state={scopedState} t={t} />;
      case 'users': return <UserManagement state={state} setState={setState} t={t} />;
      case 'tutorial': return <TutorialModule t={t} />;
      default: return <Dashboard state={scopedState} t={t} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {!state.currentUser ? (
        <Login 
          onLogin={handleLogin} users={state.users} t={t} theme={state.theme} language={state.language}
          onLanguageToggle={() => setState(p => ({ ...p, language: p.language === 'FR' ? 'EN' : 'FR' }))}
          onThemeToggle={() => setState(p => ({ ...p, theme: p.theme === 'light' ? 'dark' : 'light' }))}
          addToast={addToast}
        />
      ) : (
        <>
          <Sidebar 
            activeTab={activeTab} setActiveTab={setActiveTab} 
            userRole={state.currentUser.role} t={t} onLogout={handleLogout} 
            isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}
          />
          <div className="flex-1 flex flex-col min-w-0 relative">
            <Header 
              t={t} theme={state.theme} language={state.language} 
              onThemeToggle={() => {
                const newTheme = state.theme === 'light' ? 'dark' : 'light';
                setState(p => ({ ...p, theme: newTheme }));
              }}
              onLanguageToggle={() => {
                const newLang = state.language === 'FR' ? 'EN' : 'FR';
                setState(p => ({ ...p, language: newLang }));
              }}
              searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              user={state.currentUser} notifications={state.notifications}
              markAllRead={() => setState(p => ({ ...p, notifications: p.notifications.map(n => ({ ...n, isRead: true })) }))}
              onHelpClick={() => setActiveTab('tutorial')}
              onMenuToggle={() => setIsSidebarOpen(true)}
              currentPlantation={currentPlantation}
            />
            <main className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
              {renderContent()}
            </main>
          </div>
          <ChatBot state={state} t={t} />
        </>
      )}
      
      {/* Toast Container Global */}
      <div className="fixed bottom-4 left-4 z-[500] flex flex-col space-y-2 pointer-events-none">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} />
        ))}
      </div>
    </div>
  );
};

export default App;
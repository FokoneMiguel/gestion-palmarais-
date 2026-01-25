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

const INITIAL_USERS: User[] = [
  { id: 'master-01', username: 'MiguelF', role: UserRole.SUPER_ADMIN, password: 'MF-05', plantationId: 'SYSTEM' },
];

const INITIAL_PLANTATIONS: Plantation[] = [
  { id: 'SYSTEM', name: 'Plameraie BST Master', ownerName: 'MiguelF', contactEmail: 'master@palmeraie.com', status: 'ACTIVE', expiryDate: '2099-01-01' },
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('plameraie_db_v3');
    if (saved) return JSON.parse(saved);
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
  const [searchQuery, setSearchQuery] = useState('');
  const t = TRANSLATIONS[state.language];

  // Magic Configuration Link Detection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const configData = params.get('config');
    if (configData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(configData))));
        setState(prev => ({
          ...prev,
          plantations: [...prev.plantations, ...(decoded.plantations || [])].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i),
          users: [...prev.users, ...(decoded.users || [])].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i),
        }));
        window.history.replaceState({}, document.title, window.location.pathname);
        alert("✅ Configuration activée avec succès !");
      } catch (e) {
        console.error("Erreur configuration", e);
      }
    }
  }, []);

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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  const currentPlantation = useMemo(() => 
    state.plantations.find(p => p.id === state.currentUser?.plantationId),
  [state.plantations, state.currentUser]);

  const isAccessSuspended = state.currentUser?.role !== UserRole.SUPER_ADMIN && currentPlantation?.status === 'SUSPENDED';

  const handleLogin = (user: User) => {
    setState(prev => ({ ...prev, currentUser: user }));
    if (user.role === UserRole.SUPER_ADMIN) {
        setActiveTab('superadmin');
    } else {
        setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
  };

  const addActivity = (activity: any) => {
    if (isAccessSuspended) return;
    const newActivity = { ...activity, id: Date.now().toString(), plantationId: state.currentUser!.plantationId, updatedAt: Date.now(), synced: false };
    setState(prev => ({ ...prev, activities: [newActivity, ...prev.activities] }));
    addNotification({ type: 'SUCCESS', message: `${state.currentUser!.username} : ${activity.label}` });
  };

  const onAddSale = (sale: any) => {
    if (isAccessSuspended) return;
    const newSale = { ...sale, id: Date.now().toString(), plantationId: state.currentUser!.plantationId, updatedAt: Date.now(), synced: false };
    setState(prev => ({ ...prev, sales: [newSale, ...prev.sales] }));
    addNotification({ type: 'ALERT', message: `Vente : ${sale.quantity}L (${state.currentUser!.username})` });
  };

  const renderContent = () => {
    if (state.currentUser?.role === UserRole.SUPER_ADMIN) {
        return <SuperAdminModule state={state} setState={setState} t={t} />;
    }

    if (isAccessSuspended) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl animate-in zoom-in">
                <div className="w-32 h-32 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-7xl mb-8">🛑</div>
                <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">Abonnement Expiré</h2>
                <p className="text-slate-500 mt-6 max-w-md text-lg">L'accès à votre plantation est actuellement suspendu. Veuillez contacter <b>MiguelF</b> pour régulariser votre compte et activer vos services.</p>
                <button onClick={handleLogout} className="mt-10 px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Retour à la connexion</button>
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
      case 'creation': return <ActivityModule type="CREATION" state={scopedState} onAdd={addActivity} t={t} />;
      case 'maintenance': return <ActivityModule type="MAINTENANCE" state={scopedState} onAdd={addActivity} t={t} />;
      case 'harvest': return <ActivityModule type="HARVEST" state={scopedState} onAdd={addActivity} t={t} />;
      case 'production': return <ProductionModule state={scopedState} onAdd={addActivity} t={t} />;
      case 'packaging': return <ActivityModule type="PACKAGING" state={scopedState} onAdd={addActivity} t={t} />;
      case 'sales': return <SalesModule state={scopedState} onAdd={onAddSale} t={t} />;
      case 'cash': return <CashModule state={scopedState} t={t} />;
      case 'stats': return <StatsModule state={scopedState} t={t} />;
      case 'users': return <UserManagement state={state} setState={setState} t={t} />;
      case 'tutorial': return <TutorialModule t={t} />;
      default: return <Dashboard state={scopedState} t={t} />;
    }
  };

  if (!state.currentUser) {
    return (
      <Login 
        onLogin={handleLogin} users={state.users} t={t} theme={state.theme} language={state.language}
        onLanguageToggle={() => setState(p => ({ ...p, language: p.language === 'FR' ? 'EN' : 'FR' }))}
        onThemeToggle={() => setState(p => ({ ...p, theme: p.theme === 'light' ? 'dark' : 'light' }))}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={state.currentUser.role} t={t} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Header 
          t={t} theme={state.theme} language={state.language} 
          onThemeToggle={() => setState(p => ({ ...p, theme: p.theme === 'light' ? 'dark' : 'light' }))}
          onLanguageToggle={() => setState(p => ({ ...p, language: p.language === 'FR' ? 'EN' : 'FR' }))}
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          user={state.currentUser} notifications={state.notifications}
          markAllRead={() => setState(p => ({ ...p, notifications: p.notifications.map(n => ({ ...n, isRead: true })) }))}
          onHelpClick={() => setActiveTab('tutorial')}
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
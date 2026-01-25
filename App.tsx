
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
import { syncDataWithServer } from './syncService.ts';

const INITIAL_USERS: User[] = [
  { id: 'master-01', username: 'MiguelF', role: UserRole.SUPER_ADMIN, password: 'MF-05', plantationId: 'SYSTEM' },
  { id: 'admin-bst', username: 'admin', role: UserRole.ADMIN, password: 'admin', plantationId: 'BST-001' },
  { id: 'worker-bst', username: 'worker', role: UserRole.EMPLOYEE, password: 'worker', plantationId: 'BST-001' }
];

const INITIAL_PLANTATIONS: Plantation[] = [
  { id: 'BST-001', name: 'Plameraie de Démo BST', ownerName: 'Client Démo', contactEmail: 'demo@palmeraie.com', status: 'ACTIVE', expiryDate: '2026-01-01' }
];

const App: React.FC = () => {
  const getTabFromHash = () => window.location.hash.replace('#', '') || 'dashboard';

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

  const [activeTab, setActiveTab] = useState<string>(getTabFromHash());
  const [searchQuery, setSearchQuery] = useState('');
  const [importStatus, setImportStatus] = useState<{success: boolean, message: string} | null>(null);

  // LOGIQUE DU LIEN MAGIQUE (Auto-Config)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const configData = urlParams.get('config');
    
    if (configData) {
      try {
        const decoded = JSON.parse(atob(configData));
        setState(prev => {
          // Fusion intelligente : on ne garde que MiguelF (SuperAdmin) et on ajoute les nouvelles données
          const masterAccount = prev.users.find(u => u.role === UserRole.SUPER_ADMIN);
          const newUsers = decoded.users || [];
          const mergedUsers = masterAccount ? [masterAccount, ...newUsers.filter((u: User) => u.role !== UserRole.SUPER_ADMIN)] : newUsers;
          
          const newState = {
            ...prev,
            plantations: decoded.plantations || prev.plantations,
            users: mergedUsers,
            activities: decoded.activities || prev.activities,
            sales: decoded.sales || prev.sales,
            cashMovements: decoded.cashMovements || prev.cashMovements
          };
          localStorage.setItem('plameraie_db_v3', JSON.stringify(newState));
          return newState;
        });
        setImportStatus({ success: true, message: "Configuration reçue ! Vous pouvez vous connecter." });
        // Nettoyer l'URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        setImportStatus({ success: false, message: "Le lien de configuration est invalide." });
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('plameraie_db_v3', JSON.stringify(state));
  }, [state]);

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

  useEffect(() => {
    if (state.isOnline && !state.isSyncing && state.currentUser) syncDataWithServer(state, setState);
  }, [state.isOnline, state.activities, state.sales, state.cashMovements, state.currentUser]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  const t = TRANSLATIONS[state.language];

  const currentPlantation = useMemo(() => 
    state.plantations.find(p => p.id === state.currentUser?.plantationId),
  [state.plantations, state.currentUser]);

  const isAccessSuspended = state.currentUser?.role !== UserRole.SUPER_ADMIN && currentPlantation?.status === 'SUSPENDED';

  const handleLogin = (user: User) => {
    setState(prev => ({ ...prev, currentUser: user }));
    window.location.hash = user.role === UserRole.SUPER_ADMIN ? 'superadmin' : 'dashboard';
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
    window.location.hash = '';
  };

  const addActivity = (activity: any) => {
    if (isAccessSuspended) return;
    const newActivity = { 
        ...activity, 
        id: Date.now().toString(), 
        plantationId: state.currentUser!.plantationId, 
        updatedAt: Date.now(), 
        synced: false 
    };
    setState(prev => ({ ...prev, activities: [newActivity, ...prev.activities] }));
  };

  const renderContent = () => {
    if (state.currentUser?.role === UserRole.SUPER_ADMIN) {
        return <SuperAdminModule state={state} setState={setState} />;
    }

    if (isAccessSuspended) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-5xl mb-6">🔒</div>
                <h2 className="text-3xl font-black text-slate-800 dark:text-white">Accès Suspendu</h2>
                <p className="text-slate-500 mt-4 max-w-md">Veuillez contacter MiguelF pour régulariser votre situation.</p>
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
      case 'sales': return <SalesModule state={scopedState} onAdd={(s: any) => { if (!isAccessSuspended) { const ns = { ...s, id: Date.now().toString(), plantationId: state.currentUser!.plantationId, updatedAt: Date.now(), synced: false }; setState(p => ({ ...p, sales: [ns, ...p.sales] })) }}} t={t} />;
      case 'cash': return <CashModule state={scopedState} t={t} />;
      case 'stats': return <StatsModule state={scopedState} t={t} />;
      case 'users': return <UserManagement state={state} setState={setState} t={t} />;
      case 'tutorial': return <TutorialModule t={t} />;
      default: return <Dashboard state={scopedState} t={t} />;
    }
  };

  if (!state.currentUser) {
    return (
      <>
        {importStatus && (
          <div className={`fixed top-0 left-0 right-0 z-[100] p-4 text-center text-white font-black uppercase text-xs tracking-widest animate-in slide-in-from-top duration-500 ${importStatus.success ? 'bg-green-600' : 'bg-red-600'}`}>
            {importStatus.message}
            <button onClick={() => setImportStatus(null)} className="ml-4 underline">Fermer</button>
          </div>
        )}
        <Login 
          onLogin={handleLogin} users={state.users} t={t} theme={state.theme} language={state.language}
          onThemeToggle={() => setState(p => ({ ...p, theme: p.theme === 'light' ? 'dark' : 'light' }))}
          onLanguageToggle={() => setState(p => ({ ...p, language: p.language === 'FR' ? 'EN' : 'FR' }))}
        />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <Sidebar activeTab={activeTab} setActiveTab={tab => window.location.hash = tab} userRole={state.currentUser.role} t={t} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Header t={t} theme={state.theme} language={state.language} onThemeToggle={() => setState(p => ({ ...p, theme: p.theme === 'light' ? 'dark' : 'light' }))} onLanguageToggle={() => setState(p => ({ ...p, language: p.language === 'FR' ? 'EN' : 'FR' }))} searchQuery={searchQuery} setSearchQuery={setSearchQuery} user={state.currentUser} notifications={state.notifications} markAllRead={() => {}} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {renderContent()}
        </main>
      </div>
      <ChatBot state={state} t={t} />
    </div>
  );
};

export default App;


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
  const [inspectedPlantationId, setInspectedPlantationId] = useState<string | null>(null);

  const t = TRANSLATIONS[state.language];

  useEffect(() => {
    const root = window.document.documentElement;
    if (state.theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [state.theme]);

  useEffect(() => {
    localStorage.setItem('plameraie_db_v3', JSON.stringify(state));
  }, [state]);

  // INGESTION CRITIQUE DU LIEN DE CONFIGURATION
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const configBase64 = urlParams.get('config');

    if (configBase64) {
      try {
        const decodedString = decodeURIComponent(escape(atob(configBase64)));
        const configData = JSON.parse(decodedString);

        if (configData.plantations && configData.users) {
          setState(prev => {
            const updatedPlantations = [...prev.plantations];
            configData.plantations.forEach((p: Plantation) => {
              if (!updatedPlantations.find(exist => exist.id === p.id)) updatedPlantations.push(p);
            });

            const updatedUsers = [...prev.users];
            configData.users.forEach((u: User) => {
              if (!updatedUsers.find(exist => exist.id === u.id)) updatedUsers.push(u);
            });

            return { ...prev, plantations: updatedPlantations, users: updatedUsers };
          });
          
          window.history.replaceState({}, document.title, window.location.pathname);
          addToast("Configuration activée ! Connectez-vous.", 'success');
        }
      } catch (err) {
        addToast("Lien de configuration invalide", 'error');
      }
    }
  }, []);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const handleLogin = (user: User) => {
    const isFirstLogin = !user.lastLoginAt;
    const updatedUsers = state.users.map(u => 
      u.id === user.id ? { ...u, lastLoginAt: new Date().toISOString() } : u
    );
    setState(prev => ({ ...prev, currentUser: user, users: updatedUsers }));
    addToast(`Bienvenue, ${user.username} !`, 'success');
    setActiveTab(user.role === UserRole.SUPER_ADMIN ? 'superadmin' : 'dashboard');
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
    setInspectedPlantationId(null);
    addToast("Déconnexion réussie", 'info');
  };

  // Logique de surveillance pour MiguelF
  const effectivePlantationId = useMemo(() => {
    if (state.currentUser?.role === UserRole.SUPER_ADMIN) {
        return inspectedPlantationId || 'SYSTEM';
    }
    return state.currentUser?.plantationId || 'SYSTEM';
  }, [state.currentUser, inspectedPlantationId]);

  const currentPlantation = useMemo(() => 
    state.plantations.find(p => p.id === effectivePlantationId),
  [state.plantations, effectivePlantationId]);

  const isAccessSuspended = state.currentUser?.role !== UserRole.SUPER_ADMIN && currentPlantation?.status === 'SUSPENDED';

  const renderContent = () => {
    // Si on est en mode Master et qu'on n'inspecte rien de précis
    if (state.currentUser?.role === UserRole.SUPER_ADMIN && !inspectedPlantationId) {
        return <SuperAdminModule state={state} setState={setState} t={t} onInspect={(id) => {
            setInspectedPlantationId(id);
            setActiveTab('dashboard');
        }} />;
    }

    if (isAccessSuspended) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl">
                <div className="w-32 h-32 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-7xl mb-8">🛑</div>
                <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">Accès Suspendu</h2>
                <p className="text-slate-500 mt-6 max-w-md text-lg">Contactez MiguelF pour régulariser votre abonnement.</p>
                <button onClick={handleLogout} className="mt-10 px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Déconnexion</button>
            </div>
        );
    }

    // Filtrer les données selon la plantation (soit celle de l'user, soit celle inspectée par MiguelF)
    const scopedState = { ...state, 
        activities: state.activities.filter(a => a.plantationId === effectivePlantationId), 
        sales: state.sales.filter(s => s.plantationId === effectivePlantationId), 
        cashMovements: state.cashMovements.filter(c => c.plantationId === effectivePlantationId) 
    };
    
    switch (activeTab) {
      case 'dashboard': return <Dashboard state={scopedState} t={t} />;
      case 'creation': return <ActivityModule type="CREATION" state={scopedState} onAdd={(a) => {}} t={t} />;
      case 'maintenance': return <ActivityModule type="MAINTENANCE" state={scopedState} onAdd={(a) => {}} t={t} />;
      case 'harvest': return <ActivityModule type="HARVEST" state={scopedState} onAdd={(a) => {}} t={t} />;
      case 'production': return <ProductionModule state={scopedState} onAdd={(a) => {}} t={t} />;
      case 'packaging': return <ActivityModule type="PACKAGING" state={scopedState} onAdd={(a) => {}} t={t} />;
      case 'sales': return <SalesModule state={scopedState} onAdd={(s) => {}} t={t} />;
      case 'cash': return <CashModule state={scopedState} t={t} />;
      case 'stats': return <StatsModule state={scopedState} t={t} />;
      case 'users': return <UserManagement state={state} setState={setState} t={t} />;
      case 'tutorial': return <TutorialModule t={t} />;
      case 'superadmin': return <SuperAdminModule state={state} setState={setState} t={t} onInspect={(id) => setInspectedPlantationId(id)} />;
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
              onThemeToggle={() => setState(p => ({ ...p, theme: p.theme === 'light' ? 'dark' : 'light' }))}
              onLanguageToggle={() => setState(p => ({ ...p, language: p.language === 'FR' ? 'EN' : 'FR' }))}
              searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              user={state.currentUser} notifications={state.notifications}
              markAllRead={() => {}} onHelpClick={() => setActiveTab('tutorial')}
              onMenuToggle={() => setIsSidebarOpen(true)}
              currentPlantation={currentPlantation}
            />
            
            {/* Bannière Mode Inspection pour Super-Admin */}
            {inspectedPlantationId && (
                <div className="bg-amber-600 text-white px-8 py-2 flex justify-between items-center animate-in slide-in-from-top duration-300">
                    <p className="text-xs font-black uppercase tracking-widest">👁️ Mode Surveillance : {currentPlantation?.name}</p>
                    <button onClick={() => { setInspectedPlantationId(null); setActiveTab('superadmin'); }} className="bg-white/20 hover:bg-white/30 px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Quitter</button>
                </div>
            )}

            <main className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
              {renderContent()}
            </main>
          </div>
          <ChatBot state={state} t={t} />
        </>
      )}
      
      <div className="fixed bottom-4 left-4 z-[500] flex flex-col space-y-2 pointer-events-none">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} />
        ))}
      </div>
    </div>
  );
};

export default App;

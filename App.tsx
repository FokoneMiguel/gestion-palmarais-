
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
import { syncDataWithServer, syncDelete, pushNewAccounts, pushSystemNotification } from './syncService.ts';

// DONNÉES DE DÉMONSTRATION PRÉ-REMPLIES
const DEMO_PLANTATION: Plantation = {
  id: 'DEMO-BST',
  name: 'Palmeraie Royale (Démo)',
  ownerName: 'M. Jean Démo',
  contactEmail: 'demo@palmeraie.com',
  status: 'ACTIVE',
  expiryDate: '2030-12-31'
};

const DEMO_ADMIN: User = {
  id: 'user-demo-01',
  username: 'demo',
  password: 'demo',
  role: UserRole.ADMIN,
  plantationId: 'DEMO-BST',
  lastLoginAt: new Date().toISOString()
};

const DEMO_ACTIVITIES: Activity[] = [
  { id: 'demo-act-1', plantationId: 'DEMO-BST', type: 'CREATION', label: 'Mise en terre', date: '2024-03-01', zone: 'Parcelle A1', quantity: 500, unit: 'plants', cost: 250000, workers: ['Moussa', 'Paul'], updatedAt: Date.now(), synced: true },
  { id: 'demo-act-2', plantationId: 'DEMO-BST', type: 'MAINTENANCE', label: 'Désherbage manuel', date: '2024-03-05', zone: 'Parcelle A1', cost: 45000, workers: ['Koffi'], updatedAt: Date.now(), synced: true },
  { id: 'demo-act-3', plantationId: 'DEMO-BST', type: 'HARVEST', label: 'Coupe des régimes', date: '2024-03-10', zone: 'Parcelle A1', quantity: 1200, unit: 'kg', cost: 60000, workers: ['Equipe Alpha'], updatedAt: Date.now(), synced: true },
  { id: 'demo-act-4', plantationId: 'DEMO-BST', type: 'PRODUCTION', label: 'Pressage à chaud', date: '2024-03-11', zone: 'Usine Nord', inputQuantity: 1200, inputUnit: 'kg', quantity: 240, unit: 'L', cost: 35000, workers: ['Yao'], updatedAt: Date.now(), synced: true },
  { id: 'demo-act-5', plantationId: 'DEMO-BST', type: 'PACKAGING', label: 'Mise en bidons 20L', date: '2024-03-12', zone: 'Conditionnement', quantity: 12, unit: 'bidons', cost: 5000, workers: ['Awa'], updatedAt: Date.now(), synced: true },
];

const DEMO_SALES: Sale[] = [
  { id: 'demo-sale-1', plantationId: 'DEMO-BST', date: '2024-03-15', client: 'Grossiste Abidjan', product: 'Huile de Palme', quantity: 200, unitPrice: 900, total: 180000, updatedAt: Date.now(), synced: true },
  { id: 'demo-sale-2', plantationId: 'DEMO-BST', date: '2024-03-18', client: 'Boutique Locale', product: 'Huile de Palme', quantity: 40, unitPrice: 950, total: 38000, updatedAt: Date.now(), synced: true },
];

const DEMO_CASH: CashMovement[] = [
  { id: 'demo-cash-1', plantationId: 'DEMO-BST', date: '2024-03-15', type: 'IN', amount: 180000, reason: 'Vente Huile Batch #01', updatedAt: Date.now(), synced: true },
  { id: 'demo-cash-2', plantationId: 'DEMO-BST', date: '2024-03-16', type: 'OUT', amount: 50000, reason: 'Achat Engrais NPK', updatedAt: Date.now(), synced: true },
  { id: 'demo-cash-3', plantationId: 'DEMO-BST', date: '2024-03-18', type: 'IN', amount: 38000, reason: 'Vente Boutique', updatedAt: Date.now(), synced: true },
  { id: 'demo-cash-4', plantationId: 'DEMO-BST', date: '2024-03-20', type: 'WITHDRAWAL', amount: 20000, reason: 'Avance sur salaire Paul', updatedAt: Date.now(), synced: true },
];

const INITIAL_USERS: User[] = [
  { id: 'master-01', username: 'MiguelF', role: UserRole.SUPER_ADMIN, password: 'MF-05', plantationId: 'SYSTEM' },
  DEMO_ADMIN
];

const INITIAL_PLANTATIONS: Plantation[] = [
  { id: 'SYSTEM', name: 'Plameraie BST Master', ownerName: 'MiguelF', contactEmail: 'master@palmeraie.com', status: 'ACTIVE', expiryDate: '2099-01-01' },
  DEMO_PLANTATION
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('plameraie_db_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        // On force la présence et la mise à jour des données Démo
        const demoExists = parsed.plantations.find((p: any) => p.id === 'DEMO-BST');
        if (!demoExists) {
          parsed.plantations.push(DEMO_PLANTATION);
          parsed.users.push(DEMO_ADMIN);
          parsed.activities = [...parsed.activities, ...DEMO_ACTIVITIES];
          parsed.sales = [...parsed.sales, ...DEMO_SALES];
          parsed.cashMovements = [...(parsed.cashMovements || []), ...DEMO_CASH];
        } else if (!parsed.cashMovements || parsed.cashMovements.length === 0) {
          // Correction spécifique pour ajouter la caisse si elle manque
          parsed.cashMovements = DEMO_CASH;
        }
        return parsed;
      }
    } catch (e) {
      console.error("Erreur Storage", e);
    }
    return {
      plantations: INITIAL_PLANTATIONS,
      users: INITIAL_USERS,
      currentUser: null,
      activities: DEMO_ACTIVITIES,
      sales: DEMO_SALES,
      cashMovements: DEMO_CASH,
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

  useEffect(() => {
    const syncInterval = setInterval(() => {
      syncDataWithServer(state, setState, state.currentUser?.role === UserRole.SUPER_ADMIN ? addToast : undefined);
    }, 3000);
    return () => clearInterval(syncInterval);
  }, [state.currentUser?.id, state.plantations.length, state.notifications.length]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const handleLogin = (user: User) => {
    if (user.role === UserRole.ADMIN && !user.lastLoginAt && user.plantationId !== 'DEMO-BST') {
        const plantationName = state.plantations.find(p => p.id === user.plantationId)?.name || 'Inconnue';
        pushSystemNotification(`🚀 Nouveau client : La plantation "${plantationName}" s'est activée !`);
    }
    const updatedUsers = state.users.map(u => 
      u.id === user.id ? { ...u, lastLoginAt: new Date().toISOString() } : u
    );
    setState(prev => ({ ...prev, currentUser: user, users: updatedUsers }));
    addToast(`Bienvenue ${user.username} !`, 'success');
    setActiveTab(user.role === UserRole.SUPER_ADMIN ? 'superadmin' : 'dashboard');
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
    setInspectedPlantationId(null);
    addToast("Session fermée", 'info');
  };

  const effectivePlantationId = useMemo(() => {
    if (state.currentUser?.role === UserRole.SUPER_ADMIN) return inspectedPlantationId || 'SYSTEM';
    return state.currentUser?.plantationId || 'SYSTEM';
  }, [state.currentUser, inspectedPlantationId]);

  const currentPlantation = useMemo(() => 
    state.plantations.find(p => p.id === effectivePlantationId),
  [state.plantations, effectivePlantationId]);

  const scopedState = useMemo(() => ({
    ...state,
    activities: state.activities.filter(a => a.plantationId === effectivePlantationId),
    sales: state.sales.filter(s => s.plantationId === effectivePlantationId),
    cashMovements: state.cashMovements.filter(c => c.plantationId === effectivePlantationId)
  }), [state, effectivePlantationId]);

  const addActivity = (activity: any) => {
    const newActivity = { ...activity, id: `act-${Date.now()}`, plantationId: state.currentUser!.plantationId, updatedAt: Date.now(), synced: false };
    setState(prev => ({ ...prev, activities: [newActivity, ...prev.activities] }));
    addToast("Donnée sauvegardée");
  };

  const deleteActivity = (id: string) => {
    if (window.confirm("Supprimer ?")) {
        syncDelete(id);
        setState(prev => ({ ...prev, activities: prev.activities.filter(a => a.id !== id) }));
    }
  };

  const addSale = (sale: any) => {
    const newSale = { ...sale, id: `sale-${Date.now()}`, plantationId: state.currentUser!.plantationId, updatedAt: Date.now(), synced: false };
    setState(prev => ({ ...prev, sales: [newSale, ...prev.sales] }));
    addToast("Vente enregistrée", 'success');
  };

  const deleteSale = (id: string) => {
    if (window.confirm("Supprimer ?")) {
        syncDelete(id);
        setState(prev => ({ ...prev, sales: prev.sales.filter(s => s.id !== id) }));
    }
  };

  const renderContent = () => {
    if (state.currentUser?.role !== UserRole.SUPER_ADMIN && currentPlantation?.status === 'SUSPENDED') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10 bg-white dark:bg-slate-800 rounded-[3rem] shadow-xl">
                <div className="text-7xl mb-6">🚫</div>
                <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">Accès Suspendu</h2>
                <button onClick={handleLogout} className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs">Retour</button>
            </div>
        );
    }

    if (state.currentUser?.role === UserRole.SUPER_ADMIN && !inspectedPlantationId && activeTab !== 'superadmin' && activeTab !== 'tutorial') {
        return <SuperAdminModule state={state} setState={setState} t={t} onInspect={(id) => { setInspectedPlantationId(id); setActiveTab('dashboard'); }} />;
    }

    switch (activeTab) {
      case 'dashboard': return <Dashboard state={scopedState} t={t} />;
      case 'creation': return <ActivityModule type="CREATION" state={scopedState} onAdd={addActivity} onDelete={deleteActivity} t={t} />;
      case 'maintenance': return <ActivityModule type="MAINTENANCE" state={scopedState} onAdd={addActivity} onDelete={deleteActivity} t={t} />;
      case 'harvest': return <ActivityModule type="HARVEST" state={scopedState} onAdd={addActivity} onDelete={deleteActivity} t={t} />;
      case 'production': return <ProductionModule state={scopedState} onAdd={addActivity} onDelete={deleteActivity} t={t} />;
      case 'packaging': return <ActivityModule type="PACKAGING" state={scopedState} onAdd={addActivity} onDelete={deleteActivity} t={t} />;
      case 'sales': return <SalesModule state={scopedState} onAdd={addSale} onDelete={deleteSale} t={t} />;
      case 'cash': return <CashModule state={scopedState} t={t} />;
      case 'stats': return <StatsModule state={scopedState} t={t} />;
      case 'users': return <UserManagement state={state} setState={setState} t={t} />;
      case 'tutorial': return <TutorialModule t={t} />;
      case 'superadmin': return <SuperAdminModule state={state} setState={setState} t={t} onInspect={(id) => setInspectedPlantationId(id)} />;
      default: return <Dashboard state={scopedState} t={t} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      {!state.currentUser ? (
        <Login onLogin={handleLogin} users={state.users} t={t} theme={state.theme} language={state.language} onLanguageToggle={() => setState(p => ({ ...p, language: p.language === 'FR' ? 'EN' : 'FR' }))} onThemeToggle={() => setState(p => ({ ...p, theme: p.theme === 'light' ? 'dark' : 'light' }))} addToast={addToast} />
      ) : (
        <>
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={state.currentUser.role} t={t} onLogout={handleLogout} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <div className="flex-1 flex flex-col min-w-0">
            <Header t={t} theme={state.theme} language={state.language} onThemeToggle={() => setState(p => ({ ...p, theme: p.theme === 'light' ? 'dark' : 'light' }))} onLanguageToggle={() => setState(p => ({ ...p, language: p.language === 'FR' ? 'EN' : 'FR' }))} searchQuery={searchQuery} setSearchQuery={setSearchQuery} user={state.currentUser} notifications={state.notifications} markAllRead={() => setState(p => ({ ...p, notifications: p.notifications.map(n => ({...n, isRead: true})) }))} onHelpClick={() => setActiveTab('tutorial')} onMenuToggle={() => setIsSidebarOpen(true)} currentPlantation={currentPlantation} />
            {inspectedPlantationId && (
                <div className="bg-amber-600 text-white px-8 py-2 flex justify-between items-center shadow-lg">
                    <p className="text-[10px] font-black uppercase tracking-widest">👁️ Surveillance : {currentPlantation?.name}</p>
                    <button onClick={() => { setInspectedPlantationId(null); setActiveTab('superadmin'); }} className="bg-white/20 px-4 py-1 rounded-lg text-[9px] font-black uppercase">Quitter</button>
                </div>
            )}
            <main className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">{renderContent()}</main>
          </div>
          <ChatBot state={state} t={t} />
        </>
      )}
      <div className="fixed bottom-4 left-4 z-[500] flex flex-col space-y-2 pointer-events-none">
        {toasts.map(toast => <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} />)}
      </div>
    </div>
  );
};

export default App;

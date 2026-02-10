
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

// DONNÉES DE DÉMONSTRATION ÉTALÉES SUR 3 MOIS POUR LES GRAPHES
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
  // Janvier : Gros investissements de création
  { id: 'demo-act-1', plantationId: 'DEMO-BST', type: 'CREATION', label: 'Mise en terre', date: '2024-01-15', zone: 'Parcelle A1', quantity: 500, unit: 'plants', cost: 450000, workers: ['Moussa', 'Paul'], updatedAt: Date.now(), synced: true },
  { id: 'demo-act-2', plantationId: 'DEMO-BST', type: 'MAINTENANCE', label: 'Élagage', date: '2024-02-05', zone: 'Parcelle A1', cost: 65000, workers: ['Koffi'], updatedAt: Date.now(), synced: true },
  // Mars : Activité intense
  { id: 'demo-act-3', plantationId: 'DEMO-BST', type: 'HARVEST', label: 'Coupe des régimes', date: '2024-03-01', zone: 'Parcelle A1', quantity: 1200, unit: 'kg', cost: 80000, workers: ['Equipe Alpha'], updatedAt: Date.now(), synced: true },
  { id: 'demo-act-4', plantationId: 'DEMO-BST', type: 'PRODUCTION', label: 'Pressage Batch #1', date: '2024-03-10', zone: 'Usine Nord', inputQuantity: 1200, inputUnit: 'kg', quantity: 240, unit: 'L', cost: 35000, workers: ['Yao'], updatedAt: Date.now(), synced: true },
  { id: 'demo-act-5', plantationId: 'DEMO-BST', type: 'PACKAGING', label: 'Mise en bidons', date: '2024-03-15', zone: 'Conditionnement', quantity: 12, unit: 'bidons', cost: 5000, workers: ['Awa'], updatedAt: Date.now(), synced: true },
];

const DEMO_SALES: Sale[] = [
  { id: 'demo-sale-1', plantationId: 'DEMO-BST', date: '2024-02-20', client: 'Marché Local', product: 'Huile de Palme', quantity: 100, unitPrice: 850, total: 85000, updatedAt: Date.now(), synced: true },
  { id: 'demo-sale-2', plantationId: 'DEMO-BST', date: '2024-03-05', client: 'Grossiste Abidjan', product: 'Huile de Palme', quantity: 300, unitPrice: 900, total: 270000, updatedAt: Date.now(), synced: true },
  { id: 'demo-sale-3', plantationId: 'DEMO-BST', date: '2024-03-25', client: 'Exportateur CI', product: 'Huile de Palme', quantity: 500, unitPrice: 950, total: 475000, updatedAt: Date.now(), synced: true },
];

const DEMO_CASH: CashMovement[] = [
  { id: 'demo-cash-1', plantationId: 'DEMO-BST', date: '2024-02-20', type: 'IN', amount: 85000, reason: 'Vente Février', updatedAt: Date.now(), synced: true },
  { id: 'demo-cash-2', plantationId: 'DEMO-BST', date: '2024-03-05', type: 'IN', amount: 270000, reason: 'Vente Grossiste', updatedAt: Date.now(), synced: true },
  { id: 'demo-cash-3', plantationId: 'DEMO-BST', date: '2024-03-10', type: 'OUT', amount: 150000, reason: 'Achat Matériel Usine', updatedAt: Date.now(), synced: true },
  { id: 'demo-cash-4', plantationId: 'DEMO-BST', date: '2024-03-25', type: 'IN', amount: 475000, reason: 'Encaissement Export', updatedAt: Date.now(), synced: true },
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
      const saved = localStorage.getItem('plameraie_db_v4_demo');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
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
    localStorage.setItem('plameraie_db_v4_demo', JSON.stringify(state));
  }, [state]);

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

  const handleLogin = (user: User) => {
    const updatedUsers = state.users.map(u => u.id === user.id ? { ...u, lastLoginAt: new Date().toISOString() } : u);
    setState(prev => ({ ...prev, currentUser: user, users: updatedUsers }));
    setActiveTab(user.role === UserRole.SUPER_ADMIN ? 'superadmin' : 'dashboard');
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
    setInspectedPlantationId(null);
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const renderContent = () => {
    if (state.currentUser?.role === UserRole.SUPER_ADMIN && !inspectedPlantationId && activeTab !== 'superadmin' && activeTab !== 'tutorial') {
        return <SuperAdminModule state={state} setState={setState} t={t} onInspect={(id) => { setInspectedPlantationId(id); setActiveTab('dashboard'); }} />;
    }

    switch (activeTab) {
      case 'dashboard': return <Dashboard state={scopedState} t={t} />;
      case 'creation': return <ActivityModule type="CREATION" state={scopedState} onAdd={(a) => setState(p => ({...p, activities: [{...a, id: Date.now().toString(), plantationId: effectivePlantationId, updatedAt: Date.now()}, ...p.activities]}))} t={t} />;
      case 'maintenance': return <ActivityModule type="MAINTENANCE" state={scopedState} onAdd={(a) => setState(p => ({...p, activities: [{...a, id: Date.now().toString(), plantationId: effectivePlantationId, updatedAt: Date.now()}, ...p.activities]}))} t={t} />;
      case 'harvest': return <ActivityModule type="HARVEST" state={scopedState} onAdd={(a) => setState(p => ({...p, activities: [{...a, id: Date.now().toString(), plantationId: effectivePlantationId, updatedAt: Date.now()}, ...p.activities]}))} t={t} />;
      case 'production': return <ProductionModule state={scopedState} onAdd={(a) => setState(p => ({...p, activities: [{...a, id: Date.now().toString(), plantationId: effectivePlantationId, updatedAt: Date.now()}, ...p.activities]}))} t={t} />;
      case 'packaging': return <ActivityModule type="PACKAGING" state={scopedState} onAdd={(a) => setState(p => ({...p, activities: [{...a, id: Date.now().toString(), plantationId: effectivePlantationId, updatedAt: Date.now()}, ...p.activities]}))} t={t} />;
      case 'sales': return <SalesModule state={scopedState} onAdd={(s) => setState(p => ({...p, sales: [{...s, id: Date.now().toString(), plantationId: effectivePlantationId, updatedAt: Date.now()}, ...p.sales]}))} t={t} />;
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
            <Header t={t} theme={state.theme} language={state.language} onThemeToggle={() => setState(p => ({ ...p, theme: p.theme === 'light' ? 'dark' : 'light' }))} onLanguageToggle={() => setState(p => ({ ...p, language: p.language === 'FR' ? 'EN' : 'FR' }))} searchQuery={searchQuery} setSearchQuery={setSearchQuery} user={state.currentUser} notifications={state.notifications} markAllRead={() => {}} onHelpClick={() => setActiveTab('tutorial')} onMenuToggle={() => setIsSidebarOpen(true)} currentPlantation={currentPlantation} />
            {inspectedPlantationId && (
                <div className="bg-amber-600 text-white px-8 py-2 flex justify-between items-center shadow-lg border-b border-amber-500">
                    <p className="text-[10px] font-black uppercase tracking-widest flex items-center"><span className="mr-2 text-lg">👁️</span> Surveillance de {currentPlantation?.name}</p>
                    <button onClick={() => { setInspectedPlantationId(null); setActiveTab('superadmin'); }} className="bg-white/20 px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-white/30">Quitter</button>
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

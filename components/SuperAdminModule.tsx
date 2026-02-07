
import React, { useState } from 'react';
import { AppState, Plantation, User, UserRole } from '../types';

interface SuperAdminModuleProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  t: any;
  onInspect: (plantationId: string) => void;
}

const SuperAdminModule: React.FC<SuperAdminModuleProps> = ({ state, setState, t, onInspect }) => {
  const [newPlantation, setNewPlantation] = useState({ 
    name: '', owner: '', email: '', adminUsername: 'admin', adminPassword: '' 
  });
  const [showCode, setShowCode] = useState<string | null>(null);

  const generateActivationLink = (pId: string) => {
    const p = state.plantations.find(pl => pl.id === pId);
    const companyUsers = state.users.filter(u => u.plantationId === pId);
    const config = { plantations: [p], users: companyUsers };
    const base64 = btoa(unescape(encodeURIComponent(JSON.stringify(config))));
    return `${window.location.origin}${window.location.pathname}?config=${base64}`;
  };

  const shareWhatsApp = (pId: string) => {
    const p = state.plantations.find(pl => pl.id === pId);
    const adminUser = state.users.find(u => u.plantationId === pId && u.role === UserRole.ADMIN);
    const link = generateActivationLink(pId);
    
    const message = `*PLAMERAIE BST - Accès Officiel*\n\n` +
      `Bonjour ${p?.ownerName},\n` +
      `Voici vos accès pour la plantation *${p?.name}*.\n\n` +
      `*Code:* ${pId}\n` +
      `*Identifiant:* ${adminUser?.username}\n` +
      `*Mot de passe:* ${adminUser?.password}\n\n` +
      `👉 *CLIQUEZ ICI POUR ACTIVER:* ${link}`;
      
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const addPlantation = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `PALM-${Math.floor(100 + Math.random() * 899)}`;
    
    const plantation: Plantation = {
      id, 
      name: newPlantation.name, 
      ownerName: newPlantation.owner, 
      contactEmail: newPlantation.email,
      status: 'ACTIVE', 
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    const adminUser: User = { 
      id: `user-${Date.now()}`, 
      username: newPlantation.adminUsername, 
      password: newPlantation.adminPassword || '1234', 
      role: UserRole.ADMIN, 
      plantationId: id 
    };

    setState(prev => ({ 
      ...prev, 
      plantations: [...prev.plantations, plantation], 
      users: [...prev.users, adminUser] 
    }));

    setShowCode(id);
    setNewPlantation({ name: '', owner: '', email: '', adminUsername: 'admin', adminPassword: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-green-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden border border-slate-700">
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-1 tracking-tighter">👑 MiguelF Control</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Master Console Plameraie BST</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700">
          <h3 className="text-xl font-black mb-6 dark:text-white flex items-center">
            <span className="mr-2">➕</span> Inscrire un Client
          </h3>
          <form onSubmit={addPlantation} className="space-y-5">
            <div className="space-y-4 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Nom Palmeraie</label>
                <input required placeholder="Ex: Avocatier Sud" value={newPlantation.name} onChange={e => setNewPlantation({...newPlantation, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none dark:text-white font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Gérant</label>
                <input required placeholder="M. Kouamé" value={newPlantation.owner} onChange={e => setNewPlantation({...newPlantation, owner: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none dark:text-white font-bold" />
              </div>
            </div>
            
            <div className="space-y-4 pt-2">
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Accès Admin</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Identifiant</label>
                  <input required placeholder="admin" value={newPlantation.adminUsername} onChange={e => setNewPlantation({...newPlantation, adminUsername: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none dark:text-white font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Mot de passe</label>
                  <input required placeholder="Code..." value={newPlantation.adminPassword} onChange={e => setNewPlantation({...newPlantation, adminPassword: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none dark:text-white font-bold" />
                </div>
              </div>
            </div>
            
            <button className="w-full bg-green-700 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-green-800 transition-all transform active:scale-95 uppercase text-xs tracking-widest mt-4">Générer le Lien Magique</button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-4">
            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tighter">Tableau de Bord Global</h3>
            <span className="bg-slate-100 dark:bg-slate-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-slate-500">
                {state.plantations.filter(p => p.id !== 'SYSTEM').length} Palmeraies Sous Surveillance
            </span>
          </div>

          <div className="space-y-4">
            {state.plantations.filter(p => p.id !== 'SYSTEM').map(p => {
              const activities = state.activities.filter(a => a.plantationId === p.id);
              const sales = state.sales.filter(s => s.plantationId === p.id);
              const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);

              return (
                <div key={p.id} className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 transition-all hover:shadow-xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center space-x-5">
                      <div className="w-16 h-16 rounded-3xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-3xl">🌴</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-black text-lg text-slate-800 dark:text-white truncate">{p.name}</h4>
                          <span className="bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded-lg text-[10px] font-mono font-black text-green-600">{p.id}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 truncate">{p.ownerName} • Statut: <span className={p.status === 'ACTIVE' ? 'text-green-600' : 'text-red-500'}>{p.status}</span></p>
                        <div className="flex space-x-3 mt-2">
                          <span className="text-[9px] font-black uppercase text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">🗓️ {activities.length} Opérations</span>
                          <span className="text-[9px] font-black uppercase text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">💰 {totalRevenue.toLocaleString()} FCFA</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button 
                        onClick={() => onInspect(p.id)}
                        className="bg-slate-900 text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-105 transition-transform flex items-center space-x-2"
                      >
                        <span>👁️ Surveiller</span>
                      </button>
                      <button onClick={() => shareWhatsApp(p.id)} className="bg-[#25D366] text-white p-3 rounded-2xl shadow-lg hover:rotate-6 transition-all" title="Partager Lien WhatsApp">
                        <span className="text-xl">💬</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showCode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-green-900/60 backdrop-blur-xl">
            <div className="bg-white dark:bg-slate-800 p-12 rounded-[4rem] shadow-2xl text-center max-w-sm w-full animate-in zoom-in border border-white/20">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">✅</div>
                <h4 className="text-3xl font-black mb-2 dark:text-white tracking-tighter">Compte Créé !</h4>
                <p className="text-sm text-slate-500 mb-8 font-medium">L'accès est prêt. Cliquez ci-dessous pour envoyer le lien d'activation WhatsApp au gérant.</p>
                <button onClick={() => { shareWhatsApp(showCode); setShowCode(null); }} className="w-full py-6 bg-[#25D366] text-white rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center justify-center space-x-3 shadow-2xl hover:scale-105 transition-all">
                   <span>WhatsApp au Client</span>
                </button>
                <button onClick={() => setShowCode(null)} className="mt-6 text-slate-400 font-black uppercase text-[10px] tracking-widest">Fermer</button>
            </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminModule;

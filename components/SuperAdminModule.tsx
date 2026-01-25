
import React, { useState } from 'react';
import { AppState, Plantation, User, UserRole } from '../types';

interface SuperAdminModuleProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const SuperAdminModule: React.FC<SuperAdminModuleProps> = ({ state, setState }) => {
  const [newPlantation, setNewPlantation] = useState({ name: '', owner: '', email: '', adminUser: 'admin', adminPass: '' });
  const [showCode, setShowCode] = useState<string | null>(null);

  const addPlantation = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Génération d'un code unique en majuscules
    const id = `PALM-${Math.floor(100 + Math.random() * 899)}`;
    
    const plantation: Plantation = {
      id: id,
      name: newPlantation.name,
      ownerName: newPlantation.owner,
      contactEmail: newPlantation.email,
      status: 'ACTIVE',
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    // Création du compte utilisateur admin rattaché
    const defaultAdmin: User = {
        id: `user-${Date.now()}`,
        username: newPlantation.adminUser.trim() || 'admin',
        password: newPlantation.adminPass.trim() || 'admin',
        role: UserRole.ADMIN,
        plantationId: id
    };

    // Mise à jour de l'état global (Plantations + Utilisateurs)
    setState(prev => ({ 
        ...prev, 
        plantations: [...prev.plantations, plantation],
        users: [...prev.users, defaultAdmin]
    }));
    
    setShowCode(id);
    setNewPlantation({ name: '', owner: '', email: '', adminUser: 'admin', adminPass: '' });
  };

  const toggleStatus = (id: string) => {
    setState(prev => ({
      ...prev,
      plantations: prev.plantations.map(p => 
        p.id === id ? { ...p, status: p.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : p
      )
    }));
  };

  const deletePlantation = (id: string) => {
    if (confirm("🚨 ATTENTION : La suppression d'une entreprise est irréversible. Toutes les données associées seront perdues. Confirmer ?")) {
      setState(prev => ({
        ...prev,
        plantations: prev.plantations.filter(p => p.id !== id),
        users: prev.users.filter(u => u.plantationId !== id),
        activities: prev.activities.filter(a => a.plantationId !== id),
        sales: prev.sales.filter(s => s.plantationId !== id),
        cashMovements: prev.cashMovements.filter(c => c.plantationId !== id)
      }));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-4xl font-black mb-2 tracking-tighter flex items-center">
              <span className="mr-4">👑</span> Console Maître
            </h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Administrateur Système : MiguelF</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 px-6 py-3 rounded-2xl backdrop-blur-md">
             <span className="text-green-400 font-black text-lg">{state.plantations.filter(p => p.id !== 'SYSTEM').length} Entreprises Clientes</span>
          </div>
        </div>
      </div>

      {showCode && (
        <div className="bg-green-700 text-white p-10 rounded-[4rem] shadow-2xl animate-in zoom-in duration-300 border-4 border-green-600/50">
            <h4 className="font-black text-2xl mb-4 flex items-center">
                <span className="mr-3">🎉</span> Entreprise créée avec succès !
            </h4>
            <p className="text-sm opacity-90 font-medium">Communiquez ces informations au client :</p>
            <div className="bg-white/10 p-8 rounded-3xl mt-6 text-5xl font-black text-center tracking-[0.4em] border-2 border-dashed border-white/30 backdrop-blur-sm shadow-inner">
                {showCode}
            </div>
            <div className="mt-8 p-6 bg-black/20 rounded-[2rem] text-sm space-y-3 border border-white/10">
                <p className="font-black text-green-300 uppercase tracking-widest text-xs">Accès Admin Client</p>
                <div className="flex justify-between">
                  <span className="opacity-70">Utilisateur :</span>
                  <span className="font-black">admin (ou celui choisi)</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Mot de passe :</span>
                  <span className="font-black">Configuré par vous</span>
                </div>
            </div>
            <button onClick={() => setShowCode(null)} className="mt-10 w-full py-5 bg-white text-green-700 font-black rounded-3xl hover:bg-green-50 transition-all uppercase text-xs tracking-[0.2em] shadow-xl">J'ai noté les informations</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm sticky top-24">
            <h3 className="text-xl font-black mb-8 dark:text-white flex items-center tracking-tight">
                <span className="mr-3 bg-green-100 dark:bg-green-900/30 p-2 rounded-xl">➕</span> Inscrire Client
            </h3>
            <form onSubmit={addPlantation} className="space-y-5">
              <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Nom Plantation</label>
                  <input required placeholder="Ex: Palmeraie du Sud" value={newPlantation.name} onChange={e => setNewPlantation({...newPlantation, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 border border-transparent focus:border-green-500 rounded-2xl outline-none transition-all dark:text-white font-bold" />
              </div>
              <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Nom du Gérant</label>
                  <input required placeholder="M. Kouassi" value={newPlantation.owner} onChange={e => setNewPlantation({...newPlantation, owner: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 border border-transparent focus:border-green-500 rounded-2xl outline-none transition-all dark:text-white font-bold" />
              </div>
              <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Email Client</label>
                  <input required type="email" placeholder="client@email.com" value={newPlantation.email} onChange={e => setNewPlantation({...newPlantation, email: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 border border-transparent focus:border-green-500 rounded-2xl outline-none transition-all dark:text-white font-bold" />
              </div>
              
              <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 space-y-4">
                  <p className="text-[10px] font-black uppercase text-green-600 tracking-[0.2em] mb-2 px-2">Identifiants Administrateur</p>
                  <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-4">Utilisateur Admin</label>
                      <input required value={newPlantation.adminUser} onChange={e => setNewPlantation({...newPlantation, adminUser: e.target.value})} className="w-full px-5 py-4 bg-white dark:bg-slate-800 border-none rounded-xl text-sm font-bold dark:text-white" />
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-4">Mot de Passe Admin</label>
                      <input required type="password" placeholder="••••••••" value={newPlantation.adminPass} onChange={e => setNewPlantation({...newPlantation, adminPass: e.target.value})} className="w-full px-5 py-4 bg-white dark:bg-slate-800 border-none rounded-xl text-sm font-bold dark:text-white" />
                  </div>
              </div>

              <button className="w-full bg-green-700 text-white font-black py-6 rounded-[2.5rem] shadow-2xl hover:bg-green-800 transition-all transform active:scale-95 uppercase text-xs tracking-widest">
                Valider & Générer Code
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-[3.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center bg-slate-50/30 dark:bg-slate-700/30">
               <h3 className="font-black text-2xl tracking-tight dark:text-white uppercase">Portefeuille Clients</h3>
               <div className="flex space-x-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Serveur Actif</span>
               </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Statut</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {state.plantations.filter(p => p.id !== 'SYSTEM').map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-700/20 transition-colors group">
                      <td className="px-10 py-8">
                        <div className="flex items-center space-x-6">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-green-50 dark:bg-green-900/20 text-green-700 font-mono font-black flex items-center justify-center border-2 border-green-100 dark:border-green-900/30 text-xl shadow-sm">
                                {p.id.split('-')[1]}
                            </div>
                            <div>
                                <p className="font-black text-xl text-slate-800 dark:text-white leading-none mb-1">{p.name}</p>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.1em]">{p.id} • {p.ownerName}</p>
                            </div>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${p.status === 'ACTIVE' ? 'bg-green-100 text-green-700 shadow-sm shadow-green-900/5' : 'bg-red-100 text-red-700 animate-pulse'}`}>
                          {p.status === 'ACTIVE' ? 'ACTIF' : 'SUSPENDU'}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex justify-end space-x-3">
                            <button 
                                onClick={() => toggleStatus(p.id)} 
                                className={`text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl border-2 transition-all ${p.status === 'ACTIVE' ? 'border-amber-100 text-amber-600 hover:bg-amber-50' : 'border-green-100 text-green-600 hover:bg-green-50'}`}
                            >
                              {p.status === 'ACTIVE' ? 'Suspendre' : 'Activer'}
                            </button>
                            <button 
                                onClick={() => deletePlantation(p.id)} 
                                className="text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl border-2 border-red-50 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm"
                            >
                              Supprimer
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {state.plantations.filter(p => p.id !== 'SYSTEM').length === 0 && (
                      <tr>
                          <td colSpan={3} className="p-32 text-center">
                              <div className="flex flex-col items-center">
                                <span className="text-7xl opacity-20 mb-6 transform hover:rotate-12 transition-transform">📭</span>
                                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Aucun client actif sur le réseau.</p>
                              </div>
                          </td>
                      </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminModule;

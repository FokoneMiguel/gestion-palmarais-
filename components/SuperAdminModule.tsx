
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
    const id = `PALM-${Math.floor(100 + Math.random() * 899)}`;
    
    const plantation: Plantation = {
      id,
      name: newPlantation.name,
      ownerName: newPlantation.owner,
      contactEmail: newPlantation.email,
      status: 'ACTIVE',
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    const defaultAdmin: User = {
        id: `user-${Date.now()}`,
        username: newPlantation.adminUser,
        password: newPlantation.adminPass || 'admin',
        role: UserRole.ADMIN,
        plantationId: id
    };

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
        <div className="bg-green-700 text-white p-8 rounded-[3rem] shadow-2xl animate-in zoom-in duration-300 border-4 border-green-600/50">
            <h4 className="font-black text-xl mb-3 flex items-center">
                <span className="mr-2">🎉</span> Entreprise créée avec succès !
            </h4>
            <p className="text-sm opacity-90 font-medium">Communiquez ce code de plantation au client :</p>
            <div className="bg-white/10 p-6 rounded-3xl mt-4 text-4xl font-black text-center tracking-[0.3em] border-2 border-dashed border-white/30 backdrop-blur-sm">
                {showCode}
            </div>
            <div className="mt-6 p-4 bg-black/10 rounded-2xl text-xs space-y-1">
                <p className="font-bold">Identifiants Admin créés :</p>
                <p>Utilisateur : <span className="font-black underline">admin</span></p>
                <p>Mot de passe : <span className="font-black underline">Configuré par vous</span></p>
            </div>
            <button onClick={() => setShowCode(null)} className="mt-8 w-full py-3 bg-white text-green-700 font-black rounded-2xl hover:bg-green-50 transition-all uppercase text-[10px] tracking-widest">J'ai noté les informations</button>
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
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Nom Plantation</label>
                  <input required placeholder="Ex: Palmeraie du Sud" value={newPlantation.name} onChange={e => setNewPlantation({...newPlantation, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700 border border-transparent focus:border-green-500 rounded-2xl outline-none transition-all dark:text-white font-bold" />
              </div>
              <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Nom du Gérant</label>
                  <input required placeholder="M. Kouassi" value={newPlantation.owner} onChange={e => setNewPlantation({...newPlantation, owner: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700 border border-transparent focus:border-green-500 rounded-2xl outline-none transition-all dark:text-white font-bold" />
              </div>
              <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Email Client</label>
                  <input required type="email" placeholder="client@email.com" value={newPlantation.email} onChange={e => setNewPlantation({...newPlantation, email: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700 border border-transparent focus:border-green-500 rounded-2xl outline-none transition-all dark:text-white font-bold" />
              </div>
              
              <div className="p-5 bg-slate-50 dark:bg-slate-700/50 rounded-[2rem] border border-slate-100 dark:border-slate-700 space-y-4">
                  <p className="text-[10px] font-black uppercase text-green-600 tracking-[0.2em] mb-2">Accès Administrateur</p>
                  <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Nom Utilisateur Admin</label>
                      <input required value={newPlantation.adminUser} onChange={e => setNewPlantation({...newPlantation, adminUser: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-none rounded-xl text-sm font-bold dark:text-white" />
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Mot de Passe Admin</label>
                      <input required type="password" placeholder="••••••••" value={newPlantation.adminPass} onChange={e => setNewPlantation({...newPlantation, adminPass: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-none rounded-xl text-sm font-bold dark:text-white" />
                  </div>
              </div>

              <button className="w-full bg-green-700 text-white font-black py-5 rounded-[2rem] shadow-xl hover:bg-green-800 transition-all transform active:scale-95 uppercase text-xs tracking-widest">
                Valider & Générer Code
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center bg-slate-50/30 dark:bg-slate-700/30">
               <h3 className="font-black text-xl tracking-tight dark:text-white uppercase">Portefeuille Clients</h3>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gestion des licences</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {state.plantations.filter(p => p.id !== 'SYSTEM').map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-700/20 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-700 font-mono font-black flex items-center justify-center border-2 border-green-100 dark:border-green-900/30">
                                {p.id.split('-')[1]}
                            </div>
                            <div>
                                <p className="font-black text-slate-800 dark:text-white">{p.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{p.id} • {p.ownerName}</p>
                            </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700 animate-pulse'}`}>
                          {p.status === 'ACTIVE' ? 'ACTIF' : 'SUSPENDU'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end space-x-2">
                            <button 
                                onClick={() => toggleStatus(p.id)} 
                                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl border-2 transition-all ${p.status === 'ACTIVE' ? 'border-amber-100 text-amber-600 hover:bg-amber-50' : 'border-green-100 text-green-600 hover:bg-green-50'}`}
                            >
                              {p.status === 'ACTIVE' ? 'Suspendre' : 'Activer'}
                            </button>
                            <button 
                                onClick={() => deletePlantation(p.id)} 
                                className="text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl border-2 border-red-50 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                            >
                              Supprimer
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {state.plantations.length <= 1 && (
                      <tr>
                          <td colSpan={3} className="p-20 text-center flex flex-col items-center">
                              <span className="text-5xl opacity-20 mb-4">📭</span>
                              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Aucune entreprise cliente enregistrée.</p>
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

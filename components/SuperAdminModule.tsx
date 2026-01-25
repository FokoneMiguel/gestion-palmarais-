
import React, { useState } from 'react';
import { AppState, Plantation, User, UserRole } from '../types';

interface SuperAdminModuleProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const SuperAdminModule: React.FC<SuperAdminModuleProps> = ({ state, setState }) => {
  const [newPlantation, setNewPlantation] = useState({ name: '', owner: '', email: '', adminUser: 'admin', adminPass: '' });
  const [showCode, setShowCode] = useState<string | null>(null);
  const [editingAccess, setEditingAccess] = useState<{plantationId: string, userId: string, user: string, pass: string} | null>(null);
  const [syncCode, setSyncCode] = useState<string | null>(null);

  const addPlantation = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `PALM-${Math.floor(100 + Math.random() * 899)}`;
    
    const plantation: Plantation = {
      id: id,
      name: newPlantation.name,
      ownerName: newPlantation.owner,
      contactEmail: newPlantation.email,
      status: 'ACTIVE',
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    const defaultAdmin: User = {
        id: `user-${Date.now()}`,
        username: (newPlantation.adminUser.trim() || 'admin').toLowerCase(),
        password: newPlantation.adminPass.trim() || 'admin',
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

  const generateSyncCode = () => {
    const code = btoa(JSON.stringify(state));
    setSyncCode(code);
  };

  const handleUpdateAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccess) return;

    setState(prev => ({
      ...prev,
      users: prev.users.map(u => 
        u.id === editingAccess.userId 
          ? { ...u, username: editingAccess.user.trim().toLowerCase(), password: editingAccess.pass.trim() } 
          : u
      )
    }));
    setEditingAccess(null);
    alert("Les identifiants ont été mis à jour avec succès.");
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
          <button 
            onClick={generateSyncCode}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-3 rounded-2xl shadow-xl flex items-center space-x-2 transition-all active:scale-95"
          >
            <span>🔄</span>
            <span className="text-xs uppercase tracking-widest">Générer Code de Sync</span>
          </button>
        </div>
      </div>

      {syncCode && (
        <div className="bg-blue-700 text-white p-10 rounded-[4rem] shadow-2xl animate-in zoom-in duration-300">
            <h4 className="font-black text-xl mb-4">Code de Synchronisation pour le Client</h4>
            <p className="text-xs opacity-80 mb-6">Envoyez ce code au client. Il devra le coller dans l'onglet "📲" de sa page de connexion pour activer son compte sur son téléphone.</p>
            <textarea readOnly value={syncCode} className="w-full p-4 bg-black/20 rounded-2xl text-[8px] font-mono h-32 mb-6 outline-none border border-white/20 select-all" />
            <button onClick={() => setSyncCode(null)} className="w-full py-4 bg-white text-blue-700 font-black rounded-2xl">Fermer</button>
        </div>
      )}

      {showCode && (
        <div className="bg-green-700 text-white p-10 rounded-[4rem] shadow-2xl animate-in zoom-in duration-300 border-4 border-green-600/50 text-center">
            <h4 className="font-black text-2xl mb-4 flex items-center justify-center">
                <span className="mr-3">🎉</span> Entreprise créée !
            </h4>
            <div className="bg-white/10 p-8 rounded-3xl mt-6 text-5xl font-black tracking-[0.4em] border-2 border-dashed border-white/30 backdrop-blur-sm">
                {showCode}
            </div>
            <button onClick={() => setShowCode(null)} className="mt-10 w-full py-5 bg-white text-green-700 font-black rounded-3xl shadow-xl">Continuer</button>
        </div>
      )}

      {editingAccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
            <div className="bg-white dark:bg-slate-800 w-full max-w-md p-10 rounded-[3.5rem] shadow-2xl animate-in zoom-in-95">
                <h3 className="text-2xl font-black mb-6 dark:text-white flex items-center">
                    <span className="mr-3">🔑</span> Modifier Accès
                </h3>
                <form onSubmit={handleUpdateAccess} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Identifiant</label>
                        <input required value={editingAccess.user} onChange={e => setEditingAccess({...editingAccess, user: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl font-bold dark:text-white" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Mot de Passe</label>
                        <input required value={editingAccess.pass} onChange={e => setEditingAccess({...editingAccess, pass: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl font-bold dark:text-white" />
                    </div>
                    <div className="flex space-x-3 pt-4">
                        <button type="button" onClick={() => setEditingAccess(null)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 font-black rounded-2xl dark:text-white">Annuler</button>
                        <button type="submit" className="flex-1 py-4 bg-green-700 text-white font-black rounded-2xl">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm sticky top-24">
            <h3 className="text-xl font-black mb-8 dark:text-white flex items-center">
                <span className="mr-3 bg-green-100 dark:bg-green-900/30 p-2 rounded-xl">➕</span> Inscrire Client
            </h3>
            <form onSubmit={addPlantation} className="space-y-5">
              <input required placeholder="Nom Plantation" value={newPlantation.name} onChange={e => setNewPlantation({...newPlantation, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl dark:text-white font-bold" />
              <input required placeholder="Nom du Gérant" value={newPlantation.owner} onChange={e => setNewPlantation({...newPlantation, owner: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl dark:text-white font-bold" />
              
              <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-[2.5rem] space-y-4">
                  <p className="text-[10px] font-black uppercase text-green-600 tracking-widest text-center">Identifiants par défaut</p>
                  <input required placeholder="Utilisateur" value={newPlantation.adminUser} onChange={e => setNewPlantation({...newPlantation, adminUser: e.target.value})} className="w-full px-5 py-4 bg-white dark:bg-slate-800 border-none rounded-xl text-sm font-bold dark:text-white" />
                  <input required type="password" placeholder="Mot de Passe" value={newPlantation.adminPass} onChange={e => setNewPlantation({...newPlantation, adminPass: e.target.value})} className="w-full px-5 py-4 bg-white dark:bg-slate-800 border-none rounded-xl text-sm font-bold dark:text-white" />
              </div>

              <button className="w-full bg-green-700 text-white font-black py-6 rounded-[2.5rem] shadow-2xl hover:bg-green-800 transition-all uppercase text-xs tracking-widest">
                Créer l'entreprise
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-[3.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center bg-slate-50/30 dark:bg-slate-700/30">
               <h3 className="font-black text-2xl dark:text-white uppercase">Portefeuille Clients</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase">Client</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase">Admin Accès</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {state.plantations.filter(p => p.id !== 'SYSTEM').map(p => {
                    const adminUser = state.users.find(u => u.plantationId === p.id && u.role === UserRole.ADMIN);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-700/20 transition-colors">
                        <td className="px-10 py-8">
                          <div className="flex items-center space-x-6">
                              <div className="w-16 h-16 rounded-[1.5rem] bg-green-50 dark:bg-green-900/20 text-green-700 font-black flex items-center justify-center border-2 border-green-100 dark:border-green-900/30 shadow-sm">
                                  {p.id.split('-')[1]}
                              </div>
                              <div>
                                  <p className="font-black text-xl text-slate-800 dark:text-white mb-1">{p.name}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.id}</p>
                              </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                           {adminUser ? (
                             <button 
                               onClick={() => setEditingAccess({plantationId: p.id, userId: adminUser.id, user: adminUser.username, pass: adminUser.password || ''})}
                               className="text-left group"
                             >
                                <p className="text-sm font-black dark:text-white group-hover:text-green-600 flex items-center">
                                  {adminUser.username} <span className="ml-2 text-xs opacity-0 group-hover:opacity-100">✏️</span>
                                </p>
                                <p className="text-[10px] text-slate-400 font-bold">Pass: ••••••••</p>
                             </button>
                           ) : (
                             <span className="text-xs text-red-400 font-bold">❌ Erreur utilisateur</span>
                           )}
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex justify-end space-x-3">
                              <button 
                                  onClick={() => toggleStatus(p.id)} 
                                  className={`p-4 rounded-2xl border-2 transition-all ${p.status === 'ACTIVE' ? 'border-amber-100 text-amber-600' : 'border-green-100 text-green-600'}`}
                              >
                                {p.status === 'ACTIVE' ? '⏸️' : '▶️'}
                              </button>
                              <button 
                                  onClick={() => deletePlantation(p.id)} 
                                  className="p-4 rounded-2xl border-2 border-red-50 text-red-400 hover:bg-red-500 hover:text-white"
                              >
                                🗑️
                              </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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


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

  const getMagicLink = (plantationId: string) => {
    // On prépare un mini-état contenant uniquement les infos de cette plantation
    const plantationData = {
      plantations: state.plantations.filter(p => p.id === plantationId),
      users: state.users.filter(u => u.plantationId === plantationId),
      activities: [],
      sales: [],
      cashMovements: []
    };
    const configStr = btoa(JSON.stringify(plantationData));
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?config=${configStr}`;
  };

  const shareViaWhatsApp = (p: Plantation) => {
    const admin = state.users.find(u => u.plantationId === p.id && u.role === UserRole.ADMIN);
    const link = getMagicLink(p.id);
    const text = `*PLAMERAIE BST - Vos Accès*%0A%0APlantation: ${p.name}%0ACode: ${p.id}%0AUtilisateur: ${admin?.username}%0AMot de passe: ${admin?.password}%0A%0A*CLIQUEZ ICI POUR ACTIVER VOTRE APP :*%0A${link}`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
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
    if (confirm("Supprimer définitivement cette entreprise ?")) {
      setState(prev => ({
        ...prev,
        plantations: prev.plantations.filter(p => p.id !== id),
        users: prev.users.filter(u => u.plantationId !== id)
      }));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
        <h2 className="text-4xl font-black mb-2 tracking-tighter">👑 Console Maître</h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Super-Admin : MiguelF</p>
      </div>

      {showCode && (
        <div className="bg-green-700 text-white p-10 rounded-[3.5rem] shadow-2xl animate-in zoom-in text-center border-4 border-white/20">
            <h4 className="font-black text-2xl mb-4">Entreprise Créée !</h4>
            <div className="bg-white/10 p-6 rounded-2xl text-5xl font-black tracking-widest mb-6">{showCode}</div>
            <button onClick={() => {
                const p = state.plantations.find(pl => pl.id === showCode);
                if (p) shareViaWhatsApp(p);
                setShowCode(null);
            }} className="w-full py-5 bg-white text-green-700 font-black rounded-2xl shadow-xl flex items-center justify-center space-x-3">
                <span>🟢 Partager via WhatsApp</span>
            </button>
        </div>
      )}

      {editingAccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
            <div className="bg-white dark:bg-slate-800 w-full max-w-md p-10 rounded-[3.5rem] shadow-2xl">
                <h3 className="text-2xl font-black mb-6 dark:text-white">Modifier Accès</h3>
                <form onSubmit={handleUpdateAccess} className="space-y-4">
                    <input required value={editingAccess.user} onChange={e => setEditingAccess({...editingAccess, user: e.target.value})} className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-700 rounded-2xl font-bold dark:text-white" placeholder="Utilisateur" />
                    <input required value={editingAccess.pass} onChange={e => setEditingAccess({...editingAccess, pass: e.target.value})} className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-700 rounded-2xl font-bold dark:text-white" placeholder="Mot de passe" />
                    <div className="flex space-x-3 pt-4">
                        <button type="button" onClick={() => setEditingAccess(null)} className="flex-1 py-4 bg-slate-200 dark:bg-slate-700 font-black rounded-2xl">Annuler</button>
                        <button type="submit" className="flex-1 py-4 bg-green-700 text-white font-black rounded-2xl">Sauvegarder</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm sticky top-24">
            <h3 className="text-xl font-black mb-6 dark:text-white">➕ Nouveau Client</h3>
            <form onSubmit={addPlantation} className="space-y-4">
              <input required placeholder="Nom Plantation" value={newPlantation.name} onChange={e => setNewPlantation({...newPlantation, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 rounded-2xl dark:text-white font-bold" />
              <input required placeholder="Gérant" value={newPlantation.owner} onChange={e => setNewPlantation({...newPlantation, owner: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 rounded-2xl dark:text-white font-bold" />
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl space-y-2">
                  <input required placeholder="Utilisateur" value={newPlantation.adminUser} onChange={e => setNewPlantation({...newPlantation, adminUser: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-slate-800 rounded-xl text-sm font-bold dark:text-white" />
                  <input required type="password" placeholder="Mot de Passe" value={newPlantation.adminPass} onChange={e => setNewPlantation({...newPlantation, adminPass: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-slate-800 rounded-xl text-sm font-bold dark:text-white" />
              </div>
              <button className="w-full bg-green-700 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-green-800 transition-all">Générer Accès</button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-[3.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 dark:border-slate-700 bg-slate-50/30">
               <h3 className="font-black text-2xl dark:text-white">Portefeuille Clients</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase">Plantation</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase">Admin</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {state.plantations.filter(p => p.id !== 'SYSTEM').map(p => {
                    const admin = state.users.find(u => u.plantationId === p.id && u.role === UserRole.ADMIN);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-8 py-6">
                            <p className="font-black text-lg dark:text-white">{p.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{p.id} • {p.ownerName}</p>
                        </td>
                        <td className="px-8 py-6">
                           <button onClick={() => setEditingAccess({plantationId: p.id, userId: admin!.id, user: admin!.username, pass: admin!.password || ''})} className="text-left">
                                <p className="text-sm font-black dark:text-white">{admin?.username}</p>
                                <p className="text-[10px] text-slate-400">Pass: ••••••••</p>
                           </button>
                        </td>
                        <td className="px-8 py-6 text-right space-x-2">
                            <button onClick={() => shareViaWhatsApp(p)} className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all" title="Lien Magique WhatsApp">📲</button>
                            <button onClick={() => toggleStatus(p.id)} className={`p-3 rounded-xl border ${p.status === 'ACTIVE' ? 'text-amber-500 border-amber-100' : 'text-green-500 border-green-100'}`}>{p.status === 'ACTIVE' ? '⏸️' : '▶️'}</button>
                            <button onClick={() => deletePlantation(p.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl">🗑️</button>
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

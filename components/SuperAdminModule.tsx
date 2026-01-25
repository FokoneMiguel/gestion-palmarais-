import React, { useState } from 'react';
import { AppState, Plantation, User, UserRole } from '../types';

interface SuperAdminModuleProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  t: any;
}

const SuperAdminModule: React.FC<SuperAdminModuleProps> = ({ state, setState, t }) => {
  const [newPlantation, setNewPlantation] = useState({ name: '', owner: '', email: '' });
  const [showCode, setShowCode] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const saT = t.superAdmin;

  const generateShareLink = (pId: string) => {
    const p = state.plantations.find(pl => pl.id === pId);
    const companyUsers = state.users.filter(u => u.plantationId === pId);
    const config = { plantations: [p], users: companyUsers };
    const base64 = btoa(unescape(encodeURIComponent(JSON.stringify(config))));
    const url = `${window.location.origin}${window.location.pathname}?config=${base64}`;
    
    navigator.clipboard.writeText(url);
    alert("🔗 Lien d'activation copié ! Envoyez-le au client.");
  };

  const addPlantation = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `PALM-${Math.floor(100 + Math.random() * 899)}`;
    const plantation: Plantation = {
      id, name: newPlantation.name, ownerName: newPlantation.owner, contactEmail: newPlantation.email,
      status: 'ACTIVE', expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    const defaultAdmin: User = { id: `user-${Date.now()}`, username: 'admin', password: 'admin', role: UserRole.ADMIN, plantationId: id };

    setState(prev => ({ ...prev, plantations: [...prev.plantations, plantation], users: [...prev.users, defaultAdmin] }));
    setShowCode(id);
    setNewPlantation({ name: '', owner: '', email: '' });
  };

  const handleUpdateCreds = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setState(prev => ({ ...prev, users: prev.users.map(u => u.id === editingUser.id ? editingUser : u) }));
      setEditingUser(null);
      alert("Identifiants mis à jour !");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <h2 className="text-3xl font-black mb-1">👑 Bonjour, MiguelF</h2>
        <p className="text-slate-400 text-sm">Gestionnaire Maître Plameraie BST</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-xl font-black mb-6 dark:text-white">Inscrire un Client</h3>
          <form onSubmit={addPlantation} className="space-y-4">
            <input required placeholder="Nom de la Palmeraie" value={newPlantation.name} onChange={e => setNewPlantation({...newPlantation, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none dark:text-white font-bold" />
            <input required placeholder="Nom du Gérant" value={newPlantation.owner} onChange={e => setNewPlantation({...newPlantation, owner: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none dark:text-white font-bold" />
            <input required type="email" placeholder="Email de contact" value={newPlantation.email} onChange={e => setNewPlantation({...newPlantation, email: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none dark:text-white font-bold" />
            <button className="w-full bg-green-700 text-white font-black py-5 rounded-2xl shadow-lg uppercase text-xs tracking-widest">Créer le Compte</button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Client</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Identifiants</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {state.plantations.filter(p => p.id !== 'SYSTEM').map(p => {
                const admin = state.users.find(u => u.plantationId === p.id && u.role === UserRole.ADMIN);
                return (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-black text-slate-800 dark:text-white">{p.name}</p>
                      <p className="text-[10px] text-green-600 font-mono font-black">{p.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      {admin ? (
                        <button onClick={() => setEditingUser(admin)} className="text-left">
                          <p className="text-xs font-bold dark:text-slate-300">U: <span className="text-blue-500">{admin.username}</span></p>
                          <p className="text-xs font-bold dark:text-slate-300">P: <span className="text-blue-500">{admin.password}</span></p>
                        </button>
                      ) : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => generateShareLink(p.id)} className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-[9px] font-black px-3 py-2 rounded-xl uppercase tracking-widest">Copier Lien</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
           <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-[3rem] p-8">
              <h3 className="text-xl font-black mb-6 dark:text-white">Modifier Admin</h3>
              <form onSubmit={handleUpdateCreds} className="space-y-4">
                <input required value={editingUser.username} onChange={e => setEditingUser({...editingUser, username: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700 border rounded-2xl outline-none dark:text-white font-bold" />
                <input required value={editingUser.password} onChange={e => setEditingUser({...editingUser, password: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700 border rounded-2xl outline-none dark:text-white font-bold" />
                <button type="submit" className="w-full py-4 bg-green-700 text-white rounded-2xl font-black uppercase text-xs">Enregistrer</button>
                <button type="button" onClick={() => setEditingUser(null)} className="w-full py-4 text-slate-400 font-bold text-xs uppercase">Annuler</button>
              </form>
           </div>
        </div>
      )}

      {showCode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-green-900/60 backdrop-blur-xl">
            <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl text-center max-w-sm w-full animate-in zoom-in">
                <h4 className="text-2xl font-black mb-2 dark:text-white">Compte Créé !</h4>
                <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-3xl mb-6 border-2 border-dashed border-green-200">
                    <p className="text-4xl font-black tracking-widest text-green-700 dark:text-green-400">{showCode}</p>
                </div>
                <button onClick={() => { generateShareLink(showCode); setShowCode(null); }} className="w-full py-5 bg-green-700 text-white rounded-2xl font-black uppercase text-xs">Copier le Lien d'Activation</button>
            </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminModule;
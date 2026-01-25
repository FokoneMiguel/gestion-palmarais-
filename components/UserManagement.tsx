import React, { useState } from 'react';
import { AppState, User, UserRole } from '../types';

interface UserManagementProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  t: any;
}

const UserManagement: React.FC<UserManagementProps> = ({ state, setState, t }) => {
  const [newUser, setNewUser] = useState({ username: '', password: '', role: UserRole.EMPLOYEE });

  const currentPId = state.currentUser?.plantationId;
  const currentP = state.plantations.find(p => p.id === currentPId);
  const filteredUsers = state.users.filter(u => u.plantationId === currentPId);

  const generateConfigLink = () => {
    const p = state.plantations.find(pl => pl.id === currentPId);
    const companyUsers = state.users.filter(u => u.plantationId === currentPId);
    const config = { plantations: [p], users: companyUsers };
    const base64 = btoa(unescape(encodeURIComponent(JSON.stringify(config))));
    return `${window.location.origin}${window.location.pathname}?config=${base64}`;
  };

  const shareEmployeeWhatsApp = (u: User) => {
    const link = generateConfigLink();
    const message = `*PLAMERAIE BST - Ton Accès Employé*\n\nSalut *${u.username}*,\nVoici ton accès pour la plantation *${currentP?.name}*.\n\n*Utilisateur:* ${u.username}\n*Mot de passe:* ${u.password}\n\n👉 *CLIQUE ICI POUR CONFIGURER TON APP:* ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.users.find(u => u.username.toLowerCase() === newUser.username.toLowerCase())) {
        return alert("Ce nom d'utilisateur est déjà pris.");
    }

    const user: User = { 
      id: `user-${Date.now()}`, 
      username: newUser.username, 
      password: newUser.password, 
      role: newUser.role,
      plantationId: currentPId || ''
    };

    setState(prev => ({ ...prev, users: [...prev.users, user] }));
    setNewUser({ username: '', password: '', role: UserRole.EMPLOYEE });
    alert("Compte créé ! Vous pouvez maintenant l'envoyer par WhatsApp.");
  };

  const deleteUser = (uId: string) => {
    if (confirm("Supprimer cet accès ? L'employé ne pourra plus se connecter.")) {
        setState(prev => ({ ...prev, users: prev.users.filter(u => u.id !== uId) }));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">Équipe de Terrain</h2>
            <p className="text-slate-500 font-medium">Gérez vos ouvriers et leurs permissions.</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 px-6 py-3 rounded-[1.5rem] border border-amber-100 dark:border-amber-800 flex items-center space-x-3">
             <span className="text-xl">📱</span>
             <div>
                <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Code Plantation Unique</p>
                <p className="text-sm font-black dark:text-white tracking-widest">{currentPId}</p>
             </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/20">
            <h3 className="text-xl font-black mb-6 dark:text-white flex items-center">
                <span className="mr-2">👤</span> Nouvel Employé
            </h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Utilisateur</label>
                <input required value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} placeholder="ex: paul" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none dark:text-white font-bold focus:ring-2 focus:ring-green-500 transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Mot de passe</label>
                <input required value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} placeholder="ex: 1234" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none dark:text-white font-bold focus:ring-2 focus:ring-green-500 transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Rôle</label>
                <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none dark:text-white font-bold focus:ring-2 focus:ring-green-500 transition-all appearance-none">
                    <option value={UserRole.EMPLOYEE}>👷 Ouvrier (Terrain)</option>
                    <option value={UserRole.ADMIN}>💼 Gestionnaire (Admin)</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-green-700 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-green-800 transition-all transform active:scale-95 uppercase text-xs tracking-widest mt-2">Créer le compte</button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                <tr>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Utilisateur</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rôle</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group">
                    <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-black text-slate-500 uppercase">{u.username.charAt(0)}</div>
                            <div>
                                <p className="text-sm font-black text-slate-800 dark:text-white">{u.username}</p>
                                <p className="text-[9px] text-slate-400 font-bold font-mono">PWD: {u.password}</p>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border ${u.role === UserRole.ADMIN ? 'border-blue-100 text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-100 text-slate-500 bg-slate-50 dark:bg-slate-900/20'}`}>
                            {u.role}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                            <button onClick={() => shareEmployeeWhatsApp(u)} className="bg-[#25D366] text-white p-2.5 rounded-xl shadow-lg shadow-green-500/10 hover:scale-110 transition-transform flex items-center space-x-1">
                                <span className="text-lg">💬</span>
                                <span className="text-[8px] font-black uppercase tracking-tighter pr-1 hidden sm:inline">Inviter</span>
                            </button>
                            {u.id !== state.currentUser?.id && (
                                <button onClick={() => deleteUser(u.id)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                                    🗑️
                                </button>
                            )}
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-slate-900 text-white rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
                <span className="text-3xl">🔗</span>
                <div>
                    <p className="font-black text-sm">Lien d'équipe global</p>
                    <p className="text-[10px] text-slate-400">Pour configurer tous les téléphones d'un coup.</p>
                </div>
            </div>
            <button 
                onClick={() => {
                    navigator.clipboard.writeText(generateConfigLink());
                    alert("🔗 Lien d'équipe copié !");
                }}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border border-white/10"
            >
                Copier Lien Global
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
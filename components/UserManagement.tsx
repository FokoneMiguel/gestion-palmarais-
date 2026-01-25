import React, { useState } from 'react';
import { AppState, User, UserRole } from '../types';

interface UserManagementProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  t: any;
}

const UserManagement: React.FC<UserManagementProps> = ({ state, setState, t }) => {
  const [newUser, setNewUser] = useState({ username: '', password: '', role: UserRole.EMPLOYEE });

  const filteredUsers = state.users.filter(u => u.plantationId === state.currentUser?.plantationId);

  const generateEmployeeLink = () => {
    const pId = state.currentUser?.plantationId;
    const p = state.plantations.find(pl => pl.id === pId);
    // On envoie la plantation et TOUS les utilisateurs de cette plantation pour que tout le monde soit synchrone
    const companyUsers = state.users.filter(u => u.plantationId === pId);
    const config = { plantations: [p], users: companyUsers };
    const base64 = btoa(unescape(encodeURIComponent(JSON.stringify(config))));
    const url = `${window.location.origin}${window.location.pathname}?config=${base64}`;
    
    navigator.clipboard.writeText(url);
    alert("🔗 Lien d'invitation copié ! Envoyez-le à vos employés pour configurer leur téléphone.");
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.users.find(u => u.username === newUser.username)) return alert("Utilisateur déjà existant.");

    const user: User = { 
      id: `user-${Date.now()}`, 
      username: newUser.username, 
      password: newUser.password, 
      role: newUser.role,
      plantationId: state.currentUser?.plantationId || ''
    };

    setState(prev => ({ ...prev, users: [...prev.users, user] }));
    setNewUser({ username: '', password: '', role: UserRole.EMPLOYEE });
    alert("Compte créé ! N'oubliez pas de générer un nouveau lien pour mettre à jour les téléphones.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">Équipe de Terrain</h2>
            <p className="text-slate-500 text-sm">Gérez vos employés et leurs accès.</p>
          </div>
          <button onClick={generateEmployeeLink} className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-200">Générer Lien Invité</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-black mb-6 dark:text-white">Nouvel Accès</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <input required value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} placeholder="Utilisateur" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700 border rounded-2xl outline-none dark:text-white font-bold" />
              <input required type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} placeholder="Mot de passe" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700 border rounded-2xl outline-none dark:text-white font-bold" />
              <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700 border rounded-2xl outline-none dark:text-white font-bold">
                <option value={UserRole.EMPLOYEE}>Ouvrier (Accès Limité)</option>
                <option value={UserRole.ADMIN}>Gestionnaire (Accès Total)</option>
              </select>
              <button type="submit" className="w-full bg-green-700 text-white font-black py-4 rounded-2xl shadow-lg">Ajouter</button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Utilisateur</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Rôle</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold dark:text-white">{u.username}</td>
                  <td className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">{u.role}</td>
                  <td className="px-6 py-4">
                    {u.id !== state.currentUser?.id && <button onClick={() => setState(prev => ({ ...prev, users: prev.users.filter(usr => usr.id !== u.id) }))} className="text-red-500 font-bold text-xs uppercase">Retirer</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

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
  const currentPlantation = state.plantations.find(p => p.id === state.currentUser?.plantationId);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newUser.username.trim();
    if (state.users.find(u => u.username.toLowerCase() === cleanName.toLowerCase())) {
        return alert("Ce nom d'utilisateur est déjà utilisé.");
    }

    const user: User = { 
      id: `user-${Date.now()}`, 
      username: cleanName, 
      password: newUser.password.trim(), 
      role: newUser.role,
      plantationId: state.currentUser?.plantationId || ''
    };

    setState(prev => ({ ...prev, users: [...prev.users, user] }));
    setNewUser({ username: '', password: '', role: UserRole.EMPLOYEE });
    alert("Compte créé ! Vous pouvez maintenant partager l'accès.");
  };

  const getInviteLink = (username: string, pass: string) => {
    const data = {
      plantations: [currentPlantation],
      users: state.users.filter(u => u.username === username), // On n'envoie que son compte
      activities: [], sales: [], cashMovements: []
    };
    const config = btoa(JSON.stringify(data));
    return `${window.location.origin}${window.location.pathname}?config=${config}`;
  };

  const shareAccess = (user: User) => {
    const link = getInviteLink(user.username, user.password || '');
    const text = `*Invitation Plameraie BST*%0A%0AHello ${user.username}, voici ton accès à la plantation *${currentPlantation?.name}* :%0A%0AUtilisateur: ${user.username}%0APass: ${user.password}%0ACode: ${user.plantationId}%0A%0A*Clique ici pour configurer ton app :*%0A${link}`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const deleteUser = (id: string) => {
    if (state.currentUser?.id === id) return alert("Interdit.");
    if (confirm("Supprimer cet accès ?")) {
        setState(prev => ({ ...prev, users: prev.users.filter(u => u.id !== id) }));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Membres de l'Équipe</h2>
            <p className="text-slate-500 text-sm font-medium">Gérez qui peut voir et modifier les données de votre plantation.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Identifiant Équipe</p>
              <p className="text-lg font-black text-green-700 text-center">{state.currentUser?.plantationId}</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm sticky top-24">
            <h3 className="text-xl font-black mb-8 dark:text-white flex items-center">
                <span className="mr-3 bg-blue-50 dark:bg-blue-900/30 p-2 rounded-xl text-lg">👤</span> Ajouter un membre
            </h3>
            <form onSubmit={handleAddUser} className="space-y-5">
              <input required placeholder="Nom d'utilisateur" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 rounded-2xl font-bold dark:text-white border-none" />
              <input required type="text" placeholder="Mot de Passe" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 rounded-2xl font-bold dark:text-white border-none" />
              <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 rounded-2xl font-bold dark:text-white border-none">
                <option value={UserRole.EMPLOYEE}>👨‍🌾 Employé de terrain</option>
                <option value={UserRole.ADMIN}>👨‍💼 Co-Administrateur</option>
              </select>
              <button type="submit" className="w-full bg-green-700 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-green-800 transition-all uppercase text-xs tracking-widest">Créer le compte</button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase">Utilisateur</th>
                  <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase">Rôle</th>
                  <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-black text-slate-500">
                                {u.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-black text-slate-800 dark:text-white">{u.username}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">{u.password}</p>
                            </div>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {u.role === UserRole.ADMIN ? 'ADMIN' : 'EMPLOYÉ'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right space-x-2">
                      {u.id !== state.currentUser?.id && (
                        <>
                          <button onClick={() => shareAccess(u)} className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all">📲</button>
                          <button onClick={() => deleteUser(u.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">🗑️</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;


import React, { useState } from 'react';
import { AppState, User, UserRole } from '../types';

interface UserManagementProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  t: any;
}

const UserManagement: React.FC<UserManagementProps> = ({ state, setState, t }) => {
  const [newUser, setNewUser] = useState({ username: '', password: '', role: UserRole.EMPLOYEE });

  // On ne montre que les utilisateurs qui appartiennent à la MÊME plantation que l'Admin connecté
  const filteredUsers = state.users.filter(u => u.plantationId === state.currentUser?.plantationId);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérification si l'utilisateur existe déjà
    if (state.users.find(u => u.username === newUser.username)) {
        return alert("Ce nom d'utilisateur est déjà utilisé.");
    }

    const user: User = { 
      id: `user-${Date.now()}`, 
      username: newUser.username, 
      password: newUser.password, 
      role: newUser.role,
      plantationId: state.currentUser?.plantationId || ''
    };

    setState(prev => ({ ...prev, users: [...prev.users, user] }));
    setNewUser({ username: '', password: '', role: UserRole.EMPLOYEE });
    alert("Compte créé avec succès !");
  };

  const deleteUser = (id: string) => {
    const userToDelete = state.users.find(u => u.id === id);
    if (!userToDelete) return;

    if (state.currentUser?.id === id) {
        return alert("Sécurité : Vous ne pouvez pas supprimer votre propre compte Admin.");
    }
    
    if (confirm(`Voulez-vous vraiment supprimer le compte de ${userToDelete.username} ?`)) {
        setState(prev => ({ ...prev, users: prev.users.filter(u => u.id !== id) }));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t.users}</h2>
            <p className="text-slate-500 text-sm">Gérez l'accès de votre équipe de terrain.</p>
          </div>
          <div className="text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Votre Plantation</span>
              <span className="text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full">{state.currentUser?.plantationId}</span>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-bold mb-6 dark:text-white flex items-center">
                <span className="mr-2">👤+</span> Nouvel Employé
            </h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">{t.username}</label>
                <input required type="text" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} placeholder="ex: Jean_Ouvrier" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">{t.password}</label>
                <input required type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">{t.role}</label>
                <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white">
                  <option value={UserRole.EMPLOYEE}>{t.employee} (Accès terrain uniquement)</option>
                  <option value={UserRole.ADMIN}>{t.admin} (Accès complet à la gestion)</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95">
                Créer le compte
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 dark:border-slate-700">
                <h3 className="font-bold dark:text-white">Membres de votre équipe ({filteredUsers.length})</h3>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">{t.username}</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">{t.role}</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500">
                                {u.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-bold dark:text-white">{u.username}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {u.role === UserRole.ADMIN ? 'ADMINISTRATEUR' : 'OUVRIER / EMPLOYÉ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {u.id !== state.currentUser?.id ? (
                        <button 
                            onClick={() => deleteUser(u.id)}
                            className="text-red-500 hover:text-red-700 font-bold bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-xl transition-colors"
                        >
                            Supprimer
                        </button>
                      ) : (
                        <span className="text-slate-300 italic text-xs">Vous (Actif)</span>
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

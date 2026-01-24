
import React, { useState } from 'react';
import { AppState, User, UserRole } from '../types';

interface UserManagementProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  t: any;
}

const UserManagement: React.FC<UserManagementProps> = ({ state, setState, t }) => {
  const [newUser, setNewUser] = useState({ username: '', password: '', role: UserRole.EMPLOYEE });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = { 
      id: Date.now().toString(), 
      username: newUser.username, 
      password: newUser.password, 
      role: newUser.role,
      // Ensure the new user belongs to the same plantation as the current user
      plantationId: state.currentUser?.plantationId || ''
    };
    setState(prev => ({ ...prev, users: [...prev.users, user] }));
    setNewUser({ username: '', password: '', role: UserRole.EMPLOYEE });
  };

  const deleteUser = (id: string) => {
    if (state.currentUser?.id === id) return alert("Vous ne pouvez pas supprimer votre propre compte.");
    setState(prev => ({ ...prev, users: prev.users.filter(u => u.id !== id) }));
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t.users}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Ajouter un Utilisateur</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.username}</label>
                <input required type="text" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.password}</label>
                <input required type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.role}</label>
                <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white">
                  <option value={UserRole.ADMIN}>{t.admin}</option>
                  <option value={UserRole.EMPLOYEE}>{t.employee}</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2 rounded-xl transition-colors">
                Créer le compte
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t.username}</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t.role}</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {state.users.map(u => (
                  <tr key={u.id}>
                    <td className="px-6 py-4 text-sm font-medium dark:text-white">{u.username}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button 
                        onClick={() => deleteUser(u.id)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        Supprimer
                      </button>
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


import React, { useState } from 'react';
import { AppState, Plantation, User, UserRole } from '../types';

interface SuperAdminModuleProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const SuperAdminModule: React.FC<SuperAdminModuleProps> = ({ state, setState }) => {
  const [newPlantation, setNewPlantation] = useState({ name: '', owner: '', email: '' });
  const [showCode, setShowCode] = useState<string | null>(null);

  const addPlantation = (e: React.FormEvent) => {
    e.preventDefault();
    // Génère un code unique pour le client
    const id = `PALM-${Math.floor(100 + Math.random() * 899)}`;
    
    const plantation: Plantation = {
      id,
      name: newPlantation.name,
      ownerName: newPlantation.owner,
      contactEmail: newPlantation.email,
      status: 'ACTIVE',
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    // On crée aussi un utilisateur "admin" par défaut pour ce code
    const defaultAdmin: User = {
        id: `user-${Date.now()}`,
        username: 'admin',
        password: 'admin',
        role: UserRole.ADMIN,
        plantationId: id
    };

    setState(prev => ({ 
        ...prev, 
        plantations: [...prev.plantations, plantation],
        users: [...prev.users, defaultAdmin]
    }));
    
    setShowCode(id);
    setNewPlantation({ name: '', owner: '', email: '' });
  };

  const toggleStatus = (id: string) => {
    setState(prev => ({
      ...prev,
      plantations: prev.plantations.map(p => 
        p.id === id ? { ...p, status: p.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : p
      )
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-3xl shadow-2xl border border-slate-700">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black mb-2 flex items-center">
              <span className="mr-3">👑</span> Bonjour, MiguelF
            </h2>
            <p className="text-slate-400">Bienvenue dans votre console de gestion Plameraie BST.</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl">
             <span className="text-green-400 font-bold">{state.plantations.length} Entreprises Clientes</span>
          </div>
        </div>
      </div>

      {showCode && (
        <div className="bg-green-700 text-white p-6 rounded-3xl shadow-lg animate-bounce">
            <h4 className="font-bold mb-2">✅ Entreprise créée avec succès !</h4>
            <p className="text-sm opacity-90">Donnez ce code à votre client :</p>
            <div className="bg-white/20 p-4 rounded-xl mt-2 text-3xl font-black text-center tracking-widest border border-white/30">
                {showCode}
            </div>
            <p className="text-xs mt-4 italic">* Identifiants par défaut : admin / admin</p>
            <button onClick={() => setShowCode(null)} className="mt-4 text-xs underline font-bold">Fermer ce message</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold mb-6 dark:text-white">Inscrire un nouveau client</h3>
          <form onSubmit={addPlantation} className="space-y-4">
            <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Nom de la Plantation</label>
                <input 
                    required placeholder="Ex: Palmeraie du Sud"
                    value={newPlantation.name} onChange={e => setNewPlantation({...newPlantation, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
                />
            </div>
            <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Nom du Gérant</label>
                <input 
                    required placeholder="Ex: M. Kouassi"
                    value={newPlantation.owner} onChange={e => setNewPlantation({...newPlantation, owner: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
                />
            </div>
            <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Email de contact</label>
                <input 
                    required type="email" placeholder="client@email.com"
                    value={newPlantation.email} onChange={e => setNewPlantation({...newPlantation, email: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
                />
            </div>
            <button className="w-full bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-green-800 transition-all transform active:scale-95">
              Valider & Générer le Code
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 dark:border-slate-700">
             <h3 className="font-bold dark:text-white">Vos Clients Actifs</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Code Client</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Plantation</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Statut</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {state.plantations.filter(p => p.id !== 'SYSTEM').map(p => (
                <tr key={p.id}>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-mono font-bold text-sm">
                        {p.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold dark:text-white">{p.name}</p>
                    <p className="text-[10px] text-slate-400">{p.ownerName} • {p.contactEmail}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.status === 'ACTIVE' ? 'PAIEMENT OK' : 'SUSPENDU'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                        onClick={() => toggleStatus(p.id)} 
                        className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all ${p.status === 'ACTIVE' ? 'border-red-200 text-red-500 hover:bg-red-50' : 'border-green-200 text-green-500 hover:bg-green-50'}`}
                    >
                      {p.status === 'ACTIVE' ? 'Désactiver le compte' : 'Réactiver'}
                    </button>
                  </td>
                </tr>
              ))}
              {state.plantations.length <= 1 && (
                  <tr>
                      <td colSpan={4} className="p-12 text-center text-slate-400 italic">Vous n'avez pas encore de client. Inscrivez votre premier client à gauche !</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminModule;

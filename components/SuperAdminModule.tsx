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

  const generateActivationLink = (pId: string) => {
    const p = state.plantations.find(pl => pl.id === pId);
    const companyUsers = state.users.filter(u => u.plantationId === pId);
    const config = { plantations: [p], users: companyUsers };
    const base64 = btoa(unescape(encodeURIComponent(JSON.stringify(config))));
    return `${window.location.origin}${window.location.pathname}?config=${base64}`;
  };

  const shareWhatsApp = (pId: string) => {
    const p = state.plantations.find(pl => pl.id === pId);
    const link = generateActivationLink(pId);
    const message = `*PLAMERAIE BST - Accès Officiel*\n\nBonjour ${p?.ownerName},\nVoici vos accès pour la plantation *${p?.name}*.\n\n*Code:* ${pId}\n*Identifiants:* admin / admin\n\n👉 *CLIQUEZ ICI POUR ACTIVER:* ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const toggleSuspension = (pId: string) => {
    setState(prev => ({
      ...prev,
      plantations: prev.plantations.map(p => 
        p.id === pId ? { ...p, status: p.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : p
      )
    }));
  };

  const deletePlantation = (pId: string) => {
    if (confirm("🚨 ATTENTION : Supprimer cette entreprise effacera toutes ses données et ses accès. Continuer ?")) {
      setState(prev => ({
        ...prev,
        plantations: prev.plantations.filter(p => p.id !== pId),
        users: prev.users.filter(u => u.plantationId !== pId),
        activities: prev.activities.filter(a => a.plantationId !== pId),
        sales: prev.sales.filter(s => s.plantationId !== pId)
      }));
    }
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
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-green-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden border border-slate-700">
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-1 tracking-tighter">👑 MiguelF Control</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Master Console Plameraie BST</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire de création */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700">
          <h3 className="text-xl font-black mb-6 dark:text-white flex items-center">
            <span className="mr-2">➕</span> Nouveau Client
          </h3>
          <form onSubmit={addPlantation} className="space-y-5">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-1 ml-1 block">Nom de la Palmeraie</label>
              <input required placeholder="Ex: Avocatier Sud" value={newPlantation.name} onChange={e => setNewPlantation({...newPlantation, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none dark:text-white font-bold transition-all focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-1 ml-1 block">Nom du Gérant</label>
              <input required placeholder="M. Kouamé" value={newPlantation.owner} onChange={e => setNewPlantation({...newPlantation, owner: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none dark:text-white font-bold transition-all focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-1 ml-1 block">Contact Email</label>
              <input required type="email" placeholder="client@palmeraie.com" value={newPlantation.email} onChange={e => setNewPlantation({...newPlantation, email: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none dark:text-white font-bold transition-all focus:ring-2 focus:ring-green-500" />
            </div>
            <button className="w-full bg-green-700 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-green-800 transition-all transform active:scale-95 uppercase text-xs tracking-widest">Générer Accès</button>
          </form>
        </div>

        {/* Liste Interactive des Entreprises */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-4">
            <h3 className="text-xl font-black text-slate-800 dark:text-white">Vos Palmeraies</h3>
            <span className="bg-slate-100 dark:bg-slate-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-slate-500">{state.plantations.filter(p => p.id !== 'SYSTEM').length} Actives</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {state.plantations.filter(p => p.id !== 'SYSTEM').map(p => {
              const admin = state.users.find(u => u.plantationId === p.id && u.role === UserRole.ADMIN);
              const activityCount = state.activities.filter(a => a.plantationId === p.id).length;
              const salesTotal = state.sales.filter(s => s.plantationId === p.id).reduce((sum, s) => sum + s.total, 0);

              return (
                <div key={p.id} className={`bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border ${p.status === 'SUSPENDED' ? 'border-red-200 bg-red-50/10' : 'border-slate-100 dark:border-slate-700'} transition-all hover:shadow-xl group`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center space-x-5">
                      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-inner ${p.status === 'SUSPENDED' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-600'}`}>
                        {p.status === 'SUSPENDED' ? '🚫' : '🌴'}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-black text-lg text-slate-800 dark:text-white">{p.name}</h4>
                          <span className="bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded-lg text-[10px] font-mono font-black text-green-600">{p.id}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-400">{p.ownerName} • {p.contactEmail}</p>
                        <div className="flex space-x-3 mt-2">
                          <span className="text-[10px] font-black uppercase text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">📈 {activityCount} Opérations</span>
                          <span className="text-[10px] font-black uppercase text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">💰 {salesTotal.toLocaleString()} FCFA</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button onClick={() => shareWhatsApp(p.id)} className="flex-1 md:flex-none bg-[#25D366] text-white px-4 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center space-x-2 shadow-lg shadow-green-500/20 hover:scale-105 transition-transform">
                        <span>Lien WhatsApp</span>
                      </button>
                      <button onClick={() => toggleSuspension(p.id)} className={`flex-1 md:flex-none px-4 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${p.status === 'ACTIVE' ? 'border-amber-100 text-amber-600 hover:bg-amber-50' : 'border-green-100 text-green-600 hover:bg-green-50'}`}>
                        {p.status === 'ACTIVE' ? 'Suspendre' : 'Réactiver'}
                      </button>
                      <button onClick={() => deletePlantation(p.id)} className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal Modification Admin */}
      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
           <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-[3rem] p-10 border border-slate-700 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🔑</div>
                <h3 className="text-2xl font-black dark:text-white">Identifiants Client</h3>
              </div>
              <form onSubmit={handleUpdateCreds} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Utilisateur</label>
                  <input required value={editingUser.username} onChange={e => setEditingUser({...editingUser, username: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none dark:text-white font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Mot de passe</label>
                  <input required value={editingUser.password} onChange={e => setEditingUser({...editingUser, password: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none dark:text-white font-bold" />
                </div>
                <button type="submit" className="w-full py-5 bg-green-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Sauvegarder</button>
                <button type="button" onClick={() => setEditingUser(null)} className="w-full py-4 text-slate-400 font-bold text-xs uppercase">Fermer</button>
              </form>
           </div>
        </div>
      )}

      {showCode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-green-900/60 backdrop-blur-xl">
            <div className="bg-white dark:bg-slate-800 p-12 rounded-[4rem] shadow-2xl text-center max-w-sm w-full animate-in zoom-in border border-white/20">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">🎯</div>
                <h4 className="text-3xl font-black mb-2 dark:text-white">C'est prêt !</h4>
                <p className="text-sm text-slate-500 mb-8 font-medium">L'entreprise est enregistrée. Cliquez ci-dessous pour envoyer le lien via WhatsApp.</p>
                <div className="bg-slate-50 dark:bg-slate-700 p-8 rounded-[2.5rem] mb-8 border-2 border-dashed border-green-200">
                    <p className="text-4xl font-black tracking-widest text-green-700 dark:text-green-400">{showCode}</p>
                </div>
                <button onClick={() => { shareWhatsApp(showCode); setShowCode(null); }} className="w-full py-6 bg-[#25D366] text-white rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center justify-center space-x-3 shadow-2xl">
                   <span>WhatsApp le client</span>
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminModule;
import React, { useState } from 'react';
import { ActivityType, AppState, Activity } from '../types';

interface ActivityModuleProps {
  type: ActivityType;
  state: AppState;
  onAdd: (activity: Omit<Activity, 'id' | 'plantationId' | 'updatedAt'>) => void;
  t: any;
}

const ActivityModule: React.FC<ActivityModuleProps> = ({ type, state, onAdd, t }) => {
  const [showModal, setShowModal] = useState(false);
  const [customLabel, setCustomLabel] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    date: new Date().toISOString().split('T')[0],
    zone: '',
    quantity: 0,
    cost: 0,
    workers: '',
    observations: ''
  });

  const predefinedOps = t.opLists ? t.opLists[type] : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label) {
        alert("Veuillez sélectionner ou saisir une opération.");
        return;
    }
    onAdd({
      type,
      label: formData.label,
      date: formData.date,
      zone: formData.zone,
      quantity: formData.quantity,
      cost: formData.cost,
      workers: formData.workers.split(',').map(w => w.trim()).filter(w => w !== ''),
      observations: formData.observations
    });
    setShowModal(false);
    setFormData({ label: '', date: new Date().toISOString().split('T')[0], zone: '', quantity: 0, cost: 0, workers: '', observations: '' });
    setCustomLabel(false);
  };

  const filteredActivities = state.activities.filter(a => a.type === type);

  // Correction cruciale : Définition statique des styles pour éviter le bug Tailwind
  const getModuleStyle = () => {
    switch(type) {
      case 'CREATION': return { btn: 'bg-emerald-700 hover:bg-emerald-800', text: 'text-emerald-700', bg: 'bg-emerald-50' };
      case 'MAINTENANCE': return { btn: 'bg-blue-700 hover:bg-blue-800', text: 'text-blue-700', bg: 'bg-blue-50' };
      case 'HARVEST': return { btn: 'bg-orange-600 hover:bg-orange-700', text: 'text-orange-600', bg: 'bg-orange-50' };
      case 'PACKAGING': return { btn: 'bg-indigo-700 hover:bg-indigo-800', text: 'text-indigo-700', bg: 'bg-indigo-50' };
      default: return { btn: 'bg-slate-700 hover:bg-slate-800', text: 'text-slate-700', bg: 'bg-slate-50' };
    }
  };

  const styles = getModuleStyle();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white capitalize tracking-tighter">{t[type.toLowerCase()]}</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Saisie des travaux de terrain.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className={`${styles.btn} text-white px-10 py-5 rounded-[1.8rem] font-black shadow-2xl transition-all transform hover:scale-105 active:scale-95 uppercase text-xs tracking-[0.15em]`}
        >
          + {t.addOperation}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.date}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Opération</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.zone}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.cost}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Équipe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="opacity-20 text-5xl mb-4">🍃</div>
                    <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Aucune donnée pour {t[type.toLowerCase()]}</p>
                  </td>
                </tr>
              ) : (
                filteredActivities.map(activity => (
                  <tr key={activity.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-8 py-5 text-sm font-black text-slate-500 dark:text-slate-400">{activity.date}</td>
                    <td className="px-8 py-5 text-sm font-black text-slate-800 dark:text-white">{activity.label}</td>
                    <td className="px-8 py-5 text-sm">
                        <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider">{activity.zone}</span>
                    </td>
                    <td className="px-8 py-5 text-sm font-black text-slate-700 dark:text-slate-200">{activity.cost.toLocaleString()} FCFA</td>
                    <td className="px-8 py-5">
                        <div className="flex -space-x-2">
                            {activity.workers.slice(0, 3).map((w, i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase">{w.charAt(0)}</div>
                            ))}
                            {activity.workers.length > 3 && <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-[9px] font-black">+{activity.workers.length - 3}</div>}
                        </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[3rem] shadow-2xl animate-in zoom-in border border-white/10 overflow-hidden">
            <div className={`p-8 ${styles.btn} text-white flex justify-between items-center`}>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight">{t.addOperation}</h3>
                <p className="text-[10px] font-black opacity-70 tracking-widest uppercase mt-1">Saisie Manuelle • {type}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all text-xl font-bold">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Type d'opération</label>
                  {!customLabel ? (
                    <div className="relative">
                        <select required value={formData.label} onChange={e => {
                            if (e.target.value === "Autre..." || e.target.value === "Other...") { setCustomLabel(true); setFormData({...formData, label: ''}); }
                            else { setFormData({...formData, label: e.target.value}); }
                          }} 
                          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none focus:ring-4 focus:ring-green-500/10 dark:text-white font-bold appearance-none"
                        >
                          <option value="">Sélectionner...</option>
                          {predefinedOps.map((op: string) => <option key={op} value={op}>{op}</option>)}
                          <option value="Autre...">➕ Autre (Saisie libre)</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 text-xs">▼</div>
                    </div>
                  ) : (
                    <div className="flex space-x-2 animate-in slide-in-from-right-5">
                        <input required autoFocus type="text" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} placeholder="Saisir l'opération..." className="flex-1 px-6 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none focus:ring-4 focus:ring-green-500/10 dark:text-white font-bold" />
                        <button type="button" onClick={() => setCustomLabel(false)} className="px-4 text-xs font-black text-slate-400 hover:text-green-600 transition-colors">↺</button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">{t.date}</label>
                        <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none dark:text-white font-bold" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">{t.zone}</label>
                        <input required type="text" value={formData.zone} onChange={e => setFormData({...formData, zone: e.target.value})} placeholder="Zone / Parcelle" className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none dark:text-white font-bold" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">{t.cost} (FCFA)</label>
                        <input required type="number" value={formData.cost} onChange={e => setFormData({...formData, cost: Number(e.target.value)})} className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none dark:text-white font-bold" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">{t.quantity}</label>
                        <input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none dark:text-white font-bold" />
                    </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">{t.workers}</label>
                  <input type="text" value={formData.workers} onChange={e => setFormData({...formData, workers: e.target.value})} placeholder="Paul, Moussa, ..." className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none dark:text-white font-bold" />
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 bg-slate-100 dark:bg-slate-700 dark:text-white font-black rounded-2xl hover:bg-slate-200 transition-all uppercase text-[10px] tracking-widest">{t.cancel}</button>
                <button type="submit" className={`flex-1 py-5 ${styles.btn} text-white font-black rounded-2xl shadow-xl transition-all uppercase text-[10px] tracking-widest`}>{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityModule;
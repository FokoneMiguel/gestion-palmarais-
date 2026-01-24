
import React, { useState } from 'react';
import { ActivityType, AppState, Activity, UserRole } from '../types';

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

  const predefinedOps = t.opLists[type] || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      type,
      label: formData.label,
      date: formData.date,
      zone: formData.zone,
      quantity: formData.quantity,
      cost: formData.cost,
      workers: formData.workers.split(',').map(w => w.trim()),
      observations: formData.observations
    });
    setShowModal(false);
    setFormData({ label: '', date: new Date().toISOString().split('T')[0], zone: '', quantity: 0, cost: 0, workers: '', observations: '' });
    setCustomLabel(false);
  };

  const filteredActivities = state.activities.filter(a => a.type === type);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white capitalize tracking-tight">{t[type.toLowerCase()]}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Gestion structurée des opérations de terrain.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-2.5 rounded-2xl font-bold shadow-lg shadow-green-900/20 transition-all transform hover:scale-105"
        >
          + {t.addOperation}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/30">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.date}</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Opération</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.zone}</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.cost}</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ouvriers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-400 italic">Aucune donnée enregistrée pour ce module.</td>
                </tr>
              ) : (
                filteredActivities.map(activity => (
                  <tr key={activity.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium dark:text-slate-400">{activity.date}</td>
                    <td className="px-6 py-4 text-sm font-bold dark:text-white">{activity.label}</td>
                    <td className="px-6 py-4 text-sm dark:text-slate-400">
                        <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-xs">{activity.zone}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-slate-700 dark:text-slate-200">{activity.cost.toLocaleString()} FCFA</td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                        {activity.workers.length > 0 ? activity.workers.join(', ') : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl animate-in zoom-in duration-200 border border-white/10 overflow-hidden">
            <div className="p-6 bg-green-700 text-white flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tight">{t.addOperation}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Type d'opération</label>
                  {!customLabel ? (
                    <select 
                      required 
                      value={formData.label} 
                      onChange={e => {
                        if (e.target.value === "Autre..." || e.target.value === "Other...") {
                          setCustomLabel(true);
                          setFormData({...formData, label: ''});
                        } else {
                          setFormData({...formData, label: e.target.value});
                        }
                      }} 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all"
                    >
                      <option value="">Sélectionner une opération...</option>
                      {predefinedOps.map((op: string) => <option key={op} value={op}>{op}</option>)}
                    </select>
                  ) : (
                    <div className="flex space-x-2">
                        <input 
                            required autoFocus type="text" 
                            value={formData.label} 
                            onChange={e => setFormData({...formData, label: e.target.value})} 
                            placeholder="Nom de l'opération..."
                            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all"
                        />
                        <button onClick={() => setCustomLabel(false)} className="px-3 text-xs font-bold text-slate-400">↺</button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">{t.date}</label>
                        <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">{t.zone}</label>
                        <input required type="text" value={formData.zone} onChange={e => setFormData({...formData, zone: e.target.value})} placeholder="Ex: Zone A1" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">{t.cost} (FCFA)</label>
                        <input required type="number" value={formData.cost} onChange={e => setFormData({...formData, cost: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">{t.quantity}</label>
                        <input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all" />
                    </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">{t.workers}</label>
                  <input type="text" value={formData.workers} onChange={e => setFormData({...formData, workers: e.target.value})} placeholder="Jean, Paul, ..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all" />
                </div>
                
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">{t.observations}</label>
                  <textarea rows={2} value={formData.observations} onChange={e => setFormData({...formData, observations: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all" />
                </div>
              </div>
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 dark:text-white font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors uppercase text-xs tracking-widest">{t.cancel}</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-green-700 text-white font-bold rounded-2xl hover:bg-green-800 shadow-xl shadow-green-900/20 transition-all uppercase text-xs tracking-widest">{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityModule;

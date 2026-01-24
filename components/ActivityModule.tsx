
import React, { useState } from 'react';
import { ActivityType, AppState, Activity, UserRole } from '../types';

interface ActivityModuleProps {
  type: ActivityType;
  state: AppState;
  // Use the same Omit type as defined in App.tsx to avoid assignment errors
  onAdd: (activity: Omit<Activity, 'id' | 'plantationId' | 'updatedAt'>) => void;
  t: any;
}

const ActivityModule: React.FC<ActivityModuleProps> = ({ type, state, onAdd, t }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    date: new Date().toISOString().split('T')[0],
    zone: '',
    quantity: 0,
    cost: 0,
    workers: '',
    observations: ''
  });

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
  };

  const filteredActivities = state.activities.filter(a => a.type === type);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white capitalize">{t[type.toLowerCase()]}</h2>
          <p className="text-slate-500 dark:text-slate-400">Gérez les opérations de cette étape.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md transition-all transform hover:scale-105"
        >
          + {t.addOperation}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.date}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Libellé</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.zone}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.cost}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">Aucune donnée pour le moment.</td>
                </tr>
              ) : (
                filteredActivities.map(activity => (
                  <tr key={activity.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 text-sm dark:text-slate-300">{activity.date}</td>
                    <td className="px-6 py-4 text-sm font-medium dark:text-white">{activity.label}</td>
                    <td className="px-6 py-4 text-sm dark:text-slate-300">{activity.zone}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-200">{activity.cost.toLocaleString()} FCFA</td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-blue-600 hover:underline">Détails</button>
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
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold dark:text-white">{t.addOperation}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Libellé de l'opération</label>
                  <input required type="text" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.date}</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.zone}</label>
                  <input required type="text" value={formData.zone} onChange={e => setFormData({...formData, zone: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.cost}</label>
                  <input required type="number" value={formData.cost} onChange={e => setFormData({...formData, cost: Number(e.target.value)})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.quantity}</label>
                  <input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.workers} (séparés par virgule)</label>
                <input type="text" value={formData.workers} onChange={e => setFormData({...formData, workers: e.target.value})} placeholder="Jean, Paul, ..." className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.observations}</label>
                <textarea rows={3} value={formData.observations} onChange={e => setFormData({...formData, observations: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none dark:text-white" />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 dark:text-white font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">{t.cancel}</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 shadow-md transition-colors">{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityModule;

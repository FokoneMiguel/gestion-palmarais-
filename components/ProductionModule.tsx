import React, { useState, useMemo } from 'react';
import { AppState, Activity } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ProductionModuleProps {
  state: AppState;
  onAdd: (activity: Omit<Activity, 'id' | 'plantationId' | 'updatedAt'>) => void;
  onDelete?: (id: string) => void;
  t: any;
}

const ProductionModule: React.FC<ProductionModuleProps> = ({ state, onAdd, onDelete, t }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState<Activity | null>(null);
  const [customLabel, setCustomLabel] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    date: new Date().toISOString().split('T')[0],
    zone: '',
    inputQuantity: 0,
    quantity: 0,
    cost: 0,
    workers: '',
    observations: ''
  });

  const predefinedOps = t.opLists.PRODUCTION || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.quantity <= 0) {
      alert("Veuillez saisir une quantité d'huile produite supérieure à 0.");
      return;
    }
    if (formData.inputQuantity <= 0) {
      alert("Veuillez saisir une quantité de matière traitée.");
      return;
    }

    onAdd({
      type: 'PRODUCTION',
      label: formData.label,
      date: formData.date,
      zone: formData.zone,
      inputQuantity: formData.inputQuantity,
      quantity: formData.quantity,
      cost: formData.cost,
      workers: formData.workers.split(',').map(w => w.trim()).filter(w => w !== ''),
      observations: formData.observations,
      unit: 'L',
      inputUnit: 'kg'
    });
    setShowModal(false);
    setFormData({ label: '', date: new Date().toISOString().split('T')[0], zone: '', inputQuantity: 0, quantity: 0, cost: 0, workers: '', observations: '' });
    setCustomLabel(false);
  };

  const productionActivities = useMemo(() => 
    state.activities.filter(a => a.type === 'PRODUCTION').sort((a, b) => b.date.localeCompare(a.date)),
    [state.activities]
  );

  const stats = useMemo(() => {
    const totalRaw = productionActivities.reduce((acc, a) => acc + (a.inputQuantity || 0), 0);
    const totalOil = productionActivities.reduce((acc, a) => acc + (a.quantity || 0), 0);
    const avgYield = totalRaw > 0 ? (totalOil / totalRaw) * 100 : 0;
    
    return {
      totalRaw,
      totalOil,
      avgYield: avgYield.toFixed(2)
    };
  }, [productionActivities]);

  const chartData = useMemo(() => {
    return productionActivities.slice(-10).reverse().map(a => ({
      name: a.date.split('-').slice(1).join('/'),
      yield: a.inputQuantity && a.inputQuantity > 0 ? Number(((a.quantity || 0) / a.inputQuantity * 100).toFixed(2)) : 0,
      oil: a.quantity || 0
    }));
  }, [productionActivities]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{t.production}</h2>
          <p className="text-slate-500 dark:text-slate-400">Transformation & Rendement de l'huile de palme.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-10 py-5 rounded-[1.8rem] font-black shadow-lg shadow-amber-900/20 transition-all transform hover:scale-105 flex items-center space-x-2 uppercase text-xs tracking-widest"
        >
          <span>🏭</span>
          <span>{t.addOperation}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.totalProcessed}</p>
          <div className="flex items-end space-x-2">
            <h3 className="text-4xl font-black text-slate-800 dark:text-white">{stats.totalRaw.toLocaleString()}</h3>
            <span className="text-slate-500 mb-1 font-bold">kg</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.oilOutput}</p>
          <div className="flex items-end space-x-2">
            <h3 className="text-4xl font-black text-green-600 dark:text-green-400">{stats.totalOil.toLocaleString()}</h3>
            <span className="text-slate-500 mb-1 font-bold">L</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 rounded-[2rem] shadow-xl shadow-amber-500/20 relative overflow-hidden text-white">
          <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">{t.avgYield}</p>
          <div className="flex items-end space-x-2">
            <h3 className="text-4xl font-black">{stats.avgYield}%</h3>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-black text-slate-800 dark:text-white">{t.batchHistory}</h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temps réel</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.date}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Processus</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Matière</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Huile (L)</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rendement</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {productionActivities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-slate-400 italic font-black uppercase tracking-widest text-[10px]">Aucun lot enregistré.</td>
                </tr>
              ) : (
                productionActivities.map(activity => {
                  const yieldRate = activity.inputQuantity && activity.inputQuantity > 0 
                    ? ((activity.quantity || 0) / activity.inputQuantity * 100).toFixed(2) 
                    : '0';
                  return (
                    <tr key={activity.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group">
                      <td className="px-8 py-5 text-sm font-black text-slate-400">{activity.date}</td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-black dark:text-white">{activity.label}</span>
                          <span className="text-[10px] text-slate-400 font-bold">{activity.zone}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-black dark:text-slate-300">{activity.inputQuantity?.toLocaleString()} kg</td>
                      <td className="px-8 py-5 text-sm font-black text-green-600 dark:text-green-400">{activity.quantity?.toLocaleString()} L</td>
                      <td className="px-8 py-5">
                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black ${Number(yieldRate) > 15 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {yieldRate}%
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setShowDetails(activity)} className="p-2 text-slate-400 hover:text-green-600" title="Détails">👁️</button>
                          {onDelete && <button onClick={() => onDelete(activity.id)} className="p-2 text-slate-400 hover:text-red-600" title="Supprimer">🗑️</button>}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Détails Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl">
           <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[3rem] shadow-2xl animate-in zoom-in border border-white/10 overflow-hidden">
              <div className="p-10 bg-amber-600 text-white">
                 <h3 className="text-3xl font-black uppercase tracking-tight">{showDetails.label}</h3>
                 <p className="text-xs font-bold opacity-80 mt-2 uppercase tracking-widest">{showDetails.date} • {showDetails.zone}</p>
              </div>
              <div className="p-10 space-y-8">
                 <div className="grid grid-cols-2 gap-8">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Matière Première</p>
                       <p className="text-xl font-black dark:text-white">{showDetails.inputQuantity?.toLocaleString()} kg</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Huile Produite</p>
                       <p className="text-xl font-black text-green-600 dark:text-green-400">{showDetails.quantity?.toLocaleString()} L</p>
                    </div>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Équipe Usine</p>
                    <div className="flex flex-wrap gap-2">
                       {showDetails.workers.map((w, i) => (
                          <span key={i} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{w}</span>
                       ))}
                    </div>
                 </div>
                 {showDetails.observations && (
                   <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Observations</p>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-300 italic">"{showDetails.observations}"</p>
                   </div>
                 )}
                 <button onClick={() => setShowDetails(null)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Fermer</button>
              </div>
           </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[3rem] shadow-2xl animate-in zoom-in border border-white/10 overflow-hidden">
            <div className="p-8 bg-amber-600 text-white flex justify-between items-center">
              <h3 className="text-2xl font-black uppercase tracking-tight">Saisie Transformation</h3>
              <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Étape du processus</label>
                  {!customLabel ? (
                    <select required value={formData.label} onChange={e => {
                        if (e.target.value === "Autre..." || e.target.value === "Other...") { setCustomLabel(true); setFormData({...formData, label: ''}); }
                        else { setFormData({...formData, label: e.target.value}); }
                      }} 
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 dark:text-white font-bold appearance-none"
                    >
                      <option value="">Sélectionner...</option>
                      {predefinedOps.map((op: string) => <option key={op} value={op}>{op}</option>)}
                      <option value="Autre...">➕ Autre...</option>
                    </select>
                  ) : (
                    <div className="flex space-x-2">
                        <input required autoFocus type="text" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} placeholder="Nom de l'étape..." className="flex-1 px-6 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none dark:text-white font-bold" />
                        <button onClick={() => setCustomLabel(false)} className="px-4 text-xs font-black text-slate-400">↺</button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">{t.date}</label>
                    <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none dark:text-white font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">{t.zone}</label>
                    <input required type="text" value={formData.zone} onChange={e => setFormData({...formData, zone: e.target.value})} placeholder="Usine / Secteur" className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none dark:text-white font-bold" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/20">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-amber-600 uppercase tracking-widest">Matière (kg)</label>
                    <input required type="number" min="1" value={formData.inputQuantity} onChange={e => setFormData({...formData, inputQuantity: Number(e.target.value)})} className="w-full bg-transparent text-2xl font-black text-amber-700 dark:text-amber-400 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-amber-600 uppercase tracking-widest">Huile (L)</label>
                    <input required type="number" min="1" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} className="w-full bg-transparent text-2xl font-black text-amber-700 dark:text-amber-400 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">{t.cost} (FCFA)</label>
                    <input required type="number" min="0" value={formData.cost} onChange={e => setFormData({...formData, cost: Number(e.target.value)})} className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none dark:text-white font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Équipe</label>
                    <input type="text" value={formData.workers} onChange={e => setFormData({...formData, workers: e.target.value})} placeholder="Jean, Paul..." className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none dark:text-white font-bold" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1 tracking-widest">Observations</label>
                  <textarea value={formData.observations} onChange={e => setFormData({...formData, observations: e.target.value})} placeholder="Détails..." className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none dark:text-white font-bold min-h-[80px]" />
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-4 bg-slate-100 dark:bg-slate-700 dark:text-white font-black rounded-2xl hover:bg-slate-200 transition-all uppercase text-[10px] tracking-widest">{t.cancel}</button>
                <button type="submit" className="flex-1 px-4 py-4 bg-amber-600 text-white font-black rounded-2xl hover:bg-amber-700 shadow-xl shadow-amber-900/20 transition-all uppercase text-[10px] tracking-widest">{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionModule;
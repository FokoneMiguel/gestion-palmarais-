
import React, { useState, useMemo } from 'react';
import { AppState, Activity, UserRole } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, Legend } from 'recharts';

interface ProductionModuleProps {
  state: AppState;
  onAdd: (activity: Omit<Activity, 'id' | 'plantationId' | 'updatedAt'>) => void;
  t: any;
}

const ProductionModule: React.FC<ProductionModuleProps> = ({ state, onAdd, t }) => {
  const [showModal, setShowModal] = useState(false);
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
    onAdd({
      type: 'PRODUCTION',
      label: formData.label,
      date: formData.date,
      zone: formData.zone,
      inputQuantity: formData.inputQuantity,
      quantity: formData.quantity,
      cost: formData.cost,
      workers: formData.workers.split(',').map(w => w.trim()),
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{t.production}</h2>
          <p className="text-slate-500 dark:text-slate-400">Transformation & Rendement de l'huile de palme.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-2xl font-black shadow-lg shadow-amber-900/20 transition-all transform hover:scale-105 flex items-center space-x-2"
        >
          <span>🏭</span>
          <span>{t.addOperation}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <span className="text-6xl">⚖️</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.totalProcessed}</p>
          <div className="flex items-end space-x-2">
            <h3 className="text-4xl font-black text-slate-800 dark:text-white">{stats.totalRaw.toLocaleString()}</h3>
            <span className="text-slate-500 mb-1 font-bold">kg</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <span className="text-6xl">🛢️</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.oilOutput}</p>
          <div className="flex items-end space-x-2">
            <h3 className="text-4xl font-black text-green-600 dark:text-green-400">{stats.totalOil.toLocaleString()}</h3>
            <span className="text-slate-500 mb-1 font-bold">L</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-3xl shadow-xl shadow-amber-500/20 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 p-4 opacity-20">
              <span className="text-6xl">✨</span>
          </div>
          <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">{t.avgYield}</p>
          <div className="flex items-end space-x-2">
            <h3 className="text-4xl font-black">{stats.avgYield}%</h3>
          </div>
          <p className="mt-2 text-[10px] text-white/60 italic font-bold">Ratio global d'extraction</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center">
            <span className="mr-2 text-amber-500">📈</span> {t.extractionRate} (%)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" />
                <YAxis fontSize={10} stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="yield" stroke="#f59e0b" strokeWidth={4} dot={{ r: 6, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center">
            <span className="mr-2 text-green-600">🛢️</span> {t.produced} (L)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorOil" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" />
                <YAxis fontSize={10} stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="oil" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorOil)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t.batchHistory}</h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temps réel</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.date}</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Processus / Lot</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Matière (kg)</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Huile (L)</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rendement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {productionActivities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-400 italic">Aucun lot enregistré.</td>
                </tr>
              ) : (
                productionActivities.map(activity => {
                  const yieldRate = activity.inputQuantity && activity.inputQuantity > 0 
                    ? ((activity.quantity || 0) / activity.inputQuantity * 100).toFixed(2) 
                    : '0';
                  return (
                    <tr key={activity.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium dark:text-slate-400">{activity.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold dark:text-white">{activity.label}</span>
                          <span className="text-[10px] text-slate-400">{activity.zone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold dark:text-slate-300">{activity.inputQuantity?.toLocaleString()} kg</td>
                      <td className="px-6 py-4 text-sm font-black text-green-600 dark:text-green-400">{activity.quantity?.toLocaleString()} L</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-xl text-xs font-black ${Number(yieldRate) > 15 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {yieldRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl animate-in zoom-in duration-200 border border-white/10 overflow-hidden">
            <div className="p-6 bg-amber-600 text-white flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tight">Saisie Transformation</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Étape du processus</label>
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
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 dark:text-white transition-all"
                    >
                      <option value="">Sélectionner une étape...</option>
                      {predefinedOps.map((op: string) => <option key={op} value={op}>{op}</option>)}
                    </select>
                  ) : (
                    <div className="flex space-x-2">
                        <input required autoFocus type="text" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} placeholder="Nom du lot ou étape..." className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 dark:text-white" />
                        <button onClick={() => setCustomLabel(false)} className="px-3 text-xs font-bold text-slate-400">↺</button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">{t.date}</label>
                    <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 dark:text-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">{t.zone}</label>
                    <input required type="text" value={formData.zone} onChange={e => setFormData({...formData, zone: e.target.value})} placeholder="Usine / Secteur" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 dark:text-white transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-amber-600 uppercase tracking-widest">{t.rawMaterial} (kg)</label>
                    <input required type="number" value={formData.inputQuantity} onChange={e => setFormData({...formData, inputQuantity: Number(e.target.value)})} className="w-full bg-transparent text-xl font-black text-amber-700 dark:text-amber-400 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-amber-600 uppercase tracking-widest">{t.oilOutput} (L)</label>
                    <input required type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} className="w-full bg-transparent text-xl font-black text-amber-700 dark:text-amber-400 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">{t.cost} (FCFA)</label>
                    <input required type="number" value={formData.cost} onChange={e => setFormData({...formData, cost: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">{t.workers}</label>
                    <input type="text" value={formData.workers} onChange={e => setFormData({...formData, workers: e.target.value})} placeholder="Ouvriers impliqués..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none dark:text-white" />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 dark:text-white font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors uppercase text-xs tracking-widest">{t.cancel}</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-amber-600 text-white font-bold rounded-2xl hover:bg-amber-700 shadow-xl shadow-amber-900/20 transition-all uppercase text-xs tracking-widest">{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionModule;

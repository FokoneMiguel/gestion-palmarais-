
import React, { useState, useMemo } from 'react';
import { AppState, Activity, UserRole } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, Legend } from 'recharts';

interface ProductionModuleProps {
  state: AppState;
  // Use the same Omit type as defined in App.tsx to avoid assignment errors
  onAdd: (activity: Omit<Activity, 'id' | 'plantationId' | 'updatedAt'>) => void;
  t: any;
}

const ProductionModule: React.FC<ProductionModuleProps> = ({ state, onAdd, t }) => {
  const [showModal, setShowModal] = useState(false);
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
          <p className="text-slate-500 dark:text-slate-400">{t.productionSteps}</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-amber-900/20 transition-all transform hover:scale-105 flex items-center space-x-2"
        >
          <span>✨</span>
          <span>{t.addOperation}</span>
        </button>
      </div>

      {/* Production Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t.totalProcessed}</p>
          <div className="flex items-end space-x-2">
            <h3 className="text-3xl font-black text-slate-800 dark:text-white">{stats.totalRaw.toLocaleString()}</h3>
            <span className="text-slate-500 mb-1 font-bold">kg</span>
          </div>
          <div className="mt-4 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
             <div className="h-full bg-amber-500 w-3/4 rounded-full"></div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t.oilOutput}</p>
          <div className="flex items-end space-x-2">
            <h3 className="text-3xl font-black text-green-600 dark:text-green-400">{stats.totalOil.toLocaleString()}</h3>
            <span className="text-slate-500 mb-1 font-bold">L</span>
          </div>
          <div className="mt-4 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
             <div className="h-full bg-green-500 w-2/3 rounded-full"></div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm border-b-4 border-b-amber-500">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t.avgYield}</p>
          <div className="flex items-end space-x-2">
            <h3 className="text-3xl font-black text-amber-600 dark:text-amber-400">{stats.avgYield}%</h3>
          </div>
          <p className="mt-2 text-xs text-slate-400">Ratio Huile / Régimes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Yield Trend Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center">
            <span className="mr-2">📈</span> {t.extractionRate} (%)
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

        {/* Volume Output Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center">
            <span className="mr-2">🛢️</span> {t.produced} (Liters)
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

      {/* Detailed Batch Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t.batchHistory}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.date}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.rawMaterial}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.oilOutput}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.yield}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.cost}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {productionActivities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">Aucun lot de production enregistré.</td>
                </tr>
              ) : (
                productionActivities.map(activity => {
                  const yieldRate = activity.inputQuantity && activity.inputQuantity > 0 
                    ? ((activity.quantity || 0) / activity.inputQuantity * 100).toFixed(2) 
                    : '0';
                  return (
                    <tr key={activity.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                      <td className="px-6 py-4 text-sm dark:text-slate-300 font-medium">{activity.date}</td>
                      <td className="px-6 py-4 text-sm dark:text-slate-300">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 dark:text-slate-200">{activity.inputQuantity?.toLocaleString()} kg</span>
                          <span className="text-[10px] text-slate-400">{activity.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="text-green-600 dark:text-green-400 font-black">{activity.quantity?.toLocaleString()} L</span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${Number(yieldRate) > 15 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {yieldRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                        {activity.cost.toLocaleString()} FCFA
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Production Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl animate-in zoom-in duration-200 border border-white/20">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">{t.production}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 transition-colors">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-black text-slate-500 uppercase mb-2 tracking-widest">{t.product} / Batch Name</label>
                  <input required type="text" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} placeholder="Ex: Lot #2025-A" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-amber-500/20 outline-none dark:text-white transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase mb-2 tracking-widest">{t.date}</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-amber-500/20 outline-none dark:text-white transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase mb-2 tracking-widest">{t.zone}</label>
                  <input required type="text" value={formData.zone} onChange={e => setFormData({...formData, zone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-amber-500/20 outline-none dark:text-white transition-all" />
                </div>
                
                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20 space-y-2">
                   <label className="block text-[10px] font-black text-amber-600 uppercase tracking-widest">{t.inputWeight} (kg)</label>
                   <input required type="number" value={formData.inputQuantity} onChange={e => setFormData({...formData, inputQuantity: Number(e.target.value)})} className="w-full bg-transparent text-xl font-black text-amber-700 dark:text-amber-400 outline-none" />
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-900/20 space-y-2">
                   <label className="block text-[10px] font-black text-green-600 uppercase tracking-widest">{t.produced} (L)</label>
                   <input required type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} className="w-full bg-transparent text-xl font-black text-green-700 dark:text-green-400 outline-none" />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-black text-slate-500 uppercase mb-2 tracking-widest">{t.cost} (FCFA)</label>
                  <input required type="number" value={formData.cost} onChange={e => setFormData({...formData, cost: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none dark:text-white" />
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 dark:text-white font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors uppercase tracking-widest text-xs">{t.cancel}</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-amber-600 text-white font-bold rounded-2xl hover:bg-amber-700 shadow-lg shadow-amber-900/20 transition-all uppercase tracking-widest text-xs">{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionModule;

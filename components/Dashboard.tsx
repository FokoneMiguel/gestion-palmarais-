
import React, { useMemo } from 'react';
import { AppState } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  state: AppState;
  t: any;
}

const Dashboard: React.FC<DashboardProps> = ({ state, t }) => {
  const totalSales = useMemo(() => state.sales.reduce((acc, s) => acc + s.total, 0), [state.sales]);
  const totalCosts = useMemo(() => state.activities.reduce((acc, a) => acc + a.cost, 0), [state.activities]);
  const netBalance = totalSales - totalCosts;

  // AGRÉGATION CHRONOLOGIQUE PAR JOUR (Ventes et Coûts)
  const chartData = useMemo(() => {
    const grouped: Record<string, { date: string, sales: number, costs: number }> = {};
    
    // On prend toutes les dates uniques
    const allDates = new Set([
      ...state.sales.map(s => s.date),
      ...state.activities.map(a => a.date)
    ].filter(d => d && typeof d === 'string'));

    if (allDates.size === 0) return [];

    allDates.forEach(date => {
      grouped[date] = { 
        date, 
        sales: 0, 
        costs: 0 
      };
    });

    state.sales.forEach(sale => {
      if (sale.date && grouped[sale.date]) grouped[sale.date].sales += sale.total;
    });

    state.activities.forEach(act => {
      if (act.date && grouped[act.date]) grouped[act.date].costs += act.cost;
    });

    // Convertir en tableau trié
    return Object.values(grouped)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(item => ({
        name: item.date.split('-').reverse().slice(0, 2).join('/'),
        sales: item.sales,
        costs: item.costs
      }));
  }, [state.sales, state.activities]);

  const stats = [
    { label: t.totalSales, value: `${totalSales.toLocaleString()} FCFA`, color: 'text-green-600', icon: '💰', bg: 'bg-green-50 dark:bg-green-900/10' },
    { label: t.totalCosts, value: `${totalCosts.toLocaleString()} FCFA`, color: 'text-red-600', icon: '📉', bg: 'bg-red-50 dark:bg-red-900/10' },
    { label: t.netBalance, value: `${netBalance.toLocaleString()} FCFA`, color: netBalance >= 0 ? 'text-amber-600' : 'text-red-600', icon: '🏦', bg: 'bg-amber-50 dark:bg-amber-900/10' },
    { label: t.totalActivities, value: state.activities.length, color: 'text-blue-600', icon: '🗓️', bg: 'bg-blue-50 dark:bg-blue-900/10' }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">{t.dashboard}</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Suivi en temps réel de votre exploitation.</p>
        </div>
        <div className="flex items-center space-x-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
           <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Système Intelligent Prêt</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 ${stat.bg} group transition-all hover:scale-[1.03] hover:shadow-xl`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className={`text-2xl font-black ${stat.color}`}>{stat.value}</h3>
              </div>
              <span className="text-3xl bg-white dark:bg-slate-700 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform">
                {stat.icon}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm min-h-[450px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white">Flux de Trésorerie</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ventes vs Dépenses par jour</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 text-green-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
              Performance
            </div>
          </div>
          <div className="flex-1 w-full min-h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCosts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" dy={10} />
                  <YAxis axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="sales" name="Ventes (FCFA)" stroke="#16a34a" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" animationDuration={1500} />
                  <Area type="monotone" dataKey="costs" name="Dépenses (FCFA)" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorCosts)" animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50 space-y-4">
                 <span className="text-6xl">📊</span>
                 <p className="font-black uppercase text-xs tracking-[0.2em]">Aucune donnée à afficher</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col">
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6">Journal des Travaux</h3>
          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {state.activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-50">
                <span className="text-4xl mb-2">📭</span>
                <p className="text-xs font-black uppercase">Aucune activité</p>
              </div>
            ) : (
              state.activities.slice(0, 8).map(activity => (
                <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 transition-all group border border-transparent hover:border-slate-200">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    {activity.type === 'CREATION' ? '🌱' : activity.type === 'HARVEST' ? '🚜' : activity.type === 'PRODUCTION' ? '🏭' : '⚙️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-800 dark:text-white truncate">{activity.label}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{activity.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-700 dark:text-slate-300">-{activity.cost.toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


import React, { useMemo } from 'react';
import { AppState } from '../types';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Line } from 'recharts';

interface StatsModuleProps {
  state: AppState;
  t: any;
}

const StatsModule: React.FC<StatsModuleProps> = ({ state, t }) => {
  // 1. RÉPARTITION DES COÛTS (PIE)
  const pieData = useMemo(() => {
    const activityCostsByType = state.activities.reduce((acc, a) => {
      acc[a.type] = (acc[a.type] || 0) + a.cost;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(activityCostsByType).map(([name, value]) => ({ 
      name: t[name.toLowerCase()] || name, 
      value 
    }));
  }, [state.activities, t]);

  // 2. RENTABILITÉ MENSUELLE (REVENUS VS DÉPENSES)
  const profitabilityData = useMemo(() => {
    const months: Record<string, { name: string, revenus: number, depenses: number }> = {};
    
    // Initialiser les mois présents dans les données
    const allDates = [
      ...state.sales.map(s => s.date),
      ...state.activities.map(a => a.date)
    ].filter(d => d && typeof d === 'string' && d.length >= 7).sort();

    if (allDates.length === 0) return [];

    allDates.forEach(date => {
      const monthKey = date.substring(0, 7); // YYYY-MM
      if (!months[monthKey]) {
        try {
          const d = new Date(date);
          if (isNaN(d.getTime())) return;
          months[monthKey] = {
            name: d.toLocaleString('fr-FR', { month: 'short', year: '2-digit' }).toUpperCase(),
            revenus: 0,
            depenses: 0
          };
        } catch (e) {
          console.error("Invalid date format:", date);
        }
      }
    });

    state.sales.forEach(s => {
      if (!s.date) return;
      const key = s.date.substring(0, 7);
      if (months[key]) months[key].revenus += s.total;
    });

    state.activities.forEach(a => {
      if (!a.date) return;
      const key = a.date.substring(0, 7);
      if (months[key]) months[key].depenses += a.cost;
    });

    return Object.values(months);
  }, [state.sales, state.activities, t]);

  // 3. COURBE DE CROISSANCE (ASCENDANTE / DESCENDANTE)
  const growthData = useMemo(() => {
    let cumulative = 0;
    const dailyData: Record<string, number> = {};

    // On calcule le solde cumulé jour après jour
    const events = [
      ...state.sales.map(s => ({ date: s.date, val: s.total })),
      ...state.activities.map(a => ({ date: a.date, val: -a.cost }))
    ].filter(e => e.date && typeof e.date === 'string').sort((a, b) => a.date.localeCompare(b.date));

    if (events.length === 0) return [];

    events.forEach(e => {
      cumulative += e.val;
      dailyData[e.date] = cumulative;
    });

    return Object.entries(dailyData).map(([date, val]) => ({
      date: date.split('-').reverse().slice(0, 2).join('/'),
      solde: val
    }));
  }, [state.sales, state.activities]);

  const COLORS = ['#166534', '#ca8a04', '#ea580c', '#2563eb', '#7c3aed'];

  const totalRevenus = state.sales.reduce((acc, s) => acc + s.total, 0);
  const totalDepenses = state.activities.reduce((acc, a) => acc + a.cost, 0);
  const ROI = totalDepenses > 0 ? ((totalRevenus - totalDepenses) / totalDepenses * 100).toFixed(1) : '0';

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">Analyses Techniques</h2>
          <p className="text-slate-500 font-medium">Rentabilité et croissance de votre patrimoine.</p>
        </div>
        <div className={`px-6 py-3 rounded-2xl border flex items-center space-x-3 ${Number(ROI) >= 0 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          <span className="text-2xl">{Number(ROI) >= 0 ? '📈' : '📉'}</span>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-70">Rendement (ROI)</p>
            <p className="text-lg font-black">{ROI}%</p>
          </div>
        </div>
      </div>

      {/* RENTABILITÉ GLOBALE (REVENUS vs DÉPENSES) */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col min-h-[450px]">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white">Comparatif Revenus vs Dépenses</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vision Mensuelle de la Rentabilité</p>
          </div>
        </div>
        <div className="h-[350px] w-full min-h-[350px] flex-1">
          {profitabilityData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitabilityData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis fontSize={10} stroke="#94a3b8" axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }} 
                />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                <Bar dataKey="revenus" name="Revenus (Ventes)" fill="#166534" radius={[6, 6, 0, 0]} />
                <Bar dataKey="depenses" name="Dépenses (Coûts)" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50 space-y-4">
               <span className="text-6xl">📊</span>
               <p className="font-black uppercase text-xs tracking-[0.2em]">Aucune donnée mensuelle</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* COURBE DE CROISSANCE (ASCENSION) */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm min-h-[400px] flex flex-col">
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-8">Trajectoire de Croissance</h3>
          <div className="h-72 w-full min-h-[288px] flex-1">
            {growthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorSolde" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: '20px', border: 'none' }} />
                  <Area 
                    type="monotone" 
                    dataKey="solde" 
                    name="Capital Net" 
                    stroke="#2563eb" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorSolde)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50 space-y-4">
                 <span className="text-5xl">📈</span>
                 <p className="font-black uppercase text-xs tracking-[0.2em]">Données insuffisantes</p>
              </div>
            )}
          </div>
          <p className="text-[9px] font-black text-center text-slate-400 uppercase tracking-widest mt-4">Évolution cumulée du capital de l'exploitation</p>
        </div>

        {/* RÉPARTITION DES DÉPENSES */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center min-h-[400px]">
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-8 self-start">Où va l'argent ?</h3>
          <div className="h-72 w-full min-h-[288px] flex-1">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '20px', border: 'none' }} />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50 space-y-4">
                 <span className="text-5xl">🥧</span>
                 <p className="font-black uppercase text-xs tracking-[0.2em]">Aucune dépense enregistrée</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsModule;

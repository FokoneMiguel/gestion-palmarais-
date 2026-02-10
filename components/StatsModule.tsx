
import React, { useMemo } from 'react';
import { AppState } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface StatsModuleProps {
  state: AppState;
  t: any;
}

const StatsModule: React.FC<StatsModuleProps> = ({ state, t }) => {
  // Agrégation des coûts par type d'activité
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

  const COLORS = ['#166534', '#ca8a04', '#ea580c', '#2563eb', '#7c3aed'];

  // Agrégation des revenus par jour (ou mois pour la démo)
  const monthlyData = useMemo(() => {
    const salesByDate = state.sales.reduce((acc, s) => {
      acc[s.date] = (acc[s.date] || 0) + s.total;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(salesByDate)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, amount]) => ({ 
        name: name.split('-').reverse().slice(0, 2).join('/'), 
        amount 
      }));
  }, [state.sales]);

  const hasData = pieData.length > 0 || monthlyData.length > 0;

  if (!hasData) {
    return (
        <div className="flex flex-col items-center justify-center p-20 bg-white dark:bg-slate-800 rounded-[3rem] text-slate-400">
            <span className="text-6xl mb-4">📉</span>
            <p className="font-black uppercase tracking-widest text-[10px]">Aucune statistique disponible</p>
            <p className="text-sm font-medium mt-2">Veuillez d'abord enregistrer des opérations.</p>
        </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">Analyses de Performance</h2>
          <p className="text-slate-500 font-medium">Visualisation de la rentabilité de votre exploitation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm min-h-[450px]">
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-8">Répartition des Dépenses</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', fontWeight: 'bold' }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm min-h-[450px]">
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-8">Revenus par Opération de Vente</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis fontSize={10} stroke="#94a3b8" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '20px', border: 'none', fontWeight: 'bold' }} />
                <Bar dataKey="amount" fill="#ca8a04" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsModule;

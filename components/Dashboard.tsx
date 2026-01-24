
import React from 'react';
import { AppState } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DashboardProps {
  state: AppState;
  t: any;
}

const Dashboard: React.FC<DashboardProps> = ({ state, t }) => {
  const totalSales = state.sales.reduce((acc, s) => acc + s.total, 0);
  const totalCosts = state.activities.reduce((acc, a) => acc + a.cost, 0);
  const netBalance = totalSales - totalCosts;

  const chartData = state.sales.slice(-7).map(s => ({
    name: s.date.split('-').slice(1).join('/'),
    amount: s.total
  }));

  const stats = [
    { label: t.totalSales, value: `${totalSales.toLocaleString()} FCFA`, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', icon: '💰' },
    { label: t.totalCosts, value: `${totalCosts.toLocaleString()} FCFA`, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', icon: '📉' },
    { label: t.netBalance, value: `${netBalance.toLocaleString()} FCFA`, color: netBalance >= 0 ? 'text-amber-600' : 'text-red-600', bg: 'bg-amber-50 dark:bg-amber-900/20', icon: '🏦' },
    { label: 'Activités', value: state.activities.length, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', icon: '📅' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 ${stat.bg} transition-all hover:shadow-md`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                <h3 className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</h3>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Tendance des Ventes (7 dernières)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                <XAxis dataKey="name" fontSize={12} stroke="#94a3b8" />
                <YAxis fontSize={12} stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="#16a34a" fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{t.recentActivities}</h3>
          <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar">
            {state.activities.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8 italic">Aucune activité enregistrée</p>
            ) : (
              state.activities.slice(0, 5).map(activity => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-xl">
                    {activity.type === 'CREATION' ? '🌱' : activity.type === 'HARVEST' ? '🚜' : '⚙️'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{activity.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{activity.date} - {activity.zone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">-{activity.cost} FCFA</p>
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

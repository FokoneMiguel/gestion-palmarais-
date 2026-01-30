import React from 'react';
import { AppState } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  state: AppState;
  t: any;
}

const Dashboard: React.FC<DashboardProps> = ({ state, t }) => {
  const totalSales = state.sales.reduce((acc, s) => acc + s.total, 0);
  const totalCosts = state.activities.reduce((acc, a) => acc + a.cost, 0);
  const netBalance = totalSales - totalCosts;

  const chartData = state.sales.length > 0 
    ? state.sales.slice(-7).map(s => ({
        name: s.date.split('-').slice(1).join('/'),
        amount: s.total
      }))
    : [{ name: 'N/A', amount: 0 }];

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
          <p className="text-slate-500 dark:text-slate-400 font-medium">{t.dashboardSubtitle}</p>
        </div>
        <div className="flex items-center space-x-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
           <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
           <span className="text-xs font-black uppercase tracking-widest text-slate-400">{t.systemConnected}</span>
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
            <div className="mt-4 h-1 w-12 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full bg-current ${stat.color} w-2/3`}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800 dark:text-white">{t.sales}</h3>
            <div className="bg-slate-50 dark:bg-slate-700 border-none rounded-xl text-[10px] font-black uppercase px-3 py-1.5 outline-none text-slate-400">
              {t.recentActivities}
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />
                <YAxis axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#16a34a" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col">
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6">{t.recentActivities}</h3>
          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {state.activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 py-10 opacity-50">
                <span className="text-4xl mb-2">📭</span>
                <p className="text-sm font-bold italic">{t.nothingToReport}</p>
              </div>
            ) : (
              state.activities.slice(0, 6).map(activity => (
                <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-transparent hover:border-slate-200 group">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {activity.type === 'CREATION' ? '🌱' : activity.type === 'HARVEST' ? '🚜' : activity.type === 'PRODUCTION' ? '🏭' : '⚙️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-800 dark:text-white truncate">{activity.label}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{activity.date} • {activity.zone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-700 dark:text-slate-300">-{activity.cost.toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="mt-6 w-full py-4 text-xs font-black uppercase tracking-[0.2em] text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-2xl transition-all border-2 border-dashed border-green-200 dark:border-green-800">
            {t.viewAllLog}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
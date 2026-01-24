
import React from 'react';
import { AppState } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface StatsModuleProps {
  state: AppState;
  t: any;
}

const StatsModule: React.FC<StatsModuleProps> = ({ state, t }) => {
  // Aggregate data by type
  const activityCostsByType = state.activities.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + a.cost;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(activityCostsByType).map(([name, value]) => ({ name, value }));
  const COLORS = ['#166534', '#ca8a04', '#ea580c', '#2563eb', '#7c3aed'];

  const salesData = state.sales.reduce((acc, s) => {
    const month = s.date.slice(0, 7);
    acc[month] = (acc[month] || 0) + s.total;
    return acc;
  }, {} as Record<string, number>);

  const monthlyData = Object.entries(salesData).map(([name, amount]) => ({ name, amount }));

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Analyses Statistiques</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Répartition des Coûts par Module</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Revenus Mensuels</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" fontSize={12} stroke="#94a3b8" />
                <YAxis fontSize={12} stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="amount" fill="#ca8a04" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsModule;

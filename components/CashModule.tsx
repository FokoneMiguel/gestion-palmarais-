
import React from 'react';
import { AppState } from '../types';

interface CashModuleProps {
  state: AppState;
  t: any;
}

const CashModule: React.FC<CashModuleProps> = ({ state, t }) => {
  const currentBalance = state.cashMovements.reduce((acc, cm) => {
    if (cm.type === 'IN') return acc + cm.amount;
    return acc - cm.amount;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t.cash}</h2>
          <p className="text-slate-500 dark:text-slate-400">Journal des flux financiers.</p>
        </div>
        <div className="bg-white dark:bg-slate-800 px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-right">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Solde Actuel</p>
          <p className={`text-3xl font-black ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {currentBalance.toLocaleString()} FCFA
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {state.cashMovements.slice(0, 3).map(cm => (
          <div key={cm.id} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${cm.type === 'IN' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-red-100 text-red-700 dark:bg-red-900/30'}`}>
                {cm.type}
              </span>
              <span className="text-xs text-slate-400">{cm.date}</span>
            </div>
            <p className="text-sm font-semibold dark:text-white truncate">{cm.reason}</p>
            <p className={`text-lg font-bold ${cm.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
              {cm.type === 'IN' ? '+' : '-'}{cm.amount.toLocaleString()} FCFA
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.date}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.reason}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.type}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.amount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {state.cashMovements.map(cm => (
                <tr key={cm.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-6 py-4 text-sm dark:text-slate-300">{cm.date}</td>
                  <td className="px-6 py-4 text-sm font-medium dark:text-white">{cm.reason}</td>
                  <td className="px-6 py-4 text-sm capitalize">
                    <span className={cm.type === 'IN' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{t[cm.type.toLowerCase()]}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold dark:text-slate-200">
                    {cm.amount.toLocaleString()} FCFA
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CashModule;


import React, { useState, useMemo } from 'react';
import { AppState, Sale } from '../types';

interface SalesModuleProps {
  state: AppState;
  // Use the same Omit type as defined in App.tsx to avoid assignment errors
  onAdd: (sale: Omit<Sale, 'id' | 'plantationId' | 'updatedAt'>) => void;
  t: any;
}

const SalesModule: React.FC<SalesModuleProps> = ({ state, onAdd, t }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    client: '',
    product: 'Huile de Palme',
    quantity: 0,
    unitPrice: 0
  });

  // Filter states
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterProduct, setFilterProduct] = useState('All');

  const productOptions = ['Huile de Palme', 'Palmistes', 'Noix de Palme', 'Tourteaux'];

  const total = formData.quantity * formData.unitPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      total
    });
    setShowModal(false);
    setFormData({ date: new Date().toISOString().split('T')[0], client: '', product: 'Huile de Palme', quantity: 0, unitPrice: 0 });
  };

  const filteredSales = useMemo(() => {
    return state.sales.filter(sale => {
      const matchProduct = filterProduct === 'All' || sale.product === filterProduct;
      const matchStartDate = !filterStartDate || sale.date >= filterStartDate;
      const matchEndDate = !filterEndDate || sale.date <= filterEndDate;
      return matchProduct && matchStartDate && matchEndDate;
    });
  }, [state.sales, filterStartDate, filterEndDate, filterProduct]);

  const resetFilters = () => {
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterProduct('All');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t.sales}</h2>
          <p className="text-slate-500 dark:text-slate-400">Suivi des revenus générés.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md transition-all transform hover:scale-105"
        >
          + Enregistrer une Vente
        </button>
      </div>

      {/* Filtering Section */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Produit</label>
            <select 
              value={filterProduct} 
              onChange={e => setFilterProduct(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none dark:text-white text-sm"
            >
              <option value="All">Tous les produits</option>
              {productOptions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Du</label>
            <input 
              type="date" 
              value={filterStartDate} 
              onChange={e => setFilterStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none dark:text-white text-sm"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Au</label>
            <input 
              type="date" 
              value={filterEndDate} 
              onChange={e => setFilterEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none dark:text-white text-sm"
            />
          </div>
          <button 
            onClick={resetFilters}
            className="px-4 py-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-semibold transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.date}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.client}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.product}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.quantity}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.total}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    {state.sales.length === 0 ? "Aucune vente enregistrée." : "Aucune vente ne correspond à vos filtres."}
                  </td>
                </tr>
              ) : (
                filteredSales.map(sale => (
                  <tr key={sale.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 text-sm dark:text-slate-300">{sale.date}</td>
                    <td className="px-6 py-4 text-sm font-medium dark:text-white">{sale.client}</td>
                    <td className="px-6 py-4 text-sm dark:text-slate-300">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {sale.product}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm dark:text-slate-300">{sale.quantity} L</td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600 dark:text-green-400">{sale.total.toLocaleString()} FCFA</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filteredSales.length > 0 && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-700 text-right">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mr-4">Total Filtré :</span>
            <span className="text-lg font-bold text-slate-800 dark:text-white">
              {filteredSales.reduce((acc, s) => acc + s.total, 0).toLocaleString()} FCFA
            </span>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold dark:text-white">Nouvelle Vente</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.date}</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.client}</label>
                  <input required type="text" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none dark:text-white" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.product}</label>
                  <select value={formData.product} onChange={e => setFormData({...formData, product: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none dark:text-white">
                    {productOptions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.quantity}</label>
                  <input required type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.unitPrice}</label>
                  <input required type="number" value={formData.unitPrice} onChange={e => setFormData({...formData, unitPrice: Number(e.target.value)})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none dark:text-white" />
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400 font-semibold">{t.total}</span>
                <span className="text-lg font-bold text-green-700 dark:text-green-400">{total.toLocaleString()} FCFA</span>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 dark:text-white font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">{t.cancel}</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 shadow-md transition-colors">{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesModule;

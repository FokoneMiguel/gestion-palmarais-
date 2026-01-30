import React, { useState, useMemo } from 'react';
import { AppState, Sale } from '../types';

interface SalesModuleProps {
  state: AppState;
  onAdd: (sale: Omit<Sale, 'id' | 'plantationId' | 'updatedAt'>) => void;
  onDelete?: (id: string) => void;
  t: any;
}

const SalesModule: React.FC<SalesModuleProps> = ({ state, onAdd, onDelete, t }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState<Sale | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    client: '',
    product: 'Huile de Palme',
    quantity: 0,
    unitPrice: 0
  });

  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterProduct, setFilterProduct] = useState('All');

  const productOptions = ['Huile de Palme', 'Palmistes', 'Noix de Palme', 'Tourteaux'];
  const total = formData.quantity * formData.unitPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.quantity <= 0 || formData.unitPrice <= 0) {
      alert("Quantité et prix unitaire doivent être supérieurs à 0.");
      return;
    }
    if (!formData.client) {
      alert("Veuillez saisir le nom du client.");
      return;
    }

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

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">{t.sales}</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Suivi des revenus générés.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-green-700 hover:bg-green-800 text-white px-10 py-5 rounded-[1.8rem] font-black shadow-2xl transition-all transform hover:scale-105 uppercase text-xs tracking-widest"
        >
          + Enregistrer une Vente
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex flex-wrap items-end gap-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Produit</label>
            <select value={filterProduct} onChange={e => setFilterProduct(e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-700 border-none rounded-xl font-bold dark:text-white outline-none">
              <option value="All">Tous les produits</option>
              {productOptions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Du</label>
            <input type="date" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-700 border-none rounded-xl font-bold dark:text-white outline-none" />
          </div>
          <button onClick={() => { setFilterStartDate(''); setFilterEndDate(''); setFilterProduct('All'); }} className="px-6 py-3 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-green-600 transition-colors">Réinitialiser</button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.date}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.client}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.product}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.quantity}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.total}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-slate-400 italic uppercase font-black text-[10px] tracking-widest">Rien à signaler.</td>
                </tr>
              ) : (
                filteredSales.map(sale => (
                  <tr key={sale.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                    <td className="px-8 py-5 text-sm font-black text-slate-400">{sale.date}</td>
                    <td className="px-8 py-5 text-sm font-black dark:text-white">{sale.client}</td>
                    <td className="px-8 py-5">
                      <span className="inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {sale.product}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-black dark:text-slate-300">{sale.quantity} L</td>
                    <td className="px-8 py-5 text-sm font-black text-green-600 dark:text-green-400">{sale.total.toLocaleString()} FCFA</td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setShowDetails(sale)} className="p-2 text-slate-400 hover:text-green-600">👁️</button>
                          {onDelete && <button onClick={() => onDelete(sale.id)} className="p-2 text-slate-400 hover:text-red-600">🗑️</button>}
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDetails && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl">
           <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[3rem] shadow-2xl animate-in zoom-in border border-white/10 overflow-hidden">
              <div className="p-10 bg-green-700 text-white">
                 <h3 className="text-3xl font-black uppercase tracking-tight">Facture Vente</h3>
                 <p className="text-xs font-bold opacity-80 mt-2 tracking-widest uppercase">{showDetails.date} • {showDetails.product}</p>
              </div>
              <div className="p-10 space-y-8">
                 <div className="grid grid-cols-2 gap-8">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Client</p>
                       <p className="text-xl font-black dark:text-white">{showDetails.client}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Montant Total</p>
                       <p className="text-2xl font-black text-green-700 dark:text-green-400">{showDetails.total.toLocaleString()} FCFA</p>
                    </div>
                 </div>
                 <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Détails</p>
                    <div className="flex justify-between text-sm font-black dark:text-slate-300">
                       <span>Quantité:</span>
                       <span>{showDetails.quantity} L</span>
                    </div>
                    <div className="flex justify-between text-sm font-black dark:text-slate-300 mt-2">
                       <span>Prix Unitaire:</span>
                       <span>{showDetails.unitPrice.toLocaleString()} FCFA / L</span>
                    </div>
                 </div>
                 <button onClick={() => setShowDetails(null)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Fermer</button>
              </div>
           </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[3rem] shadow-2xl animate-in zoom-in border border-white/10 overflow-hidden">
            <div className="p-8 bg-green-700 text-white flex justify-between items-center">
              <h3 className="text-2xl font-black uppercase tracking-tight">Nouvelle Vente</h3>
              <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors font-bold">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">{t.client}</label>
                  <input required type="text" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} placeholder="Nom du client / Boutique" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none focus:ring-2 focus:ring-green-500 font-bold dark:text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">{t.date}</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none font-bold dark:text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">{t.product}</label>
                  <select value={formData.product} onChange={e => setFormData({...formData, product: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none font-bold dark:text-white appearance-none">
                    {productOptions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">{t.quantity} (L)</label>
                  <input required type="number" min="1" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none font-bold dark:text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">P.U (FCFA)</label>
                  <input required type="number" min="1" value={formData.unitPrice} onChange={e => setFormData({...formData, unitPrice: Number(e.target.value)})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl outline-none font-bold dark:text-white" />
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl flex justify-between items-center border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.total}</span>
                <span className="text-2xl font-black text-green-700 dark:text-green-400">{total.toLocaleString()} FCFA</span>
              </div>
              <div className="flex space-x-4 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 bg-slate-100 dark:bg-slate-700 dark:text-white font-black rounded-2xl hover:bg-slate-200 uppercase text-[10px] tracking-widest transition-all">{t.cancel}</button>
                <button type="submit" className="flex-1 py-5 bg-green-700 text-white font-black rounded-2xl shadow-xl hover:bg-green-800 uppercase text-[10px] tracking-widest transition-all">{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesModule;
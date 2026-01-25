
import React, { useState } from 'react';

const TutorialModule: React.FC<{ t: any }> = ({ t }) => {
  const [activeSliderSet, setActiveSliderSet] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const sliders = [
    {
      name: "Navigation & Interface",
      slides: [
        { title: "Le Tableau de Bord", text: "Visualisez instantanément la santé de votre plantation.", action: "Explorez les indicateurs de revenus et de coûts.", annotation: "Graphiques en temps réel", img: "https://images.unsplash.com/photo-1551288049-bbbda536339a?w=800" },
        { title: "Menu Intelligent", text: "Accédez rapidement à chaque module via la barre latérale.", action: "Utilisez le bouton 'Menu' en bas sur mobile.", annotation: "Navigation optimisée Android", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800" },
        { title: "Mode Sombre", text: "Confort visuel optimal pour le travail de nuit.", action: "Basculez entre le jour et la nuit via le header.", annotation: "Protection de vos yeux", img: "https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=800" }
      ]
    },
    {
      name: "Opérations de Terrain",
      slides: [
        { title: "Saisie d'activité", text: "Enregistrez chaque tâche : défrichage, entretien, récolte.", action: "Utilisez le bouton '+' pour ajouter une opération.", annotation: "Formulaire simple et rapide", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800" },
        { title: "Suivi des Récoltes", text: "Notez le nombre de régimes et les zones récoltées.", action: "Idéal pour anticiper votre production.", annotation: "Précision géographique", img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800" },
        { title: "Transformation d'Huile", text: "Calculez votre rendement huile/matière première.", action: "Analysez le taux d'extraction en un clin d'œil.", annotation: "Module Production Avancé", img: "https://images.unsplash.com/photo-1474440692490-2e83dae39754?w=800" }
      ]
    },
    {
      name: "Gestion Financière",
      slides: [
        { title: "Journal de Caisse", text: "Gardez un œil sur chaque franc entrant ou sortant.", action: "Enregistrez les entrées et dépenses quotidiennes.", annotation: "Transparence totale", img: "https://images.unsplash.com/photo-1454165833762-02ac4f4089e8?w=800" },
        { title: "Ventes & Clients", text: "Suivez vos ventes d'huile, de noix et de sous-produits.", action: "Générez un historique clair pour votre comptabilité.", annotation: "Suivi commercial pro", img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800" }
      ]
    },
    {
      name: "Intelligence Artificielle",
      slides: [
        { title: "Assistant BST IA", text: "Posez vos questions techniques sur le palmier à huile.", action: "Cliquez sur l'icône 🤖 en bas à droite.", annotation: "Expertise agronomique 24h/24", img: "https://images.unsplash.com/photo-1531746790731-6c087fecd05a?w=800" },
        { title: "Conseils Vocaux", text: "Écoutez les réponses de l'IA sans avoir à lire.", action: "Utilisez l'icône 🔊 dans le chat.", annotation: "Accessibilité améliorée", img: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800" }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-24 animate-in fade-in duration-700">
      <div className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 p-12 md:p-16 rounded-[4rem] text-white shadow-2xl relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-400/10 rounded-full -ml-32 -mb-32 blur-2xl"></div>
        <div className="relative z-10">
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">Centre d'Apprentissage</h2>
          <p className="text-xl opacity-90 font-medium max-w-2xl mx-auto leading-relaxed">Devenez un expert de l'application Plameraie BST en quelques étapes visuelles.</p>
        </div>
      </div>

      <div className="space-y-10">
        <div className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth px-2">
          {sliders.map((s, idx) => (
            <button
              key={s.name}
              onClick={() => { setActiveSliderSet(idx); setActiveSlide(0); }}
              className={`flex-shrink-0 px-8 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all ${activeSliderSet === idx ? 'bg-green-700 text-white shadow-2xl scale-105' : 'bg-white dark:bg-slate-800 text-slate-500 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-green-200 hover:scale-105'}`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[4.5rem] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-100 dark:border-slate-700 min-h-[600px] flex flex-col lg:flex-row transition-all group">
          <div className="lg:w-1/2 relative min-h-[350px] md:min-h-[450px]">
            <img 
              key={`${activeSliderSet}-${activeSlide}`}
              src={sliders[activeSliderSet].slides[activeSlide].img} 
              className="w-full h-full object-cover animate-in fade-in duration-1000 zoom-in-110" 
              alt="Application Screen"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-10 md:p-14">
              <div className="w-full">
                <div className="bg-white/10 backdrop-blur-3xl inline-block px-5 py-2 rounded-2xl border border-white/20 text-white font-black text-[10px] uppercase tracking-widest mb-5">
                  Étape {activeSlide + 1} / {sliders[activeSliderSet].slides.length}
                </div>
                <h3 className="text-5xl font-black text-white tracking-tighter leading-none">
                  {sliders[activeSliderSet].slides[activeSlide].title}
                </h3>
              </div>
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-bounce">
              <div className="w-20 h-20 border-8 border-green-500/50 rounded-full shadow-[0_0_50px_rgba(34,197,94,0.4)] flex items-center justify-center backdrop-blur-sm">
                 <span className="text-4xl">👆</span>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 p-12 md:p-16 flex flex-col justify-center bg-slate-50/50 dark:bg-slate-900/20">
            <div className="space-y-10">
              <div className="animate-in slide-in-from-right-10 duration-500">
                 <p className="text-xs font-black text-green-700 uppercase tracking-[0.3em] mb-4">Fonctionnement</p>
                 <p className="text-3xl font-bold text-slate-800 dark:text-white leading-tight">
                  {sliders[activeSliderSet].slides[activeSlide].text}
                 </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border-2 border-green-100 dark:border-green-900/30 shadow-xl shadow-green-900/5 flex items-start space-x-6 animate-in zoom-in-95 duration-700">
                <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 rounded-3xl flex items-center justify-center text-3xl shrink-0">
                  💡
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-green-600 tracking-widest mb-1">Comment faire ?</p>
                  <p className="text-xl font-black text-slate-800 dark:text-white leading-tight">{sliders[activeSliderSet].slides[activeSlide].action}</p>
                  <p className="text-xs font-bold text-slate-400 mt-2 italic opacity-80">{sliders[activeSliderSet].slides[activeSlide].annotation}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-10">
                <button 
                  disabled={activeSlide === 0}
                  onClick={() => setActiveSlide(s => s - 1)}
                  className="w-20 h-20 rounded-[2.5rem] bg-white dark:bg-slate-700 text-slate-300 hover:text-green-700 disabled:opacity-20 transition-all shadow-xl flex items-center justify-center text-3xl hover:scale-105 active:scale-90 border border-slate-100 dark:border-slate-600"
                >
                  ⬅️
                </button>
                <div className="flex space-x-2">
                  {sliders[activeSliderSet].slides.map((_, i) => (
                    <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === activeSlide ? 'w-12 bg-green-600 shadow-[0_0_15px_rgba(22,101,52,0.5)]' : 'w-2 bg-slate-200 dark:bg-slate-700'}`} />
                  ))}
                </div>
                <button 
                  onClick={() => {
                    if (activeSlide < sliders[activeSliderSet].slides.length - 1) {
                      setActiveSlide(s => s + 1);
                    } else if (activeSliderSet < sliders.length - 1) {
                      setActiveSliderSet(s => s + 1);
                      setActiveSlide(0);
                    }
                  }}
                  className="px-12 py-6 rounded-[2.5rem] bg-green-700 text-white font-black shadow-[0_20px_40px_-10px_rgba(22,101,52,0.4)] hover:bg-green-800 hover:scale-105 active:scale-95 transition-all flex items-center space-x-4 border-b-4 border-green-900"
                >
                  <span>{activeSlide === sliders[activeSliderSet].slides.length - 1 ? 'Suivant' : 'Suivant'}</span>
                  <span className="text-2xl animate-pulse">➡️</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialModule;

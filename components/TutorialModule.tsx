import React, { useState } from 'react';

const TutorialModule: React.FC<{ t: any }> = ({ t }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    { title: "🏠 Le Tableau", text: "Ici, on regarde tout. C'est le cœur de ton téléphone !", action: "Regarde les grands chiffres", icon: "📊", img: "https://images.unsplash.com/photo-1551288049-bbbda536339a?w=800" },
    { title: "🌱 Ajouter un Champ", text: "Tu as planté ? Appuie sur le gros bouton '+' pour le dire à l'appli.", action: "Mets le nom de ton champ", icon: "➕", img: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800" },
    { title: "🛠️ Faire le Travail", text: "Quand tu coupes l'herbe, écris-le ici pour être payé.", action: "Note ce que tu as fait", icon: "⛏️", img: "https://images.unsplash.com/photo-1454165833762-02ac4f4089e8?w=800" },
    { title: "🏭 Faire de l'Huile", text: "Mets les noix dans la machine et regarde combien d'huile sort !", action: "Note les litres d'huile", icon: "🛢️", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800" },
    { title: "💰 Vendre l'Huile", text: "Quand un client prend ton huile, enregistre la vente ici.", action: "Prends l'argent !", icon: "💵", img: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800" },
  ];

  return (
    <div className="max-w-2xl mx-auto pb-24 px-4 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
        <div className="aspect-square relative">
          <img src={slides[activeSlide].img} className="w-full h-full object-cover" alt="Guide" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 flex items-end p-8">
            <h3 className="text-4xl font-black text-white">{slides[activeSlide].title}</h3>
          </div>
        </div>
        <div className="p-10 space-y-6">
          <div className="flex items-center space-x-4">
             <span className="text-5xl">{slides[activeSlide].icon}</span>
             <p className="text-2xl font-bold dark:text-white leading-tight">{slides[activeSlide].text}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-3xl border-2 border-dashed border-green-200">
             <p className="text-[10px] font-black uppercase text-green-600 tracking-widest mb-1">🎯 À FAIRE</p>
             <p className="text-xl font-black dark:text-white">{slides[activeSlide].action}</p>
          </div>
          <div className="flex justify-between items-center pt-4">
            <button disabled={activeSlide === 0} onClick={() => setActiveSlide(s => s - 1)} className="text-4xl disabled:opacity-20">⬅️</button>
            <div className="flex space-x-2">
              {slides.map((_, i) => <div key={i} className={`h-2 rounded-full ${i === activeSlide ? 'w-8 bg-green-600' : 'w-2 bg-slate-200'}`} />)}
            </div>
            <button onClick={() => activeSlide < slides.length - 1 ? setActiveSlide(s => s + 1) : setActiveSlide(0)} className="text-4xl">➡️</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialModule;
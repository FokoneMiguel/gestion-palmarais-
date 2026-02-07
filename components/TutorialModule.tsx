import React, { useState } from 'react';
import { TUTORIAL_STEPS } from '../constants.tsx';

const TutorialModule: React.FC<{ t: any }> = ({ t }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = TUTORIAL_STEPS;

  return (
    <div className="max-w-2xl mx-auto pb-24 px-4 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-800 rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
        <div className="p-10 bg-gradient-to-br from-green-700 to-green-900 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Étape {activeSlide + 1} / {slides.length}</p>
          <div className="text-7xl mb-6">{slides[activeSlide].icon}</div>
          <h3 className="text-3xl font-black tracking-tighter leading-tight">{slides[activeSlide].title}</h3>
        </div>

        <div className="p-10 space-y-8">
          <div className="space-y-4">
             <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-700">
                <p className="text-lg font-bold dark:text-white leading-relaxed text-slate-700">{slides[activeSlide].description}</p>
             </div>
             
             <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border-2 border-dashed border-amber-200 dark:border-amber-800/40">
                <p className="text-lg font-black dark:text-amber-400 text-amber-700">{slides[activeSlide].tip}</p>
             </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
            <button 
              disabled={activeSlide === 0} 
              onClick={() => setActiveSlide(s => s - 1)} 
              className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-2xl disabled:opacity-20 active:scale-90 transition-all"
            >
              ⬅️
            </button>
            <div className="flex space-x-2">
              {slides.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 rounded-full transition-all duration-300 ${i === activeSlide ? 'w-8 bg-green-600' : 'w-2 bg-slate-200 dark:bg-slate-700'}`} 
                />
              ))}
            </div>
            <button 
              onClick={() => activeSlide < slides.length - 1 ? setActiveSlide(s => s + 1) : setActiveSlide(0)} 
              className="w-14 h-14 bg-green-700 text-white rounded-2xl flex items-center justify-center text-2xl active:scale-90 transition-all shadow-lg"
            >
              {activeSlide === slides.length - 1 ? "🔄" : "➡️"}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center px-6">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.tutorialSubtitle}</p>
      </div>
    </div>
  );
};

export default TutorialModule;
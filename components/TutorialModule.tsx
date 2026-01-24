
import React, { useState } from 'react';

interface TutorialModuleProps {
  t: any;
}

const TutorialModule: React.FC<TutorialModuleProps> = ({ t }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'slides'>('slides');
  const [activeLesson, setActiveLesson] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const lessons = [
    {
      id: 'quickstart',
      title: "1. Démarrage Rapide",
      duration: '2:30',
      description: "Apprenez à configurer votre code plantation et à naviguer entre les modules de création et d'entretien.",
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' // Placeholder thématique
    },
    {
      id: 'creation',
      title: "2. Création & Mise en terre",
      duration: '4:15',
      description: "Guide complet sur l'enregistrement des opérations d'abattage, de piquetage et de protection des jeunes plants.",
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    },
    {
      id: 'harvest',
      title: "3. Cycle de Récolte",
      duration: '3:45',
      description: "Comment suivre la coupe des régimes, le ramassage des noix et l'organisation du transport vers l'usine.",
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    },
    {
      id: 'finance',
      title: "4. Gestion de la Caisse",
      duration: '5:00',
      description: "Maîtrisez les entrées (ventes d'huile) et sorties (salaires, engrais) pour maintenir un solde positif.",
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
    }
  ];

  const slides = [
    {
      title: "Bienvenue sur Plameraie BST",
      text: "L'outil complet pour piloter votre plantation de palmiers à huile. Commencez par vérifier votre Code Plantation unique.",
      image: "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&q=80&w=800",
      tip: "Astuce : Le code SYSTEM est réservé au propriétaire."
    },
    {
      title: "Enregistrer une Activité",
      text: "Dans 'Création' ou 'Entretien', cliquez sur '+ Ajouter'. Sélectionnez l'opération (ex: Fertilisation) et saisissez le coût.",
      image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800",
      tip: "Le système calcule automatiquement l'impact sur votre caisse."
    },
    {
      title: "Suivre la Production",
      text: "Le module 'Production' vous permet de comparer le poids des noix entrantes et le litrage d'huile extraite.",
      image: "https://images.unsplash.com/photo-1621460244018-9366df28795c?auto=format&fit=crop&q=80&w=800",
      tip: "Un rendement normal se situe entre 18% et 23%."
    },
    {
      title: "Analyse des Statistiques",
      text: "Consultez vos graphiques pour identifier les zones les plus rentables et les périodes de forte dépense.",
      image: "https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800",
      tip: "Utilisez l'assistant IA pour une analyse profonde de vos chiffres."
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">{t.tutorialTitle}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">{t.tutorialSubtitle}</p>
        
        <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mt-6">
          <button 
            onClick={() => setActiveTab('slides')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'slides' ? 'bg-white dark:bg-slate-700 shadow-md text-green-700 dark:text-green-400' : 'text-slate-500'}`}
          >
            🖼️ Guide en Images
          </button>
          <button 
            onClick={() => setActiveTab('video')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'video' ? 'bg-white dark:bg-slate-700 shadow-md text-green-700 dark:text-green-400' : 'text-slate-500'}`}
          >
            🎥 Cours Vidéo
          </button>
        </div>
      </div>

      {activeTab === 'slides' ? (
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="flex flex-col lg:flex-row h-full">
            <div className="lg:w-1/2 relative h-64 lg:h-auto">
              <img 
                src={slides[activeSlide].image} 
                alt={slides[activeSlide].title}
                className="w-full h-full object-cover animate-in fade-in zoom-in duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-white text-xs font-bold">
                  Etape {activeSlide + 1} / {slides.length}
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-4">{slides[activeSlide].title}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8">
                {slides[activeSlide].text}
              </p>
              
              <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-100 dark:border-amber-900/20 mb-10 flex items-start space-x-3">
                <span className="text-2xl">💡</span>
                <p className="text-sm text-amber-800 dark:text-amber-400 font-medium">{slides[activeSlide].tip}</p>
              </div>

              <div className="flex items-center justify-between">
                <button 
                  disabled={activeSlide === 0}
                  onClick={() => setActiveSlide(s => s - 1)}
                  className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 transition-all"
                >
                  ⬅️ Précédent
                </button>
                <div className="flex space-x-2">
                  {slides.map((_, i) => (
                    <div key={i} className={`h-2 rounded-full transition-all ${i === activeSlide ? 'w-8 bg-green-600' : 'w-2 bg-slate-200 dark:bg-slate-700'}`} />
                  ))}
                </div>
                {activeSlide < slides.length - 1 ? (
                  <button 
                    onClick={() => setActiveSlide(s => s + 1)}
                    className="px-8 py-4 rounded-2xl bg-green-700 text-white font-bold shadow-lg shadow-green-900/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    Suivant ➡️
                  </button>
                ) : (
                  <button 
                    onClick={() => setActiveTab('video')}
                    className="px-8 py-4 rounded-2xl bg-amber-500 text-white font-bold shadow-lg shadow-amber-900/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    Voir Vidéos 🎓
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-4">
            <div className="aspect-video bg-black rounded-3xl shadow-2xl overflow-hidden border-4 border-white dark:border-slate-800 relative group">
              <video 
                key={lessons[activeLesson].videoUrl}
                className="w-full h-full object-cover"
                controls
                autoPlay={false}
              >
                <source src={lessons[activeLesson].videoUrl} type="video/mp4" />
              </video>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">{lessons[activeLesson].title}</h3>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                  {lessons[activeLesson].duration}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                {lessons[activeLesson].description}
              </p>
            </div>
          </div>

          <div className="xl:col-span-1 space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Programme de Formation</h4>
            <div className="space-y-3">
              {lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(index)}
                  className={`
                    w-full flex items-center p-4 rounded-2xl transition-all text-left group
                    ${activeLesson === index 
                      ? 'bg-green-700 text-white shadow-xl shadow-green-900/30 scale-[1.02]' 
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700 hover:border-green-300'}
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm mr-4
                    ${activeLesson === index ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'}
                  `}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${activeLesson === index ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                      {lesson.title}
                    </p>
                    <p className={`text-[10px] mt-1 uppercase font-black ${activeLesson === index ? 'text-white/60' : 'text-slate-400'}`}>
                      Durée : {lesson.duration}
                    </p>
                  </div>
                  {activeLesson === index && <span className="text-xl animate-pulse">▶️</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorialModule;

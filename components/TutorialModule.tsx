
import React, { useState } from 'react';

interface TutorialModuleProps {
  t: any;
}

const TutorialModule: React.FC<TutorialModuleProps> = ({ t }) => {
  const [activeLesson, setActiveLesson] = useState(0);

  const lessons = [
    {
      id: 'intro',
      title: t.lessons.intro,
      duration: '2:45',
      description: "Apprenez à naviguer dans l'interface, changer de thème et utiliser la recherche globale.",
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' // Placeholder video
    },
    {
      id: 'creation',
      title: t.lessons.creation,
      duration: '3:20',
      description: "Comment enregistrer les étapes initiales : abattage, piquetage et mise en terre.",
      videoUrl: 'https://www.w3schools.com/html/movie.mp4' // Placeholder video
    },
    {
      id: 'maintenance',
      title: t.lessons.maintenance,
      duration: '4:15',
      description: "Suivez l'entretien régulier, la fertilisation et la lutte contre les nuisibles.",
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    {
      id: 'harvest',
      title: t.lessons.harvest,
      duration: '5:00',
      description: "Maîtrisez le cycle de récolte, du ramassage des branches au transport final.",
      videoUrl: 'https://www.w3schools.com/html/movie.mp4'
    },
    {
      id: 'finance',
      title: t.lessons.finance,
      duration: '3:45',
      description: "Gérez les flux de trésorerie, les entrées de ventes et les retraits de caisse.",
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{t.tutorialTitle}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{t.tutorialSubtitle}</p>
        </div>
        <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-full text-green-700 dark:text-green-400 text-sm font-bold">
          <span>🎓</span>
          <span>{lessons.length} Modules disponibles</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Video Player Section */}
        <div className="xl:col-span-2 space-y-4">
          <div className="aspect-video bg-black rounded-3xl shadow-2xl overflow-hidden border-4 border-white dark:border-slate-800 group relative">
            <video 
              key={lessons[activeLesson].videoUrl}
              className="w-full h-full object-cover"
              controls
              autoPlay={false}
              poster="https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&q=80&w=1200"
            >
              <source src={lessons[activeLesson].videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{lessons[activeLesson].title}</h3>
              <span className="text-sm font-medium text-slate-400">{lessons[activeLesson].duration}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {lessons[activeLesson].description}
            </p>
          </div>
        </div>

        {/* Playlist Section */}
        <div className="xl:col-span-1 space-y-4">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">Programme de Formation</h4>
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(index)}
                className={`
                  w-full flex items-center p-4 rounded-2xl transition-all text-left
                  ${activeLesson === index 
                    ? 'bg-green-700 text-white shadow-lg shadow-green-900/20 scale-[1.02]' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-700'}
                `}
              >
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm mr-4
                  ${activeLesson === index ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'}
                `}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${activeLesson === index ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                    {lesson.title}
                  </p>
                  <p className={`text-xs mt-0.5 ${activeLesson === index ? 'text-white/70' : 'text-slate-400'}`}>
                    {lesson.duration} • Vidéo
                  </p>
                </div>
                {activeLesson === index && (
                  <span className="text-xl animate-pulse">▶️</span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/30">
            <h5 className="font-bold text-amber-800 dark:text-amber-400 flex items-center mb-2 text-sm">
              <span className="mr-2">💡</span> Besoin d'aide supplémentaire ?
            </h5>
            <p className="text-xs text-amber-700 dark:text-amber-500 leading-relaxed">
              Utilisez l'assistant IA en bas à droite de votre écran pour poser des questions spécifiques sur votre plantation en temps réel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialModule;

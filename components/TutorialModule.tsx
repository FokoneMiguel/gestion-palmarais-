
import React, { useState } from 'react';

interface TutorialModuleProps {
  t: any;
}

const TutorialModule: React.FC<TutorialModuleProps> = ({ t }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'slides'>('slides');
  const [activeSerie, setActiveSerie] = useState<number>(1);
  const [activeLesson, setActiveLesson] = useState<number>(0);
  const [activeSliderSet, setActiveSliderSet] = useState<number>(0);
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const videoSeries = [
    {
      id: 1,
      name: "Série 1 : Démarrage Rapide",
      lessons: [
        { title: "Vidéo 1 : Première Connexion", duration: "2-3 min", desc: "Écran d'accueil, inscription, création du profil et tour guidé.", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
        { title: "Vidéo 2 : Créer Votre Première Plantation", duration: "3-4 min", desc: "Module Nouvelle Plantation, zones, dimensions et photos.", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
        { title: "Vidéo 3 : Configurer les Alertes", duration: "2 min", desc: "Paramètres, notifications et définition des seuils d'alerte.", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }
      ]
    },
    {
      id: 2,
      name: "Série 2 : Fonctionnalités Essentielles",
      lessons: [
        { title: "Vidéo 4 : Tableau de Bord et Monitoring", duration: "4 min", desc: "Lecture des indicateurs et navigation entre les plantations.", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
        { title: "Vidéo 5 : Gestion de l'Irrigation", duration: "3 min", desc: "Niveaux d'humidité, arrosage manuel et automatique.", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" },
        { title: "Vidéo 6 : Suivi et Notes", duration: "2-3 min", desc: "Observations quotidiennes, photos de progression et historique.", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" }
      ]
    },
    {
      id: 3,
      name: "Série 3 : Fonctions Avancées",
      lessons: [
        { title: "Vidéo 7 : Calendrier et Planification", duration: "3 min", desc: "Tâches récurrentes et rotation des cultures.", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4" },
        { title: "Vidéo 8 : Analyses et Rapports", duration: "4 min", desc: "Statistiques, comparaisons de zones et exports de données.", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
        { title: "Vidéo 9 : Capteurs IoT", duration: "3-4 min", desc: "Connexion, calibration et visualisation en temps réel.", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackAds.mp4" }
      ]
    }
  ];

  const sliderSets = [
    {
      id: 0,
      name: "Inscription & Premiers Pas",
      slides: [
        { title: "Écran d'accueil", text: "Bienvenue sur Plameraie BST ! Appuyez sur 'Commencer'.", tip: "Le bouton est situé en bas de l'écran principal.", img: "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=800" },
        { title: "Formulaire d'inscription", text: "Créez votre compte en remplissant votre email et mot de passe.", tip: "Utilisez un mot de passe sécurisé mélangeant lettres et chiffres.", img: "https://images.unsplash.com/photo-1454165833762-02ac4f4089e8?w=800" },
        { title: "Configuration profil", text: "Sélectionnez votre région et votre type d'exploitation.", tip: "La localisation permet d'adapter les conseils agronomiques.", img: "https://images.unsplash.com/photo-1523348830708-15d4a09cfac2?w=800" },
        { title: "Tour guidé", text: "Découvrez le menu, le dashboard et vos plantations.", tip: "Le menu latéral donne accès à tous les modules.", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800" }
      ]
    },
    {
      id: 1,
      name: "Créer une Plantation",
      slides: [
        { title: "Bouton '+'", text: "Ajoutez une nouvelle plantation via le bouton en bas à droite.", tip: "Ce bouton est visible sur la page Dashboard.", img: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800" },
        { title: "Sélection culture", text: "Choisissez 'Palmier à Huile' dans la liste déroulante.", tip: "Vous pouvez aussi gérer des cultures intercalaires.", img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800" },
        { title: "Définir la zone", text: "Nommez votre zone (ex: Secteur Nord) et sa superficie.", tip: "Une bonne nomenclature facilite le suivi futur.", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800" },
        { title: "Validation", text: "Prenez une photo optionnelle et enregistrez.", tip: "La photo servira de point de référence T0.", img: "https://images.unsplash.com/photo-1505233303102-0ca048866236?w=800" }
      ]
    },
    {
      id: 2,
      name: "Configurer les Alertes",
      slides: [
        { title: "Accès Paramètres", text: "Allez dans les réglages de votre plantation.", tip: "L'icône roue dentée sur la fiche plantation.", img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800" },
        { title: "Seuils d'humidité", text: "Définissez le seuil d'alerte critique (ex: 30%).", tip: "Gemini peut vous conseiller des seuils selon la météo.", img: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=800" }
      ]
    },
    {
      id: 3,
      name: "Suivi Quotidien",
      slides: [
        { title: "Dashboard principal", text: "Surveillez les données vitales en temps réel.", tip: "Le vert indique un état optimal.", img: "https://images.unsplash.com/photo-1551288049-bbbda536339a?w=800" },
        { title: "Ajouter une note", text: "Enregistrez vos observations quotidiennes (insectes, croissance).", tip: "Ajoutez des photos pour chaque note.", img: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800" }
      ]
    },
    {
      id: 4,
      name: "Réagir aux Alertes",
      slides: [
        { title: "Notification reçue", text: "Une notification push vous avertit d'un problème.", tip: "Ouvrez l'application dès réception.", img: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=800" },
        { title: "Options d'action", text: "Choisissez d'arroser, de traiter ou de reporter.", tip: "L'historique garde trace de votre réactivité.", img: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=800" }
      ]
    }
  ];

  const currentLesson = videoSeries.find(s => s.id === activeSerie)?.lessons[activeLesson];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto pb-20">
      <div className="bg-gradient-to-r from-green-800 to-green-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 text-center">
          <h2 className="text-5xl font-black tracking-tighter mb-4">{t.tutorialTitle}</h2>
          <p className="text-xl text-green-100 font-medium max-w-2xl mx-auto">{t.tutorialSubtitle}</p>
          
          <div className="flex items-center justify-center mt-10 space-x-2">
            <button 
              onClick={() => setActiveTab('slides')}
              className={`px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${activeTab === 'slides' ? 'bg-white text-green-800 shadow-xl scale-105' : 'bg-green-700/50 hover:bg-green-700'}`}
            >
              🖼️ Sliders Interactifs
            </button>
            <button 
              onClick={() => setActiveTab('video')}
              className={`px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${activeTab === 'video' ? 'bg-white text-green-800 shadow-xl scale-105' : 'bg-green-700/50 hover:bg-green-700'}`}
            >
              🎥 Formations Vidéo
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'slides' ? (
        <div className="space-y-8">
          <div className="flex overflow-x-auto pb-2 space-x-3 no-scrollbar">
            {sliderSets.map((set, idx) => (
              <button
                key={set.id}
                onClick={() => { setActiveSliderSet(idx); setActiveSlide(0); }}
                className={`flex-shrink-0 px-6 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${activeSliderSet === idx ? 'bg-green-700 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'}`}
              >
                {set.name}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden min-h-[500px]">
            <div className="flex flex-col lg:flex-row h-full">
              <div className="lg:w-1/2 relative h-80 lg:h-auto overflow-hidden">
                <img 
                  key={`${activeSliderSet}-${activeSlide}`}
                  src={sliderSets[activeSliderSet].slides[activeSlide].img} 
                  className="w-full h-full object-cover animate-in fade-in zoom-in duration-700"
                  alt="Tutoriel"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-10">
                  <div className="bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/20 text-white font-black text-xs uppercase tracking-widest">
                    Slide {activeSlide + 1} / {sliderSets[activeSliderSet].slides.length}
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center bg-slate-50/50 dark:bg-slate-900/20">
                <h3 className="text-4xl font-black text-slate-800 dark:text-white mb-6 leading-tight">
                  {sliderSets[activeSliderSet].slides[activeSlide].title}
                </h3>
                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
                  {sliderSets[activeSliderSet].slides[activeSlide].text}
                </p>
                
                <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-[2rem] border-2 border-amber-100 dark:border-amber-900/20 mb-12 flex items-start space-x-5">
                  <span className="text-4xl animate-bounce">💡</span>
                  <div>
                    <p className="text-xs font-black text-amber-600 uppercase tracking-widest mb-1">Conseil d'expert</p>
                    <p className="text-sm text-amber-900 dark:text-amber-200 font-medium leading-snug">{sliderSets[activeSliderSet].slides[activeSlide].tip}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button 
                    disabled={activeSlide === 0}
                    onClick={() => setActiveSlide(s => s - 1)}
                    className="w-16 h-16 rounded-3xl bg-white dark:bg-slate-700 text-slate-400 hover:text-green-700 dark:hover:text-white disabled:opacity-20 shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-90"
                  >
                    <span className="text-2xl">⬅️</span>
                  </button>
                  <div className="flex space-x-3">
                    {sliderSets[activeSliderSet].slides.map((_, i) => (
                      <div key={i} className={`h-2.5 rounded-full transition-all duration-300 ${i === activeSlide ? 'w-12 bg-green-600' : 'w-2.5 bg-slate-200 dark:bg-slate-700'}`} />
                    ))}
                  </div>
                  <button 
                    onClick={() => {
                      if (activeSlide < sliderSets[activeSliderSet].slides.length - 1) {
                        setActiveSlide(s => s + 1);
                      } else if (activeSliderSet < sliderSets.length - 1) {
                        setActiveSliderSet(s => s + 1);
                        setActiveSlide(0);
                      }
                    }}
                    className="px-10 py-5 rounded-3xl bg-green-700 text-white font-black shadow-xl shadow-green-900/30 hover:bg-green-800 hover:scale-105 active:scale-95 transition-all flex items-center space-x-3"
                  >
                    <span>{activeSlide === sliderSets[activeSliderSet].slides.length - 1 ? 'Suivant' : 'Continuer'}</span>
                    <span>➡️</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <div className="xl:col-span-2 space-y-6">
            <div className="aspect-video bg-black rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white dark:border-slate-800 relative group">
              <video 
                key={currentLesson?.url}
                className="w-full h-full object-cover"
                controls
                autoPlay={false}
              >
                <source src={currentLesson?.url} type="video/mp4" />
              </video>
            </div>
            <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-black text-slate-800 dark:text-white">{currentLesson?.title}</h3>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest">
                  ⏱️ {currentLesson?.duration}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xl">
                {currentLesson?.desc}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {videoSeries.map(serie => (
              <div key={serie.id} className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-4">{serie.name}</h4>
                <div className="space-y-3">
                  {serie.lessons.map((lesson, idx) => {
                    const isSelected = activeSerie === serie.id && activeLesson === idx;
                    return (
                      <button
                        key={lesson.title}
                        onClick={() => { setActiveSerie(serie.id); setActiveLesson(idx); }}
                        className={`
                          w-full flex items-center p-5 rounded-[2rem] transition-all text-left border-2
                          ${isSelected 
                            ? 'bg-green-700 border-green-700 text-white shadow-2xl scale-[1.02]' 
                            : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-green-200 dark:hover:border-green-800'}
                        `}
                      >
                        <div className={`
                          w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm mr-5
                          ${isSelected ? 'bg-white text-green-700' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}
                        `}>
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-black leading-tight ${isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                            {lesson.title}
                          </p>
                          <p className={`text-[10px] mt-1 font-bold ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>
                             {lesson.duration}
                          </p>
                        </div>
                        {isSelected && <span className="text-2xl animate-pulse">▶️</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorialModule;

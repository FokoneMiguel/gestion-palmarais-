import React, { useState } from 'react';

const TutorialModule: React.FC<{ t: any }> = ({ t }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'slides'>('video');
  const [activeSerie, setActiveSerie] = useState(0);
  const [activeVideo, setActiveVideo] = useState(0);
  const [activeSliderSet, setActiveSliderSet] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const videoSeries = [
    {
      name: "Série 1 : Démarrage Rapide (Quick Start)",
      videos: [
        { title: "Vidéo 1 : Première Connexion", duration: "2-3 min", timeline: ["0:00 - Écran d'accueil", "0:30 - Création profil", "1:00 - Localisation", "2:00 - Préférences"] },
        { title: "Vidéo 2 : Créer Votre Première Plantation", duration: "3-4 min", timeline: ["0:00 - Accès module", "0:45 - Type de culture", "2:15 - Détails plants", "3:30 - Valider"] },
        { title: "Vidéo 3 : Configurer les Alertes", duration: "2 min", timeline: ["0:00 - Paramètres", "0:30 - Notifications", "1:00 - Seuils d'alerte", "1:30 - Test"] }
      ]
    },
    {
      name: "Série 2 : Fonctionnalités Essentielles",
      videos: [
        { title: "Vidéo 4 : Tableau de Bord et Monitoring", duration: "4 min", timeline: ["Vue dashboard", "Indicateurs", "Navigation", "Graphiques"] },
        { title: "Vidéo 5 : Gestion de l'Irrigation", duration: "3 min", timeline: ["Humidité", "Alerte arrosage", "Manuel/Auto"] },
        { title: "Vidéo 6 : Suivi et Notes", duration: "2-3 min", timeline: ["Observation", "Photos", "Croissance", "Historique"] }
      ]
    },
    {
      name: "Série 3 : Fonctions Avancées",
      videos: [
        { title: "Vidéo 7 : Calendrier et Planification", duration: "3 min", timeline: ["Calendrier", "Tâches", "Rotation", "Rappels"] },
        { title: "Vidéo 8 : Analyses et Rapports", duration: "4 min", timeline: ["Stats", "Comparaison", "Générer", "Export"] },
        { title: "Vidéo 9 : Capteurs IoT", duration: "3-4 min", timeline: ["Connecter", "Calibration", "Temps réel", "Résolution"] }
      ]
    }
  ];

  const sliders = [
    {
      name: "Inscription et Premier Pas",
      slides: [
        { title: "Écran d'accueil", text: "Bienvenue sur AgriSmart ! Appuyez sur 'Commencer'", action: "Flèche vers le bouton", img: "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=800" },
        { title: "Formulaire d'inscription", text: "Créez votre compte : Remplissez vos informations", action: "Champs surlignés", img: "https://images.unsplash.com/photo-1454165833762-02ac4f4089e8?w=800" },
        { title: "Configuration profil", text: "Parlez-nous de vous : Sélectionnez votre région", action: "Champs localis.", img: "https://images.unsplash.com/photo-1523348830708-15d4a09cfac2?w=800" },
        { title: "Tour guidé", text: "Découvrez l'interface interactive", action: "Menu en surbrillance", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800" },
        { title: "Prêt !", text: "Vous êtes prêt à commencer !", action: "Création active", img: "https://images.unsplash.com/photo-1505233303102-0ca048866236?w=800" }
      ]
    },
    {
      name: "Créer une Plantation",
      slides: [
        { title: "Bouton '+'", text: "Ajoutez une nouvelle plantation", action: "Cercle rouge sur +", tip: "Trouvez-le en bas à droite", img: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800" },
        { title: "Sélection culture", text: "Choisissez votre culture (Palmier, etc.)", action: "Liste avec icônes", img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800" },
        { title: "Définir la zone", text: "Nommez et localisez votre zone", action: "Zone A - Sud", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800" },
        { title: "Validation", text: "Validez et Enregistrez", action: "Bouton surligné", img: "https://images.unsplash.com/photo-1492496913980-501348b61469?w=800" }
      ]
    },
    {
      name: "Suivi Quotidien",
      slides: [
        { title: "Dashboard", text: "Votre tableau de bord central", action: "Indicateurs animés", img: "https://images.unsplash.com/photo-1551288049-bbbda536339a?w=800" },
        { title: "Détails Réel", text: "Humidité, Température, Luminosité", action: "Données live", img: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=800" }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="text-center p-10 bg-gradient-to-br from-green-800 to-green-600 rounded-[3rem] text-white shadow-2xl">
        <h2 className="text-4xl font-black mb-4">Plan de Tutoriels BST</h2>
        <p className="opacity-90 max-w-2xl mx-auto">Suivez nos guides interactifs et vidéos pour une maîtrise totale.</p>
        
        <div className="flex justify-center mt-8 space-x-2">
          <button 
            onClick={() => setActiveTab('video')}
            className={`px-8 py-3 rounded-2xl font-black transition-all ${activeTab === 'video' ? 'bg-white text-green-800 scale-105 shadow-xl' : 'bg-green-700/50 hover:bg-green-700'}`}
          >
            📹 VIDÉOS
          </button>
          <button 
            onClick={() => setActiveTab('slides')}
            className={`px-8 py-3 rounded-2xl font-black transition-all ${activeTab === 'slides' ? 'bg-white text-green-800 scale-105 shadow-xl' : 'bg-green-700/50 hover:bg-green-700'}`}
          >
            🖼️ SLIDERS
          </button>
        </div>
      </div>

      {activeTab === 'video' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            {videoSeries.map((serie, sIdx) => (
              <div key={serie.name} className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">{serie.name}</h3>
                <div className="space-y-2">
                  {serie.videos.map((v, vIdx) => (
                    <button
                      key={v.title}
                      onClick={() => { setActiveSerie(sIdx); setActiveVideo(vIdx); }}
                      className={`w-full p-4 rounded-2xl text-left transition-all ${activeSerie === sIdx && activeVideo === vIdx ? 'bg-green-700 text-white shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm">{v.title}</span>
                        <span className="text-[10px] opacity-60 font-black">{v.duration}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video bg-black rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-white dark:border-slate-800">
              <div className="w-full h-full flex flex-col items-center justify-center text-white bg-slate-900">
                <span className="text-6xl mb-4">▶️</span>
                <p className="font-black text-xl uppercase tracking-widest">{videoSeries[activeSerie].videos[activeVideo].title}</p>
                <p className="opacity-50 mt-2">Lecteur Vidéo Interactif</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
              <h4 className="text-xl font-black text-slate-800 dark:text-white mb-4">Chronologie de l'apprentissage</h4>
              <ul className="space-y-3">
                {videoSeries[activeSerie].videos[activeVideo].timeline.map(t => (
                  <li key={t} className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm font-medium">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
            {sliders.map((s, idx) => (
              <button
                key={s.name}
                onClick={() => { setActiveSliderSet(idx); setActiveSlide(0); }}
                className={`px-6 py-3 rounded-2xl whitespace-nowrap font-black text-xs uppercase tracking-widest transition-all ${activeSliderSet === idx ? 'bg-green-700 text-white' : 'bg-white dark:bg-slate-800 text-slate-500 shadow-sm'}`}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
            <div className="flex flex-col lg:flex-row min-h-[500px]">
              <div className="lg:w-1/2 relative h-80 lg:h-auto">
                <img 
                  src={sliders[activeSliderSet].slides[activeSlide].img} 
                  className="w-full h-full object-cover animate-in fade-in duration-500" 
                  alt="Tuto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-10">
                  <div className="bg-white/20 backdrop-blur-xl px-4 py-2 rounded-xl text-white font-black text-xs">
                    Étape {activeSlide + 1} / {sliders[activeSliderSet].slides.length}
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 p-12 flex flex-col justify-center">
                <h3 className="text-4xl font-black text-slate-800 dark:text-white mb-6">
                  {sliders[activeSliderSet].slides[activeSlide].title}
                </h3>
                <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                  {sliders[activeSliderSet].slides[activeSlide].text}
                </p>
                <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-[2rem] border-2 border-amber-100 dark:border-amber-900/20 mb-10 flex items-start space-x-4">
                  <span className="text-3xl">🎯</span>
                  <div>
                    <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-1">Action Requise</p>
                    <p className="text-amber-900 dark:text-amber-200 font-bold">{sliders[activeSliderSet].slides[activeSlide].action}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <button 
                    disabled={activeSlide === 0}
                    onClick={() => setActiveSlide(s => s - 1)}
                    className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-green-700 disabled:opacity-20 transition-all shadow-inner"
                  >
                    ⬅️ Précédent
                  </button>
                  <button 
                    onClick={() => {
                      if (activeSlide < sliders[activeSliderSet].slides.length - 1) {
                        setActiveSlide(s => s + 1);
                      } else if (activeSliderSet < sliders.length - 1) {
                        setActiveSliderSet(s => s + 1);
                        setActiveSlide(0);
                      }
                    }}
                    className="px-10 py-5 rounded-3xl bg-green-700 text-white font-black shadow-xl shadow-green-900/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    Continuer ➡️
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorialModule;
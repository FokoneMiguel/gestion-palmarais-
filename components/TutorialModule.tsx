
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
        { 
          title: "Vidéo 1 : Première Connexion", 
          duration: "2-3 min", 
          timeline: [
            "0:00 - Écran d'accueil et inscription",
            "0:30 - Création du profil",
            "1:00 - Configuration de la localisation",
            "1:30 - Tour guidé de l'interface",
            "2:00 - Personnalisation des préférences"
          ]
        },
        { 
          title: "Vidéo 2 : Créer Votre Première Plantation", 
          duration: "3-4 min", 
          timeline: [
            "0:00 - Accéder au module 'Nouvelle Plantation'",
            "0:45 - Choisir le type de culture",
            "1:30 - Définir la zone et dimensions",
            "2:15 - Ajouter des détails (nombre de plants, date)",
            "3:00 - Prendre/ajouter une photo",
            "3:30 - Enregistrer et valider"
          ]
        },
        { 
          title: "Vidéo 3 : Configurer les Alertes", 
          duration: "2 min", 
          timeline: [
            "0:00 - Accéder aux paramètres",
            "0:30 - Activer les notifications",
            "1:00 - Définir les seuils d'alerte",
            "1:30 - Tester une notification"
          ]
        }
      ]
    },
    {
      name: "Série 2 : Fonctionnalités Essentielles",
      videos: [
        { 
          title: "Vidéo 4 : Tableau de Bord et Monitoring", 
          duration: "4 min", 
          timeline: [
            "Vue d'ensemble du dashboard",
            "Lecture des indicateurs",
            "Navigation entre les plantations",
            "Interprétation des graphiques"
          ]
        },
        { 
          title: "Vidéo 5 : Gestion de l'Irrigation", 
          duration: "3 min", 
          timeline: [
            "Consulter les niveaux d'humidité",
            "Recevoir une alerte d'arrosage",
            "Enregistrer un arrosage manuel",
            "Programmer l'irrigation automatique"
          ]
        },
        { 
          title: "Vidéo 6 : Suivi et Notes", 
          duration: "2-3 min", 
          timeline: [
            "Ajouter une observation quotidienne",
            "Prendre des photos de progression",
            "Marquer les étapes de croissance",
            "Consulter l'historique"
          ]
        }
      ]
    },
    {
      name: "Série 3 : Fonctions Avancées",
      videos: [
        { 
          title: "Vidéo 7 : Calendrier et Planification", 
          duration: "3 min", 
          timeline: [
            "Naviguer dans le calendrier",
            "Créer des tâches récurrentes",
            "Planifier la rotation des cultures",
            "Gérer les rappels"
          ]
        },
        { 
          title: "Vidéo 8 : Analyses et Rapports", 
          duration: "4 min", 
          timeline: [
            "Accéder aux statistiques",
            "Comparer les zones de culture",
            "Générer un rapport",
            "Exporter les données"
          ]
        },
        { 
          title: "Vidéo 9 : Capteurs IoT", 
          duration: "3-4 min", 
          timeline: [
            "Connecter un capteur",
            "Calibrer les mesures",
            "Visualiser les données en temps réel",
            "Résoudre les problèmes de connexion"
          ]
        }
      ]
    }
  ];

  const sliders = [
    {
      name: "Inscription et Premier Pas",
      slides: [
        { title: "Écran d'accueil", text: "Bienvenue sur AgriSmart !", action: "Appuyez sur 'Commencer'", annotation: "Flèche vers le bouton", img: "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=800" },
        { title: "Formulaire d'inscription", text: "Créez votre compte", action: "Remplissez vos informations", annotation: "Email, mot de passe surlignés", img: "https://images.unsplash.com/photo-1454165833762-02ac4f4089e8?w=800" },
        { title: "Configuration profil", text: "Parlez-nous de vous", action: "Sélectionnez votre région", annotation: "Nom, type d'exploitation", img: "https://images.unsplash.com/photo-1523348830708-15d4a09cfac2?w=800" },
        { title: "Tour guidé", text: "Découvrez l'interface", action: "Suivez le guide interactif", annotation: "Menu, Dashboard en surbrillance", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800" },
        { title: "Prêt !", text: "Vous êtes prêt à commencer !", action: "Créez votre première plantation", annotation: "C'est parti !", img: "https://images.unsplash.com/photo-1505233303102-0ca048866236?w=800" }
      ]
    },
    {
      name: "Créer une Plantation",
      slides: [
        { title: "Bouton '+'", text: "Ajoutez une nouvelle plantation", action: "Trouvez-le en bas à droite", annotation: "Cercle rouge autour du +", img: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800" },
        { title: "Sélection culture", text: "Choisissez votre culture", action: "Ex: Tomates, Maïs, Salades", annotation: "Liste déroulante avec icônes", img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800" },
        { title: "Définir la zone", text: "Nommez et localisez votre zone", action: "Ex: Zone A - Potager Sud", annotation: "Champs : Nom, superficie", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800" },
        { title: "Détails plantation", text: "Ajoutez les détails", action: "Plus de détails = meilleur suivi", annotation: "Nombre de plants, date", img: "https://images.unsplash.com/photo-1492496913980-501348b61469?w=800" },
        { title: "Photo", text: "Prenez une photo (optionnel)", action: "Utile pour suivre l'évolution", annotation: "Appareil photo / Galerie", img: "https://images.unsplash.com/photo-1524486361537-8ad15938e1a3?w=800" },
        { title: "Validation", text: "Validez votre plantation", action: "Bouton 'Enregistrer' surligné", annotation: "Récapitulatif affiché", img: "https://images.unsplash.com/photo-1505233303102-0ca048866236?w=800" },
        { title: "Confirmation", text: "✅ Plantation créée avec succès !", action: "Configurez vos alertes", annotation: "Carte de plantation affichée", img: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800" }
      ]
    },
    {
      name: "Suivi Quotidien",
      slides: [
        { title: "Dashboard principal", text: "Votre tableau de bord", action: "Surveillez les données vitales", annotation: "Statut, température, humidité", img: "https://images.unsplash.com/photo-1551288049-bbbda536339a?w=800" },
        { title: "Sélection plantation", text: "Sélectionnez une plantation", action: "Tap sur une carte", annotation: "Affichage des détails", img: "https://images.unsplash.com/photo-1523348830708-15d4a09cfac2?w=800" },
        { title: "Détails en temps réel", text: "Consultez les données actuelles", action: "💧 Humidité, 🌡️ Température", annotation: "Indicateurs live", img: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=800" },
        { title: "Ajouter une note", text: "Enregistrez vos observations", action: "Bouton 'Ajouter une note'", annotation: "Notes quotidiennes", img: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800" },
        { title: "Historique", text: "Consultez l'évolution", action: "Suivi de croissance", annotation: "Graphiques d'évolution", img: "https://images.unsplash.com/photo-1551288049-bbbda536339a?w=800" }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-24 animate-in fade-in duration-700">
      <div className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="relative z-10 text-center">
          <h2 className="text-5xl font-black tracking-tighter mb-6">{t.tutorialTitle}</h2>
          <p className="text-xl opacity-90 font-medium max-w-2xl mx-auto leading-relaxed">{t.tutorialSubtitle}</p>
          
          <div className="flex items-center justify-center mt-12 space-x-4">
            <button 
              onClick={() => setActiveTab('video')}
              className={`flex items-center space-x-3 px-10 py-4 rounded-3xl font-black text-sm uppercase tracking-widest transition-all ${activeTab === 'video' ? 'bg-white text-green-900 shadow-2xl scale-105' : 'bg-green-700/50 hover:bg-green-700 backdrop-blur-md'}`}
            >
              <span className="text-2xl">📹</span> <span>Vidéos</span>
            </button>
            <button 
              onClick={() => setActiveTab('slides')}
              className={`flex items-center space-x-3 px-10 py-4 rounded-3xl font-black text-sm uppercase tracking-widest transition-all ${activeTab === 'slides' ? 'bg-white text-green-900 shadow-2xl scale-105' : 'bg-green-700/50 hover:bg-green-700 backdrop-blur-md'}`}
            >
              <span className="text-2xl">🖼️</span> <span>Sliders</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'video' ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <div className="xl:col-span-1 space-y-6">
            {videoSeries.map((serie, sIdx) => (
              <div key={serie.name} className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 px-2">{serie.name}</h3>
                <div className="space-y-3">
                  {serie.videos.map((v, vIdx) => (
                    <button
                      key={v.title}
                      onClick={() => { setActiveSerie(sIdx); setActiveVideo(vIdx); }}
                      className={`w-full group flex items-center p-4 rounded-2xl text-left transition-all border-2 ${activeSerie === sIdx && activeVideo === vIdx ? 'bg-green-700 border-green-700 text-white shadow-xl scale-[1.02]' : 'bg-transparent border-slate-50 dark:border-slate-700 hover:border-green-200'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs mr-4 ${activeSerie === sIdx && activeVideo === vIdx ? 'bg-white text-green-700' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                        {vIdx + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-black leading-tight ${activeSerie === sIdx && activeVideo === vIdx ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>{v.title}</p>
                        <p className={`text-[10px] font-bold uppercase mt-1 ${activeSerie === sIdx && activeVideo === vIdx ? 'text-white/60' : 'text-slate-400'}`}>⏱️ {v.duration}</p>
                      </div>
                      {activeSerie === sIdx && activeVideo === vIdx && <span className="text-xl animate-pulse">▶️</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="xl:col-span-2 space-y-8">
            <div className="aspect-video bg-black rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden border-[12px] border-white dark:border-slate-800 relative group">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-slate-900 group-hover:bg-slate-800 transition-colors">
                 <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center shadow-2xl mb-6 hover:scale-110 transition-transform cursor-pointer">
                    <span className="text-4xl">▶️</span>
                 </div>
                 <h4 className="text-2xl font-black uppercase tracking-[0.2em]">{videoSeries[activeSerie].videos[activeVideo].title}</h4>
                 <p className="mt-2 text-white/50 font-bold uppercase tracking-widest text-xs">Lecteur Multimédia BST</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-12 rounded-[3.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-2xl font-black text-slate-800 dark:text-white">Plan d'apprentissage</h4>
                <div className="px-5 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-xs font-black uppercase tracking-widest">
                  {videoSeries[activeSerie].videos[activeVideo].duration}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videoSeries[activeSerie].videos[activeVideo].timeline.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-4 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-transparent hover:border-green-100 transition-all">
                    <span className="bg-white dark:bg-slate-700 text-green-600 w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shadow-sm">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-snug">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar">
            {sliders.map((s, idx) => (
              <button
                key={s.name}
                onClick={() => { setActiveSliderSet(idx); setActiveSlide(0); }}
                className={`flex-shrink-0 px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeSliderSet === idx ? 'bg-green-700 text-white shadow-xl scale-105' : 'bg-white dark:bg-slate-800 text-slate-500 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-green-200'}`}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-[4rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 min-h-[650px] flex flex-col lg:flex-row">
            <div className="lg:w-1/2 relative min-h-[400px]">
              <img 
                key={`${activeSliderSet}-${activeSlide}`}
                src={sliders[activeSliderSet].slides[activeSlide].img} 
                className="w-full h-full object-cover animate-in fade-in duration-700" 
                alt="Tutorial Step"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-12">
                <div className="w-full">
                  <div className="bg-white/10 backdrop-blur-2xl inline-block px-6 py-2 rounded-2xl border border-white/20 text-white font-black text-xs uppercase tracking-widest mb-4">
                    Étape {activeSlide + 1} / {sliders[activeSliderSet].slides.length}
                  </div>
                  <h3 className="text-5xl font-black text-white tracking-tighter leading-none mb-2">
                    {sliders[activeSliderSet].slides[activeSlide].title}
                  </h3>
                </div>
              </div>
              
              {/* Fake Annotation Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-bounce">
                <div className="w-24 h-24 border-8 border-amber-400 rounded-full shadow-[0_0_50px_rgba(251,191,36,0.6)] flex items-center justify-center">
                   <span className="text-4xl">👆</span>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 p-16 flex flex-col justify-center bg-slate-50/50 dark:bg-slate-900/20">
              <div className="space-y-10">
                <div>
                   <p className="text-sm font-black text-green-700 uppercase tracking-widest mb-4">Description</p>
                   <p className="text-3xl font-bold text-slate-800 dark:text-white leading-tight">
                    {sliders[activeSliderSet].slides[activeSlide].text}
                   </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border-2 border-green-100 dark:border-green-900/30 shadow-sm flex items-start space-x-6">
                  <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 rounded-3xl flex items-center justify-center text-3xl">
                    🎯
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-green-600 tracking-widest mb-1">Action Requise</p>
                    <p className="text-xl font-black text-slate-800 dark:text-white">{sliders[activeSliderSet].slides[activeSlide].action}</p>
                    <p className="text-xs font-bold text-slate-400 mt-2 italic">{sliders[activeSliderSet].slides[activeSlide].annotation}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-10">
                  <button 
                    disabled={activeSlide === 0}
                    onClick={() => setActiveSlide(s => s - 1)}
                    className="w-20 h-20 rounded-[2rem] bg-white dark:bg-slate-700 text-slate-300 hover:text-green-700 disabled:opacity-20 transition-all shadow-md flex items-center justify-center text-3xl hover:scale-105 active:scale-90"
                  >
                    ⬅️
                  </button>
                  <div className="flex space-x-3">
                    {sliders[activeSliderSet].slides.map((_, i) => (
                      <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === activeSlide ? 'w-12 bg-green-600' : 'w-2 bg-slate-200 dark:bg-slate-700'}`} />
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
                    className="px-14 py-6 rounded-[2rem] bg-green-700 text-white font-black shadow-[0_20px_40px_-10px_rgba(22,101,52,0.4)] hover:bg-green-800 hover:scale-105 active:scale-95 transition-all flex items-center space-x-4"
                  >
                    <span>{activeSlide === sliders[activeSliderSet].slides.length - 1 ? 'Suivant' : 'Continuer'}</span>
                    <span className="text-2xl">➡️</span>
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

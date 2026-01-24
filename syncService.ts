
import { AppState, Activity, Sale, CashMovement } from './types';

// Simulation de la "Base de Données Cloud" partagée
// Dans une vraie application, cela serait stocké sur ton serveur (Firebase, Supabase, etc.)
const mockServerStorage = {
    activities: [] as any[],
    sales: [] as any[],
    cash: [] as any[]
};

export const syncDataWithServer = async (state: AppState, setState: Function) => {
  if (!navigator.onLine) return;

  // 1. On détecte ce qui n'a pas encore été envoyé au serveur
  const unsyncedActivities = state.activities.filter(a => !a.synced);
  const unsyncedSales = state.sales.filter(s => !s.synced);
  const unsyncedCash = state.cashMovements.filter(c => !c.synced);

  // S'il n'y a rien à synchroniser et qu'on a déjà fait un tour récent, on s'arrête
  if (unsyncedActivities.length === 0 && unsyncedSales.length === 0 && unsyncedCash.length === 0 && state.isSyncing === false) {
    // Optionnel : on pourrait quand même faire un "fetch" pour voir si un collègue a ajouté des trucs
    // Mais pour la démo, on simule l'envoi
  }

  setState((prev: AppState) => ({ ...prev, isSyncing: true }));

  try {
    // On simule un délai réseau (1.5 seconde)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulation de l'envoi : on ajoute nos données locales au "serveur imaginaire"
    // On filtre pour ne pas envoyer de doublons dans la démo
    unsyncedActivities.forEach(a => mockServerStorage.activities.push({...a, synced: true}));
    unsyncedSales.forEach(s => mockServerStorage.sales.push({...s, synced: true}));
    unsyncedCash.forEach(c => mockServerStorage.cash.push({...c, synced: true}));

    // 2. Mise à jour de l'état local : marquer tout comme synchronisé
    setState((prev: AppState) => ({
      ...prev,
      isSyncing: false,
      activities: prev.activities.map(a => ({ ...a, synced: true })),
      sales: prev.sales.map(s => ({ ...s, synced: true })),
      cashMovements: prev.cashMovements.map(c => ({ ...c, synced: true }))
    }));
    
    console.log("Cloud Sync : Vos données sont maintenant à jour pour toute l'équipe.");
  } catch (error) {
    console.error("Échec de la Cloud Sync:", error);
    setState((prev: AppState) => ({ ...prev, isSyncing: false }));
  }
};

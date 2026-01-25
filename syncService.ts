
import { AppState } from './types';

// Simulation de la "Base de Données Cloud" partagée entre tous les utilisateurs d'une même plantation
const mockServerStorage = {
    activities: [] as any[],
    sales: [] as any[],
    cash: [] as any[]
};

export const syncDataWithServer = async (state: AppState, setState: Function) => {
  if (!navigator.onLine || !state.currentUser) return;

  setState((prev: AppState) => ({ ...prev, isSyncing: true }));

  try {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1200));

    // 1. PUSH : Envoyer nos données locales non synchronisées
    const unsyncedActivities = state.activities.filter(a => !a.synced);
    const unsyncedSales = state.sales.filter(s => !s.synced);
    const unsyncedCash = state.cashMovements.filter(c => !c.synced);

    unsyncedActivities.forEach(a => mockServerStorage.activities.push({...a, synced: true}));
    unsyncedSales.forEach(s => mockServerStorage.sales.push({...s, synced: true}));
    unsyncedCash.forEach(c => mockServerStorage.cash.push({...c, synced: true}));

    // 2. PULL : Récupérer les données globales pour CETTE plantation (Simulé)
    // Dans un vrai système, on filtrerait par plantationId sur le serveur
    const plantationId = state.currentUser.plantationId;
    
    // On fusionne les données du "serveur" avec les nôtres en évitant les doublons par ID
    setState((prev: AppState) => {
        const mergeById = (local: any[], server: any[]) => {
            const map = new Map();
            local.forEach(item => map.set(item.id, item));
            server.forEach(item => {
                if (item.plantationId === plantationId) {
                    map.set(item.id, { ...item, synced: true });
                }
            });
            return Array.from(map.values()).sort((a, b) => b.updatedAt - a.updatedAt);
        };

        return {
            ...prev,
            isSyncing: false,
            activities: mergeById(prev.activities, mockServerStorage.activities),
            sales: mergeById(prev.sales, mockServerStorage.sales),
            // Fix: Property 'cash' does not exist on type 'AppState'. Using 'cashMovements' instead.
            cashMovements: mergeById(prev.cashMovements, mockServerStorage.cash)
        };
    });
    
    console.log(`Sync réussie pour ${plantationId} : Données équipe à jour.`);
  } catch (error) {
    console.error("Échec de la Cloud Sync:", error);
    setState((prev: AppState) => ({ ...prev, isSyncing: false }));
  }
};

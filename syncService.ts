
import { AppState, Activity, Sale, CashMovement } from './types';

/**
 * SIMULATION D'UN SERVEUR CLOUD CENTRAL
 * Dans une version de production, ces appels utiliseraient fetch() vers une API (Firebase/Supabase)
 */
const STORAGE_KEY = 'plameraie_cloud_mock';

const getCloudData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { activities: [], sales: [], cashMovements: [] };
};

const saveCloudData = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const syncDataWithServer = async (state: AppState, setState: Function) => {
  if (!navigator.onLine || !state.currentUser) return;

  const plantationId = state.currentUser.plantationId;
  if (plantationId === 'SYSTEM') return; // Le SuperAdmin n'est pas lié à une seule plantation

  setState((prev: AppState) => ({ ...prev, isSyncing: true }));

  try {
    // 1. Simulation délai réseau (800ms)
    await new Promise(resolve => setTimeout(resolve, 800));

    const cloudDb = getCloudData();

    // 2. PUSH : On envoie nos données locales non synchronisées au Cloud
    const localUnsyncedActivities = state.activities.filter(a => !a.synced);
    const localUnsyncedSales = state.sales.filter(s => !s.synced);
    const localUnsyncedCash = state.cashMovements.filter(c => !c.synced);

    // On ajoute les nouvelles données locales à la "DB Cloud"
    cloudDb.activities = [...cloudDb.activities, ...localUnsyncedActivities.map(a => ({...a, synced: true}))];
    cloudDb.sales = [...cloudDb.sales, ...localUnsyncedSales.map(s => ({...s, synced: true}))];
    cloudDb.cashMovements = [...cloudDb.cashMovements, ...localUnsyncedCash.map(c => ({...c, synced: true}))];

    saveCloudData(cloudDb);

    // 3. PULL : On récupère TOUTES les données du Cloud pour NOTRE plantation (données des collègues incluses)
    setState((prev: AppState) => {
      const merge = (local: any[], cloud: any[]) => {
        const map = new Map();
        // On charge le local
        local.forEach(item => map.set(item.id, item));
        // On fusionne avec le cloud (le cloud gagne si timestamp plus récent ou si donnée absente)
        cloud.forEach(item => {
          if (item.plantationId === plantationId) {
            const existing = map.get(item.id);
            if (!existing || item.updatedAt > (existing.updatedAt || 0)) {
              map.set(item.id, { ...item, synced: true });
            }
          }
        });
        return Array.from(map.values()).sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA;
        });
      };

      return {
        ...prev,
        isSyncing: false,
        activities: merge(prev.activities, cloudDb.activities),
        sales: merge(prev.sales, cloudDb.sales),
        cashMovements: merge(prev.cashMovements, cloudDb.cashMovements)
      };
    });

    console.log(`[Sync] Plantation ${plantationId} synchronisée avec l'équipe.`);
  } catch (error) {
    console.error("Erreur de synchronisation équipe:", error);
    setState((prev: AppState) => ({ ...prev, isSyncing: false }));
  }
};

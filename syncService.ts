
import { AppState } from './types';

// Simule un appel API vers un serveur distant
const mockApiCall = async (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Données synchronisées avec le serveur central:", data);
      resolve({ success: true });
    }, 1500);
  });
};

export const syncDataWithServer = async (state: AppState, setState: Function) => {
  if (!navigator.onLine) return;

  const unsyncedActivities = state.activities.filter(a => !a.synced);
  const unsyncedSales = state.sales.filter(s => !s.synced);
  const unsyncedCash = state.cashMovements.filter(c => !c.synced);

  if (unsyncedActivities.length === 0 && unsyncedSales.length === 0 && unsyncedCash.length === 0) {
    return;
  }

  setState((prev: AppState) => ({ ...prev, isSyncing: true }));

  try {
    // Dans une app réelle, on enverrait tout ça par lot (batch)
    if (unsyncedActivities.length > 0) await mockApiCall(unsyncedActivities);
    if (unsyncedSales.length > 0) await mockApiCall(unsyncedSales);
    if (unsyncedCash.length > 0) await mockApiCall(unsyncedCash);

    // Marquer comme synchronisé localement
    setState((prev: AppState) => ({
      ...prev,
      isSyncing: false,
      activities: prev.activities.map(a => ({ ...a, synced: true })),
      sales: prev.sales.map(s => ({ ...s, synced: true })),
      cashMovements: prev.cashMovements.map(c => ({ ...c, synced: true }))
    }));
    
    console.log("Synchronisation terminée avec succès.");
  } catch (error) {
    console.error("Échec de la synchronisation:", error);
    setState((prev: AppState) => ({ ...prev, isSyncing: false }));
  }
};

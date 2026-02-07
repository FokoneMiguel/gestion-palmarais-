
import { AppState } from './types';

/**
 * syncService.ts - Version 2.0 (Production-Ready Simulation)
 * Gère la persistance cloud simulée, les ajouts et les suppressions en temps réel.
 */

const CLOUD_STORAGE_KEY = 'plameraie_cloud_shared_v2';

interface CloudData {
    activities: any[];
    sales: any[];
    cash: any[];
    deletedIds: string[]; // Liste des IDs supprimés pour éviter les "fantômes"
}

const getCloudData = (): CloudData => {
    try {
        const cloud = localStorage.getItem(CLOUD_STORAGE_KEY);
        return cloud ? JSON.parse(cloud) : { activities: [], sales: [], cash: [], deletedIds: [] };
    } catch (e) {
        return { activities: [], sales: [], cash: [], deletedIds: [] };
    }
};

const saveToCloud = (data: CloudData) => {
    localStorage.setItem(CLOUD_STORAGE_KEY, JSON.stringify(data));
};

/**
 * Signale au cloud qu'un élément a été supprimé localement
 */
export const syncDelete = (id: string) => {
    const cloud = getCloudData();
    if (!cloud.deletedIds.includes(id)) {
        cloud.deletedIds.push(id);
        // Nettoyage des listes cloud
        cloud.activities = cloud.activities.filter(a => a.id !== id);
        cloud.sales = cloud.sales.filter(s => s.id !== id);
        cloud.cash = cloud.cash.filter(c => c.id !== id);
        saveToCloud(cloud);
    }
};

export const syncDataWithServer = async (state: AppState, setState: Function) => {
  if (!state.currentUser) return;

  const plantationId = state.currentUser.plantationId;
  const isMaster = state.currentUser.role === 'SUPER_ADMIN';
  const cloud = getCloudData();

  // 1. PUSH : Envoyer les nouvelles données locales (non encore synchronisées)
  let hasChangesToPush = false;
  
  const unsyncedActivities = state.activities.filter(a => !a.synced);
  const unsyncedSales = state.sales.filter(s => !s.synced);

  unsyncedActivities.forEach(a => {
      if (!cloud.activities.find(ca => ca.id === a.id) && !cloud.deletedIds.includes(a.id)) {
          cloud.activities.push({ ...a, synced: true });
          hasChangesToPush = true;
      }
  });

  unsyncedSales.forEach(s => {
      if (!cloud.sales.find(cs => cs.id === s.id) && !cloud.deletedIds.includes(s.id)) {
          cloud.sales.push({ ...s, synced: true });
          hasChangesToPush = true;
      }
  });

  if (hasChangesToPush) saveToCloud(cloud);

  // 2. RECONCILIATION : Fusionner Cloud -> Local
  const mergeData = (localItems: any[], cloudItems: any[]) => {
      const map = new Map();
      
      // On commence par ce qu'on a localement
      localItems.forEach(item => map.set(item.id, item));
      
      // On ajoute/met à jour avec le cloud
      cloudItems.forEach(item => {
          // Si on est master, on prend tout. Sinon, seulement ma plantation.
          if (isMaster || item.plantationId === plantationId) {
              // On ignore ce qui a été supprimé par quelqu'un d'autre
              if (!cloud.deletedIds.includes(item.id)) {
                  map.set(item.id, { ...item, synced: true });
              }
          }
      });

      // On retire localement tout ce qui a été marqué comme supprimé dans le cloud
      cloud.deletedIds.forEach(id => map.delete(id));

      return Array.from(map.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  };

  const finalActivities = mergeData(state.activities, cloud.activities);
  const finalSales = mergeData(state.sales, cloud.sales);

  // Mise à jour de l'UI seulement si nécessaire
  const needsUpdate = 
      finalActivities.length !== state.activities.length ||
      finalSales.length !== state.sales.length ||
      unsyncedActivities.length > 0;

  if (needsUpdate) {
      setState((prev: AppState) => ({
          ...prev,
          activities: finalActivities,
          sales: finalSales,
          isSyncing: false
      }));
  }
};

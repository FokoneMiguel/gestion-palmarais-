
import { AppState, Plantation, User } from './types';

/**
 * syncService.ts - Version 3.0
 * Gère désormais la synchronisation globale des COMPTES (Users/Plantations) 
 * en plus des données opérationnelles.
 */

const CLOUD_STORAGE_KEY = 'plameraie_cloud_shared_v3';

interface CloudData {
    plantations: Plantation[];
    users: User[];
    activities: any[];
    sales: any[];
    cash: any[];
    deletedIds: string[];
}

const getCloudData = (): CloudData => {
    try {
        const cloud = localStorage.getItem(CLOUD_STORAGE_KEY);
        return cloud ? JSON.parse(cloud) : { plantations: [], users: [], activities: [], sales: [], cash: [], deletedIds: [] };
    } catch (e) {
        return { plantations: [], users: [], activities: [], sales: [], cash: [], deletedIds: [] };
    }
};

const saveToCloud = (data: CloudData) => {
    localStorage.setItem(CLOUD_STORAGE_KEY, JSON.stringify(data));
};

/**
 * Enregistre immédiatement de nouveaux comptes (utilisé lors de l'activation par lien)
 */
export const pushNewAccounts = (plantations: Plantation[], users: User[]) => {
    const cloud = getCloudData();
    plantations.forEach(p => {
        if (!cloud.plantations.find(cp => cp.id === p.id)) cloud.plantations.push(p);
    });
    users.forEach(u => {
        if (!cloud.users.find(cu => cu.id === u.id)) cloud.users.push(u);
    });
    saveToCloud(cloud);
};

export const syncDelete = (id: string) => {
    const cloud = getCloudData();
    if (!cloud.deletedIds.includes(id)) {
        cloud.deletedIds.push(id);
        cloud.activities = cloud.activities.filter(a => a.id !== id);
        cloud.sales = cloud.sales.filter(s => s.id !== id);
        cloud.cash = cloud.cash.filter(c => c.id !== id);
        // Supprimer aussi de la table plantations si c'est un ID de plantation
        cloud.plantations = cloud.plantations.filter(p => p.id !== id);
        saveToCloud(cloud);
    }
};

export const syncDataWithServer = async (state: AppState, setState: Function) => {
  const cloud = getCloudData();
  const plantationId = state.currentUser?.plantationId;
  const isMaster = state.currentUser?.role === 'SUPER_ADMIN';

  // 1. PUSH : Données opérationnelles locales -> Cloud
  let hasChanges = false;
  const unsyncedActivities = state.activities.filter(a => !a.synced);
  const unsyncedSales = state.sales.filter(s => !s.synced);

  unsyncedActivities.forEach(a => {
      if (!cloud.activities.find(ca => ca.id === a.id) && !cloud.deletedIds.includes(a.id)) {
          cloud.activities.push({ ...a, synced: true });
          hasChanges = true;
      }
  });

  unsyncedSales.forEach(s => {
      if (!cloud.sales.find(cs => cs.id === s.id) && !cloud.deletedIds.includes(s.id)) {
          cloud.sales.push({ ...s, synced: true });
          hasChanges = true;
      }
  });

  // PUSH : Mises à jour de statut de plantation (si Master)
  if (isMaster) {
      cloud.plantations = state.plantations;
      hasChanges = true;
  }

  if (hasChanges) saveToCloud(cloud);

  // 2. PULL : Cloud -> Local
  const merge = (local: any[], server: any[], filterById: boolean = true) => {
      const map = new Map();
      local.forEach(item => map.set(item.id, item));
      server.forEach(item => {
          if (!filterById || isMaster || item.plantationId === plantationId) {
              if (!cloud.deletedIds.includes(item.id)) {
                  map.set(item.id, { ...item, synced: true });
              }
          }
      });
      cloud.deletedIds.forEach(id => map.delete(id));
      return Array.from(map.values());
  };

  const finalActivities = merge(state.activities, cloud.activities);
  const finalSales = merge(state.sales, cloud.sales);
  const finalPlantations = merge(state.plantations, cloud.plantations, false);
  const finalUsers = merge(state.users, cloud.users, false);

  // Déterminer si un changement d'état est requis
  const needsUpdate = 
      finalActivities.length !== state.activities.length ||
      finalSales.length !== state.sales.length ||
      finalPlantations.length !== state.plantations.length ||
      finalUsers.length !== state.users.length ||
      // Vérifier les changements de statut internes aux objets (ex: status SUSPENDED)
      JSON.stringify(finalPlantations) !== JSON.stringify(state.plantations);

  if (needsUpdate) {
      setState((prev: AppState) => ({
          ...prev,
          activities: finalActivities.sort((a,b) => b.updatedAt - a.updatedAt),
          sales: finalSales.sort((a,b) => b.updatedAt - a.updatedAt),
          plantations: finalPlantations,
          users: finalUsers,
          isSyncing: false
      }));
  }
};

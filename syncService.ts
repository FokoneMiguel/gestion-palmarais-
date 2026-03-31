
import { AppState, Plantation, User, Notification } from './types';

/**
 * syncService.ts - Version 4.0
 * Intègre les notifications système globales pour le Super-Admin.
 */

const CLOUD_STORAGE_KEY = 'plameraie_cloud_shared_v3';

interface CloudData {
    plantations: Plantation[];
    users: User[];
    activities: any[];
    sales: any[];
    cash: any[];
    deletedIds: string[];
    systemNotifications: Notification[]; // Nouveau canal global
}

const getCloudData = (): CloudData => {
    try {
        const cloud = localStorage.getItem(CLOUD_STORAGE_KEY);
        return cloud ? JSON.parse(cloud) : { plantations: [], users: [], activities: [], sales: [], cash: [], deletedIds: [], systemNotifications: [] };
    } catch (e) {
        return { plantations: [], users: [], activities: [], sales: [], cash: [], deletedIds: [], systemNotifications: [] };
    }
};

const saveToCloud = (data: CloudData) => {
    localStorage.setItem(CLOUD_STORAGE_KEY, JSON.stringify(data));
};

/**
 * Envoie une notification système que seul le Super-Admin recevra
 */
export const pushSystemNotification = (message: string, type: 'SUCCESS' | 'INFO' | 'WARNING' = 'INFO') => {
    const cloud = getCloudData();
    const newNotif: Notification = {
        id: `sys-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        type,
        message,
        date: new Date().toISOString(),
        isRead: false
    };
    cloud.systemNotifications.push(newNotif);
    saveToCloud(cloud);
};

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
        cloud.plantations = cloud.plantations.filter(p => p.id !== id);
        saveToCloud(cloud);
    }
};

export const syncDataWithServer = async (state: AppState, setState: Function, addToast?: Function) => {
  const cloud = getCloudData();
  const plantationId = state.currentUser?.plantationId;
  const isMaster = state.currentUser?.role === 'SUPER_ADMIN';

  if (!state.currentUser) return;

  // 1. PUSH : Données locales -> Cloud
  let hasChanges = false;
  const unsyncedActivities = state.activities.filter(a => !a.synced);
  const unsyncedSales = state.sales.filter(s => !s.synced);
  const unsyncedCash = state.cashMovements.filter(c => !c.synced);

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

  unsyncedCash.forEach(c => {
      if (!cloud.cash.find(cc => cc.id === c.id) && !cloud.deletedIds.includes(c.id)) {
          cloud.cash.push({ ...c, synced: true });
          hasChanges = true;
      }
  });

  if (isMaster) {
      // Le master synchronise les plantations et les utilisateurs
      state.plantations.forEach(p => {
          const idx = cloud.plantations.findIndex(cp => cp.id === p.id);
          if (idx === -1) { cloud.plantations.push(p); hasChanges = true; }
          else if (JSON.stringify(cloud.plantations[idx]) !== JSON.stringify(p)) {
              cloud.plantations[idx] = p;
              hasChanges = true;
          }
      });
  }

  if (hasChanges) {
      saveToCloud(cloud);
      if (!isMaster) {
          pushSystemNotification(`Mise à jour reçue de ${state.currentUser.username} (${state.plantations.find(p => p.id === plantationId)?.name || plantationId})`, 'INFO');
      }
  }

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
  const finalCash = merge(state.cashMovements, cloud.cash);
  const finalPlantations = merge(state.plantations, cloud.plantations, false);
  const finalUsers = merge(state.users, cloud.users, false);

  // Gestion des notifications pour MiguelF
  let finalNotifications = [...state.notifications];
  if (isMaster) {
      cloud.systemNotifications.forEach(sn => {
          if (!state.notifications.find(n => n.id === sn.id)) {
              finalNotifications.push(sn);
              if (addToast) addToast(sn.message, 'info');
          }
      });
  }

  const needsUpdate = 
      finalActivities.length !== state.activities.length ||
      finalSales.length !== state.sales.length ||
      finalCash.length !== state.cashMovements.length ||
      finalPlantations.length !== state.plantations.length ||
      finalUsers.length !== state.users.length ||
      finalNotifications.length !== state.notifications.length ||
      JSON.stringify(finalPlantations) !== JSON.stringify(state.plantations);

  if (needsUpdate) {
      setState((prev: AppState) => ({
          ...prev,
          activities: finalActivities.sort((a,b) => b.updatedAt - a.updatedAt),
          sales: finalSales.sort((a,b) => b.updatedAt - a.updatedAt),
          cashMovements: finalCash.sort((a,b) => b.updatedAt - a.updatedAt),
          plantations: finalPlantations,
          users: finalUsers,
          notifications: finalNotifications.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
          isSyncing: false
      }));
  }
};

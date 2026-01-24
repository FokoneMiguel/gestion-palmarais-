
export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  SUPER_ADMIN = 'SUPER_ADMIN' // Toi, le développeur/vendeur
}

export interface Plantation {
  id: string;
  name: string;
  ownerName: string;
  contactEmail: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL';
  expiryDate: string;
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  password?: string;
  plantationId: string;
}

export type ActivityType = 
  | 'CREATION' 
  | 'MAINTENANCE' 
  | 'HARVEST' 
  | 'PRODUCTION' 
  | 'PACKAGING';

export interface Activity {
  id: string;
  plantationId: string;
  type: ActivityType;
  label: string;
  date: string;
  zone: string;
  quantity?: number;
  unit?: string;
  inputQuantity?: number;
  inputUnit?: string;
  workers: string[];
  cost: number;
  observations?: string;
  synced?: boolean;
  updatedAt: number;
}

export interface Sale {
  id: string;
  plantationId: string;
  date: string;
  client: string;
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
  synced?: boolean;
  updatedAt: number;
}

export interface CashMovement {
  id: string;
  plantationId: string;
  date: string;
  type: 'IN' | 'OUT' | 'WITHDRAWAL';
  amount: number;
  reason: string;
  synced?: boolean;
  updatedAt: number;
}

export interface Notification {
  id: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ALERT';
  message: string;
  date: string;
  isRead: boolean;
}

export interface AppState {
  plantations: Plantation[]; // Liste des clients (accessible par SuperAdmin)
  users: User[];
  currentUser: User | null;
  activities: Activity[];
  sales: Sale[];
  cashMovements: CashMovement[];
  notifications: Notification[];
  language: 'FR' | 'EN';
  theme: 'light' | 'dark';
  isOnline: boolean;
  isSyncing: boolean;
}

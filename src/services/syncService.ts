import { apiClient } from './apiClient';
import { storageService } from './storageService';
import { SyncStatus, DeltaSyncPayload } from '../types/auth';

class SyncService {
  private status: SyncStatus = {
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSyncing: false,
    lastSyncedAt: localStorage.getItem('stillskudy_last_synced_at'),
    pendingChangesCount: 0,
    syncError: null
  };

  private listeners: ((status: SyncStatus) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.updateStatus({ isOnline: true, syncError: null });
        this.performSync();
      });
      window.addEventListener('offline', () => {
        this.updateStatus({ isOnline: false });
      });
    }
  }

  getStatus(): SyncStatus {
    return { ...this.status };
  }

  subscribe(listener: (status: SyncStatus) => void): () => void {
    this.listeners.push(listener);
    listener(this.getStatus());
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private updateStatus(partial: Partial<SyncStatus>) {
    this.status = { ...this.status, ...partial };
    this.listeners.forEach(l => l(this.getStatus()));
  }

  /**
   * Perform two-way delta sync between IndexedDB and PostgreSQL backend
   */
  async performSync(): Promise<{ success: boolean; message: string }> {
    if (!apiClient.getToken()) {
      return { success: false, message: 'Not logged in to cloud account' };
    }

    if (!navigator.onLine) {
      this.updateStatus({ isOnline: false, syncError: 'Device is offline' });
      return { success: false, message: 'Device is currently offline' };
    }

    this.updateStatus({ isSyncing: true, syncError: null });

    try {
      // 1. Gather all local IndexedDB data
      const [
        profile,
        settings,
        progress,
        ideProjects,
        managedProjects,
        plannerTasks,
        portfolio,
        practiceAttempts
      ] = await Promise.all([
        storageService.getProfile(),
        storageService.getSettings(),
        storageService.getProgress(),
        storageService.getIdeProjects(),
        storageService.getManagedProjects(),
        storageService.getPlannerTasks(),
        storageService.getPortfolio(),
        storageService.getPracticeAttempts()
      ]);

      const payload: DeltaSyncPayload = {
        lastSyncedTimestamp: this.status.lastSyncedAt || new Date(0).toISOString(),
        profile,
        settings,
        progress,
        ideProjects,
        managedProjects,
        plannerTasks,
        portfolio,
        practiceAttempts
      };

      // 2. Push local data and pull remote changes from server
      const response: any = await apiClient.post('/sync/push', payload);

      // 3. Reconcile any server-authoritative data if provided
      if (response && response.remoteData) {
        const remote = response.remoteData;
        if (remote.profile) await storageService.saveProfile(remote.profile);
        if (remote.progress) await storageService.saveProgress(remote.progress);
        if (remote.portfolio) await storageService.savePortfolio(remote.portfolio);
      }

      const now = new Date().toISOString();
      localStorage.setItem('stillskudy_last_synced_at', now);
      this.updateStatus({
        isSyncing: false,
        lastSyncedAt: now,
        pendingChangesCount: 0,
        syncError: null
      });

      return { success: true, message: 'Cloud sync completed successfully' };
    } catch (err: any) {
      console.warn('Sync failed, continuing in offline mode:', err.message);
      this.updateStatus({
        isSyncing: false,
        syncError: err.message || 'Sync failed. Working in local offline mode.'
      });
      return { success: false, message: err.message };
    }
  }
}

export const syncService = new SyncService();

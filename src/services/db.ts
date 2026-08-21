/**
 * Offline-First IndexedDB Engine for Skudium
 * Stores all student data locally on device with zero external dependencies.
 */

const DB_NAME = 'Skudium_DB';
const DB_VERSION = 1;

export const STORES = {
  PROFILE: 'profile',
  SETTINGS: 'settings',
  PROGRESS: 'progress',
  IDE_PROJECTS: 'ide_projects',
  MANAGED_PROJECTS: 'managed_projects',
  PLANNER_TASKS: 'planner_tasks',
  PORTFOLIO: 'portfolio',
  ACHIEVEMENTS: 'achievements',
  PRACTICE_ATTEMPTS: 'practice_attempts',
} as const;

class IndexedDBClient {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        return reject(new Error('IndexedDB is not supported in this environment'));
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Key-value single record stores
        if (!db.objectStoreNames.contains(STORES.PROFILE)) {
          db.createObjectStore(STORES.PROFILE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.PROGRESS)) {
          db.createObjectStore(STORES.PROGRESS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.PORTFOLIO)) {
          db.createObjectStore(STORES.PORTFOLIO, { keyPath: 'id' });
        }

        // Multi-record stores
        if (!db.objectStoreNames.contains(STORES.IDE_PROJECTS)) {
          const store = db.createObjectStore(STORES.IDE_PROJECTS, { keyPath: 'id' });
          store.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORES.MANAGED_PROJECTS)) {
          const store = db.createObjectStore(STORES.MANAGED_PROJECTS, { keyPath: 'id' });
          store.createIndex('status', 'status', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORES.PLANNER_TASKS)) {
          const store = db.createObjectStore(STORES.PLANNER_TASKS, { keyPath: 'id' });
          store.createIndex('date', 'date', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORES.ACHIEVEMENTS)) {
          db.createObjectStore(STORES.ACHIEVEMENTS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.PRACTICE_ATTEMPTS)) {
          const store = db.createObjectStore(STORES.PRACTICE_ATTEMPTS, { keyPath: 'id' });
          store.createIndex('date', 'date', { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  async get<T>(storeName: string, key: IDBValidKey): Promise<T | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result ? (req.result.data !== undefined ? req.result.data : req.result) : null);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn(`IndexedDB get failed for ${storeName}/${key}, fallback to localStorage`, err);
      const raw = localStorage.getItem(`stillskudy_${storeName}_${key}`);
      return raw ? JSON.parse(raw) : null;
    }
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => {
          const results = req.result || [];
          resolve(results.map(item => (item && item.data !== undefined ? item.data : item)));
        };
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn(`IndexedDB getAll failed for ${storeName}, fallback to localStorage`, err);
      const raw = localStorage.getItem(`stillskudy_${storeName}_all`);
      return raw ? JSON.parse(raw) : [];
    }
  }

  async put<T>(storeName: string, value: T, key?: IDBValidKey): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        
        let req: IDBRequest;
        if (key !== undefined) {
          req = store.put({ id: key, data: value });
        } else {
          req = store.put(value);
        }
        
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn(`IndexedDB put failed for ${storeName}, saving to localStorage`, err);
      const storageKey = key ? `stillskudy_${storeName}_${key}` : `stillskudy_${storeName}_${(value as any).id || 'single'}`;
      localStorage.setItem(storageKey, JSON.stringify(value));
    }
  }

  async delete(storeName: string, key: IDBValidKey): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn(`IndexedDB delete failed for ${storeName}/${key}`, err);
      localStorage.removeItem(`stillskudy_${storeName}_${key}`);
    }
  }

  async clear(storeName: string): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn(`IndexedDB clear failed for ${storeName}`, err);
    }
  }

  async clearAll(): Promise<void> {
    const stores = Object.values(STORES);
    for (const store of stores) {
      await this.clear(store);
    }
  }
}

export const db = new IndexedDBClient();

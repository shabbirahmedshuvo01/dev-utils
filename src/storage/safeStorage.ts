export interface SafeStorageOptions {
  storage?: Storage;
  now?: () => number;
}

interface StoredValue<T> {
  value: T;
  expiresAt: number | null;
}

export function safeStorage(options: SafeStorageOptions = {}) {
  const storage = options.storage ?? (typeof window !== "undefined" ? window.localStorage : undefined);
  const now = options.now ?? Date.now;

  return {
    set<T>(key: string, value: T, ttlMs?: number): boolean {
      if (!storage) return false;
      try {
        const item: StoredValue<T> = {
          value,
          expiresAt: ttlMs == null ? null : now() + Math.max(0, ttlMs)
        };
        storage.setItem(key, JSON.stringify(item));
        return true;
      } catch {
        return false;
      }
    },

    get<T>(key: string): T | null {
      if (!storage) return null;
      try {
        const raw = storage.getItem(key);
        if (!raw) return null;
        const item = JSON.parse(raw) as StoredValue<T>;
        if (item.expiresAt !== null && now() >= item.expiresAt) {
          storage.removeItem(key);
          return null;
        }
        return item.value;
      } catch {
        return null;
      }
    },

    remove(key: string): boolean {
      if (!storage) return false;
      try {
        storage.removeItem(key);
        return true;
      } catch {
        return false;
      }
    },

    clear(): boolean {
      if (!storage) return false;
      try {
        storage.clear();
        return true;
      } catch {
        return false;
      }
    }
  };
}
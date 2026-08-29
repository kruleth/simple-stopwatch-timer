import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Thin typed wrapper over AsyncStorage.
 *
 * Every read is total: a missing key, unparseable JSON, or a device storage
 * error all resolve to the caller's fallback rather than throwing, so a
 * corrupted entry degrades to "empty" instead of a white screen on launch.
 */

export const StorageKeys = {
  settings: 'lapse.settings.v1',
  history: 'lapse.history.v1',
  stopwatch: 'lapse.stopwatch.v1',
  timer: 'lapse.timer.v1',
  recents: 'lapse.recents.v1',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

export async function readJSON<T>(key: StorageKey, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    if (__DEV__) console.warn(`[storage] failed to read "${key}"`, error);
    // Drop the bad entry so the app does not retry a doomed parse every launch.
    await AsyncStorage.removeItem(key).catch(() => {});
    return fallback;
  }
}

export async function writeJSON<T>(key: StorageKey, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    if (__DEV__) console.warn(`[storage] failed to write "${key}"`, error);
  }
}

export async function removeKey(key: StorageKey): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    if (__DEV__) console.warn(`[storage] failed to remove "${key}"`, error);
  }
}

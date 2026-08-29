import { colorScheme } from 'nativewind';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';

import { readJSON, StorageKeys, writeJSON } from '@/lib/storage';
import { DEFAULT_SETTINGS, type Settings } from '@/lib/types';

type SettingsContextValue = {
  settings: Settings;
  /** False until the stored settings have been read back from disk. */
  ready: boolean;
  /** The scheme actually in effect, with `system` already resolved. */
  scheme: 'light' | 'dark';
  set: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  reset: () => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  // React Native reports null before the first read, and 'unspecified' on
  // platforms with no preference, so anything that is not explicitly dark
  // resolves to light.
  const systemScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  // Load once on mount. Spreading over the defaults means a stored blob
  // written by an older build still works after a new setting is added.
  useEffect(() => {
    let active = true;

    readJSON<Partial<Settings>>(StorageKeys.settings, {}).then((stored) => {
      if (!active) return;
      setSettings({ ...DEFAULT_SETTINGS, ...stored });
      setReady(true);
    });

    return () => {
      active = false;
    };
  }, []);

  const scheme = settings.theme === 'system' ? systemScheme : settings.theme;

  // Push the resolved scheme into NativeWind so `dark:` variants track it.
  useEffect(() => {
    colorScheme.set(scheme);
  }, [scheme]);

  const persist = useCallback((next: Settings) => {
    setSettings(next);
    void writeJSON(StorageKeys.settings, next);
  }, []);

  const set = useCallback<SettingsContextValue['set']>(
    (key, value) =>
      setSettings((current) => {
        const next = { ...current, [key]: value };
        void writeJSON(StorageKeys.settings, next);
        return next;
      }),
    []
  );

  const reset = useCallback(() => persist(DEFAULT_SETTINGS), [persist]);

  const value = useMemo(
    () => ({ settings, ready, scheme, set, reset }),
    [settings, ready, scheme, set, reset]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used inside <SettingsProvider>');
  return context;
}

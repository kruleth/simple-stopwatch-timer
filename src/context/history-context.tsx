import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { readJSON, StorageKeys, writeJSON } from '@/lib/storage';
import type { Session } from '@/lib/types';

/** Keeps the stored blob bounded; oldest runs fall off the end. */
const MAX_SESSIONS = 200;

type NewSession = Omit<Session, 'id' | 'endedAt'>;

type HistoryContextValue = {
  /** Newest first. */
  sessions: Session[];
  ready: boolean;
  add: (session: NewSession) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const HistoryContext = createContext<HistoryContextValue | null>(null);

const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [ready, setReady] = useState(false);

  // Guards against writing an empty list over real data if something calls
  // `add` in the window before the initial read resolves.
  const loaded = useRef(false);

  useEffect(() => {
    let active = true;

    readJSON<Session[]>(StorageKeys.history, []).then((stored) => {
      if (!active) return;
      setSessions(Array.isArray(stored) ? stored : []);
      loaded.current = true;
      setReady(true);
    });

    return () => {
      active = false;
    };
  }, []);

  const commit = useCallback((next: Session[]) => {
    setSessions(next);
    if (loaded.current) void writeJSON(StorageKeys.history, next);
  }, []);

  const add = useCallback((session: NewSession) => {
    setSessions((current) => {
      const next = [{ ...session, id: makeId(), endedAt: Date.now() }, ...current].slice(
        0,
        MAX_SESSIONS
      );

      if (loaded.current) void writeJSON(StorageKeys.history, next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setSessions((current) => {
      const next = current.filter((session) => session.id !== id);
      if (loaded.current) void writeJSON(StorageKeys.history, next);
      return next;
    });
  }, []);

  const clear = useCallback(() => commit([]), [commit]);

  const value = useMemo(
    () => ({ sessions, ready, add, remove, clear }),
    [sessions, ready, add, remove, clear]
  );

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}

export function useHistory(): HistoryContextValue {
  const context = useContext(HistoryContext);
  if (!context) throw new Error('useHistory must be used inside <HistoryProvider>');
  return context;
}

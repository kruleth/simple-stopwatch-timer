export type SessionKind = 'stopwatch' | 'timer';

/** A finished run, kept in history. */
export type Session = {
  id: string;
  kind: SessionKind;
  /** Stopwatch: how long it ran. Timer: how long it was set for. */
  durationMs: number;
  /** Epoch ms at which the run ended. */
  endedAt: number;
  /** Stopwatch only — each lap's own length, in press order. */
  laps: number[];
  /** Timer only — false when it was reset before reaching zero. */
  completed?: boolean;
};

export type ThemeChoice = 'system' | 'light' | 'dark';

export type Settings = {
  theme: ThemeChoice;
  /** Show hundredths on the big readout. Off gives a calmer, second-only tick. */
  showHundredths: boolean;
  /** Vibrate on start, lap, and timer completion. */
  haptics: boolean;
  /** Hold the screen on while something is running. */
  keepAwake: boolean;
  /** Automatically file finished runs into History. */
  saveHistory: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  showHundredths: true,
  haptics: true,
  keepAwake: true,
  saveHistory: true,
};

/**
 * Persisted stopwatch state.
 *
 * `startedAt` is an epoch timestamp, not a tick count, so a run survives the
 * app being backgrounded or killed — on relaunch the elapsed time is
 * recomputed from the wall clock rather than replayed.
 */
export type StopwatchSnapshot = {
  /** Milliseconds banked from earlier run segments. */
  accumulatedMs: number;
  /** Epoch ms the current segment began, or null when paused. */
  startedAt: number | null;
  laps: number[];
};

export const EMPTY_STOPWATCH: StopwatchSnapshot = {
  accumulatedMs: 0,
  startedAt: null,
  laps: [],
};

/** Persisted countdown state. Same wall-clock reasoning as the stopwatch. */
export type TimerSnapshot = {
  /** What the timer was set to. */
  durationMs: number;
  /** Milliseconds left, valid while paused. */
  remainingMs: number;
  /** Epoch ms the countdown will hit zero, or null when paused. */
  endsAt: number | null;
};

export const DEFAULT_TIMER_MS = 5 * 60_000;

/** The fixed duration chips on the timer screen. */
export const TIMER_PRESETS_MS = [
  30_000,
  60_000,
  3 * 60_000,
  5 * 60_000,
  10 * 60_000,
  20 * 60_000,
] as const;

/** How many custom durations to keep alongside the fixed presets. */
export const MAX_RECENT_DURATIONS = 3;

export const EMPTY_TIMER: TimerSnapshot = {
  durationMs: DEFAULT_TIMER_MS,
  remainingMs: DEFAULT_TIMER_MS,
  endsAt: null,
};

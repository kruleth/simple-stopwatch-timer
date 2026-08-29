import {
  lapStopwatch,
  pauseStopwatch,
  pauseTimer,
  resetTimer,
  startStopwatch,
  startTimer,
  stopwatchElapsed,
  sumLaps,
  timerHasFinished,
  timerProgress,
  timerRemaining,
} from '@/lib/clock';
import { EMPTY_STOPWATCH, EMPTY_TIMER, type TimerSnapshot } from '@/lib/types';

/** A fixed reference point, so no test depends on the real clock. */
const T0 = 1_700_000_000_000;

describe('stopwatchElapsed', () => {
  it('is zero for a fresh stopwatch', () => {
    expect(stopwatchElapsed(EMPTY_STOPWATCH, T0)).toBe(0);
  });

  it('counts from the wall clock while running', () => {
    const running = startStopwatch(EMPTY_STOPWATCH, T0);
    expect(stopwatchElapsed(running, T0 + 5_000)).toBe(5_000);
  });

  it('adds the live segment on top of banked time', () => {
    const snapshot = { ...EMPTY_STOPWATCH, accumulatedMs: 10_000, startedAt: T0 };
    expect(stopwatchElapsed(snapshot, T0 + 2_500)).toBe(12_500);
  });

  it('ignores a clock that jumps backwards instead of going negative', () => {
    const running = startStopwatch(EMPTY_STOPWATCH, T0);
    expect(stopwatchElapsed(running, T0 - 9_000)).toBe(0);
  });
});

describe('startStopwatch', () => {
  it('starts a stopped stopwatch', () => {
    expect(startStopwatch(EMPTY_STOPWATCH, T0).startedAt).toBe(T0);
  });

  it('leaves a running stopwatch untouched, so a double press cannot restart it', () => {
    const running = startStopwatch(EMPTY_STOPWATCH, T0);
    expect(startStopwatch(running, T0 + 3_000)).toBe(running);
  });
});

describe('pauseStopwatch', () => {
  it('banks the elapsed segment and stops the clock', () => {
    const running = startStopwatch(EMPTY_STOPWATCH, T0);
    const paused = pauseStopwatch(running, T0 + 7_000);

    expect(paused.startedAt).toBeNull();
    expect(paused.accumulatedMs).toBe(7_000);
  });

  it('survives a pause / resume / pause cycle without losing time', () => {
    let snapshot = startStopwatch(EMPTY_STOPWATCH, T0);
    snapshot = pauseStopwatch(snapshot, T0 + 4_000);
    snapshot = startStopwatch(snapshot, T0 + 60_000);
    snapshot = pauseStopwatch(snapshot, T0 + 66_000);

    // 4s in the first segment, 6s in the second. The 56s paused does not count.
    expect(snapshot.accumulatedMs).toBe(10_000);
  });

  it('is a no-op on an already-paused stopwatch', () => {
    expect(pauseStopwatch(EMPTY_STOPWATCH, T0)).toBe(EMPTY_STOPWATCH);
  });
});

describe('lapStopwatch', () => {
  it('records the time since the previous lap, not the total', () => {
    const running = startStopwatch(EMPTY_STOPWATCH, T0);

    const first = lapStopwatch(running, T0 + 3_000);
    const second = lapStopwatch(first, T0 + 8_000);

    expect(second.laps).toEqual([3_000, 5_000]);
  });

  it('keeps laps summing to the elapsed time', () => {
    let snapshot = startStopwatch(EMPTY_STOPWATCH, T0);
    snapshot = lapStopwatch(snapshot, T0 + 1_500);
    snapshot = lapStopwatch(snapshot, T0 + 4_000);

    expect(sumLaps(snapshot.laps)).toBe(stopwatchElapsed(snapshot, T0 + 4_000));
  });

  it('ignores a lap on a stopwatch that has not moved', () => {
    expect(lapStopwatch(EMPTY_STOPWATCH, T0)).toBe(EMPTY_STOPWATCH);
  });

  it('ignores a second lap pressed at the same instant', () => {
    const running = startStopwatch(EMPTY_STOPWATCH, T0);
    const once = lapStopwatch(running, T0 + 2_000);

    expect(lapStopwatch(once, T0 + 2_000)).toBe(once);
  });
});

describe('timerRemaining', () => {
  const minute: TimerSnapshot = { durationMs: 60_000, remainingMs: 60_000, endsAt: null };

  it('reports the paused remainder when stopped', () => {
    expect(timerRemaining(minute, T0)).toBe(60_000);
  });

  it('counts down from the wall clock while running', () => {
    const running = startTimer(minute, T0);
    expect(timerRemaining(running, T0 + 20_000)).toBe(40_000);
  });

  it('floors at zero once the deadline passes', () => {
    const running = startTimer(minute, T0);
    expect(timerRemaining(running, T0 + 90_000)).toBe(0);
  });
});

describe('startTimer', () => {
  it('resumes from the paused remainder rather than restarting', () => {
    let snapshot = startTimer({ durationMs: 60_000, remainingMs: 60_000, endsAt: null }, T0);
    snapshot = pauseTimer(snapshot, T0 + 25_000);
    snapshot = startTimer(snapshot, T0 + 100_000);

    expect(timerRemaining(snapshot, T0 + 100_000)).toBe(35_000);
  });

  it('starts a full countdown when the timer is sitting at zero', () => {
    const spent: TimerSnapshot = { durationMs: 60_000, remainingMs: 0, endsAt: null };
    const restarted = startTimer(spent, T0);

    expect(timerRemaining(restarted, T0)).toBe(60_000);
  });

  it('leaves a running timer untouched', () => {
    const running = startTimer(EMPTY_TIMER, T0);
    expect(startTimer(running, T0 + 1_000)).toBe(running);
  });
});

describe('timerHasFinished', () => {
  const running = startTimer({ durationMs: 10_000, remainingMs: 10_000, endsAt: null }, T0);

  it('is false before the deadline', () => {
    expect(timerHasFinished(running, T0 + 9_999)).toBe(false);
  });

  it('is true at and after the deadline', () => {
    expect(timerHasFinished(running, T0 + 10_000)).toBe(true);
    expect(timerHasFinished(running, T0 + 30_000)).toBe(true);
  });

  it('is false for a paused timer, however long ago it was paused', () => {
    expect(timerHasFinished(pauseTimer(running, T0 + 5_000), T0 + 999_999)).toBe(false);
  });
});

describe('timerProgress', () => {
  const running = startTimer({ durationMs: 100_000, remainingMs: 100_000, endsAt: null }, T0);

  it('runs from zero to one', () => {
    expect(timerProgress(running, T0)).toBe(0);
    expect(timerProgress(running, T0 + 25_000)).toBe(0.25);
    expect(timerProgress(running, T0 + 100_000)).toBe(1);
  });

  it('does not exceed one after the deadline', () => {
    expect(timerProgress(running, T0 + 500_000)).toBe(1);
  });
});

describe('resetTimer', () => {
  it('returns the full duration and stops the clock', () => {
    const running = startTimer({ durationMs: 60_000, remainingMs: 60_000, endsAt: null }, T0);
    const reset = resetTimer(pauseTimer(running, T0 + 30_000));

    expect(reset.endsAt).toBeNull();
    expect(reset.remainingMs).toBe(60_000);
  });
});

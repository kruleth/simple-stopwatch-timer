import { rememberDuration, sanitiseRecents } from '@/lib/recents';
import { MAX_RECENT_DURATIONS, TIMER_PRESETS_MS } from '@/lib/types';

const MIN = 60_000;

describe('rememberDuration', () => {
  it('ignores a duration that already has a preset chip', () => {
    for (const preset of TIMER_PRESETS_MS) {
      expect(rememberDuration([], preset)).toEqual([]);
    }
  });

  it('remembers a duration with no preset of its own', () => {
    expect(rememberDuration([], 7 * MIN)).toEqual([7 * MIN]);
  });

  it('puts the newest first', () => {
    let recents = rememberDuration([], 7 * MIN);
    recents = rememberDuration(recents, 12 * MIN);

    expect(recents).toEqual([12 * MIN, 7 * MIN]);
  });

  it('moves a repeat back to the front instead of duplicating it', () => {
    let recents = rememberDuration([], 7 * MIN);
    recents = rememberDuration(recents, 12 * MIN);
    recents = rememberDuration(recents, 7 * MIN);

    expect(recents).toEqual([7 * MIN, 12 * MIN]);
  });

  it('keeps only the three most recent', () => {
    let recents: number[] = [];
    for (const minutes of [7, 8, 9, 11]) {
      recents = rememberDuration(recents, minutes * MIN);
    }

    expect(recents).toHaveLength(MAX_RECENT_DURATIONS);
    expect(recents).toEqual([11 * MIN, 9 * MIN, 8 * MIN]);
  });

  it('returns the same array when nothing changes, so callers can skip a write', () => {
    const recents = rememberDuration([], 7 * MIN);

    expect(rememberDuration(recents, 7 * MIN)).toBe(recents);
    expect(rememberDuration(recents, 5 * MIN)).toBe(recents);
  });

  it('rejects nonsense durations', () => {
    expect(rememberDuration([], 0)).toEqual([]);
    expect(rememberDuration([], -1000)).toEqual([]);
    expect(rememberDuration([], Number.NaN)).toEqual([]);
    expect(rememberDuration([], Number.POSITIVE_INFINITY)).toEqual([]);
  });

  it('covers the worked example: 5m nudged twice is remembered as 7m only', () => {
    // Tapping the 5m preset then +1 min twice lands on 7m. Only the duration
    // actually started is recorded, so the 6m passed through never appears.
    const started = 5 * MIN + MIN + MIN;

    expect(rememberDuration([], started)).toEqual([7 * MIN]);
  });
});

describe('sanitiseRecents', () => {
  it('passes through a clean list', () => {
    expect(sanitiseRecents([7 * MIN, 12 * MIN])).toEqual([7 * MIN, 12 * MIN]);
  });

  it('discards a non-array', () => {
    expect(sanitiseRecents(null)).toEqual([]);
    expect(sanitiseRecents('7')).toEqual([]);
    expect(sanitiseRecents({ a: 1 })).toEqual([]);
  });

  it('drops entries that are not positive finite numbers', () => {
    expect(sanitiseRecents([7 * MIN, '12', null, -5, Number.NaN, 0, 9 * MIN])).toEqual([
      7 * MIN,
      9 * MIN,
    ]);
  });

  it('caps a list that grew too long', () => {
    expect(sanitiseRecents([1, 2, 3, 4, 5])).toHaveLength(MAX_RECENT_DURATIONS);
  });
});

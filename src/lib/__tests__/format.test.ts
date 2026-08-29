import { formatDuration, formatPreset, formatSpoken, formatWhen, toTimeParts } from '@/lib/format';

describe('toTimeParts', () => {
  it('formats sub-minute durations', () => {
    expect(toTimeParts(0)).toEqual({ main: '00:00', hundredths: '00' });
    expect(toTimeParts(1_234)).toEqual({ main: '00:01', hundredths: '23' });
  });

  it('formats minutes and seconds', () => {
    expect(toTimeParts(65_000)).toEqual({ main: '01:05', hundredths: '00' });
    expect(toTimeParts(59 * 60_000 + 59_000)).toEqual({ main: '59:59', hundredths: '00' });
  });

  it('adds an hours field only once past an hour', () => {
    expect(toTimeParts(3_599_999).main).toBe('59:59');
    expect(toTimeParts(3_600_000).main).toBe('1:00:00');
    expect(toTimeParts(3_661_000).main).toBe('1:01:01');
  });

  it('clamps negative input to zero rather than showing a minus sign', () => {
    expect(toTimeParts(-5_000)).toEqual({ main: '00:00', hundredths: '00' });
  });

  it('truncates rather than rounds, so the readout never runs ahead', () => {
    expect(toTimeParts(999)).toEqual({ main: '00:00', hundredths: '99' });
  });
});

describe('formatDuration', () => {
  it('includes hundredths by default and drops them on request', () => {
    expect(formatDuration(65_430)).toBe('01:05.43');
    expect(formatDuration(65_430, false)).toBe('01:05');
  });
});

describe('formatSpoken', () => {
  it('omits empty leading units', () => {
    expect(formatSpoken(5_000)).toBe('5 seconds');
    expect(formatSpoken(65_000)).toBe('1 minute, 5 seconds');
    expect(formatSpoken(3_665_000)).toBe('1 hour, 1 minute, 5 seconds');
  });

  it('singularises correctly', () => {
    expect(formatSpoken(1_000)).toBe('1 second');
    expect(formatSpoken(120_000)).toBe('2 minutes, 0 seconds');
  });
});

describe('formatPreset', () => {
  it('drops the empty half of the label', () => {
    expect(formatPreset(30_000)).toBe('30s');
    expect(formatPreset(60_000)).toBe('1m');
    expect(formatPreset(90_000)).toBe('1m 30s');
  });
});

describe('formatWhen', () => {
  const now = new Date('2026-08-26T15:00:00').getTime();

  it('labels the current day', () => {
    const earlier = new Date('2026-08-26T09:30:00').getTime();
    expect(formatWhen(earlier, now)).toContain('Today');
  });

  it('labels the previous day', () => {
    const yesterday = new Date('2026-08-25T22:15:00').getTime();
    expect(formatWhen(yesterday, now)).toContain('Yesterday');
  });

  it('falls back to a date further back', () => {
    const older = new Date('2026-08-01T10:00:00').getTime();
    const label = formatWhen(older, now);
    expect(label).not.toContain('Today');
    expect(label).not.toContain('Yesterday');
  });
});

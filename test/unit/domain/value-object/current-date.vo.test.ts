import { describe, it, expect } from 'bun:test';
import { CurrentDate } from '@domain/value-object/current-date.vo';

describe('CurrentDate value object', () => {
  it('creates startOfDay from provided date', () => {
    const dt = new Date(2026, 0, 5, 15, 30, 45); // Jan 5, 2026 15:30:45
    const cd = CurrentDate.create(dt);
    const v = cd.getValue();
    expect(v.getHours()).toBe(0);
    expect(v.getMinutes()).toBe(0);
    expect(v.getSeconds()).toBe(0);
  });

  it('detects weekend correctly', () => {
    const saturday = new Date(2026, 0, 3); // Jan 3, 2026 is Saturday
    const sunday = new Date(2026, 0, 4);
    const monday = new Date(2026, 0, 5);

    expect(CurrentDate.create(saturday).isWeekend()).toBe(true);
    expect(CurrentDate.create(sunday).isWeekend()).toBe(true);
    expect(CurrentDate.create(monday).isWeekend()).toBe(false);
  });

  it('formats to ISO and formatted string', () => {
    const dt = new Date(2026, 0, 3); // Jan 3, 2026
    const cd = CurrentDate.create(dt);
    const iso = cd.toISO();
    const formatted = cd.toFormatted();

    // formatted uses pattern 'yyyy-MM-dd'
    expect(formatted).toBe('2026-01-03');
    // iso should start with the date in UTC representation; ensure it contains the year-month-day
    expect(iso.startsWith('2026-01-03')).toBe(true);
  });

  it('toJSON returns object with expected keys', () => {
    const dt = new Date(2026, 0, 3);
    const cd = CurrentDate.create(dt);
    const json = cd.toJSON();

    expect(typeof json.iso).toBe('string');
    expect(json.formatted).toBe('2026-01-03');
    expect(json.isWeekend).toBe(true);
    expect(typeof json.timestamp).toBe('number');
    expect(json.timestamp).toBe(cd.getValue().getTime());
  });
});

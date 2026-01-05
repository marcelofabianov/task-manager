import { describe, it, expect } from 'bun:test';
import { Day } from '.../../../src/domain/value-objects/day.vo';

describe('Day value object', () => {
  it('creates valid day and throws on invalid', () => {
    expect(() => Day.create(0)).toThrow();
    expect(() => Day.create(32)).toThrow();
    const d = Day.create(15);
    expect(d.getValue()).toBe(15);
  });

  it('hasPassed uses provided date', () => {
    const today = new Date(2026, 0, 5); // Jan 5, 2026
    expect(Day.create(3).hasPassed(today)).toBe(true);
    expect(Day.create(5).hasPassed(today)).toBe(false);
    expect(Day.create(6).hasPassed(today)).toBe(false);
  });

  it('daysUntil when same month and future', () => {
    const today = new Date(2026, 0, 5);
    expect(Day.create(10).daysUntil(today)).toBe(5);
  });

  it('daysUntil when wraps to next month', () => {
    const today = new Date(2026, 0, 5);
    expect(Day.create(2).daysUntil(today)).toBe((31 - 5) + 2);
  });

  it('daysOverdue when earlier in same month', () => {
    const today = new Date(2026, 0, 5);
    expect(Day.create(3).daysOverdue(today)).toBe(2);
  });

  it('daysOverdue when wraps to previous month', () => {
    const today = new Date(2026, 0, 5);
    expect(Day.create(28).daysOverdue(today)).toBe((31 - 28) + 5);
  });

  it('toJSON serializes to number', () => {
    const d = Day.create(7);
    expect(JSON.stringify(d)).toBe('7');
  });
});

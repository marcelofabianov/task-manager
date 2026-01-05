import {
  getDaysInMonth,
  getDate,
  subMonths
} from 'date-fns';

export class Day {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  public static create(value: number): Day {
    if (value < 1 || value > 31) {
      throw new Error(`Day must be between 1 and 31. Received: ${value}`);
    }
    return new Day(value);
  }

  public getValue(): number {
    return this.value;
  }

  public hasPassed(today: Date = new Date()): boolean {
    return this.value < getDate(today);
  }

  public daysUntil(today: Date = new Date()): number {
    const todayDay = getDate(today);

    if (this.value >= todayDay) {
      return this.value - todayDay;
    }

    const daysInMonth = getDaysInMonth(today);
    return (daysInMonth - todayDay) + this.value;
  }

  public daysOverdue(today: Date = new Date()): number {
    const todayDay = getDate(today);

    if (this.value <= todayDay) {
      return todayDay - this.value;
    }

    const prevMonth = subMonths(today, 1);
    const daysInPrevMonth = getDaysInMonth(prevMonth);
    return (daysInPrevMonth - this.value) + todayDay;
  }

  public toJSON(): number {
    return this.value;
  }
}

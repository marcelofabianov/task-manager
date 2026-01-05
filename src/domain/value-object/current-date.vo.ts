import { format, isWeekend, startOfDay } from 'date-fns';

export class CurrentDate {
  private readonly value: Date;

  private constructor(value: Date) {
    this.value = startOfDay(value);
  }

  public static create(value?: Date): CurrentDate {
    return new CurrentDate(value ?? new Date());
  }

  public getValue(): Date {
    return this.value;
  }

  public isWeekend(): boolean {
    return isWeekend(this.value);
  }

  public toISO(): string {
    return this.value.toISOString();
  }

  public toFormatted(pattern: string = 'yyyy-MM-dd'): string {
    return format(this.value, pattern);
  }

  public toJSON() {
    return {
      iso: this.toISO(),
      formatted: this.toFormatted(),
      isWeekend: this.isWeekend(),
      timestamp: this.value.getTime()
    };
  }
}

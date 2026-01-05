import { isValid, parseISO } from 'date-fns';

export class NullableTime {
  private readonly value: Date | null;

  private constructor(value: Date | null) {
    this.value = value;
  }

  public static create(value?: Date | string | number | null): NullableTime {
    if (value === null || value === undefined) {
      return new NullableTime(null);
    }

    let date: Date;

    if (typeof value === 'string') {
      date = parseISO(value);
    } else if (value instanceof Date) {
      date = value;
    } else {
      date = new Date(value);
    }

    if (!isValid(date)) {
      throw new Error(`Invalid date provided for NullableTime: ${value}`);
    }

    return new NullableTime(date);
  }

  public static empty(): NullableTime {
    return new NullableTime(null);
  }

  public isEmpty(): boolean {
    return this.value === null;
  }

  public getValue(): Date | null {
    return this.value ? new Date(this.value.getTime()) : null;
  }

  public toRFC3339(): string | null {
    return this.value ? this.value.toISOString() : null;
  }

  public toJSON(): string | null {
    return this.toRFC3339();
  }
}

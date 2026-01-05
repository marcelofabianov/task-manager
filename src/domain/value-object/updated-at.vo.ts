import { isValid, parseISO } from 'date-fns';

export class UpdatedAt {
  private readonly value: Date;

  private constructor(value: Date) {
    this.value = value;
  }

  public static create(value?: Date | string | number): UpdatedAt {
    let date: Date;

    if (!value) {
      date = new Date();
    } else if (typeof value === 'string') {
      date = parseISO(value);
    } else {
      date = new Date(value);
    }

    if (!isValid(date)) {
      throw new Error(`Invalid date provided for UpdatedAt: ${value}`);
    }

    return new UpdatedAt(date);
  }

  public touch(): UpdatedAt {
    return new UpdatedAt(new Date());
  }

  public getValue(): Date {
    return new Date(this.value.getTime());
  }

  public toRFC3339(): string {
    return this.value.toISOString();
  }

  public toJSON(): string {
    return this.toRFC3339();
  }
}

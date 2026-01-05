import { uuidv7 } from 'uuidv7';

export class UUID {
  private readonly value: string;
  private static readonly NIL = "00000000-0000-0000-0000-000000000000";
  private static readonly V7_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  private constructor(value: string) {
    this.value = value.toLowerCase();
  }

  public static create(): UUID {
    return new UUID(uuidv7());
  }

  public static parse(value: string): UUID {
    const normalized = value.trim().toLowerCase();

    if (normalized === UUID.NIL) {
      return new UUID(UUID.NIL);
    }

    if (!this.V7_REGEX.test(normalized)) {
      throw new Error(`Invalid UUID v7 format: ${value}`);
    }

    return new UUID(normalized);
  }

  public static nil(): UUID {
    return new UUID(UUID.NIL);
  }

  public getValue(): string {
    return this.value;
  }

  public isNil(): boolean {
    return this.value === UUID.NIL;
  }

  public equals(other: UUID): boolean {
    return this.value === other.getValue();
  }

  public toJSON(): string {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }
}

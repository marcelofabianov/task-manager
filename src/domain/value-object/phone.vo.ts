export class Phone {
  private readonly value: string;

  private static readonly E164_REGEX = /^\+[1-9]\d{9,14}$/;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): Phone {
    const normalized = value.trim().replace(/(?!^\+)\D/g, "");

    if (!normalized.startsWith("+")) {
      throw new Error(`Phone number must start with '+' and include country code. Received: ${value}`);
    }

    if (!this.E164_REGEX.test(normalized)) {
      throw new Error(`Invalid phone number format (E.164 expected with 10-15 digits). Received: ${normalized}`);
    }

    return new Phone(normalized);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Phone): boolean {
    return this.value === other.getValue();
  }

  public toJSON(): string {
    return this.value;
  }
}

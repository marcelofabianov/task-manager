export class Email {
  private readonly value: string;
  public static readonly MAX_LENGTH = 254;

  private static readonly EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): Email {
    const trimmed = value.trim();

    if (trimmed === "") {
      throw new Error("Email address cannot be empty");
    }

    if (trimmed.length > Email.MAX_LENGTH) {
      throw new Error(`Email address exceeds maximum length of ${Email.MAX_LENGTH}`);
    }

    if (!Email.EMAIL_REGEX.test(trimmed)) {
      throw new Error(`Email address has an invalid format: ${value}`);
    }

    return new Email(trimmed.toLowerCase());
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Email): boolean {
    return this.value === other.getValue();
  }

  public toJSON(): string {
    return this.value;
  }
}

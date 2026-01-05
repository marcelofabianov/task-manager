export class HashedPassword {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): HashedPassword {
    if (!value || value.trim().length < 20) {
      throw new Error("Invalid hashed password format");
    }

    const isHashed = value.startsWith("$2") || value.startsWith("$argon2");
    if (!isHashed) {
      throw new Error("Value does not appear to be a valid hash Argon2");
    }

    return new HashedPassword(value);
  }

  public getValue(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}

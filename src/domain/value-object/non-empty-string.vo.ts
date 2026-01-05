export class NonEmptyString {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): NonEmptyString {
    const trimmed = value.trim();
    if (trimmed === "") {
      throw new Error("String cannot be empty");
    }
    return new NonEmptyString(trimmed);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: NonEmptyString): boolean {
    return this.value === other.getValue();
  }

  public toJSON(): string {
    return this.value;
  }
}

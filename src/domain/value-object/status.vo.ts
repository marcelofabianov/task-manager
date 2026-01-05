export class Status {
  private readonly value: string;
  private static readonly registry = new Set<string>();

  private constructor(value: string) {
    this.value = value;
  }

  public static register(...statuses: string[]): void {
    for (const s of statuses) {
      const normalized = s.toUpperCase().trim();
      if (normalized !== "") {
        this.registry.add(normalized);
      }
    }
  }

  public static create(value: string): Status {
    const normalized = value.toUpperCase().trim();

    if (normalized === "") {
      return new Status("");
    }

    if (!this.registry.has(normalized)) {
      throw new Error(`Status '${value}' is not registered as a valid status`);
    }

    return new Status(normalized);
  }

  public static clearRegistry(): void {
    this.registry.clear();
  }

  public getValue(): string {
    return this.value;
  }

  public isValid(): boolean {
    return Status.registry.has(this.value);
  }

  public isZero(): boolean {
    return this.value === "";
  }

  public equals(other: Status): boolean {
    return this.value === other.getValue();
  }

  public toJSON(): string {
    return this.value;
  }
}

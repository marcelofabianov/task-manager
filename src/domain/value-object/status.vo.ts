import { DomainError } from "@main/shared/domain.error";

export class Status<T extends string> {
  private readonly value: T;
  private static readonly registry = new Set<string>();
  public static readonly ERR_CODE = "INVALID_STATUS";

  private constructor(value: T) {
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

  public static create<T extends string>(value: T): Status<T> {
    const normalized = value.toUpperCase().trim() as T;

    if (normalized === "" as T) {
      return new Status(normalized);
    }

    if (!this.registry.has(normalized)) {
      throw new DomainError(
        `Value '${value}' is not a valid registered status.`,
        Status.ERR_CODE,
        { invalidValue: value }
      );
    }

    return new Status(normalized);
  }

  public getValue(): T {
    return this.value;
  }

  public toJSON(): T {
    return this.value;
  }
}

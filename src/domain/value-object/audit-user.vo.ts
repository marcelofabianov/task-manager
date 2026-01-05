export class AuditUser {
  private readonly value: string;
  private static readonly SYSTEM_LITERAL = "system";
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(value: string) {
    this.value = value.toLowerCase().trim();
  }

  public static create(value: string): AuditUser {
    const normalized = value.toLowerCase().trim();

    if (normalized === this.SYSTEM_LITERAL) {
      return new AuditUser(normalized);
    }

    if (!this.EMAIL_REGEX.test(normalized)) {
      throw new Error(`AuditUser must be a valid email or the literal 'system'. Received: ${value}`);
    }

    return new AuditUser(normalized);
  }

  public static system(): AuditUser {
    return new AuditUser(this.SYSTEM_LITERAL);
  }

  public getValue(): string {
    return this.value;
  }

  public isSystem(): boolean {
    return this.value === AuditUser.SYSTEM_LITERAL;
  }

  public isEmail(): boolean {
    return !this.isSystem();
  }

  public toJSON(): string {
    return this.value;
  }
}

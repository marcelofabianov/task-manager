export class Version {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  public static create(value: number): Version {
    if (value < 0) {
      throw new Error(`Version cannot be negative. Received: ${value}`);
    }
    return new Version(value);
  }

  public static initial(): Version {
    return new Version(1);
  }

  public static zero(): Version {
    return new Version(0);
  }

  public increment(): Version {
    return new Version(this.value + 1);
  }

  public previous(): Version {
    if (this.value <= 1) {
      return Version.zero();
    }
    return new Version(this.value - 1);
  }

  public getValue(): number {
    return this.value;
  }

  public isZero(): boolean {
    return this.value === 0;
  }

  public equals(other: Version): boolean {
    return this.value === other.getValue();
  }

  public isGreaterThan(other: Version): boolean {
    return this.value > other.getValue();
  }

  public isLessThan(other: Version): boolean {
    return this.value < other.getValue();
  }

  public toJSON(): number {
    return this.value;
  }
}

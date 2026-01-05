import { expect, test, describe } from "bun:test";
import { Version } from "@domain/value-object/version.vo";

describe("Version Value Object", () => {
  test("should create initial version with value 1", () => {
    const sut = Version.initial();
    expect(sut.getValue()).toBe(1);
    expect(sut.isZero()).toBe(false);
  });

  test("should increment version correctly", () => {
    const v1 = Version.initial();
    const v2 = v1.increment();

    expect(v2.getValue()).toBe(2);
    expect(v1.getValue()).toBe(1); // Immutability check
    expect(v2).not.toBe(v1);
  });

  test("should handle previous version correctly and floor at zero", () => {
    const v2 = Version.create(2);
    const v1 = v2.previous();
    const v0 = v1.previous();
    const vMinus = v0.previous();

    expect(v1.getValue()).toBe(1);
    expect(v0.getValue()).toBe(0);
    expect(v0.isZero()).toBe(true);
    expect(vMinus.getValue()).toBe(0);
  });

  test("should throw error for negative values", () => {
    expect(() => Version.create(-1)).toThrow();
  });

  test("should compare versions correctly", () => {
    const v1 = Version.create(1);
    const v2 = Version.create(2);
    const v1Duplicate = Version.create(1);

    expect(v2.isGreaterThan(v1)).toBe(true);
    expect(v1.isLessThan(v2)).toBe(true);
    expect(v1.equals(v1Duplicate)).toBe(true);
    expect(v1.equals(v2)).toBe(false);
  });

  test("should serialize to plain number for JSON", () => {
    const sut = Version.create(10);
    expect(JSON.stringify(sut)).toBe("10");
  });
});

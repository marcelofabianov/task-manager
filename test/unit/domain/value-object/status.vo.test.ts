import { expect, test, describe, beforeEach } from "bun:test";
import { Status } from "@domain/value-object/status.vo";

describe("Status Value Object", () => {
  beforeEach(() => {
    Status.clearRegistry();
  });

  test("should register and create valid statuses", () => {
    Status.register("pending", "active ");

    const s1 = Status.create("pending");
    const s2 = Status.create("ACTIVE");

    expect(s1.getValue()).toBe("PENDING");
    expect(s2.getValue()).toBe("ACTIVE");
  });

  test("should throw error for unregistered status", () => {
    Status.register("ACTIVE");
    expect(() => Status.create("PENDING")).toThrow();
  });

  test("should handle empty (zero) status", () => {
    const sut = Status.create("");
    expect(sut.isZero()).toBe(true);
    expect(sut.getValue()).toBe("");
  });

  test("should normalize input values", () => {
    Status.register("PAID");
    const sut = Status.create(" paid ");
    expect(sut.getValue()).toBe("PAID");
  });

  test("should compare statuses correctly", () => {
    Status.register("OPEN", "CLOSED");
    const s1 = Status.create("OPEN");
    const s2 = Status.create("OPEN");
    const s3 = Status.create("CLOSED");

    expect(s1.equals(s2)).toBe(true);
    expect(s1.equals(s3)).toBe(false);
  });
});

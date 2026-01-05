import { expect, test, describe } from "bun:test";
import { CreatedAt } from "@domain/value-object/created-at.vo";

describe("CreatedAt Value Object", () => {
  test("should create a valid current timestamp when no value is provided", () => {
    const sut = CreatedAt.create();

    expect(sut.getValue()).toBeInstanceOf(Date);
    expect(sut.toRFC3339()).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  test("should be able to reconstruct from an ISO string", () => {
    const iso = "2026-01-05T10:00:00.000Z";
    const sut = CreatedAt.create(iso);

    expect(sut.toRFC3339()).toBe(iso);
  });

  test("should throw an error if an invalid date string is provided", () => {
    expect(() => CreatedAt.create("invalid-date")).toThrow();
  });

  test("should ensure immutability by returning a new Date instance", () => {
    const sut = CreatedAt.create();
    const date1 = sut.getValue();
    const date2 = sut.getValue();

    expect(date1).not.toBe(date2);
    expect(date1.getTime()).toBe(date2.getTime());
  });
});

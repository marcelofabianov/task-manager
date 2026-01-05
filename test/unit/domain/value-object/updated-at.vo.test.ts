import { expect, test, describe } from "bun:test";
import { UpdatedAt } from "@domain/value-object/updated-at.vo";

describe("UpdatedAt Value Object", () => {
  test("should create a valid current timestamp", () => {
    const sut = UpdatedAt.create();

    expect(sut.getValue()).toBeInstanceOf(Date);
    expect(sut.toRFC3339()).toMatch(/\.\d{3}Z$/);
  });

  test("should be able to reconstruct from an ISO string", () => {
    const iso = "2026-01-05T10:00:00.000Z";
    const sut = UpdatedAt.create(iso);

    expect(sut.toRFC3339()).toBe(iso);
  });

  test("should create a new instance with updated time when touch is called", async () => {
    const firstInstance = UpdatedAt.create("2026-01-01T10:00:00.000Z");
    const secondInstance = firstInstance.touch();

    expect(secondInstance.toRFC3339()).not.toBe(firstInstance.toRFC3339());
    expect(secondInstance.getValue().getTime()).toBeGreaterThan(firstInstance.getValue().getTime());
    expect(secondInstance).not.toBe(firstInstance);
  });

  test("should throw an error if an invalid date is provided", () => {
    expect(() => UpdatedAt.create("invalid-date")).toThrow();
  });

  test("should ensure immutability by returning a new Date instance on getValue", () => {
    const sut = UpdatedAt.create();
    const date1 = sut.getValue();
    const date2 = sut.getValue();

    expect(date1).not.toBe(date2);
  });

  test("should return ISO string when calling toJSON", () => {
    const iso = "2026-01-05T15:00:00.000Z";
    const sut = UpdatedAt.create(iso);

    expect(JSON.stringify(sut)).toBe(`"${iso}"`);
  });
});

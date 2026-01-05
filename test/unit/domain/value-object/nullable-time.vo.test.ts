import { expect, test, describe } from "bun:test";
import { NullableTime } from "@domain/value-object/nullable-time.vo";

describe("NullableTime Value Object", () => {
  describe("Creation and State", () => {
    test("should create an empty (null) instance using .empty()", () => {
      const sut = NullableTime.empty();

      expect(sut.isEmpty()).toBe(true);
      expect(sut.getValue()).toBeNull();
      expect(sut.toRFC3339()).toBeNull();
    });

    test("should create an empty instance when passing null or undefined to .create()", () => {
      const sutNull = NullableTime.create(null);
      const sutUndef = NullableTime.create(undefined);

      expect(sutNull.isEmpty()).toBe(true);
      expect(sutUndef.isEmpty()).toBe(true);
    });

    test("should create a valid instance from an ISO string", () => {
      const iso = "2026-01-05T16:00:00.000Z";
      const sut = NullableTime.create(iso);

      expect(sut.isEmpty()).toBe(false);
      expect(sut.toRFC3339()).toBe(iso);
    });

    test("should create a valid instance from a Date object", () => {
      const date = new Date("2026-01-05T10:00:00.000Z");
      const sut = NullableTime.create(date);

      expect(sut.isEmpty()).toBe(false);
      expect(sut.getValue()?.getTime()).toBe(date.getTime());
    });
  });

  describe("Validation and Errors", () => {
    test("should throw an error if an invalid date string is provided", () => {
      expect(() => NullableTime.create("not-a-date")).toThrow();
    });

    test("should throw an error if an invalid number is provided", () => {
      expect(() => NullableTime.create(NaN)).toThrow();
    });
  });

  describe("Serialization and Immutability", () => {
    test("should return null in JSON serialization when empty", () => {
      const sut = NullableTime.empty();
      expect(JSON.stringify(sut)).toBe("null");
    });

    test("should return ISO string in JSON serialization when valid", () => {
      const iso = "2026-01-05T16:00:00.000Z";
      const sut = NullableTime.create(iso);
      expect(JSON.stringify(sut)).toBe(`"${iso}"`);
    });

    test("should ensure immutability by returning a new Date instance", () => {
      const date = new Date();
      const sut = NullableTime.create(date);

      const date1 = sut.getValue();
      const date2 = sut.getValue();

      expect(date1).not.toBe(date2);
      expect(date1?.getTime()).toBe(date2?.getTime());
    });
  });
});

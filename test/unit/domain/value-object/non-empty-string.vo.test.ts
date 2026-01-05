import { expect, test, describe } from "bun:test";
import { NonEmptyString } from "@domain/value-object/non-empty-string.vo";

describe("NonEmptyString Value Object", () => {
  test("should create a valid non-empty string and trim it", () => {
    const sut = NonEmptyString.create("  Valid Name  ");
    expect(sut.getValue()).toBe("Valid Name");
  });

  test("should throw error for empty strings", () => {
    expect(() => NonEmptyString.create("")).toThrow("String cannot be empty");
  });

  test("should throw error for strings with only whitespace", () => {
    expect(() => NonEmptyString.create("   ")).toThrow("String cannot be empty");
  });

  test("should compare equality correctly", () => {
    const s1 = NonEmptyString.create("Value");
    const s2 = NonEmptyString.create("Value");
    const s3 = NonEmptyString.create("Other");

    expect(s1.equals(s2)).toBe(true);
    expect(s1.equals(s3)).toBe(false);
  });

  test("should serialize to plain string for JSON", () => {
    const sut = NonEmptyString.create("API User");
    expect(JSON.stringify(sut)).toBe(`"API User"`);
  });
});

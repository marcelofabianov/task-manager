import { expect, test, describe } from "bun:test";
import { Email } from "@domain/value-object/email.vo";

describe("Email Value Object", () => {
  test("should create a valid email and normalize it to lowercase", () => {
    const sut = Email.create("  MARCELO@Example.com ");
    expect(sut.getValue()).toBe("marcelo@example.com");
  });

  test("should throw error for empty email", () => {
    expect(() => Email.create("   ")).toThrow("Email address cannot be empty");
  });

  test("should throw error if email exceeds max length", () => {
    const longEmail = "a".repeat(246) + "@test.com"; // 255 chars
    expect(() => Email.create(longEmail)).toThrow(/exceeds maximum length/);
  });

  test("should throw error for invalid formats", () => {
    const invalidEmails = ["invalid-email", "@domain.com", "user@", "user@domain..com"];

    for (const invalid of invalidEmails) {
      expect(() => Email.create(invalid)).toThrow(/invalid format/);
    }
  });

  test("should compare equality correctly", () => {
    const e1 = Email.create("test@test.com");
    const e2 = Email.create("TEST@test.com");
    const e3 = Email.create("other@test.com");

    expect(e1.equals(e2)).toBe(true);
    expect(e1.equals(e3)).toBe(false);
  });

  test("should serialize correctly to JSON", () => {
    const sut = Email.create("dev@api.com");
    expect(JSON.stringify(sut)).toBe(`"dev@api.com"`);
  });
});

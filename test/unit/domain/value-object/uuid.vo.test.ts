import { expect, test, describe } from "bun:test";
import { UUID } from "@domain/value-object/uuid.vo";

describe("UUID Value Object (v7)", () => {
  test("should create a valid UUID v7", () => {
    const sut = UUID.create();
    const value = sut.getValue();

    expect(value).toHaveLength(36);
    expect(value.split('-')[2]?.startsWith('7')).toBe(true);
    expect(sut.isNil()).toBe(false);
  });

  test("should parse a valid UUID v7 string", () => {
    const validV7 = "018c3230-0aa5-7206-8123-456789abcdef";
    const sut = UUID.parse(validV7);
    expect(sut.getValue()).toBe(validV7);
  });

  test("should handle Nil UUID", () => {
    const sut = UUID.nil();
    expect(sut.isNil()).toBe(true);
    expect(sut.getValue()).toBe("00000000-0000-0000-0000-000000000000");
  });

  test("should throw error for non-v7 UUIDs or invalid strings", () => {
    const v4 = "550e8400-e29b-41d4-a716-446655440000";
    expect(() => UUID.parse(v4)).toThrow(/Invalid UUID v7/);
    expect(() => UUID.parse("invalid-uuid")).toThrow();
  });

  test("should compare equality correctly", () => {
    const idStr = "018c3230-0aa5-7206-8123-456789abcdef";
    const id1 = UUID.parse(idStr);
    const id2 = UUID.parse(idStr);
    const id3 = UUID.create();

    expect(id1.equals(id2)).toBe(true);
    expect(id1.equals(id3)).toBe(false);
  });

  test("should serialize to plain string for JSON", () => {
    const sut = UUID.create();
    const json = JSON.stringify(sut);
    expect(json).toBe(`"${sut.getValue()}"`);
  });
});

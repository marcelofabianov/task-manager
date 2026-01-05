import { expect, test, describe } from "bun:test";
import { Phone } from "@domain/value-object/phone.vo";

describe("Phone Value Object", () => {
  test("should create and normalize a valid Brazilian phone number", () => {
    const sut = Phone.create(" +55 (11) 99999-9999 ");
    expect(sut.getValue()).toBe("+5511999999999");
  });

  test("should create a valid international phone number", () => {
    const sut = Phone.create("+1 555 123 4567");
    expect(sut.getValue()).toBe("+15551234567");
  });

  test("should throw error if '+' is missing", () => {
    expect(() => Phone.create("5511999999999")).toThrow(/must start with '\+'/);
  });

  test("should throw error for invalid length or characters", () => {
    expect(() => Phone.create("+55")).toThrow(/Invalid phone number format/);
    expect(() => Phone.create("+55119999999999999")).toThrow(); // Too long (>15 digits)
  });

  test("should compare equality correctly", () => {
    const p1 = Phone.create("+5511988887777");
    const p2 = Phone.create(" +55 11 98888-7777 ");
    const p3 = Phone.create("+5511900000000");

    expect(p1.equals(p2)).toBe(true);
    expect(p1.equals(p3)).toBe(false);
  });

  test("should serialize to plain string for JSON", () => {
    const sut = Phone.create("+5511999998888");
    expect(JSON.stringify(sut)).toBe(`"+5511999998888"`);
  });
});

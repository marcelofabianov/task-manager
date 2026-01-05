import { expect, test, describe } from "bun:test";
import { AuditUser } from "@domain/value-object/audit-user.vo";

describe("AuditUser Value Object", () => {
  test("should create a system audit user", () => {
    const sut = AuditUser.system();
    expect(sut.getValue()).toBe("system");
    expect(sut.isSystem()).toBe(true);
    expect(sut.isEmail()).toBe(false);
  });

  test("should create from a valid email and normalize it", () => {
    const sut = AuditUser.create(" MARCELO@Example.com ");
    expect(sut.getValue()).toBe("marcelo@example.com");
    expect(sut.isSystem()).toBe(false);
    expect(sut.isEmail()).toBe(true);
  });

  test("should throw error for invalid email and non-system strings", () => {
    expect(() => AuditUser.create("invalid-user")).toThrow();
    expect(() => AuditUser.create("not.an.email")).toThrow();
  });

  test("should serialize to plain string for JSON", () => {
    const sut = AuditUser.create("dev@api.com");
    expect(JSON.stringify(sut)).toBe(`"dev@api.com"`);
  });
});

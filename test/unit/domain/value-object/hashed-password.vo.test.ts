import { expect, test, describe } from "bun:test";
import { HashedPassword } from "@domain/value-object/hashed-password.vo";

describe("HashedPassword Value Object", () => {
  const validBCrypt = "$2b$12$KIX67C.jH57R5G6n.k/KLeP2IeK2eK2eK2eK2eK2eK2eK2eK2eK2e";

  test("should create a valid hashed password instance", () => {
    const sut = HashedPassword.create(validBCrypt);
    expect(sut.getValue()).toBe(validBCrypt);
  });

  test("should throw error for plain text or short strings", () => {
    expect(() => HashedPassword.create("123456")).toThrow();
    expect(() => HashedPassword.create("password_test")).toThrow();
  });

  test("should throw error if hash prefix is missing", () => {
    const invalidHash = "KIX67C.jH57R5G6n.k/KLeP2IeK2eK2eK2eK2eK2eK2eK2eK2eK2e";
    expect(() => HashedPassword.create(invalidHash)).toThrow(/valid hash/);
  });

  test("should serialize correctly to JSON", () => {
    const sut = HashedPassword.create(validBCrypt);
    expect(JSON.stringify(sut)).toBe(`"${validBCrypt}"`);
  });
});

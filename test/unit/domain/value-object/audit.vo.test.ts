import { expect, test, describe } from "bun:test";
import { Audit } from "@domain/value-object/audit.vo";
import { AuditUser } from "@domain/value-object/audit-user.vo";

describe("Audit Value Object", () => {
  const user = AuditUser.create("admin@system.com");
  const editor = AuditUser.create("editor@system.com");

  test("should create a new audit trail correctly", () => {
    const sut = Audit.create(user);
    const props = sut.getProps();

    expect(sut.isActive()).toBe(true);
    expect(props.version.getValue()).toBe(1);
    expect(props.createdBy.getValue()).toBe("admin@system.com");
    expect(props.updatedBy.getValue()).toBe("admin@system.com");
  });

  test("should touch and increment version", () => {
    const initial = Audit.create(user);
    const updated = initial.touch(editor);

    expect(updated.getProps().version.getValue()).toBe(2);
    expect(updated.getProps().updatedBy.getValue()).toBe("editor@system.com");
    expect(updated.getProps().createdAt.toRFC3339()).toBe(initial.getProps().createdAt.toRFC3339());
  });

  test("should handle archive lifecycle", () => {
    const initial = Audit.create(user);
    const archived = initial.archive(editor);

    expect(archived.isArchived()).toBe(true);
    expect(archived.isActive()).toBe(false);
    expect(archived.getProps().version.getValue()).toBe(2);
  });

  test("should handle soft delete lifecycle", () => {
    const initial = Audit.create(user);
    const deleted = initial.delete(user);

    expect(deleted.isDeleted()).toBe(true);
    expect(deleted.isActive()).toBe(false);

    const restored = deleted.undelete(editor);
    expect(restored.isDeleted()).toBe(false);
    expect(restored.isActive()).toBe(true);
    expect(restored.getProps().version.getValue()).toBe(3);
  });
});

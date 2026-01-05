import { expect, test, describe, beforeEach, mock } from "bun:test";
import { User, PasswordService, NewUserInput } from "@domain/entity/user.entity";
import { AuditUser } from "@domain/value-object/audit-user.vo";
import { HashedPassword } from "@domain/value-object/hashed-password.vo";
import { Status } from "@domain/value-object/status.vo";

describe("User Entity", () => {
  let passwordServiceMock: PasswordService;
  const adminUser = AuditUser.create("admin@system.com");
  const validHash = "$2b$12$KIX67C.jH57R5G6n.k/KLeP2IeK2eK2eK2eK2eK2eK2eK2eK2eK2e";

  const defaultInput: NewUserInput = {
    name: "Marcelo Fabiano",
    email: "marcelo@example.com",
    phone: "+5511999998888",
    password: "safe_password",
    role: "USER",
    preferences: { theme: "dark" }
  };

  beforeEach(() => {
    Status.clearRegistry();
    Status.register("USER", "ADMIN", "ACTIVE", "INACTIVE");

    passwordServiceMock = {
      hash: mock(async () => HashedPassword.create(validHash)),
      compare: mock(async () => true)
    };
  });

  describe("create", () => {
    test("should create a user successfully with initial state", async () => {
      const result = await User.create(defaultInput, adminUser, passwordServiceMock);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const user = result.value;
        expect(user.id.getValue()).toBeDefined();
        expect(user.version.getValue()).toBe(1);
        expect(user.toJSON().login_status).toBe("ACTIVE");
      }
    });

    test("should return a fail Either when input is invalid (invalid email)", async () => {
      const invalidInput = { ...defaultInput, email: "invalid-email" };
      const result = await User.create(invalidInput, adminUser, passwordServiceMock);

      expect(result.isFail()).toBe(true);
    });

    test("should return a fail Either when phone is invalid", async () => {
      const invalidInput = { ...defaultInput, phone: "123" };
      const result = await User.create(invalidInput, adminUser, passwordServiceMock);

      expect(result.isFail()).toBe(true);
    });
  });

  describe("business operations", () => {
    test("should update user name and preferences and touch audit", async () => {
      const userResult = await User.create(defaultInput, adminUser, passwordServiceMock);
      const user = (userResult.value as User);

      const updateResult = user.update({
        name: "New Name",
        preferences: { theme: "light" }
      }, adminUser);

      expect(updateResult.isOk()).toBe(true);
      expect(user.name.getValue()).toBe("New Name");
      expect(user.version.getValue()).toBe(2);
    });

    test("should promote user to admin and change status in audit", async () => {
      const userResult = await User.create(defaultInput, adminUser, passwordServiceMock);
      const user = (userResult.value as User);

      user.promoteToAdmin(adminUser);

      expect(user.toJSON().role).toBe("ADMIN");
      expect(user.version.getValue()).toBe(2);
    });

    test("should change password when old password is correct", async () => {
      const userResult = await User.create(defaultInput, adminUser, passwordServiceMock);
      const user = (userResult.value as User);

      const result = await user.changePassword("old_pass", "new_pass", adminUser, passwordServiceMock);

      expect(result.isOk()).toBe(true);
      expect(user.version.getValue()).toBe(2);
      expect(passwordServiceMock.hash).toHaveBeenCalledTimes(2);
    });

    test("should fail to change password when old password is incorrect", async () => {
      passwordServiceMock.compare = mock(async () => false);
      const userResult = await User.create(defaultInput, adminUser, passwordServiceMock);
      const user = (userResult.value as User);

      const result = await user.changePassword("wrong", "new", adminUser, passwordServiceMock);

      expect(result.isFail()).toBe(true);
      expect(user.version.getValue()).toBe(1);
    });

    test("should inactivate and activate user correctly", async () => {
      const userResult = await User.create(defaultInput, adminUser, passwordServiceMock);
      const user = (userResult.value as User);

      user.inactivate(adminUser);
      expect(user.toJSON().login_status).toBe("INACTIVE");

      user.activate(adminUser);
      expect(user.toJSON().login_status).toBe("ACTIVE");
      expect(user.version.getValue()).toBe(3);
    });
  });
});

import { expect, test, describe, beforeEach, mock } from "bun:test";
import { CreateUserUseCase } from "@application/usecase/user/create-user.usecase";
import { CreateUserRepository } from "@domain/repository/user.repository";
import { PasswordService, NewUserInput, User } from "@domain/entity/user.entity";
import { AuditUser } from "@domain/value-object/audit-user.vo";
import { HashedPassword } from "@domain/value-object/hashed-password.vo";
import { Status } from "@domain/value-object/status.vo";
import { ok, fail } from "@main/shared/either";

describe("CreateUserUseCase", () => {
  let useCase: CreateUserUseCase;
  let repoMock: CreateUserRepository;
  let passwordServiceMock: PasswordService;

  const adminUser = AuditUser.create("admin@system.com");
  const validHash = "$2b$12$KIX67C.jH57R5G6n.k/KLeP2IeK2eK2eK2eK2eK2eK2eK2eK2eK2e";

  const input: NewUserInput = {
    name: "Marcelo Fabiano",
    email: "marcelo@example.com",
    phone: "+5511999998888",
    password: "secure_password",
    role: "USER",
    preferences: { theme: "dark" }
  };

  beforeEach(() => {
  Status.clearRegistry();
  Status.register("USER", "ACTIVE");

  passwordServiceMock = {
    hash: mock(async () => HashedPassword.create(validHash)),
    compare: mock(async () => true)
  };

  repoMock = {
    save: mock(async (user: User) => ok<Error, User>(user))
  };

  useCase = new CreateUserUseCase(repoMock, passwordServiceMock);
});

  test("should create and save a user successfully", async () => {
    const result = await useCase.execute(input, adminUser);

    expect(result.isOk()).toBe(true);
    expect(repoMock.save).toHaveBeenCalledTimes(1);

    if (result.isOk()) {
      expect(result.value.email.getValue()).toBe(input.email);
      expect(result.value.version.getValue()).toBe(1);
    }
  });

  test("should return a failure if domain validation fails (invalid email)", async () => {
    const invalidInput = { ...input, email: "invalid-email" };

    const result = await useCase.execute(invalidInput, adminUser);

    expect(result.isFail()).toBe(true);
    expect(repoMock.save).not.toHaveBeenCalled();
    expect(result.value).toBeInstanceOf(Error);
  });

  test("should return a failure if domain validation fails (invalid phone)", async () => {
    const invalidInput = { ...input, phone: "short" };

    const result = await useCase.execute(invalidInput, adminUser);

    expect(result.isFail()).toBe(true);
    expect(repoMock.save).not.toHaveBeenCalled();
  });

  test("should return a failure if repository fails to save", async () => {
    const dbError = new Error("Database connection failed");
    repoMock.save = mock(async () => fail<Error, User>(dbError));

    const result = await useCase.execute(input, adminUser);

    expect(result.isFail()).toBe(true);
    expect(result.value).toBe(dbError);
  });

  test("should catch and return failure if repository throws an unexpected error", async () => {
    repoMock.save = mock(async () => {
      throw new Error("Unexpected crash");
    });

    const result = await useCase.execute(input, adminUser);
    expect(result.isFail()).toBe(true);

    if (result.isFail()) {
      expect(result.value.message).toBe("Unexpected crash");
    }
  });

  test("should call password service with correct raw password", async () => {
    await useCase.execute(input, adminUser);

    expect(passwordServiceMock.hash).toHaveBeenCalledWith(input.password);
  });
});

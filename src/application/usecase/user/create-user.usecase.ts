import { Either, ok, fail } from '@main/shared/either';
import { User, NewUserInput, PasswordService } from '@domain/entity/user.entity';
import { AuditUser } from '@domain/value-object/audit-user.vo';
import { CreateUserRepository } from '@domain/repository/user.repository';

export class CreateUserUseCase {
  constructor(
    private readonly repo: CreateUserRepository,
    private readonly passwordService: PasswordService
  ) {}

  async execute(
    input: NewUserInput,
    createdBy: AuditUser
  ): Promise<Either<Error, User>> {
    const userOrError = await User.create(input, createdBy, this.passwordService);

    if (userOrError.isFail()) {
      return fail(userOrError.value);
    }

    const user = userOrError.value;

    try {
      const saveResult = await this.repo.save(user);
      if (saveResult.isFail()) {
        return fail(saveResult.value);
      }

      return ok(saveResult.value);
    } catch (error) {
      return fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}

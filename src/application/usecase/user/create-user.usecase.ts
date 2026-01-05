import { NewUserInput } from "@domain/entity/user.entity";
import { CreateUserRepository } from "@domain/repository/user.repository";
import { Either } from "@main/shared/either";
import { User } from "@domain/entity/user.entity";

export class CreateUserUseCase {
  private constructor(
     private readonly repo: CreateUserRepository
  ) { }

  public async execute(input: NewUserInput): Promise<Either<Error, User>> {
    throw new Error("Method not implemented.");
  }
}

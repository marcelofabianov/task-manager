import { User } from "@domain/entity/user.entity";
import { UserRepository } from "@domain/repository/user.repository";
import { Either } from "@main/shared/either";

export class PostgresUserRepository implements UserRepository {
  async create(user: User): Promise<Either<Error, User>> {
    throw new Error("Method not implemented.");
  }
}

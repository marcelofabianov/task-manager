import { User } from "@domain/entity/user.entity";
import { Either } from "@main/shared/either";

export interface CreateUserRepository {
  save(user: User): Promise<Either<Error, User>>
}

export interface UserRepository extends CreateUserRepository {}

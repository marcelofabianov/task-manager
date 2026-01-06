import { Either, ok, fail } from '@main/shared/either';
import { DomainError } from '@main/shared/domain.error';
import { UserError } from '@domain/error/user/user.error';

import { UUID } from '@domain/value-object/uuid.vo';
import { NonEmptyString } from '@domain/value-object/non-empty-string.vo';
import { Email } from '@domain/value-object/email.vo';
import { Phone } from '@domain/value-object/phone.vo';
import { Audit } from '@domain/value-object/audit.vo';
import { AuditUser } from '@domain/value-object/audit-user.vo';
import { HashedPassword } from '@domain/value-object/hashed-password.vo';
import { Status } from '@domain/value-object/status.vo';

import { UserStatus, UserRole } from './user-status.enum';

export interface UserProps {
  id: UUID;
  name: NonEmptyString;
  email: Email;
  phone: Phone;
  hashedPassword: HashedPassword;
  role: Status<UserRole>;
  preferences: Record<string, unknown>;
  loginStatus: Status<UserStatus>;
  audit: Audit;
}

export interface NewUserInput {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
  preferences: Record<string, unknown>;
}

export interface UpdateUserInput {
  name: string;
  preferences: Record<string, unknown>;
}

export interface PasswordService {
  hash(password: string): Promise<HashedPassword>;
  compare(password: string, hashed: HashedPassword): Promise<boolean>;
}

export class User {
  private props: UserProps;

  static {
    Status.register(...Object.values(UserStatus));
    Status.register(...Object.values(UserRole));
  }

  private constructor(props: UserProps) {
    this.props = props;
  }

  public static async create(
    input: NewUserInput,
    createdBy: AuditUser,
    passwordService: PasswordService
  ): Promise<Either<UserError, User>> {
    try {
      const hashedPassword = await passwordService.hash(input.password);

      const user = new User({
        id: UUID.create(),
        name: NonEmptyString.create(input.name),
        email: Email.create(input.email),
        phone: Phone.create(input.phone),
        hashedPassword,
        role: Status.create<UserRole>(input.role),
        preferences: input.preferences,
        loginStatus: Status.create<UserStatus>(UserStatus.ACTIVE),
        audit: Audit.create(createdBy),
      });

      return ok(user);
    } catch (error) {
      if (error instanceof DomainError) {
        return fail(UserError.fromDomainError(error));
      }
      return fail(UserError.creationFailed(error as Error));
    }
  }

  public static restore(props: UserProps): User {
    return new User(props);
  }

  public isActive(): boolean {
    return this.props.loginStatus.getValue() === UserStatus.ACTIVE;
  }

  public isAdmin(): boolean {
    return this.props.role.getValue() === UserRole.ADMIN;
  }

  public async changePassword(
    oldPassword: string,
    newPassword: string,
    updatedBy: AuditUser,
    passwordService: PasswordService
  ): Promise<Either<UserError, void>> {
    const isCorrect = await passwordService.compare(oldPassword, this.props.hashedPassword);

    if (!isCorrect) {
      return fail(UserError.incorrectPassword());
    }

    try {
      this.props.hashedPassword = await passwordService.hash(newPassword);
      this.props.audit = this.props.audit.touch(updatedBy);
      return ok(undefined);
    } catch (error) {
      return fail(UserError.passwordChangeFailed(error as Error));
    }
  }

  public update(input: UpdateUserInput, updatedBy: AuditUser): Either<UserError, void> {
    try {
      this.props.name = NonEmptyString.create(input.name);
      this.props.preferences = input.preferences;
      this.props.audit = this.props.audit.touch(updatedBy);
      return ok(undefined);
    } catch (error) {
      if (error instanceof DomainError) {
        return fail(UserError.fromDomainError(error));
      }
      return fail(UserError.updateFailed(error as Error));
    }
  }

  public inactivate(updatedBy: AuditUser): void {
    this.props.loginStatus = Status.create<UserStatus>(UserStatus.INACTIVE);
    this.props.audit = this.props.audit.touch(updatedBy);
  }

  public activate(updatedBy: AuditUser): void {
    this.props.loginStatus = Status.create<UserStatus>(UserStatus.ACTIVE);
    this.props.audit = this.props.audit.touch(updatedBy);
  }

  public promoteToAdmin(updatedBy: AuditUser): void {
    this.props.role = Status.create<UserRole>(UserRole.ADMIN);
    this.props.audit = this.props.audit.touch(updatedBy);
  }

  get id() { return this.props.id; }
  get name() { return this.props.name; }
  get email() { return this.props.email; }
  get phone() { return this.props.phone; }
  get audit() { return this.props.audit; }
  get version() { return this.props.audit.getProps().version; }

  public toJSON() {
    return {
      id: this.props.id.toJSON(),
      name: this.props.name.toJSON(),
      email: this.props.email.toJSON(),
      phone: this.props.phone.toJSON(),
      role: this.props.role.toJSON(),
      preferences: this.props.preferences,
      login_status: this.props.loginStatus.toJSON(),
      is_active: this.isActive(),
      is_admin: this.isAdmin(),
      ...this.props.audit.toJSON()
    };
  }
}

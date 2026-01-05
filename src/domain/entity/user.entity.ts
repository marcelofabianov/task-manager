import { Either, ok, fail } from '@main/shared/either';
import { UUID } from '@domain/value-object/uuid.vo';
import { NonEmptyString } from '@domain/value-object/non-empty-string.vo';
import { Email } from '@domain/value-object/email.vo';
import { Phone } from '@domain/value-object/phone.vo';
import { Audit } from '@domain/value-object/audit.vo';
import { AuditUser } from '@domain/value-object/audit-user.vo';
import { HashedPassword } from '@domain/value-object/hashed-password.vo';
import { Status } from '@domain/value-object/status.vo';

export interface UserProps {
  id: UUID;
  name: NonEmptyString;
  email: Email;
  phone: Phone;
  hashedPassword: HashedPassword;
  role: Status;
  preferences: Record<string, unknown>;
  loginStatus: Status;
  audit: Audit;
}

export interface NewUserInput {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: string;
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

  private constructor(props: UserProps) {
    this.props = props;
  }

  public static async create(
    input: NewUserInput,
    createdBy: AuditUser,
    passwordService: PasswordService
  ): Promise<Either<Error, User>> {
    try {
      const hashedPassword = await passwordService.hash(input.password);

      const user = new User({
        id: UUID.create(),
        name: NonEmptyString.create(input.name),
        email: Email.create(input.email),
        phone: Phone.create(input.phone),
        hashedPassword,
        role: Status.create(input.role),
        preferences: input.preferences,
        loginStatus: Status.create("ACTIVE"),
        audit: Audit.create(createdBy),
      });

      return ok(user);
    } catch (error) {
      return fail(error as Error);
    }
  }

  public static restore(props: UserProps): User {
    return new User(props);
  }

  public async changePassword(
    oldPassword: string,
    newPassword: string,
    updatedBy: AuditUser,
    passwordService: PasswordService
  ): Promise<Either<Error, void>> {
    const isCorrect = await passwordService.compare(oldPassword, this.props.hashedPassword);
    if (!isCorrect) return fail(new Error("Incorrect password"));

    try {
      this.props.hashedPassword = await passwordService.hash(newPassword);
      this.props.audit = this.props.audit.touch(updatedBy);
      return ok(undefined);
    } catch (error) {
      return fail(error as Error);
    }
  }

  public update(input: UpdateUserInput, updatedBy: AuditUser): Either<Error, void> {
    try {
      this.props.name = NonEmptyString.create(input.name);
      this.props.preferences = input.preferences;
      this.props.audit = this.props.audit.touch(updatedBy);
      return ok(undefined);
    } catch (error) {
      return fail(error as Error);
    }
  }

  public inactivate(updatedBy: AuditUser): void {
    this.props.loginStatus = Status.create("INACTIVE");
    this.props.audit = this.props.audit.touch(updatedBy);
  }

  public activate(updatedBy: AuditUser): void {
    this.props.loginStatus = Status.create("ACTIVE");
    this.props.audit = this.props.audit.touch(updatedBy);
  }

  public promoteToAdmin(updatedBy: AuditUser): void {
    this.props.role = Status.create("ADMIN");
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
      ...this.props.audit.toJSON()
    };
  }
}

import { DomainError, ErrorContext } from "@main/shared/domain.error";
import { UserErrorCode } from "./user-error-codes.enum";

export class UserError extends DomainError {
  private static readonly MAPPINGS: Partial<Record<UserErrorCode, UserErrorCode>> = {
    [UserErrorCode.INVALID_NAME]: UserErrorCode.NAME_ERROR,
    [UserErrorCode.INVALID_EMAIL]: UserErrorCode.EMAIL_ERROR,
    [UserErrorCode.INVALID_PHONE]: UserErrorCode.PHONE_ERROR,
    [UserErrorCode.CONFLICT_ERROR]: UserErrorCode.CONFLICT_ERROR,
  };

  private constructor(message: string, code: UserErrorCode, context?: ErrorContext) {
    super(message, code, context);
  }

  public static fromDomainError(error: DomainError): UserError {
    return this.map<UserErrorCode, UserError>(
      error,
      this.MAPPINGS,
      UserErrorCode.GENERIC_USER_ERROR,
      (msg, code, ctx) => new UserError(msg, code, ctx)
    );
  }

  public static creationFailed(error: Error): UserError {
    return new UserError(error.message, UserErrorCode.CREATION_FAILED);
  }

  public static updateFailed(error: Error): UserError {
    return new UserError(error.message, UserErrorCode.UPDATE_FAILED);
  }

  public static passwordChangeFailed(error: Error): UserError {
    return new UserError(error.message, UserErrorCode.PASSWORD_CHANGE_FAILED);
  }

  public static incorrectPassword(): UserError {
    return new UserError("The current password provided is incorrect.", UserErrorCode.INCORRECT_PASSWORD);
  }
}

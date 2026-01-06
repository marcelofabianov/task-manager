export type ErrorContext = Record<string, unknown>;

export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: ErrorContext
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  protected static map<T extends string, E>(
    error: DomainError,
    mappings: Partial<Record<T, T>>,
    fallbackCode: T,
    factory: (msg: string, code: T, ctx?: ErrorContext) => E
  ): E {
    const code = error.code as T;
    const mappedCode = mappings[code] || fallbackCode;
    return factory(error.message, mappedCode, error.context);
  }
}

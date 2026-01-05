export class Failure<F, S> {
  readonly value: F;

  constructor(value: F) {
    this.value = value;
  }

  isFail(): this is Failure<F, S> {
    return true;
  }

  isOk(): this is Success<F, S> {
    return false;
  }
}

export class Success<F, S> {
  readonly value: S;

  constructor(value: S) {
    this.value = value;
  }

  isFail(): this is Failure<F, S> {
    return false;
  }

  isOk(): this is Success<F, S> {
    return true;
  }
}

export type Either<F, S> = Failure<F, S> | Success<F, S>;

export const fail = <F, S>(f: F): Either<F, S> => new Failure(f);
export const ok = <F, S>(s: S): Either<F, S> => new Success(s);

import { Either, ok, fail } from '@main/shared/either';
import { CurrentDate } from '@domain/value-object/current-date.vo';

interface SystemStatus {
  today: CurrentDate;
  status: string;
}

export class GetSystemStatusUseCase {
  async execute(): Promise<Either<Error, SystemStatus>> {
    try {
      const today = CurrentDate.create();
      return ok({ today, status: 'operational' });
    } catch (e) {
      return fail(new Error('System check failed internally'));
    }
  }
}

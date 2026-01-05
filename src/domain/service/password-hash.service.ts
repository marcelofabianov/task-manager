import { HashedPassword } from '@domain/value-object/hashed-password.vo';

export interface PasswordService {
  hash(password: string): Promise<HashedPassword>;
  compare(password: string, hashed: HashedPassword): Promise<boolean>;
}

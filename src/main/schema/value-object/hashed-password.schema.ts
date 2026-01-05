import { Type, Static } from '@sinclair/typebox';

export const HashedPasswordSchema = Type.String({
  description: "A cryptographically hashed password string (BCrypt or Argon2 format)",
  minLength: 20
});

export type THashedPassword = Static<typeof HashedPasswordSchema>;

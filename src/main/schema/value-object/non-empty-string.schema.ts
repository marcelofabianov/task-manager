import { Type, Static } from '@sinclair/typebox';

export const NonEmptyStringSchema = Type.String({
  minLength: 1,
  description: "A string that cannot be empty after trimming whitespace"
});

export type TNonEmptyString = Static<typeof NonEmptyStringSchema>;

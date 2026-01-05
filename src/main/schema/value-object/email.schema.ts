import { Type, Static } from '@sinclair/typebox';

export const EmailSchema = Type.String({
  format: 'email',
  maxLength: 254,
  description: "A validated and normalized (lowercase) email address",
  examples: ["test@example.com"]
});

export type TEmail = Static<typeof EmailSchema>;

import { Type, Static } from '@sinclair/typebox';

export const PhoneSchema = Type.String({
  pattern: '^\\+[1-9]\\d{1,14}$',
  description: "Phone number in international E.164 format (e.g., +5511999999999)",
  examples: ["+5511999999999"]
});

export type TPhone = Static<typeof PhoneSchema>;

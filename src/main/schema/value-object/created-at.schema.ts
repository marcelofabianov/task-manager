import { Type, Static } from '@sinclair/typebox';

export const CreatedAtSchema = Type.String({
  format: 'date-time',
  description: "Timestamp in RFC3339 (ISO 8601) format, typically used for audit trails",
  examples: ["2026-01-05T22:38:09.924Z"]
});

export type TCreatedAt = Static<typeof CreatedAtSchema>;

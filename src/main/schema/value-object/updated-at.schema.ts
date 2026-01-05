import { Type, Static } from '@sinclair/typebox';

export const UpdatedAtSchema = Type.String({
  format: 'date-time',
  description: "Timestamp in RFC3339 (ISO 8601) format, represents the last modification of an entity",
  examples: ["2026-01-05T16:12:00.000Z"]
});

export type TUpdatedAt = Static<typeof UpdatedAtSchema>;

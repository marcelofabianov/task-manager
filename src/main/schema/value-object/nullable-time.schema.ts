import { Type, Static } from '@sinclair/typebox';

export const NullableTimeSchema = Type.Union([
  Type.String({
    format: 'date-time',
    description: "Timestamp in RFC3339 (ISO 8601) format"
  }),
  Type.Null()
], {
  description: "Represents an optional timestamp that can be a valid date string or null",
  examples: ["2026-01-05T16:15:00.000Z", null]
});

export type TNullableTime = Static<typeof NullableTimeSchema>;

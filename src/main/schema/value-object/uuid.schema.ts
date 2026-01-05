import { Type, Static } from '@sinclair/typebox';

export const UUIDSchema = Type.String({
  format: 'uuid',
  pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
  description: "A valid UUID v7 (time-ordered)",
  examples: ["018c3230-0aa5-7206-8123-456789abcdef"]
});

export type TUUID = Static<typeof UUIDSchema>;

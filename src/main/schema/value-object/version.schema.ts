import { Type, Static } from '@sinclair/typebox';

export const VersionSchema = Type.Integer({
  minimum: 0,
  description: "Represents an entity version number for optimistic locking",
  examples: [1, 2, 10]
});

export type TVersion = Static<typeof VersionSchema>;

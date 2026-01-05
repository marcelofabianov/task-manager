import { Type, Static } from '@sinclair/typebox';

export const StatusSchema = Type.String({
  description: "Represents a normalized state in a workflow (e.g., PENDING, ACTIVE)",
  examples: ["PENDING", "ACTIVE", "INACTIVE"]
});

export type TStatus = Static<typeof StatusSchema>;

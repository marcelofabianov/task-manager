import { Type, Static } from '@sinclair/typebox';

export const AuditUserSchema = Type.Union([
  Type.String({ format: 'email' }),
  Type.Literal('system')
], {
  description: "Identifier of the user or system performing the action",
  examples: ["marcelo@example.com", "system"]
});

export type TAuditUser = Static<typeof AuditUserSchema>;

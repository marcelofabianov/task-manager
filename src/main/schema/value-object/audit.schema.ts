import { Type, Static } from '@sinclair/typebox';
import { CreatedAtSchema } from '@schema/value-object/created-at.schema';
import { UpdatedAtSchema } from '@schema/value-object/updated-at.schema';
import { AuditUserSchema } from '@schema/value-object/audit-user.schema';
import { NullableTimeSchema } from '@schema/value-object/nullable-time.schema';
import { VersionSchema } from '@schema/value-object/version.schema';

export const AuditSchema = Type.Object({
  created_at: CreatedAtSchema,
  created_by: AuditUserSchema,
  updated_at: UpdatedAtSchema,
  updated_by: AuditUserSchema,
  archived_at: Type.Optional(NullableTimeSchema),
  deleted_at: Type.Optional(NullableTimeSchema),
  version: VersionSchema,
}, {
  description: "Standard audit trail for entity lifecycle tracking",
});

export type TAudit = Static<typeof AuditSchema>;

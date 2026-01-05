import { Type } from '@sinclair/typebox';

export const CurrentDateSchema = Type.Object({
  iso: Type.String({ format: 'date-time' }),
  formatted: Type.String(),
  isWeekend: Type.Boolean(),
  timestamp: Type.Number()
}, {
  description: "Represents the current system date in multiple formats"
});

export const SystemStatusResponseSchema = Type.Object({
  today: CurrentDateSchema,
  status: Type.String()
});

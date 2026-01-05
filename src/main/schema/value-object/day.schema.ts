import { Type, Static } from '@sinclair/typebox';

export const DaySchema = Type.Integer({
  minimum: 1,
  maximum: 31,
  description: "Represents a day of the month (1-31)",
  examples: [15]
});

export type TDay = Static<typeof DaySchema>;

import { Elysia } from 'elysia';
import { CurrentDate } from '@domain/value-object/current-date.vo';
import { CurrentDateSchema } from '@schema/value-object/current-date.schema';

export const systemsRoutes = new Elysia({ prefix: '/systems' })
  .get('/today', () => {
    return CurrentDate.create().toJSON();
  }, {
    response: CurrentDateSchema
  });

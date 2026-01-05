import { Elysia, t } from 'elysia';
import { GetSystemStatusUseCase } from '@application/usecase/system/get-system-status.usecase';
import { SystemStatusResponseSchema } from '@schema/value-object/current-date.schema';

const getSystemStatus = new GetSystemStatusUseCase();

export const systemsRoutes = new Elysia({ prefix: '/systems' })
  .get('/status', async ({ set }) => {
    const result = await getSystemStatus.execute();

    if (result.isFail()) {
      set.status = 500;
      return { error: result.value.message };
    }

    return {
      today: result.value.today.toJSON(),
      status: result.value.status
    };
  }, {
    response: {
      200: SystemStatusResponseSchema,
      500: t.Object({ error: t.String() })
    }
  });

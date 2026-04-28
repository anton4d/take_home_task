import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { db } from '../../db/index.js'
import { task } from '../../db/schemas/index.js'
import { HealthQuerySchema, HealthResponseSchema, HealthErrorSchema } from './models.js'

const health = new OpenAPIHono()

const healthRoute = createRoute({
  method: 'get',
  path: '/api/health',
  request: {
    query: HealthQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: HealthResponseSchema } },
      description: 'Health status',
    },
    400: {
      content: { 'application/json': { schema: HealthErrorSchema } },
      description: 'Invalid query parameter',
    },
    500: {
      content: { 'application/json': { schema: HealthResponseSchema } },
      description: 'Database connection failed',
    },
  },
})

health.openapi(healthRoute, async (c) => {
  const { query } = c.req.valid('query')

  try {
    const result = await db.select().from(task).limit(1)

    if (query === 'database') {
      return c.json({ db_connected: true }, 200)
    }

    if (query === 'data') {
      return c.json({ has_data: result.length > 0 }, 200)
    }

    return c.json({ db_connected: true, has_data: result.length > 0 }, 200)

  } catch {
    if (query === 'database') {
      return c.json({ db_connected: false }, 500)
    }

    return c.json({ db_connected: false, has_data: false }, 500)
  }
})

export default health
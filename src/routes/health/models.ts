import { z } from 'zod'

export const HealthQuerySchema = z.object({
  query: z.enum(['database', 'data']).optional(),
})

export const HealthResponseSchema = z.object({
  db_connected: z.boolean().optional(),
  has_data: z.boolean().optional(),
})

export const HealthErrorSchema = z.object({
  error: z.string(),
})

export type HealthResponse = z.infer<typeof HealthResponseSchema>
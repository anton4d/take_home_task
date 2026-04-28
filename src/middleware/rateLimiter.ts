import type { MiddlewareHandler } from 'hono'

const requests = new Map<string, number[]>()

const WINDOW_MS = 10 * 1000
const MAX_REQUESTS = 1

export const healthRateLimiter: MiddlewareHandler = async (c, next) => {
  const ip = c.req.header('x-forwarded-for') ?? c.req.header('x-real-ip') ?? 'unknown'
  const now = Date.now()

  const timestamps = (requests.get(ip) ?? []).filter(t => now - t < WINDOW_MS)

  if (timestamps.length >= MAX_REQUESTS) {
    return c.json({ error: 'Too many requests, please try again later.' }, 429)
  }

  timestamps.push(now)
  requests.set(ip, timestamps)

  await next()
}
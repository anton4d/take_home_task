import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import app from '../../src/app.js'

describe('GET /api/health', () => {
  describe('no query parameter', () => {
    it('returns 200 with full health status', async () => {
      const res = await app.request('/api/health')
      const body = await res.json()

      assert.equal(res.status, 200)
      assert.ok(typeof body.db_connected === 'boolean')
      assert.ok(typeof body.has_data === 'boolean')
    })
  })

  describe('?query=database', () => {
    it('returns only db_connected', async () => {
      const res = await app.request('/api/health?query=database', {
        headers: { 'x-forwarded-for': '1.3.3.4' },
        })
      const body = await res.json()

      assert.equal(res.status, 200)
      assert.ok(typeof body.db_connected === 'boolean')
      assert.equal(body.has_data, undefined)
    })
  })

  describe('?query=data', () => {
    it('returns only has_data', async () => {
      const res = await app.request('/api/health?query=data', {
        headers: { 'x-forwarded-for': '1.2.3.1' },
        })
      const body = await res.json()

      assert.equal(res.status, 200)
      assert.ok(typeof body.has_data === 'boolean')
      assert.equal(body.db_connected, undefined)
    })
  })

  describe('invalid query parameter', () => {
    it('returns 400 for unknown query value', async () => {
      const res = await app.request('/api/health?query=invalid',{
        headers: { 'x-forwarded-for': '1.2.3.5' },
        })

      assert.equal(res.status, 400)
    })
  })

  describe('rate limiting', () => {
    it('returns 429 after exceeding 1 request per 10 seconds', async () => {
        const first = await app.request('/api/health', {
        headers: { 'x-forwarded-for': '1.2.3.4' },
        })
        assert.equal(first.status, 200)

        const second = await app.request('/api/health', {
        headers: { 'x-forwarded-for': '1.2.3.4' },
        })
        assert.equal(second.status, 429)

        const body = await second.json()
        assert.ok(typeof body.error === 'string')
    })
})
})
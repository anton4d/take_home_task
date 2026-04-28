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
      const res = await app.request('/api/health?query=database')
      const body = await res.json()

      assert.equal(res.status, 200)
      assert.ok(typeof body.db_connected === 'boolean')
      assert.equal(body.has_data, undefined)
    })
  })

  describe('?query=data', () => {
    it('returns only has_data', async () => {
      const res = await app.request('/api/health?query=data')
      const body = await res.json()

      assert.equal(res.status, 200)
      assert.ok(typeof body.has_data === 'boolean')
      assert.equal(body.db_connected, undefined)
    })
  })

  describe('invalid query parameter', () => {
    it('returns 400 for unknown query value', async () => {
      const res = await app.request('/api/health?query=invalid')

      assert.equal(res.status, 400)
    })
  })
})
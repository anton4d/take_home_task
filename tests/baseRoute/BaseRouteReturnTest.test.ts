import { describe, it } from 'node:test'
import assert from 'node:assert'
import app from '../../src/app.js'

describe('GET /', () => {
  it('should return Hello Hono!', async () => {
    const res = await app.request('/')
    assert.equal(res.status, 200)
    assert.equal(await res.text(), 'Hello Hono!')
  })
})
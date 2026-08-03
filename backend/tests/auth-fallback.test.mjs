import test from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../db.js';

test('findUserByEmail resolves demo user from the fallback store', async () => {
  const user = await db.findUserByEmail('demo@example.com');
  assert.ok(user, 'expected demo user to be found');
  assert.equal(user.email, 'demo@example.com');
});
